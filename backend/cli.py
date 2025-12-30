import typer
import requests
from rich import print
from rich.table import Table

from core.scanner import PackageScanner
from api.parser import extract_packages    

app = typer.Typer(help="🛡️ Code Guardian – Package Security Scanner")     
                                                                       
# ---------------------------                                          
# SCAN SINGLE PACKAGE
# ---------------------------
@app.command("scan-package")
def scan_package(
    name: str,
    ecosystem: str = typer.Option("npm", help="Package ecosystem (npm / pypi)")
):
    """
    Scan a single package for security risks
    """
    print(f"\n🔍 [bold cyan]Scanning[/bold cyan] {name} ({ecosystem})\n")

    scanner = PackageScanner(name, ecosystem)
    result = scanner.analyze()
    risk = result["risk"]

    table = Table(title="Scan Result")
    table.add_column("Field", style="bold")
    table.add_column("Value")

    table.add_row("Package", result.get("package", "—"))
    table.add_row("Ecosystem", ecosystem)
    table.add_row("Risk Level", f"[bold]{risk['level']}[/bold]")
    table.add_row("Score", str(risk["score"]))
    table.add_row("Status", risk["status"])

    print(table)

    if risk.get("reasons"):
        print("\n📌 [bold]Reasons:[/bold]")
        for r in risk["reasons"]:
            print(f" • {r}")

    print("\n✅ Scan complete\n")


# ---------------------------
# SCAN GITHUB README
# ---------------------------
@app.command("scan-readme")
def scan_readme(github_url: str):
    """
    Scan a GitHub README.md for hallucinated or malicious packages
    """
    print(f"\n📄 Fetching README from [blue]{github_url}[/blue]\n")

    clean_path = github_url.replace("https://github.com/", "")
    raw_url = f"https://raw.githubusercontent.com/{clean_path}/main/README.md"

    response = requests.get(raw_url)
    if response.status_code != 200:
        print("❌ [red]README.md not found in main branch[/red]")
        raise typer.Exit(code=1)

    packages = extract_packages(response.text)
    print(f"🔍 Found [bold]{len(packages)}[/bold] packages\n")

    table = Table(title="Dependency Scan")
    table.add_column("Package")
    table.add_column("Ecosystem")
    table.add_column("Risk Level")

    hallucinations = suspicious = 0

    for pkg in packages:
        scanner = PackageScanner(pkg["name"], pkg["ecosystem"])
        analysis = scanner.analyze()
        level = analysis["risk"]["level"]

        table.add_row(pkg["name"], pkg["ecosystem"], level)

        if level == "CRITICAL":
            hallucinations += 1
        elif level == "HIGH":
            suspicious += 1

    print(table)

    print("\n📊 [bold]Summary[/bold]")
    print(f"🚨 Hallucinations : {hallucinations}")
    print(f"⚠️  Suspicious     : {suspicious}")
    print(f"📦 Total Scanned  : {len(packages)}\n")


if __name__ == "__main__":
    app()