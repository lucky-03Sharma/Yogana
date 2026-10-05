import json
import urllib.request

BASE = "http://127.0.0.1:5000"

def post(path, data):
    body = json.dumps(data).encode()
    req = urllib.request.Request(
        BASE + path, data=body,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

# Test farmer recommendation
print("=== Small Farmer Recommendation ===")
result = post("/api/recommend", {
    "age": 35, "income": 150000, "gender": "male",
    "caste": "general", "location_type": "rural",
    "state": "maharashtra", "employment_status": "farmer",
    "interests": "farming irrigation agriculture crop insurance",
    "description": "I am a small farmer looking for income support and irrigation aid"
})
print(f"Found {result['count']} schemes\n")
for s in result["schemes"][:5]:
    print(f"  {s['scheme']['name']}")
    print(f"    Category: {s['scheme']['category']} | Score: {s['match_score']} | Elig: {s['eligibility_score']} | Text: {s['text_similarity']}")
    print(f"    Details: {', '.join(s['eligibility_details'][:2])}")
    print()

# Test unemployed graduate
print("=== Unemployed Graduate Recommendation ===")
result2 = post("/api/recommend", {
    "age": 24, "income": 0, "gender": "male",
    "caste": "sc", "location_type": "urban",
    "state": "karnataka", "employment_status": "unemployed",
    "interests": "skill training job placement certification digital",
    "description": "I just graduated and am looking for jobs"
})
print(f"Found {result2['count']} schemes\n")
for s in result2["schemes"][:5]:
    print(f"  {s['scheme']['name']}")
    print(f"    Category: {s['scheme']['category']} | Score: {s['match_score']}")
    print()

# Test senior citizen
print("=== Senior Citizen Recommendation ===")
result3 = post("/api/recommend", {
    "age": 65, "income": 120000, "gender": "male",
    "caste": "general", "location_type": "urban",
    "state": "west bengal", "employment_status": "retired",
    "interests": "pension health insurance senior citizen",
    "description": "Retired person looking for pension and health coverage"
})
print(f"Found {result3['count']} schemes\n")
for s in result3["schemes"][:5]:
    print(f"  {s['scheme']['name']}")
    print(f"    Category: {s['scheme']['category']} | Score: {s['match_score']}")
    print()
