#!/usr/bin/env python
"""
Quick Installation Script for AI Soil Analyzer
Run this to install all dependencies and set up the module
"""

import subprocess
import sys
import os

def run_command(command, description):
    """Run a command and print status"""
    print(f"\n{'='*60}")
    print(f"🔧 {description}")
    print(f"{'='*60}")
    
    try:
        result = subprocess.run(
            command,
            shell=True,
            check=True,
            capture_output=True,
            text=True
        )
        print(f"✅ {description} - SUCCESS")
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} - FAILED")
        print(f"Error: {e.stderr}")
        return False

def main():
    print("""
    ╔════════════════════════════════════════════════════════════╗
    ║                                                            ║
    ║        🌱 AI SOIL ANALYZER - INSTALLATION SCRIPT 🌱        ║
    ║                                                            ║
    ║              Kisan Sathi - Empowering Farmers              ║
    ║                                                            ║
    ╚════════════════════════════════════════════════════════════╝
    """)
    
    # Check if we're in the right directory
    if not os.path.exists('kisan_sathi_backend'):
        print("❌ Error: Please run this script from the project root directory")
        print("   (the directory containing 'kisan_sathi_backend' folder)")
        sys.exit(1)
    
    os.chdir('kisan_sathi_backend')
    
    steps = [
        {
            'command': f'{sys.executable} -m pip install --upgrade pip',
            'description': 'Upgrading pip'
        },
        {
            'command': f'{sys.executable} -m pip install Pillow>=10.0.0',
            'description': 'Installing Pillow (Image Processing)'
        },
        {
            'command': f'{sys.executable} -m pip install numpy>=1.24.0',
            'description': 'Installing NumPy (Numerical Computing)'
        },
        {
            'command': f'{sys.executable} -m pip install reportlab>=4.0.0',
            'description': 'Installing ReportLab (PDF Generation)'
        },
        {
            'command': f'{sys.executable} -m pip install gTTS>=2.3.0',
            'description': 'Installing gTTS (Text-to-Speech)'
        },
        {
            'command': f'{sys.executable} manage.py makemigrations soil_analysis',
            'description': 'Creating database migrations'
        },
        {
            'command': f'{sys.executable} manage.py migrate soil_analysis',
            'description': 'Running database migrations'
        }
    ]
    
    success_count = 0
    total_steps = len(steps)
    
    for step in steps:
        if run_command(step['command'], step['description']):
            success_count += 1
    
    print(f"\n{'='*60}")
    print(f"📊 INSTALLATION SUMMARY")
    print(f"{'='*60}")
    print(f"✅ Successful: {success_count}/{total_steps}")
    print(f"❌ Failed: {total_steps - success_count}/{total_steps}")
    
    if success_count == total_steps:
        print(f"\n{'='*60}")
        print("🎉 INSTALLATION COMPLETE!")
        print(f"{'='*60}")
        print("\n✅ AI Soil Analyzer is ready to use!")
        print("\n📚 Next Steps:")
        print("   1. Start Django server: python manage.py runserver")
        print("   2. Test the API at: http://localhost:8000/api/soil/")
        print("   3. Read the guide: AI_SOIL_ANALYZER_COMPLETE.md")
        print("\n🌾 Happy Farming! 🌾\n")
    else:
        print(f"\n{'='*60}")
        print("⚠️  INSTALLATION INCOMPLETE")
        print(f"{'='*60}")
        print("\nSome steps failed. Please:")
        print("1. Check the error messages above")
        print("2. Install failed packages manually")
        print("3. Run this script again")
        print("\nFor help, check: AI_SOIL_ANALYZER_COMPLETE.md\n")

if __name__ == '__main__':
    main()
