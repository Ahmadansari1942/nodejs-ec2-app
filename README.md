

# Node.js EC2 Deployment Guide

Simple Node.js Express application with systemd service configuration for EC2 deployment.

## Application Features

- Express.js REST API
- Health check endpoint
- JSON responses
- Error handling
- Environment configuration

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /api/info` - Application info

## Local Development

```bash
# Install dependencies
npm install

# Run application
npm start

# Run with auto-reload (development)
npm run dev
```

## EC2 Deployment Steps

### Step 1: Launch EC2 Instance

1. Go to AWS Console → EC2 → Launch Instance
2. Choose Amazon Linux 2 or Ubuntu 22.04
3. Select instance type (t2.micro for free tier)
4. Configure security group:
   - SSH (22) - Your IP
   - HTTP (80) - Anywhere
   - Custom TCP (3000) - Anywhere (for testing)
5. Create/select key pair
6. Launch instance

### Step 2: Connect to EC2

```bash
# Connect via SSH
ssh -i "your-key.pem" ec2-user@your-ec2-public-ip

# For Ubuntu use:
ssh -i "your-key.pem" ubuntu@your-ec2-public-ip
```

### Step 3: Install Node.js on EC2

**For Amazon Linux 2:**
```bash
# Update system
sudo yum update -y

# Install Node.js 18.x
curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Verify installation
node --version
npm --version
```

**For Ubuntu:**
```bash
# Update system
sudo apt update
sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 4: Install Git and Clone Repository

```bash
# Install git
sudo yum install git -y    # Amazon Linux
# OR
sudo apt install git -y    # Ubuntu

# Clone your repository
git clone https://github.com/yourusername/your-repo.git

# Navigate to project
cd your-repo
```

### Step 5: Install Application Dependencies

```bash
# Install npm packages
npm install

# Test the application
node app.js
```

Press `Ctrl + C` to stop the test run.

### Step 6: Create Systemd Service

Create service file:

```bash
sudo nano /etc/systemd/system/nodeapp.service
```

Paste this configuration:

```ini
[Unit]
Description=Node.js Application
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/your-repo
ExecStart=/usr/bin/node /home/ec2-user/your-repo/app.js
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=nodeapp
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

**Important:** Update these values:
- `User=ec2-user` (use `ubuntu` for Ubuntu)
- `WorkingDirectory=/home/ec2-user/your-repo` (your actual path)
- `ExecStart=/usr/bin/node /home/ec2-user/your-repo/app.js` (your actual path)

Save and exit (Ctrl + X, then Y, then Enter)

### Step 7: Start and Enable Service

```bash
# Reload systemd
sudo systemctl daemon-reload

# Start the service
sudo systemctl start nodeapp

# Enable service to start on boot
sudo systemctl enable nodeapp

# Check status
sudo systemctl status nodeapp
```

### Step 8: Service Management Commands

```bash
# Check status
sudo systemctl status nodeapp

# Stop service
sudo systemctl stop nodeapp

# Restart service
sudo systemctl restart nodeapp

# View logs
sudo journalctl -u nodeapp -f

# View last 50 lines
sudo journalctl -u nodeapp -n 50

# Disable auto-start
sudo systemctl disable nodeapp
```

### Step 9: Configure Nginx (Optional - Recommended)

Install Nginx:

```bash
# Amazon Linux
sudo amazon-linux-extras install nginx1 -y

# Ubuntu
sudo apt install nginx -y
```

Configure Nginx as reverse proxy:

```bash
sudo nano /etc/nginx/conf.d/nodeapp.conf
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # or EC2 public IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Start Nginx:

```bash
# Test configuration
sudo nginx -t

# Start Nginx
sudo systemctl start nginx

# Enable on boot
sudo systemctl enable nginx

# Restart Nginx
sudo systemctl restart nginx
```

### Step 10: Testing

```bash
# Test locally on EC2
curl http://localhost:3000

# Test from browser
http://your-ec2-public-ip:3000
# OR (if using Nginx)
http://your-ec2-public-ip
```

## Updating Application

```bash
# Pull latest changes
cd /home/ec2-user/your-repo
git pull origin main

# Install new dependencies (if any)
npm install

# Restart service
sudo systemctl restart nodeapp

# Check status
sudo systemctl status nodeapp
```

## Troubleshooting

### Service won't start

```bash
# Check logs
sudo journalctl -u nodeapp -n 100

# Check permissions
ls -la /home/ec2-user/your-repo

# Verify Node.js path
which node

# Test manually
node app.js
```

### Port already in use

```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill process
sudo kill -9 <PID>
```

### Can't access from browser

1. Check Security Group allows port 3000/80
2. Verify service is running: `sudo systemctl status nodeapp`
3. Test locally: `curl http://localhost:3000`
4. Check firewall: `sudo iptables -L`

## Security Recommendations

1. Use Nginx reverse proxy
2. Set up SSL/TLS with Let's Encrypt
3. Use environment variables for sensitive data
4. Keep security group rules minimal
5. Regular system updates
6. Use IAM roles instead of credentials

## Environment Variables

Create `.env` file (don't commit to git):

```bash
NODE_ENV=production
PORT=3000
```

Update service file to load .env file or use Environment= directives.

## License

MIT
