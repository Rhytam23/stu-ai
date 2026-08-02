#!/bin/bash
# scripts/bootstrap.sh
# Purpose: Orchestrates the install, verify, doctor, and build verification workflows for onboarding.

. "$(dirname "$0")/utils.sh"

if [[ "$1" == "-h" || "$1" == "--help" ]]; then
    echo "Usage: ./scripts/bootstrap.sh [-v|--verbose] [-d|--dry-run]"
    echo "Purpose: Orchestrates the install, verify, doctor, and build verification workflows for onboarding."
    exit $EXIT_SUCCESS
fi

cd "$REPO_ROOT" || exit $EXIT_FATAL

printf "============================================================\n"
printf "  Synapse Repository Bootstrap Orchestrator\n"
printf "============================================================\n"

# Check if Task CLI is installed
if ! check_command "task"; then
    log_warn "The 'task' CLI tool is not installed on this machine."
    log_info "Recommendation: Consider installing Task for automated multi-platform task running."
    log_info "Installation details: https://taskfile.dev/installation/"
else
    log_success "Task CLI is installed."
fi

if [[ "$1" == "-d" || "$1" == "--dry-run" ]]; then
    log_info "Dry run mode active. Skipping physical installations."
    ./scripts/verify.sh
    exit $EXIT_SUCCESS
fi

# 1. Execute Install
log_info "Executing Dependency Installation..."
if ! ./scripts/install.sh; then
    log_error "Dependency installation failed."
    exit $?
fi

# 2. Execute Verify
log_info "Executing Environment Verification..."
if ! ./scripts/verify.sh; then
    log_error "Environment verification failed."
    exit $?
fi

# 3. Execute Doctor
log_info "Executing Configuration Diagnostics..."
if ! ./scripts/doctor.sh; then
    log_error "Configuration diagnostics failed."
    exit $?
fi

# 4. Build & Lint Verification
log_info "Running build lints verification..."
# Detect package manager
PKG_MGR="npm"
if [ -f "$REPO_ROOT/pnpm-lock.yaml" ]; then
    PKG_MGR="pnpm"
elif [ -f "$REPO_ROOT/yarn.lock" ]; then
    PKG_MGR="yarn"
elif [ -f "$REPO_ROOT/bun.lockb" ]; then
    PKG_MGR="bun"
fi

if "$PKG_MGR" run lint; then
    log_success "Linter checks passed successfully."
else
    log_warn "Linter verification warning or failure."
fi

log_info "Compiling Next.js build..."
if ! "$PKG_MGR" run build; then
    log_error "Build verification failed."
    exit $EXIT_FATAL
fi
log_success "Next.js build succeeded."

printf "\n"
printf "✓ Environment Ready\n"
printf "============================================================\n"
printf "Next Steps:\n"
printf "  1. Open .env and complete your API keys.\n"
printf "  2. Run 'npm run dev' (or your package manager command) to launch portal.\n"
printf "  3. Run './scripts/ai-health.sh' to verify live API connection health.\n"
printf "============================================================\n"
exit $EXIT_SUCCESS
