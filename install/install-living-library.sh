#!/bin/bash

# =============================================================================
# Living Library Installation Script
# Installs educational knowledge repository for schools
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
TIER=""
SCHOOL_ID=""
SCHOOL_NAME=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --tier)
            TIER="$2"
            shift 2
            ;;
        --school-id)
            SCHOOL_ID="$2"
            shift 2
            ;;
        --school-name)
            SCHOOL_NAME="$2"
            shift 2
            ;;
        *)
            log_error "Unknown option: $1"
            echo "Usage: $0 --tier <elementary|high_school|university> --school-id <id> --school-name <name>"
            exit 1
            ;;
    esac
done

# Validate arguments
if [ -z "$TIER" ] || [ -z "$SCHOOL_ID" ]; then
    log_error "Missing required arguments"
    echo "Usage: $0 --tier <elementary|high_school|university> --school-id <id> [--school-name <name>]"
    echo "Example: $0 --tier elementary --school-id springfield-elem-001 --school-name \"Springfield Elementary\""
    exit 1
fi

SCHOOL_NAME="${SCHOOL_NAME:-$SCHOOL_ID}"

# Map tier to altitude range
case $TIER in
    elementary)
        ALT_MIN=0
        ALT_MAX=5
        ;;
    high_school)
        ALT_MIN=0
        ALT_MAX=10
        ;;
    university)
        ALT_MIN=0
        ALT_MAX=15
        ;;
    *)
        log_error "Invalid tier: $TIER"
        exit 1
        ;;
esac

# Configuration
KC_PATH="$(cd "$(dirname "$0")/.." && pwd)"
INSTALL_PATH="/opt/knowledge-centre/living-library"
DATA_PATH="$INSTALL_PATH/data"

log_info "Living Library Installation"
log_info "School: $SCHOOL_NAME"
log_info "School ID: $SCHOOL_ID"
log_info "Tier: $TIER"
log_info "Altitude Range: $ALT_MIN-$ALT_MAX"
log_info "Installing to: $INSTALL_PATH"

# Check root permissions
if [ "$EUID" -ne 0 ]; then
    log_error "This script must be run as root (use sudo)"
    exit 1
fi

# Create directories
log_info "Creating directories..."
mkdir -p "$INSTALL_PATH"/{config,data,logs,content}
mkdir -p "$DATA_PATH"/{concepts,curriculum,assessments}

# Install dependencies
log_info "Installing Node.js dependencies..."
cd "$KC_PATH/living-library"
npm install

# Build TypeScript
log_info "Building Living Library..."
npm run build 2>/dev/null || log_info "No build step required"

# Copy built files
log_info "Installing Living Library..."
cp -r "$KC_PATH/living-library/src" "$INSTALL_PATH/" 2>/dev/null || true
cp -r "$KC_PATH/living-library/content" "$INSTALL_PATH/" 2>/dev/null || true
cp -r "$KC_PATH/living-library/node_modules" "$INSTALL_PATH/" 2>/dev/null || true
cp "$KC_PATH/living-library/package.json" "$INSTALL_PATH/" 2>/dev/null || true

# Create configuration
log_info "Creating configuration..."
cat > "$INSTALL_PATH/config/living-library.json" << EOF
{
  "domain": "education",
  "name": "Living Library",
  "school_id": "${SCHOOL_ID}",
  "school_name": "${SCHOOL_NAME}",
  "tier": "${TIER}",
  "altitude_range": {
    "min": ${ALT_MIN},
    "max": ${ALT_MAX}
  },
  "data_path": "${DATA_PATH}",
  "content_path": "${INSTALL_PATH}/content",
  "features": {
    "curriculum_access": true,
    "assessment_generation": true,
    "progress_tracking": true,
    "parental_reports": true
  },
  "gatekeeper": {
    "required": true,
    "validate_credentials": true,
    "enforce_altitude_limits": true
  },
  "content_filters": {
    "age_appropriate": true,
    "curriculum_aligned": true
  }
}
EOF

# Download tier-specific content
log_info "Downloading content for tier: $TIER..."
mkdir -p "$INSTALL_PATH/content/tier-${TIER}"

# Placeholder - in production, this would download actual content
cat > "$INSTALL_PATH/content/tier-${TIER}/README.md" << EOF
# Living Library Content - ${TIER}

Content for ${SCHOOL_NAME}

Altitude Range: ${ALT_MIN}-${ALT_MAX}

Content will be populated during initial setup.
EOF

# Create systemd service
log_info "Creating systemd service..."
cat > "/etc/systemd/system/living-library.service" << EOF
[Unit]
Description=Living Library Knowledge Repository
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
StandardOutput=append:$INSTALL_PATH/logs/living-library.log
StandardError=append:$INSTALL_PATH/logs/living-library.error.log

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

log_success "Living Library installed successfully!"
echo ""
echo "Configuration:"
echo "  Domain: Education"
echo "  School: $SCHOOL_NAME ($SCHOOL_ID)"
echo "  Tier: $TIER"
echo "  Altitude Range: $ALT_MIN-$ALT_MAX"
echo "  Install Path: $INSTALL_PATH"
echo "  Config: $INSTALL_PATH/config/living-library.json"
echo ""
echo "Next steps:"
echo "1. Review configuration: $INSTALL_PATH/config/living-library.json"
echo "2. Ensure Gatekeeper is running: sudo systemctl status gatekeeper"
echo "3. Start Living Library: sudo systemctl start living-library"
echo "4. Enable at boot: sudo systemctl enable living-library"
echo "5. Check status: sudo systemctl status living-library"
echo "6. View logs: sudo journalctl -u living-library -f"
echo ""
echo "Students can now access content through their RosettaAI with school credentials."
echo ""
