from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from decimal import Decimal

User = get_user_model()

class ExpenseCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Expense Categories"

class Expense(models.Model):
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expenses')
    category = models.ForeignKey(ExpenseCategory, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    date = models.DateField()
    notes = models.TextField(blank=True)
    receipt_image = models.ImageField(upload_to='expenses/', blank=True, null=True)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.farmer.username} - {self.category.name} - ₹{self.amount}"

    class Meta:
        ordering = ['-date', '-created_at']

class Crop(models.Model):
    name = models.CharField(max_length=100)
    variety = models.CharField(max_length=100, blank=True)
    season = models.CharField(max_length=50, choices=[
        ('kharif', 'Kharif'),
        ('rabi', 'Rabi'),
        ('zaid', 'Zaid'),
        ('perennial', 'Perennial')
    ])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.variety})" if self.variety else self.name

    class Meta:
        unique_together = ['name', 'variety']

class Income(models.Model):
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='incomes')
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    unit = models.CharField(max_length=20, choices=[
        ('kg', 'Kilogram'),
        ('quintal', 'Quintal'),
        ('ton', 'Ton'),
        ('bag', 'Bag'),
        ('piece', 'Piece')
    ], default='kg')
    rate_per_unit = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, editable=False)
    buyer_name = models.CharField(max_length=200)
    buyer_contact = models.CharField(max_length=15, blank=True)
    sale_date = models.DateField()
    payment_status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('partial', 'Partial'),
        ('completed', 'Completed')
    ], default='pending')
    notes = models.TextField(blank=True)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.total_amount = self.quantity * self.rate_per_unit
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.farmer.username} - {self.crop.name} - ₹{self.total_amount}"

    class Meta:
        ordering = ['-sale_date', '-created_at']

class InventoryCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Inventory Categories"

class InventoryItem(models.Model):
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='inventory_items')
    category = models.ForeignKey(InventoryCategory, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    brand = models.CharField(max_length=100, blank=True)
    current_stock = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    unit = models.CharField(max_length=20, choices=[
        ('kg', 'Kilogram'),
        ('liter', 'Liter'),
        ('bag', 'Bag'),
        ('bottle', 'Bottle'),
        ('packet', 'Packet'),
        ('piece', 'Piece')
    ])
    minimum_stock = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    cost_per_unit = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    supplier_name = models.CharField(max_length=200, blank=True)
    supplier_contact = models.CharField(max_length=15, blank=True)
    expiry_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def is_low_stock(self):
        return self.current_stock <= self.minimum_stock

    @property
    def total_value(self):
        return self.current_stock * self.cost_per_unit

    def __str__(self):
        return f"{self.name} ({self.brand})" if self.brand else self.name

    class Meta:
        ordering = ['name']

class CropPlan(models.Model):
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='crop_plans')
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE)
    planned_area = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    area_unit = models.CharField(max_length=20, choices=[
        ('acre', 'Acre'),
        ('hectare', 'Hectare'),
        ('bigha', 'Bigha'),
        ('katha', 'Katha')
    ], default='acre')
    planting_date = models.DateField()
    expected_harvest_date = models.DateField()
    estimated_yield = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    estimated_cost = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    estimated_revenue = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    status = models.CharField(max_length=20, choices=[
        ('planned', 'Planned'),
        ('planted', 'Planted'),
        ('growing', 'Growing'),
        ('harvested', 'Harvested'),
        ('cancelled', 'Cancelled')
    ], default='planned')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def estimated_profit(self):
        if self.estimated_revenue and self.estimated_cost:
            return self.estimated_revenue - self.estimated_cost
        return None

    def __str__(self):
        return f"{self.farmer.username} - {self.crop.name} - {self.planned_area} {self.area_unit}"

    class Meta:
        ordering = ['-planting_date']

class LivestockType(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Livestock(models.Model):
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='livestock')
    livestock_type = models.ForeignKey(LivestockType, on_delete=models.CASCADE)
    tag_number = models.CharField(max_length=50)
    breed = models.CharField(max_length=100, blank=True)
    age_months = models.PositiveIntegerField(blank=True, null=True)
    weight = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    purchase_date = models.DateField()
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    health_status = models.CharField(max_length=20, choices=[
        ('healthy', 'Healthy'),
        ('sick', 'Sick'),
        ('under_treatment', 'Under Treatment'),
        ('quarantine', 'Quarantine')
    ], default='healthy')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.livestock_type.name} - {self.tag_number}"

    class Meta:
        unique_together = ['farmer', 'tag_number']

class VaccinationRecord(models.Model):
    livestock = models.ForeignKey(Livestock, on_delete=models.CASCADE, related_name='vaccinations')
    vaccine_name = models.CharField(max_length=200)
    vaccination_date = models.DateField()
    next_due_date = models.DateField(blank=True, null=True)
    veterinarian = models.CharField(max_length=200, blank=True)
    cost = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.livestock} - {self.vaccine_name}"

    class Meta:
        ordering = ['-vaccination_date']

class Loan(models.Model):
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='loans')
    lender_name = models.CharField(max_length=200)
    loan_type = models.CharField(max_length=50, choices=[
        ('crop_loan', 'Crop Loan'),
        ('equipment_loan', 'Equipment Loan'),
        ('personal_loan', 'Personal Loan'),
        ('kisan_credit_card', 'Kisan Credit Card'),
        ('other', 'Other')
    ])
    principal_amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    loan_date = models.DateField()
    tenure_months = models.PositiveIntegerField()
    emi_amount = models.DecimalField(max_digits=10, decimal_places=2)
    remaining_amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=[
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('defaulted', 'Defaulted')
    ], default='active')
    purpose = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.farmer.username} - {self.lender_name} - ₹{self.principal_amount}"

    class Meta:
        ordering = ['-loan_date']

class EMIPayment(models.Model):
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE, related_name='emi_payments')
    payment_date = models.DateField()
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    principal_component = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    interest_component = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    penalty = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    payment_method = models.CharField(max_length=50, choices=[
        ('cash', 'Cash'),
        ('bank_transfer', 'Bank Transfer'),
        ('cheque', 'Cheque'),
        ('online', 'Online Payment')
    ], default='cash')
    transaction_reference = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.loan} - ₹{self.amount_paid} on {self.payment_date}"

    class Meta:
        ordering = ['-payment_date']