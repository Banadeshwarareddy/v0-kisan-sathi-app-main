from rest_framework import serializers
from .models import (
    ExpenseCategory, Expense, Crop, Income, InventoryCategory, 
    InventoryItem, CropPlan, LivestockType, Livestock, 
    VaccinationRecord, Loan, EMIPayment
)

class ExpenseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseCategory
        fields = '__all__'

class ExpenseSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Expense
        fields = '__all__'
        read_only_fields = ('farmer', 'is_deleted', 'deleted_at')
    
    def create(self, validated_data):
        # Ensure is_deleted is set to False for new records
        validated_data['is_deleted'] = False
        validated_data['deleted_at'] = None
        return super().create(validated_data)

class CropSerializer(serializers.ModelSerializer):
    class Meta:
        model = Crop
        fields = '__all__'

class IncomeSerializer(serializers.ModelSerializer):
    crop_name = serializers.CharField(source='crop.name', read_only=True)
    
    class Meta:
        model = Income
        fields = '__all__'
        read_only_fields = ('farmer', 'total_amount', 'is_deleted', 'deleted_at')
    
    def create(self, validated_data):
        # Ensure is_deleted is set to False for new records
        validated_data['is_deleted'] = False
        validated_data['deleted_at'] = None
        return super().create(validated_data)

class InventoryCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryCategory
        fields = '__all__'

class InventoryItemSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    is_low_stock = serializers.BooleanField(read_only=True)
    total_value = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    
    class Meta:
        model = InventoryItem
        fields = '__all__'
        read_only_fields = ('farmer',)

class CropPlanSerializer(serializers.ModelSerializer):
    crop_name = serializers.CharField(source='crop.name', read_only=True)
    estimated_profit = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    
    class Meta:
        model = CropPlan
        fields = '__all__'
        read_only_fields = ('farmer',)

class LivestockTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LivestockType
        fields = '__all__'

class LivestockSerializer(serializers.ModelSerializer):
    livestock_type_name = serializers.CharField(source='livestock_type.name', read_only=True)
    
    class Meta:
        model = Livestock
        fields = '__all__'
        read_only_fields = ('farmer',)

class VaccinationRecordSerializer(serializers.ModelSerializer):
    livestock_tag = serializers.CharField(source='livestock.tag_number', read_only=True)
    livestock_type = serializers.CharField(source='livestock.livestock_type.name', read_only=True)
    
    class Meta:
        model = VaccinationRecord
        fields = '__all__'

class LoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loan
        fields = '__all__'
        read_only_fields = ('farmer',)

class EMIPaymentSerializer(serializers.ModelSerializer):
    loan_lender = serializers.CharField(source='loan.lender_name', read_only=True)
    
    class Meta:
        model = EMIPayment
        fields = '__all__'

# Dashboard Serializers
class MonthlyProfitSerializer(serializers.Serializer):
    month = serializers.CharField()
    total_income = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_expense = serializers.DecimalField(max_digits=12, decimal_places=2)
    profit = serializers.DecimalField(max_digits=12, decimal_places=2)

class DashboardStatsSerializer(serializers.Serializer):
    total_income = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_expenses = serializers.DecimalField(max_digits=12, decimal_places=2)
    net_profit = serializers.DecimalField(max_digits=12, decimal_places=2)
    active_loans = serializers.IntegerField()
    low_stock_items = serializers.IntegerField()
    upcoming_vaccinations = serializers.IntegerField()
    active_crop_plans = serializers.IntegerField()

class ExpenseByCategorySerializer(serializers.Serializer):
    category = serializers.CharField()
    total_amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    percentage = serializers.DecimalField(max_digits=5, decimal_places=2)