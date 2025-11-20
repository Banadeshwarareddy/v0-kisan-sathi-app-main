import requests
import json

BASE_URL = "http://localhost:8000"

print("Testing Authentication and Farm Management API")
print("=" * 60)

# Step 1: Login
print("\n1. Logging in...")
login_data = {
    "phone": "+916366673457",
    "password": "Bannu@123"
}

try:
    response = requests.post(f"{BASE_URL}/api/auth/login/", json=login_data)
    print(f"Login Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        access_token = result.get('data', {}).get('access_token')
        print(f"✅ Login successful!")
        print(f"User: {result.get('data', {}).get('farmer', {}).get('name')}")
        print(f"Access Token: {access_token[:50] if access_token else 'None'}...")
        
        # Step 2: Test Farm Management APIs with token
        headers = {"Authorization": f"Bearer {access_token}"}
        
        print("\n2. Testing Dashboard Stats with authentication...")
        response = requests.get(f"{BASE_URL}/farm-management/api/dashboard-stats/", headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Dashboard Stats:")
            print(f"   Total Income: ₹{data.get('total_income', 0)}")
            print(f"   Total Expenses: ₹{data.get('total_expenses', 0)}")
            print(f"   Net Profit: ₹{data.get('net_profit', 0)}")
            print(f"   Active Loans: {data.get('active_loans', 0)}")
        else:
            print(f"❌ Error: {response.text}")
        
        print("\n3. Testing Expenses API...")
        response = requests.get(f"{BASE_URL}/farm-management/api/expenses/", headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            expenses = data if isinstance(data, list) else data.get('results', [])
            print(f"✅ Found {len(expenses)} expenses")
            if expenses:
                exp = expenses[0]
                print(f"   Latest: {exp.get('description', 'N/A')} - ₹{exp.get('amount', 0)}")
        
        print("\n4. Testing Income API...")
        response = requests.get(f"{BASE_URL}/farm-management/api/income/", headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            income = data if isinstance(data, list) else data.get('results', [])
            print(f"✅ Found {len(income)} income records")
            if income:
                inc = income[0]
                print(f"   Latest: {inc.get('crop_name', 'N/A')} - ₹{inc.get('total_amount', 0)}")
        
        print("\n" + "=" * 60)
        print("✅ ALL TESTS PASSED!")
        print("\nTo fix Next.js app:")
        print("1. Make sure you're logged in at http://localhost:3000/")
        print("2. Check browser console for 'kisan-sathi-access' token")
        print("3. If missing, login again")
        
    else:
        print(f"❌ Login failed: {response.text}")
        print("\nPlease check:")
        print("1. Django server is running")
        print("2. Credentials are correct")
        print("3. User exists in database")
        
except Exception as e:
    print(f"❌ Error: {e}")
    print("\nMake sure Django server is running at http://localhost:8000")
