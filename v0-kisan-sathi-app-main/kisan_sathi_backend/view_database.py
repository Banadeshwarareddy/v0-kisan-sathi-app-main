import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kisan_sathi.settings')
django.setup()

from farmers.models import Farmer
from farm_management.models import Expense, Income, Inventory, Livestock, CropPlan, Loan, FarmerProfile

print("=" * 80)
print("KISAN SATHI DATABASE OVERVIEW")
print("=" * 80)

# Farmers
print("\n📊 FARMERS")
print("-" * 80)
farmers = Farmer.objects.all()
print(f"Total Farmers: {farmers.count()}\n")
for f in farmers:
    print(f"ID: {f.id}")
    print(f"Name: {f.first_name} {f.last_name}")
    print(f"Phone: {f.phone}")
    print(f"Email: {f.email}")
    print(f"Village: {f.village}")
    print(f"District: {f.district}")
    print(f"Taluk: {f.taluk}")
    print(f"Land Size: {f.land_size} acres")
    print(f"Verified: {'✓' if f.is_verified else '✗'}")
    print(f"Created: {f.created_at.strftime('%Y-%m-%d')}")
    print("-" * 80)

# Farmer Profiles
print("\n👤 FARMER PROFILES")
print("-" * 80)
profiles = FarmerProfile.objects.all()
print(f"Total Profiles: {profiles.count()}\n")
for p in profiles:
    print(f"Farmer: {p.farmer.first_name} {p.farmer.last_name}")
    print(f"Farm Name: {p.farm_name}")
    print(f"Farm Size: {p.farm_size} acres")
    print(f"Location: {p.location}")
    print(f"Verified: {'✓' if p.is_verified else '✗'}")
    print("-" * 80)

# Skip products for now - model structure different

# Farm Management Data
print("\n💰 EXPENSES")
print("-" * 80)
expenses = Expense.objects.all()
print(f"Total Expenses: {expenses.count()}")
if expenses.exists():
    total = sum(e.amount for e in expenses)
    print(f"Total Amount: ₹{total:,.2f}\n")
    for e in expenses[:5]:
        print(f"{e.date} | {e.category} | ₹{e.amount} | {e.description}")

print("\n💵 INCOME")
print("-" * 80)
incomes = Income.objects.all()
print(f"Total Income Records: {incomes.count()}")
if incomes.exists():
    total = sum(i.amount for i in incomes)
    print(f"Total Amount: ₹{total:,.2f}\n")
    for i in incomes[:5]:
        print(f"{i.date} | {i.source} | ₹{i.amount} | {i.description}")

print("\n📦 INVENTORY")
print("-" * 80)
inventory = Inventory.objects.all()
print(f"Total Items: {inventory.count()}\n")
for item in inventory[:5]:
    print(f"{item.item_name} | {item.quantity} {item.unit} | ₹{item.value}")

print("\n🐄 LIVESTOCK")
print("-" * 80)
livestock = Livestock.objects.all()
print(f"Total Livestock: {livestock.count()}\n")
for animal in livestock[:5]:
    print(f"{animal.animal_type} | Count: {animal.count} | Value: ₹{animal.value}")

print("\n🌾 CROP PLANS")
print("-" * 80)
crops = CropPlan.objects.all()
print(f"Total Crop Plans: {crops.count()}\n")
for crop in crops[:5]:
    print(f"{crop.crop_name} | {crop.area} acres | Season: {crop.season}")

print("\n💳 LOANS")
print("-" * 80)
loans = Loan.objects.all()
print(f"Total Loans: {loans.count()}\n")
for loan in loans[:5]:
    print(f"{loan.loan_type} | Amount: ₹{loan.amount} | Status: {loan.status}")

print("\n" + "=" * 80)
print("DATABASE OVERVIEW COMPLETE")
print("=" * 80)
