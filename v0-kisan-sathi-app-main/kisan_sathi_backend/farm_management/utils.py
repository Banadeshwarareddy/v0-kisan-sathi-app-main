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
    # Convert to string with 2 decimal places
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
    
    This function tries to register DejaVu Sans font which supports Unicode characters
    including the Indian Rupee symbol (₹)
    
    Returns:
        str: Name of the registered font family
    """
    try:
        # Try to use DejaVu Sans (commonly available on most systems)
        # On Windows, fonts are typically in C:\Windows\Fonts
        # On Linux, fonts are in /usr/share/fonts
        # On Mac, fonts are in /Library/Fonts or ~/Library/Fonts
        
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
            # Fallback: Use Helvetica (won't show rupee symbol correctly)
            # But at least won't crash
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
        # Fallback to Helvetica if font registration fails
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
    
    # Set the value
    if isinstance(cell, str):
        cell_obj = worksheet[cell]
    else:
        cell_obj = cell
    
    cell_obj.value = float(amount) if amount else 0
    
    # Apply Indian Rupee format with comma separator
    # Format: ₹#,##0.00 for amounts with decimals
    # Format: ₹#,##0 for whole numbers
    cell_obj.number_format = '₹#,##0.00'
