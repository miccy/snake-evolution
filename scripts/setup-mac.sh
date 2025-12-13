#!/bin/bash
# Snake Evolution - Mac Development Setup Script
# Run with: chmod +x scripts/setup-mac.sh && ./scripts/setup-mac.sh

set -e

echo "🐍 Snake Evolution - Mac Setup"
echo "==============================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_command() {
    if command -v "$1" &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 is installed"
        return 0
    else
        echo -e "${RED}✗${NC} $1 is not installed"
        return 1
    fi
}

# Check prerequisites
echo "Checking prerequisites..."
echo ""

# Homebrew
if ! check_command brew; then
    echo -e "${YELLOW}Installing Homebrew...${NC}"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Bun
if ! check_command bun; then
    echo -e "${YELLOW}Installing Bun...${NC}"
    curl -fsSL https://bun.sh/install | bash
    source ~/.bashrc 2>/dev/null || source ~/.zshrc 2>/dev/null || true
fi

# Docker
if ! check_command docker; then
    echo -e "${YELLOW}Installing Docker Desktop...${NC}"
    brew install --cask docker
    echo -e "${YELLOW}Please start Docker Desktop manually and run this script again.${NC}"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo -e "${RED}Docker is installed but not running. Please start Docker Desktop.${NC}"
    exit 1
fi

echo ""
echo "Installing project dependencies..."
bun install

echo ""
echo "Starting Docker services..."
cd docker
docker compose up -d
cd ..

echo ""
echo "Waiting for services to be ready..."
sleep 10

echo ""
echo -e "${GREEN}✓ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Open http://localhost to access Appwrite"
echo "2. Create an account and project"
echo "3. Create an API key and add to .env.local"
echo "4. Run 'bun dev' to start development"
echo ""
echo "Useful commands:"
echo "  bun dev        - Start development servers"
echo "  bun run lint   - Run linter"
echo "  bun test       - Run tests"
echo "  docker compose -f docker/docker-compose.yml logs -f  - View logs"
