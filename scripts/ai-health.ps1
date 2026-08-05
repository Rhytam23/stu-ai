param(
    [switch]$Help,
    [switch]$Verbose
)

. "$PSScriptRoot\utils.ps1"

if ($Help) {
    Write-Host "Usage: .\scripts\ai-health.ps1 [-v|--verbose]"
    Write-Host "Purpose: Verifies live connectivity, latency, and keys for all configured AI providers."
    exit $EXIT_SUCCESS
}

$repoRoot = Get-RepoRoot
Set-Location $repoRoot

Write-Host "============================================================"
Write-Host "  Synapse AI Live Health Check" -ForegroundColor Magenta
Write-Host "============================================================"
Write-Host "  WARNING: Running this script consumes API credits/quota." -ForegroundColor Yellow
Write-Host ""

# Load env vars
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

$geminiKey = $envVars["GEMINI_API_KEY"]
if ($null -eq $geminiKey -or $geminiKey.Length -eq 0) { $geminiKey = $envVars["GOOGLE_API_KEY"] }
$openaiKey = $envVars["OPENAI_API_KEY"]
$claudeKey = $envVars["ANTHROPIC_API_KEY"]

# Helper to test Gemini
function Test-Gemini {
    if ($null -eq $geminiKey -or $geminiKey.Length -eq 0) {
        Log-Warn "Gemini: API Key not set. Skipping live check."
        return
    }
    
    Log-Info "Pinging Gemini API..."
    $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=$geminiKey"
    $body = @{
        contents = @(
            @{ parts = @( @{ text = "ping" } ) }
        )
    } | ConvertTo-Json -Depth 5
    
    try {
        $elapsed = Measure-Command {
            $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json" -TimeoutSec 10
        }
        $ms = [Math]::Round($elapsed.TotalMilliseconds)
        Log-Success "Gemini: Connected successfully (Latency: ${ms}ms)"
    } catch {
        Log-Error "Gemini: Live check failed - $_"
    }
}

# Helper to test OpenAI
function Test-OpenAI {
    if ($null -eq $openaiKey -or $openaiKey.Length -eq 0) {
        Log-Warn "OpenAI: API Key not set. Skipping live check."
        return
    }
    
    Log-Info "Pinging OpenAI API..."
    $url = "https://api.openai.com/v1/chat/completions"
    $headers = @{
        "Authorization" = "Bearer $openaiKey"
    }
    $body = @{
        model = "gpt-4o-mini"
        messages = @(
            @{ role = "user"; content = "ping" }
        )
        max_tokens = 5
    } | ConvertTo-Json -Depth 5
    
    try {
        $elapsed = Measure-Command {
            $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json" -Headers $headers -TimeoutSec 10
        }
        $ms = [Math]::Round($elapsed.TotalMilliseconds)
        Log-Success "OpenAI: Connected successfully (Latency: ${ms}ms)"
    } catch {
        Log-Error "OpenAI: Live check failed - $_"
    }
}

# Helper to test Claude
function Test-Claude {
    if ($null -eq $claudeKey -or $claudeKey.Length -eq 0) {
        Log-Warn "Claude: API Key not set. Skipping live check."
        return
    }
    
    Log-Info "Pinging Claude API..."
    $url = "https://api.anthropic.com/v1/messages"
    $headers = @{
        "x-api-key" = $claudeKey
        "anthropic-version" = "2023-06-01"
    }
    $body = @{
        model = "claude-3-5-haiku-20241022"
        messages = @(
            @{ role = "user"; content = "ping" }
        )
        max_tokens = 5
    } | ConvertTo-Json -Depth 5
    
    try {
        $elapsed = Measure-Command {
            $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json" -Headers $headers -TimeoutSec 10
        }
        $ms = [Math]::Round($elapsed.TotalMilliseconds)
        Log-Success "Claude: Connected successfully (Latency: ${ms}ms)"
    } catch {
        Log-Error "Claude: Live check failed - $_"
    }
}

# Run live connection tests
Test-Gemini
Test-OpenAI
Test-Claude

exit $EXIT_SUCCESS
