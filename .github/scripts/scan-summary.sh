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
      echo "- In a file: for a false positive, add its fingerprint to \`.gitleaksignore\` with a reason."
      # One echo per bullet: the summary renderer turns a newline into a line break.
      echo "- In issue or pull request text: edit or delete that text. The edit history keeps the old text, so treat a real secret there as exposed."
      echo
      echo "| Rule | Location | Line | Commit | Fingerprint |"
      echo "|---|---|---|---|---|"
      # Findings from the GitHub API have no file; betterleaks puts the issue or pull request
      # URL in Attributes.url. Their fingerprint is not unique per issue, so do not show it.
      jq -r '.[]
        | (if .File != "" then .File else (.Attributes.url // "unknown") end) as $location
        | (if .File != "" then "`\(.Fingerprint)`" else "n/a: edit the text" end) as $fingerprint
        | "| \(.RuleID) | \($location) | \(.StartLine) | \(.Commit[0:7]) | \($fingerprint) |"' "$report"
    fi
  fi
  echo
} >> "$GITHUB_STEP_SUMMARY"
