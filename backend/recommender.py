import json
import os
import re
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

SCHEMES_FILE = os.path.join(os.path.dirname(__file__), "schemes.json")

DOMAIN_SYNONYMS = {
    "farmer": ["kisan", "krishi", "agriculture", "farming", "crop", "fasal", "cultivation", "irrigation", "khatauni", "tractor", "seed", "fertilizer", "soil", "mandi", "kcc", "livestock", "dairy", "pashupalan", "sinchayee", "plough", "harvest", "rythu"],
    "student": ["scholarship", "chhatravritti", "college", "fee", "education", "tuition", "school", "matric", "post matric", "degree", "btech", "study", "hostel", "books", "coaching", "exam", "university", "polytechnic", "diploma"],
    "women": ["mahila", "woman", "female", "girl", "beti", "sukanya", "ladli", "maternity", "pregnancy", "mother", "homemaker", "widow", "vidhwa", "shg", "lakhpati", "self help group", "women empowerment", "maternal", "infant"],
    "health": ["ayushman", "hospital", "treatment", "medical", "surgery", "medicine", "health insurance", "dawai", "generic", "jan aushadhi", "illness", "cashless", "doctor", "prescription", "arogya", "admit", "critical care"],
    "loan": ["mudra", "credit", "bank loan", "collateral free", "subsidy", "working capital", "startup", "enterprise", "pmsvanidhi", "business funding", "margin money", "seed fund", "interest rebate", "microfinance"],
    "pension": ["vridha", "senior citizen", "retirement", "old age", "atal pension", "apy", "monthly income", "60 years", "shram yogi", "security", "monthly pension", "elderly", "destitute", "nsap"],
    "housing": ["awas", "ghar", "home loan", "interest subsidy", "pmay", "pucca makan", "flat", "construction grant", "roof", "shelter", "residence", "urban poor", "kutcha"],
    "solar": ["surya ghar", "rooftop solar", "bijli", "electricity", "renewable", "solar panel", "power subsidy", "free electricity", "photovoltaic", "energy"],
    "artisan": ["vishwakarma", "karigar", "tailor", "carpenter", "mason", "potter", "blacksmith", "weaver", "handicraft", "toolkit", "artisan", "pehchan", "craftsperson", "sculptor", "cobbler"],
    "disabled": ["divyang", "divyangjan", "disability", "handicap", "wheelchair", "assistive aid", "udid card", "swavlamban", "differently abled", "blind", "deaf"],
    "street_vendor": ["svanidhi", "hawker", "thela", "vendor", "fruit seller", "vegetable vendor", "small shop", "daily wage", "street worker"],
    "bpl": ["ration card", "below poverty line", "poor", "antodaya", "secc", "free ration", "subsidy", "poverty"],
}

INDIAN_STATES = [
    "andhra pradesh", "arunachal pradesh", "assam", "bihar",
    "chandigarh", "chhattisgarh", "dadra and nagar haveli",
    "daman and diu", "delhi", "goa", "gujarat", "haryana",
    "himachal pradesh", "jammu and kashmir", "jharkhand",
    "karnataka", "kerala", "ladakh", "lakshadweep",
    "madhya pradesh", "maharashtra", "manipur", "meghalaya",
    "mizoram", "nagaland", "odisha", "puducherry",
    "punjab", "rajasthan", "sikkim", "tamil nadu",
    "telangana", "tripura", "uttarakhand", "uttar pradesh",
    "west bengal"
]

DEMO_PROFILES = [
    {
        "name": "Small Farmer",
        "avatar": "🧑‍🌾",
        "age": 35,
        "income": 120000,
        "gender": "male",
        "caste": "obc",
        "location_type": "rural",
        "state": "maharashtra",
        "employment_status": "farmer",
        "education": "school",
        "has_land": True,
        "bpl_card": False,
        "pregnant": False,
        "disabled": False,
        "interests": "pm kisan crop insurance irrigation fertilizer subsidy kisan credit card",
        "description": "I cultivate 1.5 acres of land in rural Maharashtra and need financial input support, affordable crop insurance, and drip irrigation subsidy."
    },
    {
        "name": "Women Entrepreneur / SHG",
        "avatar": "👩‍💼",
        "age": 32,
        "income": 180000,
        "gender": "female",
        "caste": "general",
        "location_type": "rural",
        "state": "madhya pradesh",
        "employment_status": "entrepreneur",
        "education": "graduate",
        "has_land": False,
        "bpl_card": False,
        "pregnant": False,
        "disabled": False,
        "interests": "women business loan self help group lakhpati didi mahila samman mudra credit subsidy",
        "description": "I run a small food processing unit with a women's Self Help Group. Looking for collateral-free business loans and government grants."
    },
    {
        "name": "Unemployed Graduate / Student",
        "avatar": "🎓",
        "age": 22,
        "income": 0,
        "gender": "female",
        "caste": "sc",
        "location_type": "urban",
        "state": "delhi",
        "employment_status": "student",
        "education": "graduate",
        "has_land": False,
        "bpl_card": True,
        "pregnant": False,
        "disabled": False,
        "interests": "higher education scholarship tuition fee waiver skill training coding certification startup seed fund",
        "description": "I just completed my B.Sc and want financial scholarships for post-graduate studies and AI/digital skill training with job placement."
    },
    {
        "name": "Traditional Artisan / Craftsman",
        "avatar": "🛠️",
        "age": 42,
        "income": 140000,
        "gender": "male",
        "caste": "obc",
        "location_type": "rural",
        "state": "rajasthan",
        "employment_status": "artisan",
        "education": "school",
        "has_land": False,
        "bpl_card": True,
        "pregnant": False,
        "disabled": False,
        "interests": "vishwakarma carpenter toolkit grant 15000 loan 5 percent interest artisan card handicraft exhibition",
        "description": "I work as a traditional wood artisan and carpenter. I need official artisan certification, modern toolkits, and low-interest working capital."
    },
    {
        "name": "Senior Citizen",
        "avatar": "👴",
        "age": 68,
        "income": 90000,
        "gender": "male",
        "caste": "general",
        "location_type": "urban",
        "state": "west bengal",
        "employment_status": "retired",
        "education": "graduate",
        "has_land": False,
        "bpl_card": True,
        "pregnant": False,
        "disabled": False,
        "interests": "old age pension monthly cash assistance ayushman health card free medicines generic pharmacy senior welfare",
        "description": "I am a retired senior citizen with no fixed pension. I need free healthcare coverage, subsidized generic medicines, and monthly pension."
    },
    {
        "name": "Urban Street Vendor / Daily Wager",
        "avatar": "🏙️",
        "age": 29,
        "income": 110000,
        "gender": "male",
        "caste": "sc",
        "location_type": "urban",
        "state": "uttar pradesh",
        "employment_status": "daily_wage",
        "education": "school",
        "has_land": False,
        "bpl_card": True,
        "pregnant": False,
        "disabled": False,
        "interests": "street vendor loan svanidhi 10000 20000 cashback upi shram yogi pension accident insurance jan dhan",
        "description": "I run a vegetable cart in the city. Looking for small collateral-free working capital loan, QR cashback incentives, and accidental insurance."
    }
]


def load_schemes():
    with open(SCHEMES_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data["schemes"]


def _normalize_text(text):
    if not text:
        return ""
    text = str(text).lower().strip()
    text = re.sub(r"[^\w\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text


def _expand_query_synonyms(text):
    norm = _normalize_text(text)
    expanded_tokens = norm.split()
    for category, synonyms in DOMAIN_SYNONYMS.items():
        if category in norm:
            expanded_tokens.extend(synonyms[:4])
        for syn in synonyms:
            if syn in norm:
                expanded_tokens.append(category)
                expanded_tokens.extend(synonyms[:3])
                break
    return " ".join(dict.fromkeys(expanded_tokens))


def _build_corpus(scheme):
    parts = [
        scheme.get("name", ""),
        scheme.get("hindi_name", ""),
        scheme.get("description", ""),
        scheme.get("tags", ""),
        scheme.get("ministry", ""),
        scheme.get("category", ""),
        scheme.get("scheme_type", ""),
        scheme.get("portal_name", "")
    ]
    benefits = scheme.get("benefits", [])
    if benefits:
        parts.append(" ".join(benefits))
    audience = scheme.get("target_audience", [])
    if audience:
        parts.append(" ".join(audience))
    docs = scheme.get("documents_required", [])
    if docs:
        parts.append(" ".join(docs))
    return _expand_query_synonyms(" ".join(parts))


class SchemeRecommender:
    def __init__(self):
        self.schemes = load_schemes()
        self.corpora = [_build_corpus(s) for s in self.schemes]
        self.vectorizer = TfidfVectorizer(
            stop_words="english",
            ngram_range=(1, 3),
            max_features=6000,
            sublinear_tf=True,
        )
        self.tfidf_matrix = self.vectorizer.fit_transform(self.corpora)
        self._scheme_map = {s["id"]: s for s in self.schemes}

    def get_all_schemes(self):
        return self.schemes

    def get_scheme_by_id(self, scheme_id):
        return self._scheme_map.get(scheme_id)

    def get_categories(self):
        return sorted(set(s["category"] for s in self.schemes))

    def get_ministries(self):
        return sorted(set(s["ministry"] for s in self.schemes))

    def get_stats(self):
        cats = self.get_categories()
        cat_counts = {cat: len([s for s in self.schemes if s.get("category") == cat]) for cat in cats}
        return {
            "total_schemes": len(self.schemes),
            "categories": len(cats),
            "ministries": len(self.get_ministries()),
            "central_schemes": len([s for s in self.schemes if s.get("state") == "central"]),
            "state_schemes": len([s for s in self.schemes if s.get("state") not in ("central", "urban", "rural")]),
            "rural_schemes": len([s for s in self.schemes if s.get("state") == "rural" or s.get("eligibility", {}).get("location_type") == "rural"]),
            "category_breakdown": cat_counts
        }

    def _eligibility_score(self, scheme, profile):
        score = 0.0
        reasons = []
        cautions = []
        elig = scheme.get("eligibility", {})

        # 1. State / Geography Check
        scheme_state = scheme.get("state", "central").lower()
        profile_state = _normalize_text(profile.get("state", ""))
        profile_location = (profile.get("location_type") or "").lower()

        if scheme_state == "central":
            score += 1.0
            reasons.append("Nationwide Central Scheme: Open to all Indian states")
        elif profile_state and profile_state in scheme_state:
            score += 1.5
            reasons.append(f"State Matching: Dedicated state scheme for {profile_state.title()}")
        elif scheme_state in ("rural", "urban"):
            if profile_location == scheme_state:
                score += 1.0
                reasons.append(f"Location Match: Targets {profile_location.title()} residents")
            elif profile_location:
                score -= 0.5
                cautions.append(f"Primarily designed for {scheme_state} regions")
        elif profile_state:
            score -= 1.0
            cautions.append(f"Specific to {scheme_state.title()} (You selected {profile_state.title()})")

        # Location Type inside eligibility
        elig_loc = elig.get("location_type", "all")
        if elig_loc != "all" and profile_location:
            if elig_loc == profile_location:
                score += 0.5
                reasons.append(f"Location matched ({profile_location})")
            else:
                score -= 0.4

        # 2. Age Check
        age = profile.get("age")
        age_min = elig.get("age_min", 0)
        age_max = elig.get("age_max", 150)
        if age is not None:
            try:
                age_num = float(age)
                if age_min <= age_num <= age_max:
                    score += 1.0
                    reasons.append(f"Age Eligible: Your age ({int(age_num)}) is within {age_min}-{age_max} yrs")
                else:
                    score -= 1.2
                    cautions.append(f"Age Requirement: Scheme requires age between {age_min} and {age_max} yrs")
            except (ValueError, TypeError):
                pass

        # 3. Income Check
        income = profile.get("income")
        income_limit = elig.get("income_limit")
        if income is not None:
            try:
                inc_num = float(income)
                if income_limit is not None:
                    if inc_num <= income_limit:
                        score += 1.0
                        reasons.append(f"Income Eligible: ₹{int(inc_num):,} is within annual ceiling of ₹{int(income_limit):,}")
                    else:
                        score -= 0.9
                        cautions.append(f"Annual Income Exceeds Limit: Income ceiling is ₹{int(income_limit):,}")
                else:
                    score += 0.3
                    reasons.append("Universal Scheme: No income restriction")
            except (ValueError, TypeError):
                pass

        # 4. Caste / Social Category Check
        caste = (profile.get("caste") or "").lower()
        caste_list = [c.lower() for c in elig.get("caste_applicable", ["all"])]
        if caste and "all" not in caste_list:
            if caste in caste_list:
                score += 1.0
                reasons.append(f"Category Priority: Special allocation for {caste.upper()} beneficiaries")
            else:
                score -= 0.6
                cautions.append(f"Applicable specifically to {', '.join(caste_list).upper()}")
        else:
            score += 0.2

        # 5. Gender Check
        gender = (profile.get("gender") or "").lower()
        gender_list = [g.lower() for g in elig.get("gender_applicable", ["all"])]
        if gender and "all" not in gender_list:
            if gender in gender_list:
                score += 1.0
                reasons.append(f"Gender Exclusive: Dedicated scheme for {gender.capitalize()} beneficiaries")
            else:
                score -= 1.5
                cautions.append(f"Applicable exclusively to {', '.join(gender_list).capitalize()}")
        else:
            score += 0.2

        # 6. Occupation Alignment
        emp_status = (profile.get("employment_status") or "").lower()
        scheme_occs = [o.lower() for o in elig.get("occupations", [])]
        if emp_status:
            if "all" in scheme_occs or not scheme_occs:
                score += 0.3
            elif any(emp_status in occ or occ in emp_status for occ in scheme_occs):
                score += 1.2
                reasons.append(f"Occupation Fit: Tailored for {emp_status.replace('_', ' ').title()}")
            else:
                # Slight penalty if scheme is strict on occupation (e.g. only farmer/artisan)
                if len(scheme_occs) <= 3 and not any(k in emp_status for k in ["unemployed", "all"]):
                    score -= 0.3

        # 7. Vulnerability & Special Flags
        if elig.get("land_holding_required"):
            if profile.get("has_land") is True:
                score += 0.8
                reasons.append("Land Possession: Eligible under landholding farmer criteria")
            elif profile.get("has_land") is False and emp_status != "farmer":
                score -= 0.7
                cautions.append("Requires agricultural landholding documentation")

        if elig.get("bpl_required"):
            if profile.get("bpl_card") is True:
                score += 0.9
                reasons.append("BPL Priority: Eligible under Below Poverty Line quota")
            else:
                score -= 0.5
                cautions.append("Priority given to BPL / Ration card holders")

        if elig.get("pregnant_required"):
            if profile.get("pregnant") is True:
                score += 1.5
                reasons.append("Maternity Benefit: Applicable for pregnant / lactating women")
            else:
                score -= 1.5
                cautions.append("Maternity scheme applicable to pregnant women")

        if elig.get("disabled_required"):
            if profile.get("disabled") is True:
                score += 1.5
                reasons.append("Divyangjan Support: Special welfare for differently-abled persons")
            else:
                score -= 1.2
                cautions.append("Reserved for Persons with Disabilities (Divyangjan)")

        return score, reasons, cautions

    def _text_similarity(self, query_text):
        if not query_text:
            return np.zeros(len(self.schemes))
        
        expanded = _expand_query_synonyms(query_text)
        query_vec = self.vectorizer.transform([expanded])
        sims = cosine_similarity(query_vec, self.tfidf_matrix).flatten()

        query_terms = set(t for t in expanded.split() if len(t) > 2)
        keyword_scores = []
        for corpus in self.corpora:
            corpus_terms = set(t for t in corpus.lower().split() if len(t) > 2)
            if query_terms and corpus_terms:
                overlap = len(query_terms & corpus_terms)
                keyword_scores.append(overlap / (len(query_terms) + 1e-5))
            else:
                keyword_scores.append(0.0)
        keyword_scores = np.array(keyword_scores, dtype=float)

        combined = 0.65 * sims + 0.35 * keyword_scores
        return combined

    def recommend(self, profile, top_k=10, category=None, min_score=0.0):
        user_text_parts = [
            profile.get("interests", ""),
            profile.get("description", ""),
            profile.get("employment_status", "").replace("_", " "),
            profile.get("education", ""),
            profile.get("state", ""),
            profile.get("location_type", ""),
            profile.get("caste", ""),
            profile.get("gender", ""),
        ]
        if profile.get("has_land"):
            user_text_parts.append("land agricultural farming kisan")
        if profile.get("bpl_card"):
            user_text_parts.append("bpl ration card low income subsidy")
        if profile.get("pregnant"):
            user_text_parts.append("maternity pregnant child mother")
        if profile.get("disabled"):
            user_text_parts.append("divyang disability handicap udid")

        user_text = _normalize_text(" ".join(user_text_parts))
        text_sims = self._text_similarity(user_text)

        results = []
        for idx, scheme in enumerate(self.schemes):
            if category and scheme.get("category") != category:
                continue

            elig_score, reasons, cautions = self._eligibility_score(scheme, profile)
            text_score = float(text_sims[idx])

            # Normalize eligibility score to approx 0-1 scale
            normalized_elig = max(0.0, min(1.0, (elig_score + 1.0) / 4.5))
            normalized_text = max(0.0, min(1.0, text_score * 1.5))

            # Composite match formula
            combined_raw = (normalized_elig * 0.55) + (normalized_text * 0.45)
            
            # Confidence match percentage (30% to 99%)
            match_percentage = int(min(99, max(35, combined_raw * 100)))

            # If heavily disqualified on gender or state, penalize
            if elig_score < -1.0:
                match_percentage = max(20, match_percentage - 40)
                if match_percentage < 30 and not profile.get("interests"):
                    continue

            scheme_copy = dict(scheme)
            results.append({
                "scheme": scheme_copy,
                "match_score": round(combined_raw * 4.0, 2),
                "match_percentage": match_percentage,
                "eligibility_score": round(elig_score, 2),
                "text_similarity": round(text_score, 4),
                "eligibility_reasons": reasons,
                "eligibility_cautions": cautions,
                "documents_needed": scheme.get("documents_required", [])[:4],
            })

        results.sort(key=lambda x: (x["match_percentage"], x["match_score"]), reverse=True)
        return results[:top_k]

    def chat_recommend(self, user_message, chat_history=None):
        """Conversational AI scheme discovery parsing intent and returning advice + schemes."""
        msg_norm = _normalize_text(user_message)
        
        # Extract demographic clues
        extracted_profile = {
            "interests": user_message,
            "description": user_message,
        }

        # Age extraction
        age_match = re.search(r"\b(\d{1,2})\s*(?:years?|yrs?|yr|sal|saal|age)?\b", msg_norm)
        if age_match:
            try:
                age_val = int(age_match.group(1))
                if 1 <= age_val <= 100:
                    extracted_profile["age"] = age_val
            except Exception:
                pass

        # Gender extraction
        if any(w in msg_norm for w in ["female", "woman", "women", "girl", "mother", "mahila", "ladki", "she", "her", "sister", "wife"]):
            extracted_profile["gender"] = "female"
        elif any(w in msg_norm for w in ["male", "man", "boy", "he", "his", "brother", "purush"]):
            extracted_profile["gender"] = "male"

        # State extraction
        for st in INDIAN_STATES:
            if st in msg_norm:
                extracted_profile["state"] = st
                break

        # Location extraction
        if any(w in msg_norm for w in ["village", "rural", "gaon", "gram", "kisan"]):
            extracted_profile["location_type"] = "rural"
        elif any(w in msg_norm for w in ["city", "urban", "town", "metro", "nagar"]):
            extracted_profile["location_type"] = "urban"

        # Occupation / Persona extraction
        if any(w in msg_norm for w in ["farmer", "kisan", "agriculture", "crop", "farming", "krishi", "land"]):
            extracted_profile["employment_status"] = "farmer"
            extracted_profile["has_land"] = True
        elif any(w in msg_norm for w in ["student", "college", "study", "scholarship", "degree", "school", "exam"]):
            extracted_profile["employment_status"] = "student"
        elif any(w in msg_norm for w in ["startup", "business", "entrepreneur", "shop", "dukan", "msme", "company"]):
            extracted_profile["employment_status"] = "entrepreneur"
        elif any(w in msg_norm for w in ["artisan", "carpenter", "tailor", "mason", "potter", "karigar", "vishwakarma", "weaver"]):
            extracted_profile["employment_status"] = "artisan"
        elif any(w in msg_norm for w in ["senior", "retired", "old age", "pension", "60", "70", "grandfather", "grandmother"]):
            extracted_profile["employment_status"] = "retired"
            if "age" not in extracted_profile:
                extracted_profile["age"] = 65
        elif any(w in msg_norm for w in ["vendor", "hawker", "thela", "street", "daily wage", "mazdoor", "labor", "labour"]):
            extracted_profile["employment_status"] = "daily_wage"

        # Special conditions
        if any(w in msg_norm for w in ["pregnant", "pregnancy", "baby", "maternity", "delivery", "expecting"]):
            extracted_profile["pregnant"] = True
            extracted_profile["gender"] = "female"
        if any(w in msg_norm for w in ["bpl", "ration card", "poor", "low income", "garib"]):
            extracted_profile["bpl_card"] = True
        if any(w in msg_norm for w in ["solar", "rooftop", "electricity", "bijli"]):
            extracted_profile["interests"] = extracted_profile["interests"] + " solar rooftop subsidy"
        if any(w in msg_norm for w in ["disabled", "handicap", "divyang", "blind", "udid"]):
            extracted_profile["disabled"] = True

        recs = self.recommend(extracted_profile, top_k=4)

        # Generate intelligent assistant conversational response
        greetings = "Namaste! Based on your query, I have analyzed central and state government schemes that best match your profile."
        if recs:
            top_scheme = recs[0]["scheme"]
            top_score = recs[0]["match_percentage"]
            summary = f"Your highest matching scheme is **{top_scheme['name']}** ({top_score}% match), which provides {', '.join(top_scheme.get('benefits', [])[:2])}."
        else:
            summary = "I have scanned our database of government schemes to find the most relevant opportunities."

        tips = []
        if extracted_profile.get("employment_status") == "farmer":
            tips.append("Make sure your Aadhaar is linked to your bank account and land record (Khatauni) for DBT subsidies.")
        elif extracted_profile.get("employment_status") == "student":
            tips.append("Keep your Bonafide Student Certificate and Income Certificate ready for National Scholarship Portal (NSP) verification.")
        elif extracted_profile.get("employment_status") == "entrepreneur":
            tips.append("You can apply directly on the JanSamarth or Startup India portal for collateral-free credit.")
        else:
            tips.append("You can directly apply online via the official portal links provided below.")

        return {
            "reply": f"{greetings}\n\n{summary}\n\nHere are the top tailored recommendations with official portal links:",
            "schemes": recs,
            "extracted_profile": extracted_profile,
            "tips": tips
        }

    def compare_schemes(self, scheme_ids):
        selected = []
        for sid in scheme_ids:
            s = self.get_scheme_by_id(sid)
            if s:
                selected.append(s)
        return {
            "schemes": selected,
            "count": len(selected)
        }

    def get_demo_profiles(self):
        return DEMO_PROFILES


_recommender = None


def get_recommender():
    global _recommender
    if _recommender is None:
        _recommender = SchemeRecommender()
    return _recommender
