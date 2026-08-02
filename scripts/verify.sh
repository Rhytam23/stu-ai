#!/bin/bash
# scripts/verify.sh
# Purpose: Performs health checks and verifies dependency installation and compiler versions.

. "$(dirname "$0")/utils.sh"

if [[ "$1" == "-h" || "$1" == "--help" ]]; then
    echo "Usage: ./scripts/verify.sh [-v|--verbose]"
    echo "Purpose: Performs health checks and verifies dependency installation and compiler versions."
    exit $EXIT_SUCCESS
fi

cd "$REPO_ROOT" || exit $EXIT_FATAL

printf "============================================================\n"
printf "  Verifying Environment & Dependencies\n"
printf "============================================================\n"

ALL_PASSED=true

# 1. Verify Git
if check_command "git"; then
    GIT_VER=$(git --version)
    log_success "Git is installed ($GIT_VER)"
else
    log_error "Git is not installed or not in PATH."
    ALL_PASSED=false
fi

# 2. Verify Node
if check_command "node"; then
    NODE_VER=$(node --version)
    REQ_NODE="20"
    if [ -f "$REPO_ROOT/.nvmrc" ]; then
        REQ_NODE=$(cat "$REPO_ROOT/.nvmrc" | xargs)
    fi
    log_success "Node.js is installed ($NODE_VER, Required: $REQ_NODE)"
else
    log_error "Node.js is not installed or not in PATH."
    ALL_PASSED=false
fi

# 3. Detect and Check Package Manager
PKG_MGR="npm"
if [ -f "$REPO_ROOT/pnpm-lock.yaml" ]; then
    PKG_MGR="pnpm"
elif [ -f "$REPO_ROOT/yarn.lock" ]; then
    PKG_MGR="yarn"
elif [ -f "$REPO_ROOT/bun.lockb" ]; then
    PKG_MGR="bun"
fi

if check_command "$PKG_MGR"; then
    log_success "Package Manager ($PKG_MGR) is installed"
else
    log_error "Package Manager ($PKG_MGR) is not installed."
    ALL_PASSED=false
fi

# 4. Verify Python
if check_command "python3" || check_command "python"; then
    PY_CMD="python3"
    if ! check_command "python3"; then
        PY_CMD="python"
    fi
    PY_VER=$($PY_CMD --version)
    log_success "Python is installed ($PY_VER)"
else
    log_error "Python is not installed or not in PATH."
    ALL_PASSED=false
fi

# 5. Verify Virtual Environment
if [ -d "$REPO_ROOT/.venv" ]; then
    log_success "Virtual Environment (.venv) directory exists"
else
    log_warn "Virtual Environment (.venv) is missing."
    ALL_PASSED=false
fi

# 6. Verify Node Dependencies (node_modules)
if [ -d "$REPO_ROOT/node_modules" ]; then
    log_success "node_modules directory exists"
else
    log_warn "node_modules directory is missing."
    ALL_PASSED=false
fi

if [ "$ALL_PASSED" = true ]; then
    printf "✓ Verification Successful\n"
    exit $EXIT_SUCCESS
else
    printf "✗ Verification Failed. Review warnings/errors above.\n"
    exit $EXIT_DEP_MISSING
fi
