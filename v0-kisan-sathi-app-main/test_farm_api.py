import requests
import json

# Test farm management API
BASE_URL = "http://localhost:8000"

print("Testing Farm Management API...")
print("=" * 50)

# Test 1: Dashboard stats (requires auth)
print("\n1. Testing Dashboard Stats API...")
try:
    response = requests.get(f"{BASE_URL}/farm-management/api/dashboard-stats/")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Total Income: ₹{data.get('total_income', 0)}")
        print(f"Total Expenses: ₹{data.get('total_expenses', 0)}")
        print(f"Net Profit: ₹{data.get('net_profit', 0)}")
    else:
        print(f"Error: {response.text[:200]}")
except Exception as e:
    print(f"Error: {e}")

# Test 2: Expenses list
print("\n2. Testing Expenses API...")
try:
    response = requests.get(f"{BASE_URL}/farm-management/api/expenses/")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Expenses count: {len(data.get('results', data))}")
    else:
        print(f"Error: {response.text[:200]}")
except Exception as e:
    print(f"Error: {e}")

# Test 3: Income list
print("\n3. Testing Income API...")
try:
    response = requests.get(f"{BASE_URL}/farm-management/api/income/")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Income count: {len(data.get('results', data))}")
    else:
        print(f"Error: {response.text[:200]}")
except Exception as e:
    print(f"Error: {e}")

# Test 4: Check if authentication is required
print("\n4. Checking Authentication Requirements...")
print("If you see 401/403 errors above, authentication is required.")
print("The Next.js app needs to send authentication tokens with requests.")

print("\n" + "=" * 50)
print("Test complete!")
