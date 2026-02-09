#!/bin/bash

# System Health Monitoring Script
# Run with: ./monitor.sh
# Add to crontab for periodic checks: */5 * * * * /path/to/monitor.sh

echo "============================================"
echo "School Management System - Health Check"
echo "Date: $(date)"
echo "============================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js Backend
echo -e "${YELLOW}Checking Backend API...${NC}"
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo -e "${GREEN}✅ Backend API is running${NC}"
else
    echo -e "${RED}❌ Backend API is DOWN${NC}"
fi

# Check PM2 Status
echo ""
echo -e "${YELLOW}Checking PM2 Processes...${NC}"
pm2 list

# Check Nginx Status
echo ""
echo -e "${YELLOW}Checking Nginx...${NC}"
if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✅ Nginx is running${NC}"
else
    echo -e "${RED}❌ Nginx is stopped${NC}"
fi

# Check MySQL Status
echo ""
echo -e "${YELLOW}Checking MySQL...${NC}"
if systemctl is-active --quiet mysql; then
    echo -e "${GREEN}✅ MySQL is running${NC}"
else
    echo -e "${RED}❌ MySQL is stopped${NC}"
fi

# Check Disk Space
echo ""
echo -e "${YELLOW}Disk Usage:${NC}"
df -h / | tail -n 1 | awk '{print "Used: " $3 " / " $2 " (" $5 ")"}'
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo -e "${RED}⚠️  WARNING: Disk usage is above 80%${NC}"
fi

# Check Memory Usage
echo ""
echo -e "${YELLOW}Memory Usage:${NC}"
free -h | grep Mem | awk '{print "Used: " $3 " / " $2}'

# Check CPU Load
echo ""
echo -e "${YELLOW}CPU Load:${NC}"
uptime | awk -F'load average:' '{print $2}'

# Check Active Connections
echo ""
echo -e "${YELLOW}Active Network Connections:${NC}"
ss -tun | grep ESTAB | wc -l | awk '{print $1 " connections"}'

# Check Last 5 Nginx Error Logs
echo ""
echo -e "${YELLOW}Recent Nginx Errors:${NC}"
sudo tail -n 5 /var/log/nginx/school-management-error.log 2>/dev/null || echo "No recent errors"

# Check Last 5 Application Logs
echo ""
echo -e "${YELLOW}Recent Application Logs:${NC}"
pm2 logs school-management-api --lines 5 --nostream 2>/dev/null || echo "No PM2 logs available"

# Database Connection Test
echo ""
echo -e "${YELLOW}Testing Database Connection...${NC}"
mysql -u school_admin -pYourStrongPassword123! -e "SELECT 1" school_management > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database connection successful${NC}"
else
    echo -e "${RED}❌ Database connection failed${NC}"
fi

# Count Database Records
echo ""
echo -e "${YELLOW}Database Statistics:${NC}"
mysql -u school_admin -pYourStrongPassword123! school_management -e "
    SELECT 'Users' as table_name, COUNT(*) as count FROM users
    UNION ALL
    SELECT 'Courses', COUNT(*) FROM courses
    UNION ALL
    SELECT 'Assignments', COUNT(*) FROM assignments
    UNION ALL
    SELECT 'Grades', COUNT(*) FROM grades
    UNION ALL
    SELECT 'Attendance', COUNT(*) FROM attendance
" 2>/dev/null

echo ""
echo "============================================"
echo "Health check completed at $(date)"
echo "============================================"
