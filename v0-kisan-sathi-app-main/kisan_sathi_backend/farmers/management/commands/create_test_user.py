from django.core.management.base import BaseCommand
from farmers.models import Farmer


class Command(BaseCommand):
    help = 'Creates a test user for login'

    def handle(self, *args, **kwargs):
        phone = '+919876543210'
        
        # Check if user already exists
        if Farmer.objects.filter(phone=phone).exists():
            self.stdout.write(self.style.WARNING(f'User with phone {phone} already exists!'))
            farmer = Farmer.objects.get(phone=phone)
            # Update password
            farmer.set_password('test123')
            farmer.is_verified = True
            farmer.save()
            self.stdout.write(self.style.SUCCESS('Password updated to: test123'))
        else:
            # Create new user
            farmer = Farmer.objects.create(
                phone=phone,
                email='test@example.com',
                first_name='Test',
                last_name='Farmer',
                district='Bangalore',
                taluk='Bangalore North',
                village='Test Village',
                is_verified=True
            )
            farmer.set_password('test123')
            farmer.save()
            self.stdout.write(self.style.SUCCESS('Test user created successfully!'))
        
        self.stdout.write(self.style.SUCCESS('\n' + '='*50))
        self.stdout.write(self.style.SUCCESS('TEST USER CREDENTIALS:'))
        self.stdout.write(self.style.SUCCESS('='*50))
        self.stdout.write(self.style.SUCCESS(f'Phone: {phone}'))
        self.stdout.write(self.style.SUCCESS('Password: test123'))
        self.stdout.write(self.style.SUCCESS('='*50))
        self.stdout.write(self.style.SUCCESS('\nYou can now login with these credentials!'))
