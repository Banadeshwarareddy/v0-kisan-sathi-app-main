import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kisan_sathi.settings')
django.setup()

from farmers.models import Farmer
from farm_management.models import Expense, Income, ExpenseCategory, Crop

print("=" * 80)
print("KISAN SATHI DATABASE - YOUR DATA")
print("=" * 80)

# Farmers
print("\n👤 YOUR FARMER ACCOUNT")
print("-" * 80)
farmers = Farmer.objects.all()
print(f"Total Farmers in Database: {farmers.count()}\n")

for f in farmers:
    print(f"📋 Farmer ID: {f.id}")
    print(f"👤 Name: {f.first_name} {f.last_name}")
    print(f"📞 Phone: {f.phone}")
    print(f"📧 Email: {f.email}")
    print(f"🏘️  Village: {f.village}")
    print(f"🏙️  Taluk: {f.taluk}")
    print(f"🌆 District: {f.district}")
    print(f"🌾 Land Size: {f.land_size} acres" if f.land_size else "🌾 Land Size: Not specified")
    print(f"✅ Verified: {'Yes ✓' if f.is_verified else 'No ✗'}")
    print(f"📅 Joined: {f.created_at.strftime('%d %B %Y')}")
    print(f"🌐 Language: {'English' if f.preferred_language == 'en' else 'Kannada'}")
    print("-" * 80)

# Expenses
print("\n💸 EXPENSES")
print("-" * 80)
expenses = Expense.objects.filter(is_deleted=False)
print(f"Total Expense Records: {expenses.count()}")
if expenses.exists():
    total = sum(e.amount for e in expenses)
    print(f"Total Amount Spent: ₹{total:,.2f}\n")
    for e in expenses[:10]:
        print(f"📅 {e.date.strftime('%d-%m-%Y')} | 📂 {e.category.name} | 💰 ₹{e.amount:,.2f}")
        if e.notes:
            print(f"   📝 {e.notes}")
else:
    print("No expense records found.\n")

# Income
print("\n💵 INCOME")
print("-" * 80)
incomes = Income.objects.filter(is_deleted=False)
print(f"Total Income Records: {incomes.count()}")
if incomes.exists():
    total = sum(i.total_amount for i in incomes)
    print(f"Total Income Earned: ₹{total:,.2f}\n")
    for i in incomes[:10]:
        print(f"📅 {i.sale_date.strftime('%d-%m-%Y')} | 🌾 {i.crop.name}")
        print(f"   📦 {i.quantity} {i.unit} @ ₹{i.rate_per_unit}/unit = ₹{i.total_amount:,.2f}")
        print(f"   👤 Buyer: {i.buyer_name} | 💳 Payment: {i.payment_status}")
else:
    print("No income records found.\n")

# Categories
print("\n📂 EXPENSE CATEGORIES")
print("-" * 80)
categories = ExpenseCategory.objects.all()
for cat in categories:
    count = Expense.objects.filter(category=cat, is_deleted=False).count()
    total = sum(e.amount for e in Expense.objects.filter(category=cat, is_deleted=False))
    print(f"{cat.name}: {count} expenses, ₹{total:,.2f}")

# Crops
print("\n🌾 CROPS")
print("-" * 80)
crops = Crop.objects.all()
print(f"Total Crops: {crops.count()}\n")
for crop in crops:
    income_count = Income.objects.filter(crop=crop, is_deleted=False).count()
    print(f"{crop.name} ({crop.season}): {income_count} sales")

print("\n" + "=" * 80)
print("DATABASE VIEW COMPLETE")
print("=" * 80)
