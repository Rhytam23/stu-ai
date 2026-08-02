param(
    [switch]$Help,
    [switch]$Verbose
)

. "$PSScriptRoot\utils.ps1"

if ($Help) {
    Write-Host "Usage: .\scripts\clean.ps1 [-v|--verbose]"
    Write-Host "Purpose: Safely removes temporary cache directories and build outputs."
    exit $EXIT_SUCCESS
}

$repoRoot = Get-RepoRoot
Set-Location $repoRoot

Write-Host "============================================================"
Write-Host "  Cleaning Caches & Temporary Folders" -ForegroundColor Magenta
Write-Host "============================================================"

$cleanTargets = @(
    "node_modules",
    ".next",
    "dist",
    "build",
    ".pytest_cache",
    ".ruff_cache",
    ".mypy_cache",
    "__pycache__"
)

foreach ($target in $cleanTargets) {
    if (Test-Path "$repoRoot\$target") {
        Log-Info "Removing target: $target"
        try {
            Remove-Item -Path "$repoRoot\$target" -Force -Recurse -Confirm:$false -ErrorAction Stop
            Log-Success "Removed: $target"
        } catch {
            Log-Warn "Could not remove target: $target. It might be locked by another process."
        }
    }
}

Log-Success "Cleanup complete."
exit $EXIT_SUCCESS
