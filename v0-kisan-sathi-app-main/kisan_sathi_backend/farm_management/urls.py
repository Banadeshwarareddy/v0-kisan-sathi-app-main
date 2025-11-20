from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'expense-categories', views.ExpenseCategoryViewSet)
router.register(r'expenses', views.ExpenseViewSet, basename='expense')
router.register(r'crops', views.CropViewSet)
router.register(r'income', views.IncomeViewSet, basename='income')
router.register(r'inventory-categories', views.InventoryCategoryViewSet)
router.register(r'inventory', views.InventoryItemViewSet, basename='inventory')
router.register(r'crop-plans', views.CropPlanViewSet, basename='cropplan')
router.register(r'livestock-types', views.LivestockTypeViewSet)
router.register(r'livestock', views.LivestockViewSet, basename='livestock')
router.register(r'vaccinations', views.VaccinationRecordViewSet, basename='vaccination')
router.register(r'loans', views.LoanViewSet, basename='loan')
router.register(r'emi-payments', views.EMIPaymentViewSet, basename='emipayment')

urlpatterns = [
    # API URLs
    path('api/', include(router.urls)),
    path('api/dashboard-stats/', views.dashboard_stats, name='dashboard-stats'),
    path('api/monthly-profit/', views.monthly_profit_chart, name='monthly-profit'),
    path('api/expense-by-category/', views.expense_by_category, name='expense-by-category'),
    path('api/income-by-crop/', views.income_by_crop, name='income-by-crop'),
    
    # Export URLs
    path('api/export/expenses/pdf/', views.export_expenses_pdf, name='export-expenses-pdf'),
    path('api/export/expenses/excel/', views.export_expenses_excel, name='export-expenses-excel'),
    path('api/export/income/pdf/', views.export_income_pdf, name='export-income-pdf'),
    path('api/export/income/excel/', views.export_income_excel, name='export-income-excel'),
    path('api/export/analytics/pdf/', views.export_analytics_pdf, name='export-analytics-pdf'),
    
    # Template URLs
    path('', views.dashboard_view, name='dashboard'),
    path('expenses/', views.expenses_view, name='expenses'),
    path('income/', views.income_view, name='income'),
    path('income-breakdown/', views.income_breakdown_view, name='income-breakdown'),
    path('income-expense-combined/', views.income_expense_combined_view, name='income-expense-combined'),
    path('inventory/', views.inventory_view, name='inventory'),
    path('crop-planning/', views.crop_planning_view, name='crop-planning'),
    path('livestock/', views.livestock_view, name='livestock'),
    path('loans/', views.loans_view, name='loans'),
    path('reports/', views.reports_view, name='reports'),
]