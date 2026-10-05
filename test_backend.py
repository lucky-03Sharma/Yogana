import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

from recommender import get_recommender

def run_tests():
    print("=== Testing SchemeSeva Backend & NLP Recommender ===")
    rec = get_recommender()
    schemes = rec.get_all_schemes()
    print(f"[PASS] Loaded {len(schemes)} government schemes")
    assert len(schemes) >= 30, "Expected at least 30 schemes"

    # Test Categories & Stats
    stats = rec.get_stats()
    print(f"[PASS] Total schemes: {stats['total_schemes']}, Categories: {stats['categories']}, Ministries: {stats['ministries']}")

    # 1. Test Small Farmer Recommendation
    farmer_prof = {
        "age": 35, "income": 120000, "gender": "male", "caste": "obc",
        "location_type": "rural", "state": "maharashtra", "employment_status": "farmer",
        "has_land": True, "interests": "crop insurance fertilizer subsidy pm kisan"
    }
    farmer_recs = rec.recommend(farmer_prof, top_k=5)
    print("\n--- Farmer Recommendations ---")
    for r in farmer_recs[:3]:
        print(f"  - {r['scheme']['name']} | {r['match_percentage']}% Match | Cat: {r['scheme']['category']}")
    assert any(s['scheme']['id'] in ['pmkisan', 'pmfby', 'pmksy', 'kisan_credit_card'] for s in farmer_recs)

    # 2. Test Student Scholarship Recommendation
    student_prof = {
        "age": 21, "income": 50000, "gender": "female", "caste": "sc",
        "location_type": "urban", "state": "delhi", "employment_status": "student",
        "interests": "college scholarship tuition fees grant"
    }
    student_recs = rec.recommend(student_prof, top_k=5)
    print("\n--- Student Recommendations ---")
    for r in student_recs[:3]:
        print(f"  - {r['scheme']['name']} | {r['match_percentage']}% Match | Cat: {r['scheme']['category']}")
    assert any(s['scheme']['id'] in ['nsp_scholarships', 'pmkvy', 'delhi_ladli', 'maharashtra_mahadbt', 'kanyashree_wb'] for s in student_recs)

    # 3. Test PM Vishwakarma Artisan Recommendation
    artisan_prof = {
        "age": 42, "income": 100000, "gender": "male", "caste": "obc",
        "location_type": "rural", "employment_status": "artisan",
        "interests": "carpenter wood artisan toolkit grant 15000 loan"
    }
    artisan_recs = rec.recommend(artisan_prof, top_k=5)
    print("\n--- Artisan Recommendations ---")
    for r in artisan_recs[:3]:
        print(f"  - {r['scheme']['name']} | {r['match_percentage']}% Match")
    assert any(s['scheme']['id'] == 'pmvishwakarma' for s in artisan_recs)

    # 4. Test Conversational AI Chat Recommendation
    chat_res = rec.chat_recommend("I am 29 years old street vendor running a fruit cart in Delhi needing working capital loan")
    print("\n--- Conversational AI Chat Test ---")
    print(f"Bot summary response: {chat_res['reply'][:120]}...")
    print(f"Top matched scheme from chat: {chat_res['schemes'][0]['scheme']['name']}")
    assert any(s['scheme']['id'] == 'pmsvanidhi' for s in chat_res['schemes'])

    # 5. Test Scheme Comparison
    comp_res = rec.compare_schemes(['pmkisan', 'pmjay', 'pmmudra'])
    print(f"\n[PASS] Comparison matrix loaded {comp_res['count']} schemes")
    assert comp_res['count'] == 3

    print("\n>>> ALL BACKEND NLP & RECOMMENDER TESTS PASSED SUCCESSFULLY! <<<")

if __name__ == "__main__":
    run_tests()
