import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from recommender import get_recommender

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

rec = get_recommender()


@app.route("/api/schemes", methods=["GET"])
def get_schemes():
    schemes = rec.get_all_schemes()
    category = request.args.get("category")
    ministry = request.args.get("ministry")
    state = request.args.get("state")
    gender = request.args.get("gender")
    caste = request.args.get("caste")
    query = request.args.get("q")
    sort_by = request.args.get("sort_by", "name")

    if category and category != "all":
        schemes = [s for s in schemes if s.get("category") == category]
    if ministry and ministry != "all":
        schemes = [s for s in schemes if s.get("ministry") == ministry]
    if state and state != "all":
        schemes = [
            s for s in schemes
            if s.get("state") == "central" or s.get("state") == state
        ]
    if gender and gender != "all":
        schemes = [
            s for s in schemes
            if "all" in s.get("eligibility", {}).get("gender_applicable", ["all"])
            or gender in s.get("eligibility", {}).get("gender_applicable", [])
        ]
    if caste and caste != "all":
        schemes = [
            s for s in schemes
            if "all" in s.get("eligibility", {}).get("caste_applicable", ["all"])
            or caste in s.get("eligibility", {}).get("caste_applicable", [])
        ]
    if query:
        ql = query.lower()
        schemes = [
            s for s in schemes
            if ql in s.get("name", "").lower()
            or ql in s.get("hindi_name", "").lower()
            or ql in s.get("tags", "").lower()
            or ql in s.get("description", "").lower()
            or ql in s.get("category", "").lower()
            or any(ql in b.lower() for b in s.get("benefits", []))
        ]

    if sort_by == "name":
        schemes = sorted(schemes, key=lambda s: s.get("name", ""))
    elif sort_by == "category":
        schemes = sorted(schemes, key=lambda s: s.get("category", ""))

    return jsonify({"schemes": schemes, "count": len(schemes)})


@app.route("/api/schemes/<scheme_id>", methods=["GET"])
def get_scheme(scheme_id):
    scheme = rec.get_scheme_by_id(scheme_id)
    if scheme:
        return jsonify(scheme)
    return jsonify({"error": "Scheme not found"}), 404


@app.route("/api/categories", methods=["GET"])
def get_categories():
    return jsonify({"categories": rec.get_categories()})


@app.route("/api/ministries", methods=["GET"])
def get_ministries():
    return jsonify({"ministries": rec.get_ministries()})


@app.route("/api/stats", methods=["GET"])
def get_stats():
    return jsonify(rec.get_stats())


@app.route("/api/recommend", methods=["POST"])
def recommend():
    profile = request.get_json(silent=True) or {}

    top_k = request.args.get("top_k", default=12, type=int)
    category = request.args.get("category")
    min_score = request.args.get("min_score", default=0.0, type=float)

    results = rec.recommend(profile, top_k=top_k, category=category, min_score=min_score)
    return jsonify({
        "schemes": results,
        "count": len(results),
        "profile_summary": {
            "age": profile.get("age"),
            "income": profile.get("income"),
            "gender": profile.get("gender"),
            "caste": profile.get("caste"),
            "location_type": profile.get("location_type"),
            "state": profile.get("state"),
            "employment_status": profile.get("employment_status"),
            "education": profile.get("education"),
            "has_land": profile.get("has_land"),
            "bpl_card": profile.get("bpl_card"),
            "pregnant": profile.get("pregnant"),
            "disabled": profile.get("disabled")
        }
    })


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    message = data.get("message", "").strip()
    if not message:
        return jsonify({"error": "Message is required"}), 400

    chat_history = data.get("history", [])
    response = rec.chat_recommend(message, chat_history=chat_history)
    return jsonify(response)


@app.route("/api/compare", methods=["POST"])
def compare():
    data = request.get_json(silent=True) or {}
    scheme_ids = data.get("scheme_ids", [])
    if not scheme_ids:
        return jsonify({"error": "Please provide scheme_ids list"}), 400

    result = rec.compare_schemes(scheme_ids)
    return jsonify(result)


@app.route("/api/recommend/demo", methods=["GET"])
def recommend_demo():
    profiles = rec.get_demo_profiles()
    profile_name = request.args.get("profile", profiles[0]["name"])
    selected = None
    for p in profiles:
        if p["name"].lower() == profile_name.lower():
            selected = p
            break
    if selected is None:
        selected = profiles[0]

    results = rec.recommend(selected, top_k=10)
    return jsonify({
        "profile": selected,
        "schemes": results,
        "count": len(results)
    })


@app.route("/api/demo-profiles", methods=["GET"])
def get_demo_profiles():
    return jsonify({"profiles": rec.get_demo_profiles()})


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "schemes_loaded": len(rec.get_all_schemes()),
        "categories": rec.get_categories(),
        "ministries": len(rec.get_ministries())
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
