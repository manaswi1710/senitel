# backend/core/scanner.py
import requests
import re
from .intelligence import detect_typosquatting
from .rules import calculate_risk_score

class PackageScanner:
    def __init__(self, name, ecosystem):
        self.raw_input = name.strip()
        self.ecosystem = ecosystem.lower()
        self.name = self.sanitize_name(self.raw_input)

    def sanitize_name(self, name):
        """
        Cleans input: Extracts name from URLs, ignores flags, 
        and converts to lowercase.
        """
        if not name:
            return None
            
        # 1. Handle GitHub/HTTP URLs (Common user mistake in Single Package mode)
        if "github.com" in name or name.startswith("http"):
            # Extracts 'farmer-credits' from 'https://github.com/user/farmer-credits'
            parts = name.rstrip('/').split('/')
            name = parts[-1]

        # 2. Ignore CLI flags (Like -r or --upgrade)
        if name.startswith("-"):
            return None

        # 3. Final cleanup (lowercase and remove .git if present)
        name = name.lower().replace(".git", "")
        return name

    def fetch_metadata(self):
        if not self.name:
            return None
            
        url = f"https://pypi.org/pypi/{self.name}/json" if self.ecosystem == "pypi" else f"https://registry.npmjs.org/{self.name}"
        try:
            res = requests.get(url, timeout=5)
            return res.json() if res.status_code == 200 else None
        except:
            return None

    def analyze(self):
        # If the input was invalid or just a flag
        if not self.name:
            return {
                "package": self.raw_input,
                "risk": {
                    "level": "INFO",
                    "score": 0,
                    "color": "gray",
                    "status": "Invalid Input",
                    "reasons": ["The input provided is not a valid package name."]
                }
            }

        metadata = self.fetch_metadata()
        typo_target = detect_typosquatting(self.name, self.ecosystem)
        verdict = calculate_risk_score(metadata, typo_target)
        
        return {
            "package": self.name,
            "ecosystem": self.ecosystem,
            "risk": verdict
        }