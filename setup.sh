#!/bin/bash
# setup.sh
# Wrapper redirecting to scripts/bootstrap.sh for backward compatibility
exec "$(dirname "$0")/scripts/bootstrap.sh" "$@"
