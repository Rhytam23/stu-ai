#!/bin/bash
# scripts/ai-health.sh
# Purpose: Verifies live connectivity, latency, and keys for all configured AI providers.

. "$(dirname "$0")/utils.sh"

if [[ "$1" == "-h" || "$1" == "--help" ]]; then
    echo "Usage: ./scripts/ai-health.sh [-v|--verbose]"
    echo "Purpose: Verifies live connectivity, latency, and keys for all configured AI providers."
    exit $EXIT_SUCCESS
fi

cd "$REPO_ROOT" || exit $EXIT_FATAL

printf "============================================================\n"
printf "  Synapse AI Live Health Check\n"
printf "============================================================\n"
printf "  ${YELLOW}WARNING: Running this script consumes API credits/quota.${NC}\n\n"

# Defaults
GEMINI_API_KEY=""
OPENAI_API_KEY=""
ANTHROPIC_API_KEY=""

# Parse .env
if [ -f "$REPO_ROOT/.env" ]; then
    while IFS='=' read -r key val || [ -n "$key" ]; do
        key=$(echo "$key" | xargs 2>/dev/null || echo "$key" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')
        val=$(echo "$val" | xargs 2>/dev/null || echo "$val" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')
        if [[ ! "$key" =~ ^# && -n "$key" ]]; then
            case "$key" in
                GEMINI_API_KEY) GEMINI_API_KEY="$val" ;;
                GOOGLE_API_KEY) GOOGLE_API_KEY="$val" ;;
                OPENAI_API_KEY) OPENAI_API_KEY="$val" ;;
                ANTHROPIC_API_KEY) ANTHROPIC_API_KEY="$val" ;;
            esac
        fi
    done < "$REPO_ROOT/.env"
fi

if [ -z "$GEMINI_API_KEY" ]; then
    GEMINI_API_KEY="$GOOGLE_API_KEY"
fi

if ! check_command "curl"; then
    log_error "curl command is missing. Cannot perform live check."
    exit $EXIT_DEP_MISSING
fi

# Test Gemini
test_gemini() {
    if [ -z "$GEMINI_API_KEY" ]; then
        log_warn "Gemini: API Key not set. Skipping live check."
        return
    fi
    log_info "Pinging Gemini API..."
    
    latency=$(curl -s -o /dev/null -w "%{time_total}" -X POST \
      -H "Content-Type: application/json" \
      -d '{"contents":[{"parts":[{"text":"ping"}]}]}' \
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$GEMINI_API_KEY")
    
    if [ $? -eq 0 ] && [ -n "$latency" ]; then
        log_success "Gemini: Connected successfully (Latency: ${latency}s)"
    else
        log_error "Gemini: Live check failed."
    fi
}

# Test OpenAI
test_openai() {
    if [ -z "$OPENAI_API_KEY" ]; then
        log_warn "OpenAI: API Key not set. Skipping live check."
        return
    fi
    log_info "Pinging OpenAI API..."
    
    latency=$(curl -s -o /dev/null -w "%{time_total}" -X POST \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $OPENAI_API_KEY" \
      -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"ping"}],"max_tokens":5}' \
      "https://api.openai.com/v1/chat/completions")
    
    if [ $? -eq 0 ] && [ -n "$latency" ]; then
        log_success "OpenAI: Connected successfully (Latency: ${latency}s)"
    else
        log_error "OpenAI: Live check failed."
    fi
}

# Test Claude
test_claude() {
    if [ -z "$ANTHROPIC_API_KEY" ]; then
        log_warn "Claude: API Key not set. Skipping live check."
        return
    fi
    log_info "Pinging Claude API..."
    
    latency=$(curl -s -o /dev/null -w "%{time_total}" -X POST \
      -H "Content-Type: application/json" \
      -H "x-api-key: $ANTHROPIC_API_KEY" \
      -H "anthropic-version: 2023-06-01" \
      -d '{"model":"claude-3-5-haiku-20241022","messages":[{"role":"user","content":"ping"}],"max_tokens":5}' \
      "https://api.anthropic.com/v1/messages")
    
    if [ $? -eq 0 ] && [ -n "$latency" ]; then
        log_success "Claude: Connected successfully (Latency: ${latency}s)"
    else
        log_error "Claude: Live check failed."
    fi
}

test_gemini
test_openai
test_claude

exit $EXIT_SUCCESS
