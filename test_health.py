import json
import urllib.request

try:
    with urllib.request.urlopen("http://127.0.0.1:5000/api/health", timeout=5) as r:
        print(f"Status: {r.status}")
        print(json.dumps(json.loads(r.read()), indent=2))
except Exception as e:
    print(f"Error: {e}")
