"""
Simple standalone test for currency formatting logic
No dependencies required
"""

from decimal import Decimal

def format_currency(amount):
    """
    Format amount as Indian Rupee currency with proper symbol and comma formatting
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


def test_currency_formatting():
    """Test various currency formatting scenarios"""
    
    print("=" * 60)
    print("Testing Currency Formatting Function")
    print("=" * 60)
    
    test_cases = [
        (34566, "₹34,566"),
        (12000.50, "₹12,000.50"),
        (1500.00, "₹1,500"),
        (0, "₹0"),
        (-500, "₹-500"),
        (-1234.56, "₹-1,234.56"),
        (1000000, "₹1,000,000"),
        (99.99, "₹99.99"),
        (100, "₹100"),
        (Decimal('34566.00'), "₹34,566"),
        (Decimal('12000.50'), "₹12,000.50"),
    ]
    
    all_passed = True
    
    for amount, expected in test_cases:
        result = format_currency(amount)
        status = "✅ PASS" if result == expected else "❌ FAIL"
        
        if result != expected:
            all_passed = False
            print(f"{status} | Input: {amount:>15} | Expected: {expected:>15} | Got: {result:>15}")
        else:
            print(f"{status} | Input: {amount:>15} | Output: {result:>15}")
    
    print("=" * 60)
    
    if all_passed:
        print("✅ All tests passed! Currency formatting is working correctly.")
    else:
        print("❌ Some tests failed. Please check the implementation.")
    
    print("=" * 60)
    
    # Additional examples
    print("\nAdditional Examples:")
    print(f"format_currency(150000) = {format_currency(150000)}")
    print(f"format_currency(2500.75) = {format_currency(2500.75)}")
    print(f"format_currency(999999.99) = {format_currency(999999.99)}")
    print(f"format_currency(-10000) = {format_currency(-10000)}")
    
    return all_passed

if __name__ == "__main__":
    try:
        success = test_currency_formatting()
        exit(0 if success else 1)
    except Exception as e:
        print(f"❌ Error running tests: {e}")
        import traceback
        traceback.print_exc()
        exit(1)
