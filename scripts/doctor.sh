#!/bin/bash
# scripts/doctor.sh
# Purpose: Performs offline diagnostics on Node, Python, and the complete AI provider subsystem.

. "$(dirname "$0")/utils.sh"

if [[ "$1" == "-h" || "$1" == "--help" ]]; then
    echo "Usage: ./scripts/doctor.sh [-v|--verbose]"
    echo "Purpose: Performs offline diagnostics on Node, Python, and the complete AI provider subsystem."
    exit $EXIT_SUCCESS
fi

cd "$REPO_ROOT" || exit $EXIT_FATAL

printf "============================================================\n"
printf "  Synapse AI Doctor Diagnostics\n"
printf "============================================================\n"

# Defaults
DEFAULT_AI_PROVIDER="gemini"
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
                DEFAULT_AI_PROVIDER) DEFAULT_AI_PROVIDER="$val" ;;
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

check_dependency() {
    if [ -f "$REPO_ROOT/package.json" ]; then
        grep -q "\"$1\":" "$REPO_ROOT/package.json"
    else
        return 1
    fi
}

# Software / Environment Checks
HAS_GIT=$(check_command "git" && echo true || echo false)
HAS_NODE=$(check_command "node" && echo true || echo false)
if check_command "python3"; then
    HAS_PYTHON=true
elif check_command "python"; then
    HAS_PYTHON=true
else
    HAS_PYTHON=false
fi
HAS_VENV=$([ -d "$REPO_ROOT/.venv" ] && echo true || echo false)
HAS_NODE_MODULES=$([ -d "$REPO_ROOT/node_modules" ] && echo true || echo false)

# AI Subsystem Checks
HAS_ROUTER=$([ -f "$REPO_ROOT/src/lib/ai/router.ts" ] && echo true || echo false)
HAS_GEMINI_ADAPTER=$([ -f "$REPO_ROOT/src/lib/ai/providers/gemini.ts" ] && echo true || echo false)
HAS_OPENAI_ADAPTER=$([ -f "$REPO_ROOT/src/lib/ai/providers/openai.ts" ] && echo true || echo false)
HAS_CLAUDE_ADAPTER=$([ -f "$REPO_ROOT/src/lib/ai/providers/claude.ts" ] && echo true || echo false)

HAS_GEMINI_SDK=$(check_dependency "@google/generative-ai" && echo true || echo false)
HAS_OPENAI_SDK=$(check_dependency "openai" && echo true || echo false)
HAS_CLAUDE_SDK=$(check_dependency "@anthropic-ai/sdk" && echo true || echo false)

printf "\nEnvironment Health:\n"
printf "  Git ................... %b\n" "$([ "$HAS_GIT" = true ] && echo "✓" || echo "✗")"
printf "  Node .................. %b\n" "$([ "$HAS_NODE" = true ] && echo "✓" || echo "✗")"
printf "  Python ................ %b\n" "$([ "$HAS_PYTHON" = true ] && echo "✓" || echo "✗")"
printf "  Virtual Environment ... %b\n" "$([ "$HAS_VENV" = true ] && echo "✓" || echo "✗")"
printf "  Dependencies .......... %b\n" "$([ "$HAS_NODE_MODULES" = true ] && echo "✓" || echo "✗")"

printf "\nAI Subsystem Health:\n"
printf "  Router ................ %b\n" "$([ "$HAS_ROUTER" = true ] && echo "✓" || echo "✗")"

# Gemini
if [ "$HAS_GEMINI_ADAPTER" = true ] && [ "$HAS_GEMINI_SDK" = true ]; then
    if [ -n "$GEMINI_API_KEY" ]; then
        printf "  Gemini ................ ${GREEN}✓${NC}\n"
    else
        printf "  Gemini ................ ${YELLOW}⚠ (Missing API Key)${NC}\n"
    fi
else
    printf "  Gemini ................ ${RED}✗ (Adapter or SDK Missing)${NC}\n"
fi

# OpenAI
if [ "$HAS_OPENAI_ADAPTER" = true ] && [ "$HAS_OPENAI_SDK" = true ]; then
    if [ -n "$OPENAI_API_KEY" ]; then
        printf "  OpenAI ................ ${GREEN}✓${NC}\n"
    else
        printf "  OpenAI ................ ${YELLOW}⚠ (Missing API Key)${NC}\n"
    fi
else
    printf "  OpenAI ................ ${RED}✗ (Adapter or SDK Missing)${NC}\n"
fi

# Claude
if [ "$HAS_CLAUDE_ADAPTER" = true ] && [ "$HAS_CLAUDE_SDK" = true ]; then
    if [ -n "$ANTHROPIC_API_KEY" ]; then
        printf "  Claude ................ ${GREEN}✓${NC}\n"
    else
        printf "  Claude ................ ${YELLOW}⚠ (Missing API Key)${NC}\n"
    fi
else
    printf "  Claude ................ ${RED}✗ (Adapter or SDK Missing)${NC}\n"
fi

printf "\n"

# Evaluate Status
ERROR_FOUND=false
WARNING_FOUND=false

if [ "$HAS_GIT" = false ] || [ "$HAS_NODE" = false ] || [ "$HAS_PYTHON" = false ] || [ "$HAS_VENV" = false ] || [ "$HAS_NODE_MODULES" = false ] || [ "$HAS_ROUTER" = false ]; then
    ERROR_FOUND=true
fi

if [ "$DEFAULT_AI_PROVIDER" = "gemini" ] && [ -z "$GEMINI_API_KEY" ]; then
    log_error "Default provider is set to 'gemini' but GEMINI_API_KEY is not configured in .env"
    ERROR_FOUND=true
elif [ "$DEFAULT_AI_PROVIDER" = "openai" ] && [ -z "$OPENAI_API_KEY" ]; then
    log_error "Default provider is set to 'openai' but OPENAI_API_KEY is not configured in .env"
    ERROR_FOUND=true
elif [ "$DEFAULT_AI_PROVIDER" = "claude" ] && [ -z "$ANTHROPIC_API_KEY" ]; then
    log_error "Default provider is set to 'claude' but ANTHROPIC_API_KEY is not configured in .env"
    ERROR_FOUND=true
fi

if [ -z "$GEMINI_API_KEY" ] || [ -z "$OPENAI_API_KEY" ] || [ -z "$ANTHROPIC_API_KEY" ]; then
    WARNING_FOUND=true
fi

if [ "$ERROR_FOUND" = true ]; then
    printf "Overall Status: ${RED}ERROR${NC}\n"
    exit $EXIT_INVALID_CONFIG
elif [ "$WARNING_FOUND" = true ]; then
    printf "Overall Status: ${YELLOW}WARNING (Missing optional API keys)${NC}\n"
    exit $EXIT_SUCCESS
else
    printf "Overall Status: ${GREEN}READY${NC}\n"
    exit $EXIT_SUCCESS
fi
