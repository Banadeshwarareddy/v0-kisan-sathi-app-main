# Voice Generator for Soil Analysis
# Generates audio reports using Text-to-Speech

import os
import tempfile
from datetime import datetime
from gtts import gTTS
from django.core.files.base import ContentFile

class SoilAnalysisVoiceGenerator:
    def __init__(self):
        self.supported_languages = {
            'en': 'English',
            'kn': 'Kannada',
            'hi': 'Hindi',
            'te': 'Telugu',
            'ta': 'Tamil'
        }
    
    def generate_voice_report(self, analysis_data, farmer_data, language='en'):
        """
        Generate voice report from analysis data
        
        Args:
            analysis_data: Soil analysis results
            farmer_data: Farmer information
            language: Language code ('en', 'kn', 'hi', etc.)
            
        Returns:
            ContentFile: Audio file content
        """
        
        try:
            # Generate text content based on language
            if language == 'kn':
                text_content = self._generate_kannada_text(analysis_data, farmer_data)
            elif language == 'hi':
                text_content = self._generate_hindi_text(analysis_data, farmer_data)
            else:
                text_content = self._generate_english_text(analysis_data, farmer_data)
            
            # Create TTS object
            tts = gTTS(text=text_content, lang=language, slow=False)
            
            # Create temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as temp_file:
                tts.save(temp_file.name)
                
                # Read the audio content
                with open(temp_file.name, 'rb') as audio_file:
                    audio_content = audio_file.read()
                
                # Clean up temporary file
                os.unlink(temp_file.name)
            
            # Create filename
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f'soil_analysis_audio_{farmer_data.get("id", "unknown")}_{language}_{timestamp}.mp3'
            
            return ContentFile(audio_content, name=filename)
            
        except Exception as e:
            print(f"Voice generation failed: {str(e)}")
            return None
    
    def _generate_english_text(self, analysis_data, farmer_data):
        """Generate English text for voice report"""
        
        farmer_name = farmer_data.get('name', 'Farmer')
        soil_type = analysis_data.get('soil_type', 'Unknown')
        fertility = analysis_data.get('fertility_level', 'Unknown')
        confidence = analysis_data.get('confidence_score', 0)
        crops = analysis_data.get('recommended_crops', [])
        
        text = f"""
        Hello {farmer_name}, this is your soil analysis report from Kisan Sathi.
        
        Your soil type is {soil_type} with {fertility} fertility level. 
        Our AI analysis has a confidence score of {confidence} percent.
        
        Recommended crops: {', '.join(crops[:4]) if crops else 'Please consult experts'}.
        
        Thank you for using Kisan Sathi AI Soil Analyzer.
        """
        
        return text.strip()
    
    def _generate_kannada_text(self, analysis_data, farmer_data):
        """Generate Kannada text for voice report"""
        
        farmer_name = farmer_data.get('name', 'ರೈತರೇ')
        
        text = f"""
        ನಮಸ್ಕಾರ {farmer_name}, ಇದು ಕಿಸಾನ್ ಸಾಥಿ ಮಣ್ಣು ವಿಶ್ಲೇಷಣೆ ವರದಿ.
        
        ನಿಮ್ಮ ಮಣ್ಣಿನ ವಿಶ್ಲೇಷಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ.
        
        ಕಿಸಾನ್ ಸಾಥಿ ಬಳಸಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು.
        """
        
        return text.strip()
    
    def _generate_hindi_text(self, analysis_data, farmer_data):
        """Generate Hindi text for voice report"""
        
        farmer_name = farmer_data.get('name', 'किसान जी')
        
        text = f"""
        नमस्कार {farmer_name}, यह किसान साथी मिट्टी विश्लेषण रिपोर्ट है।
        
        आपका मिट्टी विश्लेषण पूरा हो गया है।
        
        किसान साथी का उपयोग करने के लिए धन्यवाद।
        """
        
        return text.strip()
