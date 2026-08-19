#!/usr/bin/env bash
# Runs `npx prettier --write .` only when the hook was triggered by a
# "create" or "edit" tool call. Hook input JSON (see format.json /
# tool-output.json) is piped in on stdin; we read it here and pull out
# the toolName field using node (always available in this project).
set -euo pipefail

input="$(cat)"

toolName="$(node -e "
let data = '';
process.stdin.on('data', (chunk) => { data += chunk; });
process.stdin.on('end', () => {
  try {
    const parsed = JSON.parse(data);
    process.stdout.write(parsed.toolName || '');
  } catch {
    process.stdout.write('');
  }
});
" <<< "$input")"

if [ "$toolName" = "create" ] || [ "$toolName" = "edit" ]; then
  npx prettier --write .
fi
