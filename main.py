#!/usr/bin/env python3
"""
stu-ai Diagnostics Utility
Performs environmental and configuration checks to ensure readiness for development.
This script does not launch or wrap application servers or runtime builds.
"""

import os
import subprocess
import sys
import urllib.request

try:
    from dotenv import load_dotenv

    HAS_DOTENV = True
except ImportError:
    HAS_DOTENV = False

try:
    import google.generativeai as genai

    HAS_GENAI = True
except ImportError:
    HAS_GENAI = False

try:
    import openai

    HAS_OPENAI = True
except ImportError:
    HAS_OPENAI = False


def check_internet():
    """Verify internet connectivity by pinging google.com."""
    print("Checking Internet Connectivity...")
    try:
        urllib.request.urlopen("https://www.google.com", timeout=3)
        print("  [OK] Internet connection is available.")
        return True
    except Exception as e:
        print(f"  [FAIL] Internet connection test failed: {e}")
        return False


def check_python():
    """Log details about Python configuration and virtual environment status."""
    print("Checking Python Environment...")
    print(f"  [OK] Python version: {sys.version.split()[0]}")
    print(f"  [OK] Python executable: {sys.executable}")
    is_venv = sys.prefix != sys.base_prefix
    if is_venv:
        print("  [OK] Running inside a virtual environment (.venv)")
    else:
        print(
            "  [WARN] Running outside virtual environment. "
            "It is recommended to use .venv"
        )
    return True


def check_node():
    """Verify Node.js and npm versions are available in the PATH."""
    print("Checking Node.js & npm Environment...")
    node_ok = False
    npm_ok = False

    try:
        node_ver = subprocess.run(
            ["node", "--version"], capture_output=True, text=True, check=True
        )
        print(f"  [OK] Node.js: {node_ver.stdout.strip()}")
        node_ok = True
    except Exception:
        print("  [FAIL] Node.js: Not found in PATH.")

    try:
        npm_ver = subprocess.run(
            ["npm", "--version"], capture_output=True, text=True, check=True
        )
        print(f"  [OK] npm: {npm_ver.stdout.strip()}")
        npm_ok = True
    except Exception:
        print("  [FAIL] npm: Not found in PATH.")

    return node_ok and npm_ok


def check_env_files():
    """Verify presence of local environment files and load them."""
    print("Checking Environment Config Files...")
    found = []
    for file in [".env.local", ".env"]:
        if os.path.exists(file):
            found.append(file)

    if found:
        print(f"  [OK] Found environment files: {', '.join(found)}")
        if HAS_DOTENV:
            for file in found:
                load_dotenv(file)
            print("  [OK] Loaded environment configurations.")
        else:
            print(
                "  [WARN] python-dotenv is not installed. " "Unable to parse variables."
            )
        return True
    else:
        print(
            "  [FAIL] No .env or .env.local file found. "
            "Please copy .env.example to .env"
        )
        return False


def check_api_keys():
    """Check required API keys and attempt connection verification if possible."""
    print("Checking AI Provider Configurations...")
    default_provider = os.getenv("DEFAULT_AI_PROVIDER", "gemini")
    print(f"  [INFO] Default configured provider: {default_provider}")

    gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")
    anthropic_key = os.getenv("ANTHROPIC_API_KEY")

    if not gemini_key and not openai_key and not anthropic_key:
        print("  [FAIL] No API keys defined for Gemini, OpenAI, or Anthropic.")
        return False

    # Gemini Check
    if gemini_key:
        print(f"  [OK] Gemini key configured (length: {len(gemini_key)})")
        if HAS_GENAI:
            print("  Testing Gemini API connectivity...")
            try:
                genai.configure(api_key=gemini_key)
                model = genai.GenerativeModel("gemini-1.5-flash")
                response = model.generate_content("Ping")
                if response.text:
                    print("  [OK] Gemini API handshake: SUCCESS")
                else:
                    print("  [FAIL] Gemini API handshake: Empty response.")
            except Exception as e:
                print(f"  [FAIL] Gemini API handshake failed: {e}")
        else:
            print("  [WARN] google-generativeai not installed. Skipping live check.")
    else:
        print("  [INFO] Gemini key not configured.")

    # OpenAI Check
    if openai_key:
        print(f"  [OK] OpenAI key configured (length: {len(openai_key)})")
        if HAS_OPENAI:
            print("  Testing OpenAI API connectivity...")
            try:
                client = openai.OpenAI(api_key=openai_key)
                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[{"role": "user", "content": "Ping"}],
                    max_tokens=5,
                )
                if response.choices[0].message.content:
                    print("  [OK] OpenAI API handshake: SUCCESS")
                else:
                    print("  [FAIL] OpenAI API handshake: Empty response.")
            except Exception as e:
                print(f"  [FAIL] OpenAI API handshake failed: {e}")
        else:
            print("  [WARN] openai python package not installed. Skipping live check.")
    else:
        print("  [INFO] OpenAI key not configured.")

    # Anthropic Check
    if anthropic_key:
        print(f"  [OK] Anthropic key configured (length: {len(anthropic_key)})")
        print(
            "  [INFO] Skipping Anthropic live check "
            "(SDK not installed in Python venv)."
        )
    else:
        print("  [INFO] Anthropic key not configured.")

    return True


def run_diagnostics():
    """Run all diagnostic checks."""
    print("=" * 60)
    print("                 stu-ai ENVIRONMENT DIAGNOSTICS")
    print("=" * 60)

    internet = check_internet()
    print("-" * 60)
    python_ok = check_python()
    print("-" * 60)
    node_ok = check_node()
    print("-" * 60)
    env_ok = check_env_files()
    print("-" * 60)
    api_ok = check_api_keys()
    print("-" * 60)

    success = python_ok and node_ok and env_ok and api_ok and internet
    if success:
        print("DIAGNOSTICS SUCCESS: Environment is complete and ready for development!")
    else:
        print("DIAGNOSTICS WARNING: Some checks failed. Review output log above.")

    return success


if __name__ == "__main__":
    run_diagnostics()
