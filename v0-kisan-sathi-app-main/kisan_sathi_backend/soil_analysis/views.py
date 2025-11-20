"""
SoilSense - API Views
Production-ready REST API endpoints
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.db.models import Avg, Count
from django.utils import timezone
from datetime import timedelta

from .models import SoilSample, SoilResult, SoilFeedback, SoilHealthHistory
from .serializers import (
    SoilSampleSerializer, SoilResultSerializer, SoilAnalysisRequestSerializer,
    SoilFeedbackSerializer, SoilHealthHistorySerializer
)
from .ai_engine import soil_engine
from .pdf_generator import SoilAnalysisPDFGenerator
from .voice_generator import SoilAnalysisVoiceGenerator
import logging

logger = logging.getLogger(__name__)

# Initialize generators
pdf_generator = SoilAnalysisPDFGenerator()
voice_generator = SoilAnalysisVoiceGenerator()


class SoilAnalysisViewSet(viewsets.ModelViewSet):
    """
    ViewSet for soil analysis operations
    """
    permission_classes = [IsAuthenticated]
    serializer_class = SoilSampleSerializer
    
    def get_queryset(self):
        """Return samples for current user"""
        return SoilSample.objects.filter(farmer=self.request.user)
    
    @action(detail=False, methods=['post'])
    def analyze(self, request):
        """
        Main endpoint for soil analysis
        POST /api/soil/analyze/
        """
        try:
            # Validate input
            serializer = SoilAnalysisRequestSerializer(data=request.data)
            if not serializer.is_valid():
                return Response({
                    'success': False,
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Create soil sample
            sample_data = serializer.validated_data
            sample_data['farmer'] = request.user
            
            # Handle image upload
            if 'soil_image' in request.FILES:
                sample_data['soil_image'] = request.FILES['soil_image']
            
            sample = SoilSample.objects.create(**sample_data)
            
            # Run AI analysis
            analysis_result = soil_engine.analyze_soil(sample_data)
            
            # Create result record
            result = SoilResult.objects.create(
                sample=sample,
                **analysis_result
            )
            
            # Generate PDF report
            try:
                farmer_data = {
                    'id': request.user.id,
                    'name': request.user.get_full_name() or request.user.username,
                    'village': sample.village,
                    'taluk': sample.taluk,
                    'district': sample.district,
                    'phone': getattr(request.user, 'phone', 'N/A')
                }
                
                pdf_file = pdf_generator.generate_report(
                    analysis_result,
                    farmer_data,
                    sample.soil_image.path if sample.soil_image else None
                )
                result.pdf_report = pdf_file
                
                # Generate voice report (English by default)
                voice_file = voice_generator.generate_voice_report(
                    analysis_result,
                    farmer_data,
                    language='en'
                )
                if voice_file:
                    result.audio_report = voice_file
                
                result.save()
            except Exception as e:
                logger.warning(f"Failed to generate reports: {str(e)}")
            
            # Mark sample as processed
            sample.is_processed = True
            sample.save()
            
            # Create history record
            SoilHealthHistory.objects.create(
                farmer=request.user,
                location=f"{sample.village}, {sample.taluk}, {sample.district}",
                test_date=timezone.now().date(),
                ph_value=sample.ph,
                nitrogen_value=sample.nitrogen,
                phosphorus_value=sample.phosphorus,
                potassium_value=sample.potassium,
                fertility_score=result.fertility_score,
                sample=sample
            )
            
            # Return result
            result_serializer = SoilResultSerializer(result)
            
            return Response({
                'success': True,
                'message': 'Soil analysis completed successfully',
                'data': {
                    'sample_id': str(sample.id),
                    'result': result_serializer.data
                }
            }, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            logger.error(f"Error in soil analysis: {str(e)}")
            return Response({
                'success': False,
                'message': 'Analysis failed. Please try again.',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def reports(self, request):
        """
        Get all reports for current farmer
        GET /api/soil/reports/
        """
        farmer_id = request.query_params.get('farmer_id', request.user.id)
        
        samples = SoilSample.objects.filter(
            farmer_id=farmer_id,
            is_processed=True
        ).select_related('result')
        
        results = []
        for sample in samples:
            if hasattr(sample, 'result'):
                result_data = SoilResultSerializer(sample.result).data
                result_data['sample_date'] = sample.created_at
                results.append(result_data)
        
        return Response({
            'success': True,
            'count': len(results),
            'data': results
        })
    
    @action(detail=True, methods=['get'])
    def download_pdf(self, request, pk=None):
        """
        Download PDF report
        GET /api/soil/download/{sample_id}/
        """
        sample = get_object_or_404(SoilSample, id=pk, farmer=request.user)
        
        if not hasattr(sample, 'result'):
            return Response({
                'success': False,
                'message': 'Analysis not completed yet'
            }, status=status.HTTP_404_NOT_FOUND)
        
        result = sample.result
        
        # Generate PDF if not exists
        if not result.pdf_report:
            try:
                farmer_data = {
                    'id': request.user.id,
                    'name': request.user.get_full_name() or request.user.username,
                    'village': sample.village,
                    'taluk': sample.taluk,
                    'district': sample.district,
                    'phone': getattr(request.user, 'phone', 'N/A')
                }
                
                analysis_data = {
                    'soil_type': result.soil_type,
                    'fertility_level': result.fertility_level,
                    'confidence_score': result.confidence_score,
                    'moisture_level': result.moisture_level,
                    'recommended_crops': result.recommended_crops,
                    'fertilizer_suggestions': result.fertilizer_suggestions
                }
                
                pdf_file = pdf_generator.generate_report(
                    analysis_data,
                    farmer_data,
                    sample.soil_image.path if sample.soil_image else None
                )
                result.pdf_report = pdf_file
                result.save()
            except Exception as e:
                logger.error(f"Failed to generate PDF: {str(e)}")
                return Response({
                    'success': False,
                    'message': 'Failed to generate PDF report'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({
            'success': True,
            'pdf_url': request.build_absolute_uri(result.pdf_report.url)
        })
    
    @action(detail=True, methods=['get'])
    def download_audio(self, request, pk=None):
        """
        Download audio report
        GET /api/soil/audio/{sample_id}/
        """
        sample = get_object_or_404(SoilSample, id=pk, farmer=request.user)
        
        if not hasattr(sample, 'result'):
            return Response({
                'success': False,
                'message': 'Analysis not completed yet'
            }, status=status.HTTP_404_NOT_FOUND)
        
        result = sample.result
        language = request.query_params.get('language', 'en')
        
        # Generate audio if not exists or language changed
        if not result.audio_report or request.query_params.get('regenerate'):
            try:
                farmer_data = {
                    'id': request.user.id,
                    'name': request.user.get_full_name() or request.user.username,
                    'village': sample.village,
                    'taluk': sample.taluk,
                    'district': sample.district,
                    'phone': getattr(request.user, 'phone', 'N/A')
                }
                
                analysis_data = {
                    'soil_type': result.soil_type,
                    'fertility_level': result.fertility_level,
                    'confidence_score': result.confidence_score,
                    'moisture_level': result.moisture_level,
                    'recommended_crops': result.recommended_crops,
                    'fertilizer_suggestions': result.fertilizer_suggestions
                }
                
                voice_file = voice_generator.generate_voice_report(
                    analysis_data,
                    farmer_data,
                    language=language
                )
                
                if voice_file:
                    result.audio_report = voice_file
                    result.save()
                else:
                    return Response({
                        'success': False,
                        'message': 'Failed to generate audio report'
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                    
            except Exception as e:
                logger.error(f"Failed to generate audio: {str(e)}")
                return Response({
                    'success': False,
                    'message': 'Failed to generate audio report'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({
            'success': True,
            'audio_url': request.build_absolute_uri(result.audio_report.url)
        })
    
    @action(detail=False, methods=['get'])
    def history(self, request):
        """
        Get soil health history for trend analysis
        GET /api/soil/history/
        """
        history = SoilHealthHistory.objects.filter(
            farmer=request.user
        ).order_by('test_date')
        
        serializer = SoilHealthHistorySerializer(history, many=True)
        
        return Response({
            'success': True,
            'count': history.count(),
            'data': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Get statistics for farmer's soil tests
        GET /api/soil/stats/
        """
        samples = SoilSample.objects.filter(farmer=request.user, is_processed=True)
        
        if not samples.exists():
            return Response({
                'success': True,
                'message': 'No soil tests found',
                'data': {}
            })
        
        # Calculate averages
        avg_fertility = SoilResult.objects.filter(
            sample__farmer=request.user
        ).aggregate(Avg('fertility_score'))['fertility_score__avg']
        
        # Count by fertility level
        fertility_distribution = SoilResult.objects.filter(
            sample__farmer=request.user
        ).values('fertility_level').annotate(count=Count('id'))
        
        # Recent tests
        recent_tests = samples.order_by('-created_at')[:5]
        
        return Response({
            'success': True,
            'data': {
                'total_tests': samples.count(),
                'average_fertility': round(avg_fertility, 2) if avg_fertility else 0,
                'fertility_distribution': list(fertility_distribution),
                'recent_tests': SoilSampleSerializer(recent_tests, many=True).data
            }
        })


class SoilFeedbackViewSet(viewsets.ModelViewSet):
    """
    ViewSet for farmer feedback
    """
    permission_classes = [IsAuthenticated]
    serializer_class = SoilFeedbackSerializer
    
    def get_queryset(self):
        return SoilFeedback.objects.filter(farmer=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(farmer=self.request.user)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_summary(request):
    """
    Get dashboard summary for soil analysis
    GET /api/soil/dashboard/
    """
    try:
        farmer = request.user
        
        # Total samples
        total_samples = SoilSample.objects.filter(farmer=farmer).count()
        processed_samples = SoilSample.objects.filter(farmer=farmer, is_processed=True).count()
        
        # Latest result
        latest_sample = SoilSample.objects.filter(
            farmer=farmer, 
            is_processed=True
        ).order_by('-created_at').first()
        
        latest_result = None
        if latest_sample and hasattr(latest_sample, 'result'):
            latest_result = SoilResultSerializer(latest_sample.result).data
        
        # Average fertility
        avg_fertility = SoilResult.objects.filter(
            sample__farmer=farmer
        ).aggregate(Avg('fertility_score'))['fertility_score__avg']
        
        # Nutrient trends (last 30 days)
        thirty_days_ago = timezone.now() - timedelta(days=30)
        recent_history = SoilHealthHistory.objects.filter(
            farmer=farmer,
            test_date__gte=thirty_days_ago
        ).order_by('test_date')
        
        return Response({
            'success': True,
            'data': {
                'total_samples': total_samples,
                'processed_samples': processed_samples,
                'pending_samples': total_samples - processed_samples,
                'average_fertility': round(avg_fertility, 2) if avg_fertility else 0,
                'latest_result': latest_result,
                'recent_trends': SoilHealthHistorySerializer(recent_history, many=True).data
            }
        })
    
    except Exception as e:
        logger.error(f"Error in dashboard summary: {str(e)}")
        return Response({
            'success': False,
            'message': 'Failed to load dashboard',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def regional_stats(request):
    """
    Get regional soil statistics (for heatmap)
    GET /api/soil/regional-stats/
    """
    try:
        district = request.query_params.get('district')
        taluk = request.query_params.get('taluk')
        
        queryset = SoilSample.objects.filter(is_processed=True)
        
        if district:
            queryset = queryset.filter(district=district)
        if taluk:
            queryset = queryset.filter(taluk=taluk)
        
        # Group by location
        stats = queryset.values('district', 'taluk', 'village').annotate(
            avg_fertility=Avg('result__fertility_score'),
            sample_count=Count('id')
        )
        
        return Response({
            'success': True,
            'count': len(stats),
            'data': list(stats)
        })
    
    except Exception as e:
        logger.error(f"Error in regional stats: {str(e)}")
        return Response({
            'success': False,
            'message': 'Failed to load regional statistics',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
