#!/usr/bin/env bash
# Write the scanner config to $RUNNER_TEMP/scan.toml and export SCAN_CONFIG.
# The config extends the public .gitleaks.toml. When the PRIVATE_TERMS_TOML secret is set,
# it also adds the private-terms rule. That rule lists names that must not appear in this
# public repo, so it lives only in the secret, never in git. Never echo the secret.
set -euo pipefail

out="${RUNNER_TEMP:?}/scan.toml"

if [ -n "${PRIVATE_TERMS_TOML:-}" ]; then
  {
    printf '[extend]\npath = "%s/.gitleaks.toml"\n\n' "${GITHUB_WORKSPACE:?}"
    printf '%s\n' "$PRIVATE_TERMS_TOML"
  } > "$out"
  echo "Scan config: .gitleaks.toml + private-terms rule"
else
  # Secrets are not available to pull requests from forks.
  echo "::warning::PRIVATE_TERMS_TOML is not set; scanning without the private-terms rule."
  cp "${GITHUB_WORKSPACE:?}/.gitleaks.toml" "$out"
fi

echo "SCAN_CONFIG=$out" >> "$GITHUB_ENV"
