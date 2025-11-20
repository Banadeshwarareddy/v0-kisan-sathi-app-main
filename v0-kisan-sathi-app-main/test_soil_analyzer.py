#!/usr/bin/env python
"""
Test Script for AI Soil Analyzer
Verifies all components are working correctly
"""

import sys
import os

# Add the backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'kisan_sathi_backend'))

def test_imports():
    """Test if all required modules can be imported"""
    print("\n🔍 Testing Module Imports...")
    
    tests = []
    
    # Test Pillow
    try:
        from PIL import Image
        print("✅ Pillow (Image Processing) - OK")
        tests.append(True)
    except ImportError as e:
        print(f"❌ Pillow - FAILED: {e}")
        tests.append(False)
    
    # Test NumPy
    try:
        import numpy as np
        print("✅ NumPy (Numerical Computing) - OK")
        tests.append(True)
    except ImportError as e:
        print(f"❌ NumPy - FAILED: {e}")
        tests.append(False)
    
    # Test ReportLab
    try:
        from reportlab.lib.pagesizes import A4
        print("✅ ReportLab (PDF Generation) - OK")
        tests.append(True)
    except ImportError as e:
        print(f"❌ ReportLab - FAILED: {e}")
        tests.append(False)
    
    # Test gTTS
    try:
        from gtts import gTTS
        print("✅ gTTS (Text-to-Speech) - OK")
        tests.append(True)
    except ImportError as e:
        print(f"❌ gTTS - FAILED: {e}")
        tests.append(False)
    
    return all(tests)

def test_ai_engine():
    """Test the AI engine"""
    print("\n🧠 Testing AI Engine...")
    
    try:
        # Set up Django
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kisan_sathi.settings')
        import django
        django.setup()
        
        from soil_analysis.ai_engine import SoilAIEngine
        
        engine = SoilAIEngine()
        print("✅ AI Engine initialized - OK")
        
        # Test knowledge base
        if engine.soil_knowledge_base:
            print(f"✅ Knowledge base loaded - {len(engine.soil_knowledge_base['soil_characteristics'])} soil types")
        
        return True
    except Exception as e:
        print(f"❌ AI Engine - FAILED: {e}")
        return False

def test_pdf_generator():
    """Test PDF generator"""
    print("\n📄 Testing PDF Generator...")
    
    try:
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kisan_sathi.settings')
        import django
        django.setup()
        
        from soil_analysis.pdf_generator import SoilAnalysisPDFGenerator
        
        generator = SoilAnalysisPDFGenerator()
        print("✅ PDF Generator initialized - OK")
        
        # Test sample data
        sample_analysis = {
            'soil_type': 'Red Soil',
            'fertility_level': 'High',
            'confidence_score': 91.2,
            'moisture_level': 'Moderate',
            'recommended_crops': ['Cotton', 'Groundnut'],
            'fertilizer_suggestions': ['Vermicompost', 'FYM']
        }
        
        sample_farmer = {
            'id': 1,
            'name': 'Test Farmer',
            'village': 'Test Village',
            'district': 'Test District',
            'phone': '1234567890'
        }
        
        pdf = generator.generate_report(sample_analysis, sample_farmer)
        print(f"✅ PDF generated - {len(pdf.read())} bytes")
        
        return True
    except Exception as e:
        print(f"❌ PDF Generator - FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_voice_generator():
    """Test voice generator"""
    print("\n🔊 Testing Voice Generator...")
    
    try:
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kisan_sathi.settings')
        import django
        django.setup()
        
        from soil_analysis.voice_generator import SoilAnalysisVoiceGenerator
        
        generator = SoilAnalysisVoiceGenerator()
        print("✅ Voice Generator initialized - OK")
        print(f"✅ Supported languages: {', '.join(generator.supported_languages.keys())}")
        
        return True
    except Exception as e:
        print(f"❌ Voice Generator - FAILED: {e}")
        return False

def main():
    print("""
    ╔════════════════════════════════════════════════════════════╗
    ║                                                            ║
    ║         🧪 AI SOIL ANALYZER - TEST SUITE 🧪                ║
    ║                                                            ║
    ║              Verifying System Components                   ║
    ║                                                            ║
    ╚════════════════════════════════════════════════════════════╝
    """)
    
    results = []
    
    # Run tests
    results.append(('Module Imports', test_imports()))
    results.append(('AI Engine', test_ai_engine()))
    results.append(('PDF Generator', test_pdf_generator()))
    results.append(('Voice Generator', test_voice_generator()))
    
    # Summary
    print(f"\n{'='*60}")
    print("📊 TEST SUMMARY")
    print(f"{'='*60}")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name:.<40} {status}")
    
    print(f"\n{'='*60}")
    print(f"Results: {passed}/{total} tests passed")
    print(f"{'='*60}")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED!")
        print("\n✅ AI Soil Analyzer is fully functional!")
        print("\n📚 Next Steps:")
        print("   1. Start Django: python kisan_sathi_backend/manage.py runserver")
        print("   2. Test API: http://localhost:8000/api/soil/")
        print("   3. Upload a soil image and see the magic! ✨")
        print("\n🌾 Happy Testing! 🌾\n")
        return 0
    else:
        print("\n⚠️  SOME TESTS FAILED")
        print("\nPlease:")
        print("1. Run: python install_soil_analyzer.py")
        print("2. Check error messages above")
        print("3. Install missing dependencies")
        print("4. Run this test again\n")
        return 1

if __name__ == '__main__':
    sys.exit(main())
