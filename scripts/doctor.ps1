param(
    [switch]$Help,
    [switch]$Verbose
)

. "$PSScriptRoot\utils.ps1"

if ($Help) {
    Write-Host "Usage: .\scripts\doctor.ps1 [-v|--verbose]"
    Write-Host "Purpose: Performs offline diagnostics on Node, Python, and the complete AI provider subsystem."
    exit $EXIT_SUCCESS
}

$repoRoot = Get-RepoRoot
Set-Location $repoRoot

Write-Host "============================================================"
Write-Host "  Synapse AI Doctor Diagnostics" -ForegroundColor Magenta
Write-Host "============================================================"

# Parse package.json
$pkgJson = $null
if (Test-Path "$repoRoot\package.json") {
    $pkgJson = Get-Content "$repoRoot\package.json" -Raw | ConvertFrom-Json
}

# Parse env vars
$envVars = @{}
if (Test-Path "$repoRoot\.env") {
    Get-Content "$repoRoot\.env" | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#") -and $line -like "*=*") {
            $parts = $line -split '=', 2
            $key = $parts[0].Trim()
            $val = $parts[1].Trim()
            $envVars[$key] = $val
        }
    }
}

$defaultProvider = $envVars["DEFAULT_AI_PROVIDER"]
if ($null -eq $defaultProvider) { $defaultProvider = "gemini" }

$geminiKey = $envVars["GEMINI_API_KEY"]
if ($null -eq $geminiKey -or $geminiKey.Length -eq 0) { $geminiKey = $envVars["GOOGLE_API_KEY"] }
$openaiKey = $envVars["OPENAI_API_KEY"]
$claudeKey = $envVars["ANTHROPIC_API_KEY"]

# Software / Environment Checks
$hasGit = Check-Command "git"
$hasNode = Check-Command "node"
$hasPython = Check-Command "python"
$hasVenv = Test-Path "$repoRoot\.venv"
$hasNodeModules = Test-Path "$repoRoot\node_modules"

# AI Subsystem Checks
$hasRouter = Test-Path "$repoRoot\src\lib\ai\router.ts"
$hasGeminiAdapter = Test-Path "$repoRoot\src\lib\ai\providers\gemini.ts"
$hasOpenAIAdapter = Test-Path "$repoRoot\src\lib\ai\providers\openai.ts"
$hasClaudeAdapter = Test-Path "$repoRoot\src\lib\ai\providers\claude.ts"

$hasGeminiSDK = $null -ne $pkgJson.dependencies."@google/generative-ai"
$hasOpenAISDK = $null -ne $pkgJson.dependencies."openai"
$hasClaudeSDK = $null -ne $pkgJson.dependencies."@anthropic-ai/sdk"

# Render Report
Write-Host ""
Write-Host "Environment Health:" -ForegroundColor Cyan
Write-Host "  Git ................... $(if ($hasGit) { "[OK]" } else { "[FAIL]" })"
Write-Host "  Node .................. $(if ($hasNode) { "[OK]" } else { "[FAIL]" })"
Write-Host "  Python ................ $(if ($hasPython) { "[OK]" } else { "[FAIL]" })"
Write-Host "  Virtual Environment ... $(if ($hasVenv) { "[OK]" } else { "[FAIL]" })"
Write-Host "  Dependencies .......... $(if ($hasNodeModules) { "[OK]" } else { "[FAIL]" })"

Write-Host ""
Write-Host "AI Subsystem Health:" -ForegroundColor Cyan
Write-Host "  Router ................ $(if ($hasRouter) { "[OK]" } else { "[FAIL]" })"

# Gemini
if ($hasGeminiAdapter -and $hasGeminiSDK) {
    if ($null -ne $geminiKey -and $geminiKey.Length -gt 0) {
        Write-Host "  Gemini ................ [OK]" -ForegroundColor Green
    } else {
        Write-Host "  Gemini ................ [WARN] (Missing API Key)" -ForegroundColor Yellow
    }
} else {
    Write-Host "  Gemini ................ [FAIL] (Adapter or SDK Missing)" -ForegroundColor Red
}

# OpenAI
if ($hasOpenAIAdapter -and $hasOpenAISDK) {
    if ($null -ne $openaiKey -and $openaiKey.Length -gt 0) {
        Write-Host "  OpenAI ................ [OK]" -ForegroundColor Green
    } else {
        Write-Host "  OpenAI ................ [WARN] (Missing API Key)" -ForegroundColor Yellow
    }
} else {
    Write-Host "  OpenAI ................ [FAIL] (Adapter or SDK Missing)" -ForegroundColor Red
}

# Claude
if ($hasClaudeAdapter -and $hasClaudeSDK) {
    if ($null -ne $claudeKey -and $claudeKey.Length -gt 0) {
        Write-Host "  Claude ................ [OK]" -ForegroundColor Green
    } else {
        Write-Host "  Claude ................ [WARN] (Missing API Key)" -ForegroundColor Yellow
    }
} else {
    Write-Host "  Claude ................ [FAIL] (Adapter or SDK Missing)" -ForegroundColor Red
}

Write-Host ""

# Evaluate Overall Status
$errorFound = $false
$warningFound = $false

if (-not $hasGit -or -not $hasNode -or -not $hasPython -or -not $hasVenv -or -not $hasNodeModules -or -not $hasRouter) {
    $errorFound = $true
}

# Check default provider key
if ($defaultProvider -eq "gemini" -and ($null -eq $geminiKey -or $geminiKey.Length -eq 0)) {
    Log-Error "Default provider is set to 'gemini' but GEMINI_API_KEY is not configured in .env"
    $errorFound = $true
} elseif ($defaultProvider -eq "openai" -and ($null -eq $openaiKey -or $openaiKey.Length -eq 0)) {
    Log-Error "Default provider is set to 'openai' but OPENAI_API_KEY is not configured in .env"
    $errorFound = $true
} elseif ($defaultProvider -eq "claude" -and ($null -eq $claudeKey -or $claudeKey.Length -eq 0)) {
    Log-Error "Default provider is set to 'claude' but ANTHROPIC_API_KEY is not configured in .env"
    $errorFound = $true
}

# Check missing non-default keys
if (($null -eq $geminiKey -or $geminiKey.Length -eq 0) -or ($null -eq $openaiKey -or $openaiKey.Length -eq 0) -or ($null -eq $claudeKey -or $claudeKey.Length -eq 0)) {
    $warningFound = $true
}

if ($errorFound) {
    Write-Host "Overall Status: ERROR" -ForegroundColor Red
    exit $EXIT_INVALID_CONFIG
} elseif ($warningFound) {
    Write-Host "Overall Status: WARNING (Missing optional API keys)" -ForegroundColor Yellow
    exit $EXIT_SUCCESS
} else {
    Write-Host "Overall Status: READY" -ForegroundColor Green
    exit $EXIT_SUCCESS
}
