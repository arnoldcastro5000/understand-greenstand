#!/usr/bin/env bash
# Install a pinned secrets scanner release (linux x64) and put it on PATH.
# The archive must match the SHA-256 pinned in the workflow, not only the release's own
# checksums file, so a replaced release asset fails the job.
# Usage: install-scanner.sh <gitleaks|betterleaks> <version> <sha256>
set -euo pipefail

tool="$1"
version="$2"
sha256="$3"

case "$tool" in
  gitleaks | betterleaks) ;;
  *) echo "unknown scanner: $tool" >&2; exit 2 ;;
esac

archive="${tool}_${version}_linux_x64.tar.gz"
url="https://github.com/${tool}/${tool}/releases/download/v${version}/${archive}"
work="${RUNNER_TEMP:?}/scanner-${tool}"
bin="${RUNNER_TEMP}/bin"
mkdir -p "$work" "$bin"

curl -fsSL --retry 3 -o "$work/$archive" "$url"
echo "${sha256}  ${work}/${archive}" | sha256sum -c -
tar -xzf "$work/$archive" -C "$work" "$tool"
install -m 0755 "$work/$tool" "$bin/$tool"

echo "$bin" >> "$GITHUB_PATH"
"$bin/$tool" version
