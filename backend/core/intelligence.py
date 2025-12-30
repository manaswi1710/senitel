# backend/core/intelligence.py
from rapidfuzz import fuzz
from .constants import TOP_PACKAGES

def detect_typosquatting(package_name, ecosystem):
    """
    Returns the name of the package being mimicked if a typo is detected.
    """
    known_packages = TOP_PACKAGES.get(ecosystem.lower(), [])
    input_name = package_name.lower().strip()

    for top_pkg in known_packages:
        if input_name == top_pkg:
            return None # Exact match with a top package is safe

        # Calculate similarity (0 to 100)
        similarity = fuzz.ratio(input_name, top_pkg)

        # 85% similarity is the 'danger zone' for typos
        if similarity >= 85:
            return top_pkg
            
    return None