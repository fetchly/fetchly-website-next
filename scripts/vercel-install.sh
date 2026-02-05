#!/bin/bash
# Vercel install script - sets up SSH access for private GitHub dependencies
# See README.md "Vercel Deployment" section for setup instructions
set -e

# Setup SSH for private GitHub dependencies (requires GIT_SSH_KEY env var)
if [ -n "$GIT_SSH_KEY" ]; then
  mkdir -p ~/.ssh
  echo "$GIT_SSH_KEY" | base64 -d > ~/.ssh/id_ed25519
  chmod 600 ~/.ssh/id_ed25519
  ssh-keyscan github.com >> ~/.ssh/known_hosts 2>/dev/null
  echo "SSH key configured for GitHub"
fi

npm install
