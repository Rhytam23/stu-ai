#!/bin/bash
# scripts/clean.sh
# Purpose: Safely removes temporary cache directories and build outputs.

. "$(dirname "$0")/utils.sh"

if [[ "$1" == "-h" || "$1" == "--help" ]]; then
    echo "Usage: ./scripts/clean.sh [-v|--verbose]"
    echo "Purpose: Safely removes temporary cache directories and build outputs."
    exit $EXIT_SUCCESS
fi

cd "$REPO_ROOT" || exit $EXIT_FATAL

printf "============================================================\n"
printf "  Cleaning Caches & Temporary Folders\n"
printf "============================================================\n"

CLEAN_TARGETS=(
    "node_modules"
    ".next"
    "dist"
    "build"
    ".pytest_cache"
    ".ruff_cache"
    ".mypy_cache"
    "__pycache__"
)

for target in "${CLEAN_TARGETS[@]}"; do
    if [ -e "$REPO_ROOT/$target" ]; then
        log_info "Removing target: $target"
        if rm -rf "$REPO_ROOT/$target"; then
            log_success "Removed: $target"
        else
            log_warn "Could not remove target: $target."
        fi
    fi
done

log_success "Cleanup complete."
exit $EXIT_SUCCESS
