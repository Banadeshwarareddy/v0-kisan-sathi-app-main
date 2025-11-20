import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kisan_sathi.settings')
django.setup()

from farmers.models import Farmer
from marketplace.models import FarmerProfile

print("Creating FarmerProfile for your account...")
print("=" * 60)

try:
    # Get your farmer account
    farmer = Farmer.objects.get(phone='+916366673457')
    print(f"✅ Found Farmer: {farmer.first_name} {farmer.last_name}")
    print(f"   Phone: {farmer.phone}")
    print(f"   Email: {farmer.email}")
    
    # Check if FarmerProfile already exists
    if hasattr(farmer, 'farmer_profile'):
        print("\n✅ FarmerProfile already exists!")
        profile = farmer.farmer_profile
        print(f"   Farm Name: {profile.farm_name}")
        print(f"   Verification: {profile.verification_status}")
    else:
        # Create FarmerProfile
        profile = FarmerProfile.objects.create(
            user=farmer,
            farm_name="Banadeshwara Farm",
            verification_status='verified',
            farm_size_acres=10.0,
            address="Kodla Village",
            district="Gulbarga",
            state="Karnataka",
            pincode="585102"
        )
        print("\n✅ FarmerProfile created successfully!")
        print(f"   Farm Name: {profile.farm_name}")
        print(f"   Verification: {profile.verification_status}")
        print(f"   Farm Size: {profile.farm_size_acres} acres")
    
    print("\n" + "=" * 60)
    print("🎉 SUCCESS! You can now add products in the marketplace!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Go to http://localhost:3000/marketplace")
    print("2. Click 'Farmer Dashboard' or 'Add Product'")
    print("3. Fill in product details and upload images")
    print("4. Click 'Add Product' - It will work now!")
    
except Farmer.DoesNotExist:
    print("❌ Error: Farmer account not found!")
    print("   Please make sure you're logged in with phone: +916366673457")
except Exception as e:
    print(f"❌ Error: {e}")
