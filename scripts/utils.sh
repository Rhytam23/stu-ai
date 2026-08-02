#!/bin/bash
# scripts/utils.sh
# Reusable shared utility functions for stu-ai onboarding scripts

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

log_info() {
    printf "  [INFO] ${CYAN}%b${NC}\n" "$1"
}

log_success() {
    printf "  [OK] ${GREEN}%b${NC}\n" "$1"
}

log_warn() {
    printf "  [WARN] ${YELLOW}%b${NC}\n" "$1"
}

log_error() {
    printf "  [FAIL] ${RED}%b${NC}\n" "$1"
}

check_command() {
    command -v "$1" >/dev/null 2>&1
}

# Standard exit codes
EXIT_SUCCESS=0
EXIT_FATAL=1
EXIT_DEP_MISSING=2
EXIT_INVALID_CONFIG=3
