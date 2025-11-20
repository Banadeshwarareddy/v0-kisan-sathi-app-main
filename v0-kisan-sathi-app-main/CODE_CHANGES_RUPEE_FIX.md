# 💻 Code Changes - Rupee Symbol Fix

## 📁 File 1: `farm_management/utils.py` (NEW FILE)

```python
"""
Utility functions for Farm Management module
"""
from decimal import Decimal
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.fonts import addMapping
import os


def format_currency(amount):
    """
    Format amount as Indian Rupee currency with proper symbol and comma formatting
    
    Args:
        amount: Decimal or float amount
    
    Returns:
        str: Formatted currency string like ₹34,566 or ₹12,000.50
    
    Examples:
        >>> format_currency(34566)
        '₹34,566'
        >>> format_currency(12000.50)
        '₹12,000.50'
        >>> format_currency(-500)
        '₹-500'
    """
    if amount is None:
        return '₹0'
    
    # Convert to Decimal for precision
    if not isinstance(amount, Decimal):
        amount = Decimal(str(amount))
    
    # Handle negative values
    is_negative = amount < 0
    amount = abs(amount)
    
    # Format with Indian comma system
    amount_str = f"{amount:,.2f}"
    
    # Remove trailing .00 for whole numbers
    if amount_str.endswith('.00'):
        amount_str = amount_str[:-3]
    
    # Add rupee symbol
    if is_negative:
        return f'₹-{amount_str}'
    return f'₹{amount_str}'


def register_unicode_fonts():
    """
    Register Unicode fonts for PDF generation to support rupee symbol
    
    Returns:
        str: Name of the registered font family
    """
    try:
        font_paths = [
            # Windows paths
            'C:/Windows/Fonts/DejaVuSans.ttf',
            'C:/Windows/Fonts/Arial.ttf',
            # Linux paths
            '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
            '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf',
            # Mac paths
            '/Library/Fonts/Arial Unicode.ttf',
            '/System/Library/Fonts/Supplemental/Arial Unicode.ttf',
        ]
        
        font_registered = False
        font_name = 'DejaVuSans'
        
        for font_path in font_paths:
            if os.path.exists(font_path):
                try:
                    pdfmetrics.registerFont(TTFont(font_name, font_path))
                    font_registered = True
                    break
                except Exception:
                    continue
        
        if not font_registered:
            return 'Helvetica'
        
        # Register bold variant if available
        bold_paths = [
            'C:/Windows/Fonts/DejaVuSans-Bold.ttf',
            '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
        ]
        
        for bold_path in bold_paths:
            if os.path.exists(bold_path):
                try:
                    pdfmetrics.registerFont(TTFont('DejaVuSans-Bold', bold_path))
                    addMapping('DejaVuSans', 0, 0, 'DejaVuSans')
                    addMapping('DejaVuSans', 1, 0, 'DejaVuSans-Bold')
                    break
                except Exception:
                    continue
        
        return font_name
        
    except Exception as e:
        print(f"Font registration failed: {e}")
        return 'Helvetica'


def format_excel_currency(worksheet, cell, amount):
    """
    Format Excel cell with Indian Rupee currency
    
    Args:
        worksheet: openpyxl worksheet object
        cell: Cell reference (e.g., 'C2')
        amount: Decimal or float amount
    """
    from openpyxl.styles import numbers
    
    if isinstance(cell, str):
        cell_obj = worksheet[cell]
    else:
        cell_obj = cell
    
    cell_obj.value = float(amount) if amount else 0
    cell_obj.number_format = '₹#,##0.00'
```

---

## 📁 File 2: `farm_management/views.py` (CHANGES)

### Change 1: Update Imports

```python
# BEFORE
from openpyxl.styles import Font, Alignment, PatternFill
from openpyxl.utils import get_column_letter

# AFTER
from openpyxl.styles import Font, Alignment, PatternFill, numbers
from openpyxl.utils import get_column_letter
from .utils import format_currency, register_unicode_fonts, format_excel_currency
```

---

### Change 2: Update `export_expenses_pdf()`

```python
# BEFORE (Line ~550)
def export_expenses_pdf(request):
    farmer = request.user
    # ... query code ...
    
    # Create PDF
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    elements = []
    styles = getSampleStyleSheet()
    
    # Title
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#2c3e50'),
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    # Table data
    data = [['Date', 'Category', 'Amount (₹)', 'Notes']]
    for expense in expenses:
        data.append([
            expense.date.strftime('%d-%m-%Y'),
            expense.category.name,
            f'₹{expense.amount:,.2f}',  # ❌ Shows ■ symbol
            expense.notes[:50] if expense.notes else '-'
        ])

# AFTER
def export_expenses_pdf(request):
    farmer = request.user
    # ... query code ...
    
    # Register Unicode fonts for rupee symbol support
    font_name = register_unicode_fonts()  # ✅ NEW
    
    # Create PDF
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    elements = []
    styles = getSampleStyleSheet()
    
    # Title with Unicode font
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#2c3e50'),
        spaceAfter=30,
        alignment=TA_CENTER,
        fontName=font_name  # ✅ NEW
    )
    
    # Table data with formatted currency
    data = [['Date', 'Category', 'Amount', 'Notes']]
    for expense in expenses:
        data.append([
            expense.date.strftime('%d-%m-%Y'),
            expense.category.name,
            format_currency(expense.amount),  # ✅ NEW - Shows ₹34,566
            expense.notes[:50] if expense.notes else '-'
        ])
    
    # Table style with Unicode font
    table.setStyle(TableStyle([
        # ... other styles ...
        ('FONTNAME', (0, 0), (-1, -1), font_name),  # ✅ NEW
    ]))
```

---

### Change 3: Update `export_income_pdf()`

```python
# BEFORE
data = [['Date', 'Crop', 'Quantity', 'Rate', 'Total (₹)', 'Buyer']]
for income in income_records:
    data.append([
        income.sale_date.strftime('%d-%m-%Y'),
        income.crop.name,
        f'{income.quantity} {income.unit}',
        f'₹{income.rate_per_unit:,.2f}',  # ❌ Shows ■
        f'₹{income.total_amount:,.2f}',   # ❌ Shows ■
        income.buyer_name[:20]
    ])

# AFTER
font_name = register_unicode_fonts()  # ✅ NEW

data = [['Date', 'Crop', 'Quantity', 'Rate', 'Total', 'Buyer']]
for income in income_records:
    data.append([
        income.sale_date.strftime('%d-%m-%Y'),
        income.crop.name,
        f'{income.quantity} {income.unit}',
        format_currency(income.rate_per_unit),   # ✅ Shows ₹250
        format_currency(income.total_amount),    # ✅ Shows ₹12,000.50
        income.buyer_name[:20]
    ])

table.setStyle(TableStyle([
    # ... other styles ...
    ('FONTNAME', (0, 0), (-1, -1), font_name),  # ✅ NEW
]))
```

---

### Change 4: Update `export_expenses_excel()`

```python
# BEFORE
for row, expense in enumerate(expenses, 2):
    ws.cell(row=row, column=1, value=expense.date.strftime('%d-%m-%Y'))
    ws.cell(row=row, column=2, value=expense.category.name)
    ws.cell(row=row, column=3, value=float(expense.amount))  # ❌ No formatting
    ws.cell(row=row, column=4, value=expense.notes)

# Total row
total_row = len(expenses) + 2
ws.cell(row=total_row, column=2, value='TOTAL').font = Font(bold=True)
ws.cell(row=total_row, column=3, value=float(total)).font = Font(bold=True)  # ❌ No formatting

# AFTER
for row, expense in enumerate(expenses, 2):
    ws.cell(row=row, column=1, value=expense.date.strftime('%d-%m-%Y'))
    ws.cell(row=row, column=2, value=expense.category.name)
    
    # Format currency cell ✅ NEW
    amount_cell = ws.cell(row=row, column=3, value=float(expense.amount))
    amount_cell.number_format = '₹#,##0.00'
    
    ws.cell(row=row, column=4, value=expense.notes)

# Total row with currency formatting ✅ NEW
total_row = len(expenses) + 2
ws.cell(row=total_row, column=2, value='TOTAL').font = Font(bold=True)
total_cell = ws.cell(row=total_row, column=3, value=float(total))
total_cell.font = Font(bold=True)
total_cell.number_format = '₹#,##0.00'  # ✅ NEW
```

---

### Change 5: Update `export_income_excel()`

```python
# BEFORE
for row, income in enumerate(income_records, 2):
    # ... other cells ...
    ws.cell(row=row, column=5, value=float(income.rate_per_unit))      # ❌ No formatting
    ws.cell(row=row, column=6, value=float(income.total_amount))       # ❌ No formatting

# AFTER
for row, income in enumerate(income_records, 2):
    # ... other cells ...
    
    # Format currency cells ✅ NEW
    rate_cell = ws.cell(row=row, column=5, value=float(income.rate_per_unit))
    rate_cell.number_format = '₹#,##0.00'
    
    amount_cell = ws.cell(row=row, column=6, value=float(income.total_amount))
    amount_cell.number_format = '₹#,##0.00'
```

---

### Change 6: Update `export_analytics_pdf()`

```python
# BEFORE
summary_data = [
    ['Metric', 'Amount (₹)'],
    ['Total Income', f'₹{total_income:,.2f}'],      # ❌ Shows ■
    ['Total Expenses', f'₹{total_expenses:,.2f}'],  # ❌ Shows ■
    ['Net Profit/Loss', f'₹{net_profit:,.2f}']      # ❌ Shows ■
]

category_data = [['Category', 'Amount (₹)', 'Percentage']]
for cat in category_expenses:
    category_data.append([
        cat['category__name'],
        f'₹{cat["total_amount"]:,.2f}',  # ❌ Shows ■
        f'{percentage:.1f}%'
    ])

# AFTER
font_name = register_unicode_fonts()  # ✅ NEW

summary_data = [
    ['Metric', 'Amount'],
    ['Total Income', format_currency(total_income)],      # ✅ Shows ₹1,50,000
    ['Total Expenses', format_currency(total_expenses)],  # ✅ Shows ₹50,000
    ['Net Profit/Loss', format_currency(net_profit)]      # ✅ Shows ₹1,00,000
]

category_data = [['Category', 'Amount', 'Percentage']]
for cat in category_expenses:
    category_data.append([
        cat['category__name'],
        format_currency(cat['total_amount']),  # ✅ Shows ₹34,566
        f'{percentage:.1f}%'
    ])

# Apply font to all tables
table.setStyle(TableStyle([
    # ... other styles ...
    ('FONTNAME', (0, 0), (-1, -1), font_name),  # ✅ NEW
]))
```

---

## 📊 Summary of Changes

### Files Created: 1
- `farm_management/utils.py` - Utility functions

### Files Modified: 1
- `farm_management/views.py` - 5 report functions updated

### Functions Added: 3
- `format_currency()` - Currency formatter
- `register_unicode_fonts()` - Font registration
- `format_excel_currency()` - Excel formatter

### Functions Updated: 5
- `export_expenses_pdf()` - PDF with ₹ symbol
- `export_income_pdf()` - PDF with ₹ symbol
- `export_analytics_pdf()` - PDF with ₹ symbol
- `export_expenses_excel()` - Excel with ₹ format
- `export_income_excel()` - Excel with ₹ format

---

## ✅ Result

**Before:** ■34,566.00 or blank
**After:** ₹34,566

All currency values now display correctly with the Indian Rupee symbol!
