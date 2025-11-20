from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'chatbot'

router = DefaultRouter()
router.register(r'conversations', views.ChatConversationViewSet, basename='conversation')
router.register(r'messages', views.ChatMessageViewSet, basename='message')
router.register(r'feedback', views.FarmerFeedbackViewSet, basename='feedback')

urlpatterns = [
    path('', include(router.urls)),
    path('quick-chat/', views.quick_chat, name='quick-chat'),
    path('statistics/', views.chat_statistics, name='statistics'),
    path('transcribe/', views.transcribe_audio, name='transcribe'),
    path('generate-audio/', views.generate_audio, name='generate-audio'),
]
