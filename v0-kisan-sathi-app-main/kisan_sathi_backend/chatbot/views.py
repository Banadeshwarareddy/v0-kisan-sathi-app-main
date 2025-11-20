from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db import models
import os
import time
from groq import Groq

from .models import ChatConversation, ChatMessage, FarmerFeedback
from .serializers import (
    ChatConversationSerializer, 
    ChatMessageSerializer, 
    FarmerFeedbackSerializer
)
from .expert_system_prompt import EXPERT_SYSTEM_PROMPT

# Initialize Groq client (will be initialized when needed)
def get_groq_client():
    """Get Groq client with API key from environment"""
    api_key = os.getenv('GROQ_API_KEY')
    if not api_key:
        raise ValueError("GROQ_API_KEY not found in environment variables")
    return Groq(api_key=api_key)


def detect_language(text):
    """
    Detect if text is primarily in Kannada or English
    Returns: 'kn' for Kannada, 'en' for English
    """
    # Count Kannada Unicode characters (0C80-0CFF range)
    kannada_chars = sum(1 for char in text if '\u0C80' <= char <= '\u0CFF')
    # Count English alphabets
    english_chars = sum(1 for char in text if char.isalpha() and char.isascii())
    
    # Determine dominant language
    if kannada_chars > english_chars:
        return 'kn'
    else:
        return 'en'

class ChatConversationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing chat conversations with expert AI system
    """
    serializer_class = ChatConversationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ChatConversation.objects.filter(user=self.request.user, is_active=True)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        """
        Send a message in a conversation and get expert AI response
        """
        conversation = self.get_object()
        user_message = request.data.get('message', '').strip()
        
        if not user_message:
            return Response(
                {'error': 'Message cannot be empty'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Save user message
        user_msg = ChatMessage.objects.create(
            conversation=conversation,
            role='user',
            content=user_message
        )
        
        # Get conversation history (last 15 messages for better context)
        messages = conversation.messages.order_by('-timestamp')[:15]
        messages = list(reversed(messages))
        
        # Detect language of user message
        detected_lang = detect_language(user_message)
        lang_instruction = ""
        if detected_lang == 'kn':
            lang_instruction = "\n\n[IMPORTANT: User is asking in KANNADA. Reply FULLY in KANNADA only. Do not use any English words.]"
        else:
            lang_instruction = "\n\n[IMPORTANT: User is asking in ENGLISH. Reply FULLY in ENGLISH only. Do not use any Kannada words.]"
        
        # Build conversation context for AI
        conversation_history = [
            {"role": "system", "content": EXPERT_SYSTEM_PROMPT + lang_instruction}
        ]
        
        for msg in messages[:-1]:  # Exclude the just-added user message
            conversation_history.append({
                "role": msg.role,
                "content": msg.content
            })
        
        # Add current user message
        conversation_history.append({
            "role": "user",
            "content": user_message
        })
        
        try:
            # Call OpenAI API with expert configuration
            start_time = time.time()
            
            client = get_groq_client()
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",  # Using Llama 3.3 70B - excellent for expert responses
                messages=conversation_history,
                temperature=0.7,  # Balanced creativity and accuracy
                max_tokens=2000,  # Allow longer, detailed responses
                top_p=0.9
            )
            
            response_time = time.time() - start_time
            
            # Extract AI response
            ai_message = response.choices[0].message.content
            tokens_used = response.usage.total_tokens
            
            # Save AI response
            ai_msg = ChatMessage.objects.create(
                conversation=conversation,
                role='assistant',
                content=ai_message,
                tokens_used=tokens_used,
                response_time=response_time
            )
            
            # Update conversation title if it's the first exchange
            if not conversation.title and conversation.messages.count() == 2:
                # Use first 50 chars of user message as title
                conversation.title = user_message[:50]
                conversation.save()
            
            # Generate audio if requested
            audio_url = None
            if request.data.get('generate_audio', False):
                try:
                    from gtts import gTTS
                    import tempfile
                    from django.core.files.base import ContentFile
                    from django.core.files.storage import default_storage
                    import uuid
                    
                    # Generate audio using gTTS (Kannada voice)
                    tts = gTTS(text=ai_message, lang='kn', slow=False)
                    
                    # Save to temporary file
                    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.mp3')
                    tts.save(temp_file.name)
                    
                    # Read and save to media storage
                    with open(temp_file.name, 'rb') as f:
                        audio_content = f.read()
                    
                    filename = f'chat_audio/{uuid.uuid4()}.mp3'
                    saved_path = default_storage.save(filename, ContentFile(audio_content))
                    audio_url = request.build_absolute_uri(default_storage.url(saved_path))
                    
                    # Clean up
                    import os
                    os.unlink(temp_file.name)
                except Exception as e:
                    print(f"Audio generation error: {str(e)}")
                    # Continue without audio if generation fails
            
            return Response({
                'user_message': ChatMessageSerializer(user_msg).data,
                'ai_response': ChatMessageSerializer(ai_msg).data,
                'tokens_used': tokens_used,
                'response_time': response_time,
                'audio_url': audio_url
            })
            
        except Exception as e:
            # Log error and provide helpful message
            error_message = f'AI service error: {str(e)}'
            print(f"Chatbot Error: {error_message}")
            
            return Response(
                {'error': error_message}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['delete'])
    def archive(self, request, pk=None):
        """Archive a conversation instead of deleting"""
        conversation = self.get_object()
        conversation.is_active = False
        conversation.save()
        return Response({'status': 'conversation archived'})
    
    @action(detail=False, methods=['get'])
    def active_conversations(self, request):
        """Get all active conversations for the user"""
        conversations = self.get_queryset().order_by('-updated_at')[:10]
        serializer = self.get_serializer(conversations, many=True)
        return Response(serializer.data)


class ChatMessageViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing chat messages
    """
    serializer_class = ChatMessageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        conversation_id = self.request.query_params.get('conversation')
        if conversation_id:
            return ChatMessage.objects.filter(
                conversation_id=conversation_id,
                conversation__user=self.request.user
            )
        return ChatMessage.objects.filter(conversation__user=self.request.user)


class FarmerFeedbackViewSet(viewsets.ModelViewSet):
    """
    ViewSet for farmer feedback on AI responses
    """
    serializer_class = FarmerFeedbackSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return FarmerFeedback.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def transcribe_audio(request):
    """
    Transcribe audio to text using Groq Whisper
    Supports English and Kannada
    """
    if 'audio' not in request.FILES:
        return Response(
            {'error': 'No audio file provided'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    audio_file = request.FILES['audio']
    language = request.data.get('language', 'kn')  # Default to Kannada
    
    try:
        import tempfile
        
        client = get_groq_client()
        
        # Save uploaded file to temporary location
        with tempfile.NamedTemporaryFile(delete=False, suffix='.webm') as temp_file:
            for chunk in audio_file.chunks():
                temp_file.write(chunk)
            temp_path = temp_file.name
        
        # Open file and send to Groq
        with open(temp_path, 'rb') as f:
            transcription = client.audio.transcriptions.create(
                file=(audio_file.name, f.read(), audio_file.content_type),
                model="whisper-large-v3",
                language=language if language != 'auto' else None,
                response_format="text"
            )
        
        # Clean up temp file
        import os
        os.unlink(temp_path)
        
        return Response({
            'text': transcription,
            'language': language
        })
        
    except Exception as e:
        error_message = f'Transcription error: {str(e)}'
        print(f"Transcription Error: {error_message}")
        
        return Response(
            {'error': error_message}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_audio(request):
    """
    Generate audio from text using gTTS (Google Text-to-Speech)
    Supports Kannada voice
    """
    text = request.data.get('text', '').strip()
    language = request.data.get('language', 'kn')  # Default to Kannada
    
    if not text:
        return Response(
            {'error': 'No text provided'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        from gtts import gTTS
        import tempfile
        from django.core.files.base import ContentFile
        from django.core.files.storage import default_storage
        import uuid
        
        # Generate audio using gTTS
        tts = gTTS(text=text, lang=language, slow=False)
        
        # Save to temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.mp3')
        tts.save(temp_file.name)
        
        # Read the file and save to media storage
        with open(temp_file.name, 'rb') as f:
            audio_content = f.read()
        
        # Generate unique filename
        filename = f'chat_audio/{uuid.uuid4()}.mp3'
        saved_path = default_storage.save(filename, ContentFile(audio_content))
        
        # Get URL
        audio_url = request.build_absolute_uri(default_storage.url(saved_path))
        
        # Clean up temp file
        import os
        os.unlink(temp_file.name)
        
        return Response({
            'audio_url': audio_url,
            'filename': saved_path
        })
        
    except Exception as e:
        error_message = f'Audio generation error: {str(e)}'
        print(f"Audio Generation Error: {error_message}")
        
        return Response(
            {'error': error_message}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def quick_chat(request):
    """
    Quick chat endpoint without conversation history
    For one-off questions - uses expert system
    """
    user_message = request.data.get('message', '').strip()
    
    if not user_message:
        return Response(
            {'error': 'Message cannot be empty'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        start_time = time.time()
        
        client = get_groq_client()
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",  # Expert model
            messages=[
                {"role": "system", "content": EXPERT_SYSTEM_PROMPT},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
            max_tokens=2000,
            top_p=0.9
        )
        
        response_time = time.time() - start_time
        ai_message = response.choices[0].message.content
        tokens_used = response.usage.total_tokens
        
        return Response({
            'message': ai_message,
            'tokens_used': tokens_used,
            'response_time': response_time
        })
        
    except Exception as e:
        error_message = f'AI service error: {str(e)}'
        print(f"Quick Chat Error: {error_message}")
        
        return Response(
            {'error': error_message}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chat_statistics(request):
    """
    Get user's chat statistics
    """
    user = request.user
    
    total_conversations = ChatConversation.objects.filter(user=user).count()
    active_conversations = ChatConversation.objects.filter(user=user, is_active=True).count()
    total_messages = ChatMessage.objects.filter(conversation__user=user).count()
    total_tokens = ChatMessage.objects.filter(
        conversation__user=user,
        role='assistant'
    ).aggregate(total=models.Sum('tokens_used'))['total'] or 0
    
    avg_response_time = ChatMessage.objects.filter(
        conversation__user=user,
        role='assistant',
        response_time__isnull=False
    ).aggregate(avg=models.Avg('response_time'))['avg'] or 0
    
    feedback_count = FarmerFeedback.objects.filter(user=user).count()
    avg_rating = FarmerFeedback.objects.filter(user=user).aggregate(
        avg=models.Avg('rating')
    )['avg'] or 0
    
    return Response({
        'total_conversations': total_conversations,
        'active_conversations': active_conversations,
        'total_messages': total_messages,
        'total_tokens_used': total_tokens,
        'avg_response_time': round(avg_response_time, 2),
        'feedback_count': feedback_count,
        'avg_rating': round(avg_rating, 2)
    })
