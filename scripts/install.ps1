param(
    [switch]$Help,
    [switch]$Verbose
)

. "$PSScriptRoot\utils.ps1"

if ($Help) {
    Write-Host "Usage: .\scripts\install.ps1 [-v|--verbose]"
    Write-Host "Purpose: Installs Node.js and Python dependencies and copies environment templates."
    exit $EXIT_SUCCESS
}

$repoRoot = Get-RepoRoot
Set-Location $repoRoot

Write-Host "============================================================"
Write-Host "  Installing Dependencies" -ForegroundColor Magenta
Write-Host "============================================================"

# 1. Detect Package Manager
Log-Info "Detecting package manager..."
$pkgMgr = "npm"
if (Test-Path "$repoRoot\pnpm-lock.yaml") {
    $pkgMgr = "pnpm"
} elseif (Test-Path "$repoRoot\yarn.lock") {
    $pkgMgr = "yarn"
} elseif (Test-Path "$repoRoot\bun.lockb") {
    $pkgMgr = "bun"
} elseif (Test-Path "$repoRoot\package-lock.json") {
    $pkgMgr = "npm"
} else {
    Log-Warn "No lockfile detected. Falling back to default: npm"
}

Log-Info "Using package manager: $pkgMgr"

# 2. Check if Package Manager is installed
if (-not (Check-Command $pkgMgr)) {
    Log-Error "$pkgMgr is not installed or not in PATH."
    exit $EXIT_DEP_MISSING
}

# 3. Install Node.js packages
Log-Info "Installing Node.js dependencies..."
try {
    if ($pkgMgr -eq "yarn") {
        Start-Process -FilePath "yarn" -ArgumentList "install" -Wait -NoNewWindow
    } else {
        Start-Process -FilePath $pkgMgr -ArgumentList "install" -Wait -NoNewWindow
    }
    Log-Success "Node.js dependencies installed successfully."
} catch {
    Log-Error "Failed to install Node.js dependencies: $_"
    exit $EXIT_FATAL
}

# 4. Set up Python virtual environment
Log-Info "Setting up Python virtual environment (.venv)..."
if (-not (Check-Command "python")) {
    Log-Error "Python is not installed or not in PATH."
    exit $EXIT_DEP_MISSING
}

if (-not (Test-Path "$repoRoot\.venv")) {
    try {
        Start-Process -FilePath "python" -ArgumentList "-m venv .venv" -Wait -NoNewWindow
        Log-Success "Created virtual environment (.venv)."
    } catch {
        Log-Error "Failed to create virtual environment: $_"
        exit $EXIT_FATAL
    }
} else {
    Log-Info "Reusing existing virtual environment (.venv)."
}

# 5. Install Python dependencies
Log-Info "Installing Python dependencies..."
$pipPath = "$repoRoot\.venv\Scripts\pip.exe"
if (-not (Test-Path $pipPath)) {
    $pipPath = "$repoRoot\.venv\bin\pip"
}

if (Test-Path $pipPath) {
    try {
        # Upgrade pip, setuptools, wheel
        Start-Process -FilePath $pipPath -ArgumentList "install --upgrade pip setuptools wheel" -Wait -NoNewWindow -ErrorAction SilentlyContinue
        
        if (Test-Path "$repoRoot\requirements.txt") {
            Start-Process -FilePath $pipPath -ArgumentList "install -r requirements.txt" -Wait -NoNewWindow
        }
        if (Test-Path "$repoRoot\requirements-dev.txt") {
            Start-Process -FilePath $pipPath -ArgumentList "install -r requirements-dev.txt" -Wait -NoNewWindow
        }
        Log-Success "Python dependencies installed successfully."
    } catch {
        Log-Error "Failed to install Python dependencies: $_"
        exit $EXIT_FATAL
    }
} else {
    Log-Error "Could not find pip executable in virtual environment."
    exit $EXIT_FATAL
}

# 6. Copy .env
Log-Info "Configuring environment files..."
if (-not (Test-Path "$repoRoot\.env")) {
    if (Test-Path "$repoRoot\.env.example") {
        Copy-Item -Path "$repoRoot\.env.example" -Destination "$repoRoot\.env" -Force
        Log-Success "Created .env from .env.example."
    } else {
        Log-Warn ".env.example is missing. Skipping env creation."
    }
} else {
    Log-Info ".env already exists. Preserving configurations."
}

exit $EXIT_SUCCESS
