from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    # API endpoints
    path('api/auth/', include('farmers.urls')),
    path('api/weather/', include('weather.urls')),
    path('api/mandi/', include('mandi.urls')),
    path('api/schemes/', include('schemes.urls')),
    path('api/crop-doctor/', include('crop_doctor.urls')),
    path('api/chatbot/', include('chatbot.urls')),
    path('api/tips/', include('farming_tips.urls')),
    path('api/marketplace/', include('marketplace.api_urls')),
    path('api/soil/', include('soil_analysis.urls')),  # SoilSense API
    # Template pages
    path('marketplace/', include('marketplace.urls', namespace='marketplace')),
    path('farm-management/', include('farm_management.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

admin.site.site_header = "Kisan Sathi Admin"
