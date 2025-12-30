# backend/core/rules.py

def calculate_risk_score(metadata, typo_target):
    # If package truly doesn't exist in registry
    if metadata is None:
        return {
            "level": "CRITICAL",
            "score": 100,
            "color": "red",
            "status": "AI Hallucination",
            "reasons": ["Package not found. This name is available for hackers to register malware."]
        }

    if typo_target:
        return {
            "level": "HIGH",
            "score": 85,
            "color": "red",
            "status": "Typosquatting Risk",
            "reasons": [f"Suspiciously similar to '{typo_target}'."]
        }

    return {
        "level": "SAFE",
        "score": 0,
        "color": "green",
        "status": "Verified",
        "reasons": ["Package is verified on the registry."]
    }



# # backend/core/rules.py

# def calculate_risk_score(metadata, typo_target):
#     """
#     Assigns a color and score based on findings.
#     """
#     # 1. HALLUCINATION CHECK
#     if metadata is None:
#         return {
#             "level": "CRITICAL",
#             "score": 100,
#             "color": "red",
#             "status": "AI Hallucination",
#             "reasons": ["Package does not exist in the official registry."]
#         }

#     # 2. TYPOSQUATTING CHECK
#     if typo_target:
#         return {
#             "level": "HIGH",
#             "score": 85,
#             "color": "red",
#             "status": "Typosquatting Risk",
#             "reasons": [f"This package mimics the popular library '{typo_target}'."]
#         }

#     # 3. VERIFIED/SAFE
#     return {
#         "level": "SAFE",
#         "score": 0,
#         "color": "green",
#         "status": "Verified",
#         "reasons": ["Package exists and is not a known typo."]
#     }