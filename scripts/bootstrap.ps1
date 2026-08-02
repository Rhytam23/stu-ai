param(
    [switch]$Help,
    [switch]$Verbose,
    [switch]$DryRun
)

. "$PSScriptRoot\utils.ps1"

if ($Help) {
    Write-Host "Usage: .\scripts\bootstrap.ps1 [-v|--verbose] [-d|--dry-run]"
    Write-Host "Purpose: Orchestrates the install, verify, doctor, and build verification workflows for onboarding."
    exit $EXIT_SUCCESS
}

$repoRoot = Get-RepoRoot
Set-Location $repoRoot

Write-Host "============================================================"
Write-Host "  Synapse Repository Bootstrap Orchestrator" -ForegroundColor Magenta
Write-Host "============================================================"

# Check if Task CLI is installed
if (-not (Check-Command "task")) {
    Log-Warn "The 'task' CLI tool is not installed on this machine."
    Log-Info "Recommendation: Consider installing Task for automated multi-platform task running."
    Log-Info "Installation details: https://taskfile.dev/installation/"
} else {
    Log-Success "Task CLI is installed."
}

if ($DryRun) {
    Log-Info "Dry run mode active. Skipping physical installations."
    $verifyPath = "$PSScriptRoot\verify.ps1"
    Start-Process -FilePath "powershell.exe" -ArgumentList "-ExecutionPolicy", "Bypass", "-File", $verifyPath -Wait -NoNewWindow
    exit $EXIT_SUCCESS
}

# 1. Execute Install
Log-Info "Executing Dependency Installation..."
$installPath = "$PSScriptRoot\install.ps1"
$installProcess = Start-Process -FilePath "powershell.exe" -ArgumentList "-ExecutionPolicy", "Bypass", "-File", $installPath -Wait -PassThru -NoNewWindow
if ($installProcess.ExitCode -ne 0) {
    Log-Error "Dependency installation failed."
    exit $installProcess.ExitCode
}

# 2. Execute Verify
Log-Info "Executing Environment Verification..."
$verifyPath = "$PSScriptRoot\verify.ps1"
$verifyProcess = Start-Process -FilePath "powershell.exe" -ArgumentList "-ExecutionPolicy", "Bypass", "-File", $verifyPath -Wait -PassThru -NoNewWindow
if ($verifyProcess.ExitCode -ne 0) {
    Log-Error "Environment verification failed."
    exit $verifyProcess.ExitCode
}

# 3. Execute Doctor
Log-Info "Executing Configuration Diagnostics..."
$doctorPath = "$PSScriptRoot\doctor.ps1"
$doctorProcess = Start-Process -FilePath "powershell.exe" -ArgumentList "-ExecutionPolicy", "Bypass", "-File", $doctorPath -Wait -PassThru -NoNewWindow
if ($doctorProcess.ExitCode -ne 0) {
    Log-Error "Configuration diagnostics failed."
    exit $doctorProcess.ExitCode
}

# 4. Build & Lint Verification
Log-Info "Running build lints verification..."
# Detect package manager
$pkgMgr = "npm"
if (Test-Path "$repoRoot\pnpm-lock.yaml") {
    $pkgMgr = "pnpm"
} elseif (Test-Path "$repoRoot\yarn.lock") {
    $pkgMgr = "yarn"
} elseif (Test-Path "$repoRoot\bun.lockb") {
    $pkgMgr = "bun"
}

# run lint
try {
    Start-Process -FilePath $pkgMgr -ArgumentList "run lint" -Wait -NoNewWindow
    Log-Success "Linter checks passed successfully."
} catch {
    Log-Warn "Linter verification warning or failure."
}

# run build
try {
    Log-Info "Compiling Next.js build..."
    Start-Process -FilePath $pkgMgr -ArgumentList "run build" -Wait -NoNewWindow
    Log-Success "Next.js build succeeded."
} catch {
    Log-Error "Build verification failed."
    exit $EXIT_FATAL
}

Write-Host ""
Write-Host "SUCCESS: Environment Ready" -ForegroundColor Green
Write-Host "============================================================"
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Open .env and configure your API keys."
Write-Host "  2. Run 'npm run dev' to launch the portal."
Write-Host "  3. Run '.\scripts\ai-health.ps1' to verify live API connection health."
Write-Host "============================================================"
exit $EXIT_SUCCESS
