#!/bin/bash

echo "========================================="
echo "Node.js Application Deployment Script"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get current user
CURRENT_USER=$(whoami)
APP_DIR=$(pwd)

echo -e "${YELLOW}Current user: $CURRENT_USER${NC}"
echo -e "${YELLOW}Application directory: $APP_DIR${NC}"
echo ""

# Install dependencies
echo -e "${GREEN}Step 1: Installing npm dependencies...${NC}"
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencies installed successfully${NC}"
else
    echo -e "${RED}✗ Failed to install dependencies${NC}"
    exit 1
fi
echo ""

# Create systemd service file
echo -e "${GREEN}Step 2: Creating systemd service file...${NC}"
sudo tee /etc/systemd/system/nodeapp.service > /dev/null <<EOF
[Unit]
Description=Node.js Application
After=network.target

[Service]
Type=simple
User=$CURRENT_USER
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/node $APP_DIR/app.js
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=nodeapp
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Service file created at /etc/systemd/system/nodeapp.service${NC}"
else
    echo -e "${RED}✗ Failed to create service file${NC}"
    exit 1
fi
echo ""

# Reload systemd
echo -e "${GREEN}Step 3: Reloading systemd daemon...${NC}"
sudo systemctl daemon-reload
echo -e "${GREEN}✓ Systemd daemon reloaded${NC}"
echo ""

# Start service
echo -e "${GREEN}Step 4: Starting the service...${NC}"
sudo systemctl start nodeapp
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Service started successfully${NC}"
else
    echo -e "${RED}✗ Failed to start service${NC}"
    exit 1
fi
echo ""

# Enable service
echo -e "${GREEN}Step 5: Enabling service to start on boot...${NC}"
sudo systemctl enable nodeapp
echo -e "${GREEN}✓ Service enabled${NC}"
echo ""

# Check status
echo -e "${GREEN}Step 6: Checking service status...${NC}"
sudo systemctl status nodeapp --no-pager
echo ""

# Test application
echo -e "${GREEN}Step 7: Testing application...${NC}"
sleep 2
RESPONSE=$(curl -s http://localhost:3000)
if [ -n "$RESPONSE" ]; then
    echo -e "${GREEN}✓ Application is responding${NC}"
    echo "Response: $RESPONSE"
else
    echo -e "${RED}✗ Application is not responding${NC}"
fi
echo ""

echo "========================================="
echo -e "${GREEN}Deployment completed!${NC}"
echo "========================================="
echo ""
echo "Service management commands:"
echo "  Status:  sudo systemctl status nodeapp"
echo "  Stop:    sudo systemctl stop nodeapp"
echo "  Restart: sudo systemctl restart nodeapp"
echo "  Logs:    sudo journalctl -u nodeapp -f"
echo ""
echo "Test your application:"
echo "  Local:   curl http://localhost:3000"
echo "  Browser: http://YOUR_EC2_PUBLIC_IP:3000"
echo ""
