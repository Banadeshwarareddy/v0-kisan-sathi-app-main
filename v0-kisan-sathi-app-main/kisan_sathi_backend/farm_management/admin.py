from django.contrib import admin
from .models import (
    ExpenseCategory, Expense, Crop, Income, InventoryCategory, 
    InventoryItem, CropPlan, LivestockType, Livestock, 
    VaccinationRecord, Loan, EMIPayment
)

@admin.register(ExpenseCategory)
class ExpenseCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at')
    search_fields = ('name',)

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('farmer', 'category', 'amount', 'date', 'created_at')
    list_filter = ('category', 'date', 'created_at')
    search_fields = ('farmer__username', 'category__name', 'notes')
    date_hierarchy = 'date'

@admin.register(Crop)
class CropAdmin(admin.ModelAdmin):
    list_display = ('name', 'variety', 'season', 'created_at')
    list_filter = ('season',)
    search_fields = ('name', 'variety')

@admin.register(Income)
class IncomeAdmin(admin.ModelAdmin):
    list_display = ('farmer', 'crop', 'quantity', 'rate_per_unit', 'total_amount', 'sale_date')
    list_filter = ('crop', 'payment_status', 'sale_date')
    search_fields = ('farmer__username', 'crop__name', 'buyer_name')
    date_hierarchy = 'sale_date'

@admin.register(InventoryCategory)
class InventoryCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

@admin.register(InventoryItem)
class InventoryItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'farmer', 'category', 'current_stock', 'minimum_stock', 'is_low_stock')
    list_filter = ('category', 'unit')
    search_fields = ('name', 'brand', 'farmer__username')
    
    def is_low_stock(self, obj):
        return obj.is_low_stock
    is_low_stock.boolean = True

@admin.register(CropPlan)
class CropPlanAdmin(admin.ModelAdmin):
    list_display = ('farmer', 'crop', 'planned_area', 'planting_date', 'status')
    list_filter = ('status', 'crop', 'planting_date')
    search_fields = ('farmer__username', 'crop__name')
    date_hierarchy = 'planting_date'

@admin.register(LivestockType)
class LivestockTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

@admin.register(Livestock)
class LivestockAdmin(admin.ModelAdmin):
    list_display = ('tag_number', 'farmer', 'livestock_type', 'breed', 'health_status', 'purchase_date')
    list_filter = ('livestock_type', 'health_status', 'purchase_date')
    search_fields = ('tag_number', 'farmer__username', 'breed')

@admin.register(VaccinationRecord)
class VaccinationRecordAdmin(admin.ModelAdmin):
    list_display = ('livestock', 'vaccine_name', 'vaccination_date', 'next_due_date', 'veterinarian')
    list_filter = ('vaccination_date', 'next_due_date')
    search_fields = ('livestock__tag_number', 'vaccine_name', 'veterinarian')
    date_hierarchy = 'vaccination_date'

@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    list_display = ('farmer', 'lender_name', 'loan_type', 'principal_amount', 'emi_amount', 'status')
    list_filter = ('loan_type', 'status', 'loan_date')
    search_fields = ('farmer__username', 'lender_name')
    date_hierarchy = 'loan_date'

@admin.register(EMIPayment)
class EMIPaymentAdmin(admin.ModelAdmin):
    list_display = ('loan', 'payment_date', 'amount_paid', 'payment_method')
    list_filter = ('payment_method', 'payment_date')
    search_fields = ('loan__farmer__username', 'loan__lender_name', 'transaction_reference')
    date_hierarchy = 'payment_date'