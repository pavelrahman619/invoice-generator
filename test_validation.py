#!/usr/bin/env python3
"""
Comprehensive validation test script for Invoice Generator
Tests field length constraints and validation on both frontend and backend
"""

import requests
import json
import time
from datetime import datetime, timedelta

BASE_URL = "http://localhost:8000/api"

def test_invoice_creation_with_constraints():
    """Test invoice creation with various field length constraints"""
    
    print("🧪 Starting Invoice Validation Tests")
    print("="*50)
    
    # Test 1: Valid invoice with maximum allowed lengths
    print("\n📋 Test 1: Valid invoice with maximum field lengths")
    
    # Generate 50-character invoice number
    invoice_number_50 = "INV-" + "X" * 46  # 50 chars total
    
    # Generate 500-character description
    description_500 = "A" * 500
    
    # Generate 200-character company/client names
    company_name_200 = "B" * 200
    client_name_200 = "C" * 200
    
    valid_invoice_data = {
        "company_name": company_name_200,
        "company_address": "123 Business Street\nSuite 100",
        "company_city": "D" * 100,  # 100 chars
        "company_state": "E" * 100,  # 100 chars
        "company_zip_code": "F" * 20,  # 20 chars
        "company_country": "G" * 100,  # 100 chars
        "company_email": "test@company.com",
        "company_phone": "H" * 20,  # 20 chars
        
        "client_name": client_name_200,
        "client_address": "456 Client Avenue\nFloor 5",
        "client_city": "I" * 100,  # 100 chars
        "client_state": "J" * 100,  # 100 chars
        "client_zip_code": "K" * 20,  # 20 chars
        "client_country": "L" * 100,  # 100 chars
        "client_email": "client@test.com",
        "client_phone": "M" * 20,  # 20 chars
        
        "invoice_number": invoice_number_50,
        "invoice_date": datetime.now().strftime("%Y-%m-%d"),
        "due_date": (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d"),
        "subtotal": 1000.00,
        "tax_rate": 8.50,
        "tax_amount": 85.00,
        "total": 1085.00,
        "notes": "Payment terms: Net 30 days",
        
        "items": [
            {
                "description": description_500,  # 500 chars
                "quantity": 1.0,
                "rate": 1000.00,
                "amount": 1000.00
            }
        ]
    }
    
    print(f"Invoice Number Length: {len(valid_invoice_data['invoice_number'])} chars")
    print(f"Company Name Length: {len(valid_invoice_data['company_name'])} chars")
    print(f"Client Name Length: {len(valid_invoice_data['client_name'])} chars")
    print(f"Description Length: {len(valid_invoice_data['items'][0]['description'])} chars")
    print(f"City Length: {len(valid_invoice_data['company_city'])} chars")
    print(f"Phone Length: {len(valid_invoice_data['company_phone'])} chars")
    
    response = send_request(valid_invoice_data)
    
    if response and response.get("success"):
        print("✅ Test 1 PASSED: Valid invoice with max lengths created successfully")
        invoice_id = response['data']['id']
        print(f"   Created invoice ID: {invoice_id}")
    else:
        print("❌ Test 1 FAILED: Valid invoice creation failed")
        if response:
            print(f"   Error: {response.get('message', 'Unknown error')}")
            print(f"   Errors: {response.get('errors', {})}")
    
    # Test 2: Invoice number exceeding 50 characters
    print("\n📋 Test 2: Invoice number exceeding 50 characters")
    
    invalid_invoice_51_chars = valid_invoice_data.copy()
    invalid_invoice_51_chars["invoice_number"] = "INV-" + "X" * 47  # 51 chars total
    invalid_invoice_51_chars["items"] = [
        {
            "description": "Standard service",
            "quantity": 1.0,
            "rate": 1000.00,
            "amount": 1000.00
        }
    ]
    
    print(f"Invoice Number Length: {len(invalid_invoice_51_chars['invoice_number'])} chars")
    
    response = send_request(invalid_invoice_51_chars)
    
    if response and not response.get("success"):
        print("✅ Test 2 PASSED: Invoice number validation correctly rejected 51 chars")
        print(f"   Error message: {response.get('message', 'Unknown error')}")
        if 'errors' in response and 'invoice_number' in response['errors']:
            print(f"   Field error: {response['errors']['invoice_number']}")
    else:
        print("❌ Test 2 FAILED: Should have rejected 51-character invoice number")
    
    # Test 3: Description exceeding 500 characters
    print("\n📋 Test 3: Item description exceeding 500 characters")
    
    invalid_description_501 = valid_invoice_data.copy()
    invalid_description_501["invoice_number"] = f"INV-{int(time.time())}"  # Unique number
    invalid_description_501["items"] = [
        {
            "description": "A" * 501,  # 501 chars
            "quantity": 1.0,
            "rate": 1000.00,
            "amount": 1000.00
        }
    ]
    
    print(f"Description Length: {len(invalid_description_501['items'][0]['description'])} chars")
    
    response = send_request(invalid_description_501)
    
    if response and not response.get("success"):
        print("✅ Test 3 PASSED: Description validation correctly rejected 501 chars")
        print(f"   Error message: {response.get('message', 'Unknown error')}")
        if 'errors' in response:
            print(f"   Field errors: {response['errors']}")
    else:
        print("❌ Test 3 FAILED: Should have rejected 501-character description")
    
    # Test 4: Company name exceeding 200 characters
    print("\n📋 Test 4: Company name exceeding 200 characters")
    
    invalid_company_201 = valid_invoice_data.copy()
    invalid_company_201["invoice_number"] = f"INV-{int(time.time())}"
    invalid_company_201["company_name"] = "B" * 201  # 201 chars
    invalid_company_201["items"] = [
        {
            "description": "Standard service",
            "quantity": 1.0,
            "rate": 1000.00,
            "amount": 1000.00
        }
    ]
    
    print(f"Company Name Length: {len(invalid_company_201['company_name'])} chars")
    
    response = send_request(invalid_company_201)
    
    if response and not response.get("success"):
        print("✅ Test 4 PASSED: Company name validation correctly rejected 201 chars")
        print(f"   Error message: {response.get('message', 'Unknown error')}")
    else:
        print("❌ Test 4 FAILED: Should have rejected 201-character company name")
    
    # Test 5: Client name exceeding 200 characters
    print("\n📋 Test 5: Client name exceeding 200 characters")
    
    invalid_client_201 = valid_invoice_data.copy()
    invalid_client_201["invoice_number"] = f"INV-{int(time.time())}"
    invalid_client_201["client_name"] = "C" * 201  # 201 chars
    invalid_client_201["items"] = [
        {
            "description": "Standard service",
            "quantity": 1.0,
            "rate": 1000.00,
            "amount": 1000.00
        }
    ]
    
    print(f"Client Name Length: {len(invalid_client_201['client_name'])} chars")
    
    response = send_request(invalid_client_201)
    
    if response and not response.get("success"):
        print("✅ Test 5 PASSED: Client name validation correctly rejected 201 chars")
        print(f"   Error message: {response.get('message', 'Unknown error')}")
    else:
        print("❌ Test 5 FAILED: Should have rejected 201-character client name")
    
    # Test 6: City exceeding 100 characters
    print("\n📋 Test 6: City name exceeding 100 characters")
    
    invalid_city_101 = valid_invoice_data.copy()
    invalid_city_101["invoice_number"] = f"INV-{int(time.time())}"
    invalid_city_101["company_city"] = "D" * 101  # 101 chars
    invalid_city_101["items"] = [
        {
            "description": "Standard service",
            "quantity": 1.0,
            "rate": 1000.00,
            "amount": 1000.00
        }
    ]
    
    print(f"City Length: {len(invalid_city_101['company_city'])} chars")
    
    response = send_request(invalid_city_101)
    
    if response and not response.get("success"):
        print("✅ Test 6 PASSED: City validation correctly rejected 101 chars")
        print(f"   Error message: {response.get('message', 'Unknown error')}")
    else:
        print("❌ Test 6 FAILED: Should have rejected 101-character city")
    
    # Test 7: Phone number exceeding 20 characters
    print("\n📋 Test 7: Phone number exceeding 20 characters")
    
    invalid_phone_21 = valid_invoice_data.copy()
    invalid_phone_21["invoice_number"] = f"INV-{int(time.time())}"
    invalid_phone_21["company_phone"] = "1" * 21  # 21 chars
    invalid_phone_21["items"] = [
        {
            "description": "Standard service",
            "quantity": 1.0,
            "rate": 1000.00,
            "amount": 1000.00
        }
    ]
    
    print(f"Phone Length: {len(invalid_phone_21['company_phone'])} chars")
    
    response = send_request(invalid_phone_21)
    
    if response and not response.get("success"):
        print("✅ Test 7 PASSED: Phone validation correctly rejected 21 chars")
        print(f"   Error message: {response.get('message', 'Unknown error')}")
    else:
        print("❌ Test 7 FAILED: Should have rejected 21-character phone")
    
    # Test 8: ZIP code exceeding 20 characters
    print("\n📋 Test 8: ZIP code exceeding 20 characters")
    
    invalid_zip_21 = valid_invoice_data.copy()
    invalid_zip_21["invoice_number"] = f"INV-{int(time.time())}"
    invalid_zip_21["company_zip_code"] = "1" * 21  # 21 chars
    invalid_zip_21["items"] = [
        {
            "description": "Standard service",
            "quantity": 1.0,
            "rate": 1000.00,
            "amount": 1000.00
        }
    ]
    
    print(f"ZIP Code Length: {len(invalid_zip_21['company_zip_code'])} chars")
    
    response = send_request(invalid_zip_21)
    
    if response and not response.get("success"):
        print("✅ Test 8 PASSED: ZIP code validation correctly rejected 21 chars")
        print(f"   Error message: {response.get('message', 'Unknown error')}")
    else:
        print("❌ Test 8 FAILED: Should have rejected 21-character ZIP code")
    
    # Test 9: Negative quantity
    print("\n📋 Test 9: Negative quantity validation")
    
    invalid_negative_qty = valid_invoice_data.copy()
    invalid_negative_qty["invoice_number"] = f"INV-{int(time.time())}"
    invalid_negative_qty["items"] = [
        {
            "description": "Standard service",
            "quantity": -1.0,  # Negative quantity
            "rate": 1000.00,
            "amount": -1000.00
        }
    ]
    invalid_negative_qty["subtotal"] = -1000.00
    invalid_negative_qty["total"] = -1000.00
    
    response = send_request(invalid_negative_qty)
    
    if response and not response.get("success"):
        print("✅ Test 9 PASSED: Negative quantity correctly rejected")
        print(f"   Error message: {response.get('message', 'Unknown error')}")
    else:
        print("❌ Test 9 FAILED: Should have rejected negative quantity")
    
    # Test 10: Excessive quantity
    print("\n📋 Test 10: Excessive quantity validation")
    
    invalid_big_qty = valid_invoice_data.copy()
    invalid_big_qty["invoice_number"] = f"INV-{int(time.time())}"
    invalid_big_qty["items"] = [
        {
            "description": "Standard service",
            "quantity": 1000000.0,  # Exceeds 999,999.99
            "rate": 1.00,
            "amount": 1000000.00
        }
    ]
    invalid_big_qty["subtotal"] = 1000000.00
    invalid_big_qty["total"] = 1000000.00
    
    response = send_request(invalid_big_qty)
    
    if response and not response.get("success"):
        print("✅ Test 10 PASSED: Excessive quantity correctly rejected")
        print(f"   Error message: {response.get('message', 'Unknown error')}")
    else:
        print("❌ Test 10 FAILED: Should have rejected excessive quantity")
    
    print("\n" + "="*50)
    print("🏁 Validation tests completed!")
    print("Check the backend logs for detailed error logging.")

def send_request(data):
    """Send request to the backend API"""
    try:
        url = f"{BASE_URL}/invoices/create-from-form/"
        headers = {
            'Content-Type': 'application/json',
        }
        
        print(f"   Sending request to: {url}")
        response = requests.post(url, json=data, headers=headers, timeout=30)
        
        print(f"   Response status: {response.status_code}")
        
        if response.status_code in [200, 201, 400, 500]:
            try:
                return response.json()
            except json.JSONDecodeError:
                print(f"   Invalid JSON response: {response.text[:200]}")
                return None
        else:
            print(f"   Unexpected status code: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"   Request failed: {str(e)}")
        return None

if __name__ == "__main__":
    test_invoice_creation_with_constraints()
