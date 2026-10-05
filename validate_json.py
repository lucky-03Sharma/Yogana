import json
try:
    with open(r"C:\Users\smile_3\Desktop\NLP_Project\backend\schemes.json") as f:
        data = json.load(f)
    print(f"Valid JSON with {len(data['schemes'])} schemes")
    for s in data['schemes']:
        print(f"  - {s['id']}: {s['name']}")
except Exception as e:
    print(f"Error: {e}")
