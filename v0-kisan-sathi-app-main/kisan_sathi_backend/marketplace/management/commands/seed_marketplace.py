"""
Seed marketplace with sample data
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from marketplace.models import (
    FarmerProfile, BuyerProfile, CropCategory, CropProduct,
    ListingStatus, QualityGrade, Unit, VerificationStatus
)
from decimal import Decimal
from datetime import date, timedelta

User = get_user_model()


class Command(BaseCommand):
    help = 'Seeds marketplace with sample data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding marketplace data...')
        
        # Get existing farmer user
        try:
            farmer_user = User.objects.get(phone='+919876543210')
            self.stdout.write(self.style.SUCCESS(f'Using existing farmer user: {farmer_user.phone}'))
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR('Farmer user not found. Please create a user with phone +919876543210 first.'))
            return
        
        # Create farmer profile
        farmer_profile, created = FarmerProfile.objects.get_or_create(
            user=farmer_user,
            defaults={
                'farm_name': 'Green Valley Farms',
                'farm_size_acres': Decimal('25.5'),
                'address': 'Village Kothapalli, Mandal Shadnagar',
                'village': 'Kothapalli',
                'district': 'Rangareddy',
                'state': 'Telangana',
                'pincode': '509216',
                'verification_status': VerificationStatus.VERIFIED,
                'rating': Decimal('4.5'),
                'review_count': 120,
                'total_sales': Decimal('250000'),
                'total_orders': 85,
                'bio': 'Organic farming specialist with 15 years of experience',
                'specialization': 'Organic Vegetables & Grains',
                'years_of_experience': 15
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created farmer profile: {farmer_profile.farm_name}'))
        
        # Create categories
        categories_data = [
            {'name': 'Vegetables', 'slug': 'vegetables', 'description': 'Fresh vegetables'},
            {'name': 'Fruits', 'slug': 'fruits', 'description': 'Fresh fruits'},
            {'name': 'Grains', 'slug': 'grains', 'description': 'Cereals and grains'},
            {'name': 'Pulses', 'slug': 'pulses', 'description': 'Lentils and pulses'},
            {'name': 'Spices', 'slug': 'spices', 'description': 'Fresh spices'},
        ]
        
        categories = {}
        for cat_data in categories_data:
            category, created = CropCategory.objects.get_or_create(
                slug=cat_data['slug'],
                defaults=cat_data
            )
            categories[cat_data['slug']] = category
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created category: {category.name}'))
        
        # Create products
        products_data = [
            {
                'name': 'Organic Tomatoes',
                'slug': 'organic-tomatoes',
                'category': 'vegetables',
                'variety': 'Hybrid',
                'quantity_available': Decimal('500'),
                'unit': Unit.KG,
                'price_per_unit': Decimal('40'),
                'original_price': Decimal('50'),
                'quality_grade': QualityGrade.PREMIUM,
                'is_organic_certified': True,
                'description': 'Fresh organic tomatoes grown without pesticides',
                'min_order_quantity': Decimal('5'),
            },
            {
                'name': 'Fresh Potatoes',
                'slug': 'fresh-potatoes',
                'category': 'vegetables',
                'variety': 'Local',
                'quantity_available': Decimal('1000'),
                'unit': Unit.KG,
                'price_per_unit': Decimal('25'),
                'original_price': Decimal('30'),
                'quality_grade': QualityGrade.GRADE_A,
                'is_organic_certified': False,
                'description': 'High quality fresh potatoes',
                'min_order_quantity': Decimal('10'),
            },
            {
                'name': 'Organic Basmati Rice',
                'slug': 'organic-basmati-rice',
                'category': 'grains',
                'variety': 'Basmati 1121',
                'quantity_available': Decimal('2000'),
                'unit': Unit.KG,
                'price_per_unit': Decimal('80'),
                'original_price': Decimal('100'),
                'quality_grade': QualityGrade.PREMIUM,
                'is_organic_certified': True,
                'description': 'Premium organic basmati rice with long grains',
                'min_order_quantity': Decimal('25'),
            },
            {
                'name': 'Fresh Mangoes',
                'slug': 'fresh-mangoes',
                'category': 'fruits',
                'variety': 'Alphonso',
                'quantity_available': Decimal('300'),
                'unit': Unit.KG,
                'price_per_unit': Decimal('150'),
                'original_price': Decimal('180'),
                'quality_grade': QualityGrade.PREMIUM,
                'is_organic_certified': False,
                'description': 'Sweet and juicy Alphonso mangoes',
                'min_order_quantity': Decimal('5'),
            },
            {
                'name': 'Organic Onions',
                'slug': 'organic-onions',
                'category': 'vegetables',
                'variety': 'Red Onion',
                'quantity_available': Decimal('800'),
                'unit': Unit.KG,
                'price_per_unit': Decimal('35'),
                'original_price': Decimal('45'),
                'quality_grade': QualityGrade.GRADE_A,
                'is_organic_certified': True,
                'description': 'Fresh organic red onions',
                'min_order_quantity': Decimal('10'),
            },
            {
                'name': 'Toor Dal',
                'slug': 'toor-dal',
                'category': 'pulses',
                'variety': 'Split Pigeon Peas',
                'quantity_available': Decimal('500'),
                'unit': Unit.KG,
                'price_per_unit': Decimal('120'),
                'original_price': Decimal('140'),
                'quality_grade': QualityGrade.GRADE_A,
                'is_organic_certified': False,
                'description': 'High quality toor dal',
                'min_order_quantity': Decimal('5'),
            },
            {
                'name': 'Organic Turmeric Powder',
                'slug': 'organic-turmeric-powder',
                'category': 'spices',
                'variety': 'Lakadong',
                'quantity_available': Decimal('100'),
                'unit': Unit.KG,
                'price_per_unit': Decimal('400'),
                'original_price': Decimal('500'),
                'quality_grade': QualityGrade.PREMIUM,
                'is_organic_certified': True,
                'description': 'Pure organic turmeric powder with high curcumin content',
                'min_order_quantity': Decimal('1'),
            },
            {
                'name': 'Fresh Carrots',
                'slug': 'fresh-carrots',
                'category': 'vegetables',
                'variety': 'Hybrid',
                'quantity_available': Decimal('400'),
                'unit': Unit.KG,
                'price_per_unit': Decimal('45'),
                'original_price': Decimal('55'),
                'quality_grade': QualityGrade.GRADE_A,
                'is_organic_certified': False,
                'description': 'Crunchy fresh carrots',
                'min_order_quantity': Decimal('5'),
            },
            {
                'name': 'Organic Wheat',
                'slug': 'organic-wheat',
                'category': 'grains',
                'variety': 'Sharbati',
                'quantity_available': Decimal('1500'),
                'unit': Unit.KG,
                'price_per_unit': Decimal('35'),
                'original_price': Decimal('42'),
                'quality_grade': QualityGrade.PREMIUM,
                'is_organic_certified': True,
                'description': 'Organic wheat grains perfect for making flour',
                'min_order_quantity': Decimal('25'),
            },
            {
                'name': 'Fresh Bananas',
                'slug': 'fresh-bananas',
                'category': 'fruits',
                'variety': 'Robusta',
                'quantity_available': Decimal('600'),
                'unit': Unit.DOZEN,
                'price_per_unit': Decimal('50'),
                'original_price': Decimal('60'),
                'quality_grade': QualityGrade.GRADE_A,
                'is_organic_certified': False,
                'description': 'Fresh ripe bananas',
                'min_order_quantity': Decimal('2'),
            },
        ]
        
        for prod_data in products_data:
            category_slug = prod_data.pop('category')
            product, created = CropProduct.objects.get_or_create(
                farmer=farmer_profile,
                slug=prod_data['slug'],
                defaults={
                    **prod_data,
                    'category': categories[category_slug],
                    'listing_status': ListingStatus.ACTIVE,
                    'is_featured': True,
                    'rating': Decimal('4.5'),
                    'review_count': 25,
                    'harvest_date': date.today() - timedelta(days=2),
                    'primary_image_url': f'https://via.placeholder.com/400x300/10b981/ffffff?text={prod_data["name"].replace(" ", "+")}',
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created product: {product.name}'))
        
        self.stdout.write(self.style.SUCCESS('✅ Marketplace seeding completed!'))
        self.stdout.write(self.style.SUCCESS(f'Created {CropProduct.objects.count()} products'))
