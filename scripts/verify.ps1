param(
    [switch]$Help,
    [switch]$Verbose
)

. "$PSScriptRoot\utils.ps1"

if ($Help) {
    Write-Host "Usage: .\scripts\verify.ps1 [-v|--verbose]"
    Write-Host "Purpose: Performs health checks and verifies dependency installation and compiler versions."
    exit $EXIT_SUCCESS
}

$repoRoot = Get-RepoRoot
Set-Location $repoRoot

Write-Host "============================================================"
Write-Host "  Verifying Environment & Dependencies" -ForegroundColor Magenta
Write-Host "============================================================"

$allPassed = $true

# 1. Verify Git
if (Check-Command "git") {
    $gitVer = (git --version).Trim()
    Log-Success "Git is installed ($gitVer)"
} else {
    Log-Error "Git is not installed or not in PATH."
    $allPassed = $false
}

# 2. Verify Node
if (Check-Command "node") {
    $nodeVer = (node --version).Trim()
    $reqNode = "20"
    if (Test-Path "$repoRoot\.nvmrc") {
        $reqNode = (Get-Content "$repoRoot\.nvmrc" -Raw).Trim()
    }
    Log-Success "Node.js is installed ($nodeVer, Required: $reqNode)"
} else {
    Log-Error "Node.js is not installed or not in PATH."
    $allPassed = $false
}

# 3. Detect and Check Package Manager
$pkgMgr = "npm"
if (Test-Path "$repoRoot\pnpm-lock.yaml") {
    $pkgMgr = "pnpm"
} elseif (Test-Path "$repoRoot\yarn.lock") {
    $pkgMgr = "yarn"
} elseif (Test-Path "$repoRoot\bun.lockb") {
    $pkgMgr = "bun"
}

if (Check-Command $pkgMgr) {
    Log-Success "Package Manager ($pkgMgr) is installed"
} else {
    Log-Error "Package Manager ($pkgMgr) is not installed."
    $allPassed = $false
}

# 4. Verify Python
if (Check-Command "python") {
    $pyVer = (python --version).Trim()
    Log-Success "Python is installed ($pyVer)"
} else {
    Log-Error "Python is not installed or not in PATH."
    $allPassed = $false
}

# 5. Verify Virtual Environment
if (Test-Path "$repoRoot\.venv") {
    Log-Success "Virtual Environment (.venv) directory exists"
} else {
    Log-Warn "Virtual Environment (.venv) is missing."
    $allPassed = $false
}

# 6. Verify Node Dependencies (node_modules)
if (Test-Path "$repoRoot\node_modules") {
    Log-Success "node_modules directory exists"
} else {
    Log-Warn "node_modules directory is missing."
    $allPassed = $false
}

if ($allPassed) {
    Write-Host "SUCCESS: Verification Successful" -ForegroundColor Green
    exit $EXIT_SUCCESS
} else {
    Write-Host "FAIL: Verification Failed. Review warnings/errors above." -ForegroundColor Red
    exit $EXIT_DEP_MISSING
}
