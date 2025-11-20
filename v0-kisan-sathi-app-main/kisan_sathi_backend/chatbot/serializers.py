from rest_framework import serializers
from .models import ChatConversation, ChatMessage, FarmerFeedback


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'role', 'content', 'timestamp', 'image', 'tokens_used', 'response_time']
        read_only_fields = ['id', 'timestamp', 'tokens_used', 'response_time']


class ChatConversationSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)
    message_count = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatConversation
        fields = ['id', 'title', 'created_at', 'updated_at', 'is_active', 'messages', 'message_count', 'last_message']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_message_count(self, obj):
        return obj.messages.count()
    
    def get_last_message(self, obj):
        last_msg = obj.messages.order_by('-timestamp').first()
        if last_msg:
            return {
                'content': last_msg.content[:100],
                'timestamp': last_msg.timestamp,
                'role': last_msg.role
            }
        return None


class FarmerFeedbackSerializer(serializers.ModelSerializer):
    message_preview = serializers.SerializerMethodField()
    
    class Meta:
        model = FarmerFeedback
        fields = ['id', 'message', 'rating', 'comment', 'created_at', 'message_preview']
        read_only_fields = ['id', 'created_at']
    
    def get_message_preview(self, obj):
        return obj.message.content[:50] if obj.message else None
