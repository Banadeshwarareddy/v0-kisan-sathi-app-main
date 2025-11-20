import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kisan_sathi.settings')
django.setup()

from farmers.models import Farmer

# Admin credentials
phone = '+916366673457'
email = 'banadeshwarareddyreddy@gmail.com'
password = 'Bannu@123'

# Check if user exists
if Farmer.objects.filter(phone=phone).exists():
    farmer = Farmer.objects.get(phone=phone)
    print(f'User with phone {phone} already exists. Updating...')
else:
    # Create new admin user
    farmer = Farmer.objects.create(
        phone=phone,
        email=email,
        first_name='Admin',
        last_name='User',
        district='Bangalore',
        taluk='Bangalore North',
        village='Admin Village',
        is_verified=True,
        is_staff=True,
        is_superuser=True,
        is_active=True
    )
    print('New admin user created!')

# Set password and admin privileges
farmer.set_password(password)
farmer.is_staff = True
farmer.is_superuser = True
farmer.is_active = True
farmer.is_verified = True
farmer.email = email
farmer.save()

print('\n' + '='*60)
print('ADMIN USER CREATED SUCCESSFULLY!')
print('='*60)
print(f'Phone: {phone}')
print(f'Email: {email}')
print(f'Password: {password}')
print(f'Staff: {farmer.is_staff}')
print(f'Superuser: {farmer.is_superuser}')
print('='*60)
print('\nYou can now login with these credentials!')
