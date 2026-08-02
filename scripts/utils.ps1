# scripts/utils.ps1
# Reusable shared utility functions for stu-ai onboarding scripts

$script:repoRoot = Resolve-Path "$PSScriptRoot\.."

function Get-RepoRoot {
    return $script:repoRoot
}

function Log-Info ($Message) {
    Write-Host "  [INFO] $Message" -ForegroundColor Cyan
}

function Log-Success ($Message) {
    Write-Host "  [OK] $Message" -ForegroundColor Green
}

function Log-Warn ($Message) {
    Write-Host "  [WARN] $Message" -ForegroundColor Yellow
}

function Log-Error ($Message) {
    Write-Host "  [FAIL] $Message" -ForegroundColor Red
}

function Check-Command ($Cmd) {
    $cmdPath = Get-Command $Cmd -ErrorAction SilentlyContinue
    return $null -ne $cmdPath
}

# Standard exit codes
$EXIT_SUCCESS = 0
$EXIT_FATAL = 1
$EXIT_DEP_MISSING = 2
$EXIT_INVALID_CONFIG = 3
# Variables and functions will be automatically exposed when dot-sourced.
