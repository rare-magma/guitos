#!/usr/bin/env bash

set -Eeo pipefail

git config user.name 'github-actions[bot]'
git config user.email '41898282+github-actions[bot]@users.noreply.github.com'
git add CHANGELOG.md package.json
git commit --message "chore(release): $(cat .version)"
git push
