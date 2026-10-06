import urllib.request
import json
import time

def test_e2e():
    print("[E2E TEST] Running End-to-End Integration Tests for Satpura Jaivik Platform...\n")
    
    time.sleep(3)
    
    # 1. Test Backend REST API Endpoints
    backend_endpoints = [
        ("Projects Endpoint", "http://localhost:8000/api/projects/"),
        ("Expenses Endpoint", "http://localhost:8000/api/expenses/"),
        ("Users Endpoint", "http://localhost:8000/api/users/"),
        ("Work Logs Endpoint", "http://localhost:8000/api/work-logs/"),
        ("Audit Logs Endpoint", "http://localhost:8000/api/audit/"),
    ]

    print("=== 1. Testing Django REST API Backend (Port 8000) ===")
    for name, url in backend_endpoints:
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "E2ETest"})
            with urllib.request.urlopen(req, timeout=10) as response:
                status = response.getcode()
                data = json.loads(response.read().decode())
                print(f"  [SUCCESS] {name}: HTTP {status} -- Returned {len(data)} items")
        except Exception as e:
            print(f"  [FAILED] {name}: ({e})")

    # 2. Test Frontend Next.js Pages
    frontend_pages = [
        ("Landing Page", "http://localhost:3000/"),
        ("PWA Dashboard Portal", "http://localhost:3000/dashboard"),
    ]

    print("\n=== 2. Testing Next.js Frontend PWA Pages (Port 3000) ===")
    for name, url in frontend_pages:
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "E2ETest"})
            with urllib.request.urlopen(req, timeout=15) as response:
                status = response.getcode()
                print(f"  [SUCCESS] {name}: HTTP {status} -- Server active and rendering HTML")
        except Exception as e:
            print(f"  [FAILED] {name}: ({e})")

    print("\n[E2E TEST] End-to-End Verification Completed!")

if __name__ == "__main__":
    test_e2e()
