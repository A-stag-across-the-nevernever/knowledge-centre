#!/bin/bash

# =============================================================================
# Neural Nexus Installation Script
# Installs technology knowledge repository for tech companies
# Part of Souls in Development - KnowledgeCentre
# =============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Parse arguments
COMPANY_ID=""
COMPANY_NAME=""
TIER="${TIER:-startup}"

while [[ $# -gt 0 ]]; do
    case $1 in
        --company-id)
            COMPANY_ID="$2"
            shift 2
            ;;
        --company-name)
            COMPANY_NAME="$2"
            shift 2
            ;;
        --tier)
            TIER="$2"
            shift 2
            ;;
        *)
            log_error "Unknown option: $1"
            echo "Usage: $0 --company-id <id> --company-name <name> [--tier <tier>]"
            exit 1
            ;;
    esac
done

# Validate arguments
if [ -z "$COMPANY_ID" ]; then
    log_error "Missing required arguments"
    echo "Usage: $0 --company-id <id> [--company-name <name>] [--tier <startup|enterprise>]"
    echo "Example: $0 --company-id techcorp-001 --company-name \"TechCorp Inc\" --tier startup"
    exit 1
fi

COMPANY_NAME="${COMPANY_NAME:-$COMPANY_ID}"

# Configuration
KC_PATH="$(cd "$(dirname "$0")/.." && pwd)"
INSTALL_PATH="/opt/knowledge-centre/neural-nexus"
DATA_PATH="$INSTALL_PATH/data"
ALT_MIN=0
ALT_MAX=20  # Full access for career professionals

log_info "Neural Nexus Installation"
log_info "Company: $COMPANY_NAME"
log_info "Company ID: $COMPANY_ID"
log_info "Tier: $TIER"
log_info "Altitude Range: $ALT_MIN-$ALT_MAX (Full Access)"
log_info "Installing to: $INSTALL_PATH"

# Check root permissions
if [ "$EUID" -ne 0 ]; then
    log_error "This script must be run as root (use sudo)"
    exit 1
fi

# Create directories
log_info "Creating directories..."
mkdir -p "$INSTALL_PATH"/{config,data,logs,content}
mkdir -p "$DATA_PATH"/{concepts,technologies,best-practices,company-specific}

# Create placeholder Neural Nexus structure
log_info "Creating Neural Nexus repository structure..."
mkdir -p "$INSTALL_PATH/src"
cat > "$INSTALL_PATH/src/server.js" << 'EOF'
// Neural Nexus Server
// Technology knowledge repository

const http = require('http');
const config = require('../config/neural-nexus.json');

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', domain: 'technology' }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

const port = config.port || 8767;
server.listen(port, () => {
  console.log(`Neural Nexus running on port ${port}`);
});
EOF

# Create package.json
cat > "$INSTALL_PATH/package.json" << 'EOF'
{
  "name": "neural-nexus",
  "version": "1.0.0",
  "description": "Technology knowledge repository",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js"
  },
  "dependencies": {}
}
EOF

# Create configuration
log_info "Creating configuration..."
cat > "$INSTALL_PATH/config/neural-nexus.json" << EOF
{
  "domain": "technology",
  "name": "Neural Nexus",
  "company_id": "${COMPANY_ID}",
  "company_name": "${COMPANY_NAME}",
  "tier": "${TIER}",
  "altitude_range": {
    "min": ${ALT_MIN},
    "max": ${ALT_MAX}
  },
  "port": 8767,
  "data_path": "${DATA_PATH}",
  "content_path": "${INSTALL_PATH}/content",
  "features": {
    "code_examples": true,
    "architecture_patterns": true,
    "best_practices": true,
    "company_specific_knowledge": true,
    "real_time_updates": true
  },
  "gatekeeper": {
    "required": true,
    "validate_credentials": true,
    "require_employee_status": true
  },
  "technologies": [
    "javascript",
    "typescript",
    "python",
    "rust",
    "go",
    "react",
    "node.js",
    "docker",
    "kubernetes",
    "aws",
    "cicd"
  ]
}
EOF

# Create content structure
log_info "Creating content directories..."
mkdir -p "$INSTALL_PATH/content"/{javascript,typescript,python,architecture,devops,security}

cat > "$INSTALL_PATH/content/README.md" << EOF
# Neural Nexus Content

Technology knowledge repository for ${COMPANY_NAME}

## Content Areas

- Programming Languages
- Software Architecture
- DevOps & Infrastructure
- Security Best Practices
- Company-Specific Technologies

Altitude Range: ${ALT_MIN}-${ALT_MAX} (All levels)
EOF

# Create systemd service
log_info "Creating systemd service..."
cat > "/etc/systemd/system/neural-nexus.service" << EOF
[Unit]
Description=Neural Nexus Knowledge Repository
After=network.target gatekeeper.service
Requires=gatekeeper.service

[Service]
Type=simple
User=knowledge
Group=knowledge
WorkingDirectory=$INSTALL_PATH
ExecStart=/usr/bin/node $INSTALL_PATH/src/server.js
Restart=always
RestartSec=10
StandardOutput=append:$INSTALL_PATH/logs/neural-nexus.log
StandardError=append:$INSTALL_PATH/logs/neural-nexus.error.log

[Install]
WantedBy=multi-user.target
EOF

# Create knowledge user
if ! id "knowledge" &>/dev/null; then
    log_info "Creating knowledge user..."
    useradd -r -s /bin/false knowledge
fi

# Set permissions
chown -R knowledge:knowledge "$INSTALL_PATH"

log_success "Neural Nexus installed successfully!"
echo ""
echo "Configuration:"
echo "  Domain: Technology"
echo "  Company: $COMPANY_NAME ($COMPANY_ID)"
echo "  Tier: $TIER"
echo "  Altitude Range: $ALT_MIN-$ALT_MAX (Full Access)"
echo "  Install Path: $INSTALL_PATH"
echo "  Config: $INSTALL_PATH/config/neural-nexus.json"
echo ""
echo "Next steps:"
echo "1. Review configuration: $INSTALL_PATH/config/neural-nexus.json"
echo "2. Populate content in: $INSTALL_PATH/content/"
echo "3. Ensure Gatekeeper is running: sudo systemctl status gatekeeper"
echo "4. Start Neural Nexus: sudo systemctl start neural-nexus"
echo "5. Enable at boot: sudo systemctl enable neural-nexus"
echo "6. Check status: sudo systemctl status neural-nexus"
echo "7. View logs: sudo journalctl -u neural-nexus -f"
echo ""
echo "Engineers can now access content through their RosettaAI with company credentials."
echo ""
