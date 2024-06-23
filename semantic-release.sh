#!/usr/bin/env bash

set -Eeo pipefail

git config user.name ${GITHUB_USER}
git config user.email ${GITHUB_EMAIL}
git add CHANGELOG.md package.json
git commit --message "chore(release): $1"
git push
