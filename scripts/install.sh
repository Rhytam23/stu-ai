#!/bin/bash
# scripts/install.sh
# Purpose: Installs Node.js and Python dependencies and copies environment templates.

. "$(dirname "$0")/utils.sh"

if [[ "$1" == "-h" || "$1" == "--help" ]]; then
    echo "Usage: ./scripts/install.sh [-v|--verbose]"
    echo "Purpose: Installs Node.js and Python dependencies and copies environment templates."
    exit $EXIT_SUCCESS
fi

cd "$REPO_ROOT" || exit $EXIT_FATAL

printf "============================================================\n"
printf "  Installing Dependencies\n"
printf "============================================================\n"

# 1. Detect Package Manager
log_info "Detecting package manager..."
PKG_MGR="npm"
if [ -f "$REPO_ROOT/pnpm-lock.yaml" ]; then
    PKG_MGR="pnpm"
elif [ -f "$REPO_ROOT/yarn.lock" ]; then
    PKG_MGR="yarn"
elif [ -f "$REPO_ROOT/bun.lockb" ]; then
    PKG_MGR="bun"
elif [ -f "$REPO_ROOT/package-lock.json" ]; then
    PKG_MGR="npm"
else
    log_warn "No lockfile detected. Falling back to default: npm"
fi

log_info "Using package manager: $PKG_MGR"

# 2. Check if Package Manager is installed
if ! check_command "$PKG_MGR"; then
    log_error "$PKG_MGR is not installed or not in PATH."
    exit $EXIT_DEP_MISSING
fi

# 3. Install Node.js packages
log_info "Installing Node.js dependencies..."
if ! "$PKG_MGR" install; then
    log_error "Failed to install Node.js dependencies."
    exit $EXIT_FATAL
fi
log_success "Node.js dependencies installed successfully."

# 4. Set up Python virtual environment
log_info "Setting up Python virtual environment (.venv)..."
if ! check_command "python3" && ! check_command "python"; then
    log_error "Python is not installed or not in PATH."
    exit $EXIT_DEP_MISSING
fi

PYTHON_CMD="python3"
if ! check_command "python3"; then
    PYTHON_CMD="python"
fi

if [ ! -d "$REPO_ROOT/.venv" ]; then
    if ! "$PYTHON_CMD" -m venv .venv; then
        log_error "Failed to create virtual environment."
        exit $EXIT_FATAL
    fi
    log_success "Created virtual environment (.venv)."
else
    log_info "Reusing existing virtual environment (.venv)."
fi

# 5. Install Python dependencies
log_info "Installing Python dependencies..."
PIP_PATH="$REPO_ROOT/.venv/bin/pip"
if [ ! -f "$PIP_PATH" ]; then
    PIP_PATH="$REPO_ROOT/.venv/Scripts/pip"
fi

if [ -f "$PIP_PATH" ]; then
    if ! "$PIP_PATH" install --upgrade pip setuptools wheel; then
        log_warn "Failed to upgrade base pip tools."
    fi
    
    if [ -f "$REPO_ROOT/requirements.txt" ]; then
        if ! "$PIP_PATH" install -r requirements.txt; then
            log_error "Failed to install requirements.txt dependencies."
            exit $EXIT_FATAL
        fi
    fi
    if [ -f "$REPO_ROOT/requirements-dev.txt" ]; then
        if ! "$PIP_PATH" install -r requirements-dev.txt; then
            log_error "Failed to install requirements-dev.txt dependencies."
            exit $EXIT_FATAL
        fi
    fi
    log_success "Python dependencies installed successfully."
else
    log_error "Could not find pip executable in virtual environment."
    exit $EXIT_FATAL
fi

# 6. Copy .env
log_info "Configuring environment files..."
if [ ! -f "$REPO_ROOT/.env" ]; then
    if [ -f "$REPO_ROOT/.env.example" ]; then
        cp "$REPO_ROOT/.env.example" "$REPO_ROOT/.env"
        log_success "Created .env from .env.example."
    else
        log_warn ".env.example is missing. Skipping env creation."
    fi
else
    log_info ".env already exists. Preserving configurations."
fi

exit $EXIT_SUCCESS
