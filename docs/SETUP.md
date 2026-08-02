# Workspace Setup Guide

This guide is designed to help a new developer set up the project on a clean development machine.

---

## Prerequisites

Before starting, ensure you have the following installed:

1. **Node.js** (v18.x or newer recommended)
2. **npm** (v9.x or newer)
3. **Python 3** (v3.10 or newer)

---

## Step-by-Step Installation

### 1. Clone the Repository
If you haven't already, clone the project and navigate into the folder:
```bash
git clone https://github.com/Rhytam23/stu-ai.git
```

### 2. Configure Environment Variables
Copy the env template file and create a `.env` file in the root:
```bash
cp .env.example .env
```
Open `.env` in your editor and enter your provider API keys (at least one key is required):
```env
DEFAULT_AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### 3. Initialize the Python Virtual Environment
To build the Python diagnostics environment and configure linting/formatting hooks, run the setup script matching your OS:

* **Windows PowerShell**:
  ```powershell
  ./setup.ps1
  ```
* **Windows Command Prompt**:
  ```cmd
  setup.bat
  ```
* **Linux / macOS / Git Bash**:
  ```bash
  chmod +x setup.sh
  ./setup.sh
  ```

This setup script will:
* Create a `.venv` directory (ignored by git).
* Activate the virtual environment.
* Upgrade `pip` to the latest version.
* Install dependencies declared in `requirements-dev.txt`.
* Execute `python main.py` diagnostics checking internet connectivity, Node, npm, and API connection status.

### 4. Install Next.js/Frontend Dependencies
Install the package dependencies for the Next.js runtime environment:
```bash
npm install
```

---

## Start Development

Launch the Next.js local development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser to check the running application.
