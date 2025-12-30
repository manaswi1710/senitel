from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests
from .parser import extract_packages
from  core.scanner import PackageScanner

router = APIRouter()

class ReadmeRequest(BaseModel):
    github_url: str

class PackageRequest(BaseModel):
    name: str
    ecosystem: str = "npm"  # Default to npm if not specified

@router.post("/scan-readme")
def scan_readme(request: ReadmeRequest):
    # 1. Convert to Raw URL
    clean_path = request.github_url.replace("https://github.com/", "")
    raw_url = f"https://raw.githubusercontent.com/{clean_path}/main/README.md"
    
    # 2. Fetch Content
    response = requests.get(raw_url)
    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="README.md not found in main branch")
    
    text_content = response.text
    
    # 3. Extract Packages
    found_packages = extract_packages(text_content)
    
    # 4. RUN INTELLIGENCE SCAN
    results = []
    hallucination_count = 0
    suspicious_count = 0
    
    for pkg in found_packages:
        scanner = PackageScanner(pkg['name'], pkg['ecosystem'])
        
        # Analysis (checks for existence + typos)
        analysis = scanner.analyze()
        results.append(analysis)
        
        # Check risk level (CRITICAL or HIGH)
        risk_level = analysis['risk'].get('level', 'SAFE')
        
        if risk_level == "CRITICAL":
            hallucination_count += 1
        elif risk_level == "HIGH":
            suspicious_count += 1
            
    return {
        "url": request.github_url,
        "stats": {
            "hallucinations": hallucination_count,
            "suspicious": suspicious_count,
            "total_scanned": len(results)
        },
        "scan_results": results
    }

#2: SCAN A SINGLE PACKAGE
@router.post("/scan-package")
def scan_single_package(request: PackageRequest):
    """
    Scans just one package name (e.g., 'react') to see if it is safe.
    """
    scanner = PackageScanner(request.name, request.ecosystem)
    analysis = scanner.analyze()
    return analysis