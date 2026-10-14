#!/usr/bin/env bash
# Append a findings table for one scanner report to the job summary.
# Reports are written with --redact, so they hold no secret values.
# Usage: scan-summary.sh <label> <report.json>
set -euo pipefail

label="$1"
report="$2"

{
  echo "### ${label}"
  if [ ! -s "$report" ]; then
    echo "No report written. The scan did not finish; see the step log."
  else
    count="$(jq 'length' "$report")"
    if [ "$count" -eq 0 ]; then
      echo "No findings."
    else
      echo "**${count} finding(s).** Rotate any real secret first, then remove it."
      echo "For a false positive, add its fingerprint to \`.gitleaksignore\` with a reason."
      echo
      echo "| Rule | Location | Line | Commit | Fingerprint |"
      echo "|---|---|---|---|---|"
      jq -r '.[] | "| \(.RuleID) | \(.File) | \(.StartLine) | \(.Commit[0:7]) | `\(.Fingerprint)` |"' "$report"
    fi
  fi
  echo
} >> "$GITHUB_STEP_SUMMARY"
