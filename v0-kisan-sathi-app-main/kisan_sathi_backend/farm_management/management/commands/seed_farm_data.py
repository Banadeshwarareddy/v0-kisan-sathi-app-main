from django.core.management.base import BaseCommand
from farm_management.models import ExpenseCategory, Crop, InventoryCategory, LivestockType


class Command(BaseCommand):
    help = 'Seeds initial data for farm management module'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding farm management data...')

        # Seed Expense Categories
        expense_categories = [
            {'name': 'Seed', 'description': 'Seeds and planting materials'},
            {'name': 'Fertilizer', 'description': 'Chemical and organic fertilizers'},
            {'name': 'Pesticide', 'description': 'Pesticides and insecticides'},
            {'name': 'Labor', 'description': 'Labor and workforce costs'},
            {'name': 'Transport', 'description': 'Transportation and logistics'},
            {'name': 'Water/Electricity', 'description': 'Water and electricity bills'},
            {'name': 'Tools', 'description': 'Farm tools and equipment'},
            {'name': 'Others', 'description': 'Other miscellaneous expenses'},
        ]

        for cat_data in expense_categories:
            cat, created = ExpenseCategory.objects.get_or_create(
                name=cat_data['name'],
                defaults={'description': cat_data['description']}
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created expense category: {cat.name}'))
            else:
                self.stdout.write(f'Expense category already exists: {cat.name}')

        # Seed Crops
        crops = [
            {'name': 'Rice', 'variety': 'IR-64', 'season': 'kharif'},
            {'name': 'Wheat', 'variety': 'HD-2967', 'season': 'rabi'},
            {'name': 'Groundnut', 'variety': 'TMV-2', 'season': 'kharif'},
            {'name': 'Sugarcane', 'variety': 'Co-86032', 'season': 'perennial'},
            {'name': 'Tomato', 'variety': 'Pusa Ruby', 'season': 'rabi'},
            {'name': 'Onion', 'variety': 'Nasik Red', 'season': 'rabi'},
            {'name': 'Maize', 'variety': 'DHM-117', 'season': 'kharif'},
            {'name': 'Cotton', 'variety': 'Bt Cotton', 'season': 'kharif'},
            {'name': 'Ragi', 'variety': 'GPU-28', 'season': 'kharif'},
            {'name': 'Coconut', 'variety': 'Tall', 'season': 'perennial'},
            {'name': 'Pomegranate', 'variety': 'Bhagwa', 'season': 'perennial'},
            {'name': 'Banana', 'variety': 'Robusta', 'season': 'perennial'},
        ]

        for crop_data in crops:
            crop, created = Crop.objects.get_or_create(
                name=crop_data['name'],
                variety=crop_data['variety'],
                defaults={'season': crop_data['season']}
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created crop: {crop.name} ({crop.variety})'))
            else:
                self.stdout.write(f'Crop already exists: {crop.name} ({crop.variety})')

        # Seed Inventory Categories
        inventory_categories = [
            {'name': 'Seeds', 'description': 'Seeds and planting materials'},
            {'name': 'Fertilizers', 'description': 'Chemical and organic fertilizers'},
            {'name': 'Pesticides', 'description': 'Pesticides and insecticides'},
            {'name': 'Feed', 'description': 'Animal feed and fodder'},
            {'name': 'Tools', 'description': 'Farm tools and equipment'},
        ]

        for cat_data in inventory_categories:
            cat, created = InventoryCategory.objects.get_or_create(
                name=cat_data['name'],
                defaults={'description': cat_data['description']}
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created inventory category: {cat.name}'))
            else:
                self.stdout.write(f'Inventory category already exists: {cat.name}')

        # Seed Livestock Types
        livestock_types = [
            {'name': 'Cow', 'description': 'Dairy and beef cattle'},
            {'name': 'Buffalo', 'description': 'Water buffalo'},
            {'name': 'Goat', 'description': 'Goats for milk and meat'},
            {'name': 'Sheep', 'description': 'Sheep for wool and meat'},
            {'name': 'Chicken', 'description': 'Poultry for eggs and meat'},
            {'name': 'Duck', 'description': 'Ducks for eggs and meat'},
        ]

        for type_data in livestock_types:
            livestock_type, created = LivestockType.objects.get_or_create(
                name=type_data['name'],
                defaults={'description': type_data['description']}
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created livestock type: {livestock_type.name}'))
            else:
                self.stdout.write(f'Livestock type already exists: {livestock_type.name}')

        self.stdout.write(self.style.SUCCESS('\n✅ Farm management data seeded successfully!'))
