# Task Manager App - Urdu Guide

## 📱 Application Kya Hai?

Yeh ek complete **Task Management Application** hai jisme:
- ✅ User Login/Register system
- 📝 Tasks create, edit, delete kar sakte hain
- 📊 Dashboard with statistics
- 🎯 Task priority set kar sakte hain (Low, Medium, High)
- ✅ Task status track kar sakte hain (Pending, In Progress, Completed)
- 🎨 Beautiful UI with animations

## 🎯 Features

### User Features:
1. **Registration** - Naya account bana sakte hain
2. **Login** - Apne account me login ho sakte hain
3. **Dashboard** - Apne tasks ka overview dekh sakte hain
4. **Task Create** - Naye tasks add kar sakte hain
5. **Task Edit** - Tasks ko edit kar sakte hain
6. **Task Delete** - Tasks ko delete kar sakte hain
7. **Task Filter** - Tasks ko status ke hisab se filter kar sakte hain

### Demo Account:
```
Email: admin@example.com
Password: admin123
```

## 📁 Files Structure

```
task-manager-app/
├── app.js                 # Main server file
├── package.json           # Dependencies
├── routes/                # Routes folder
│   ├── auth.js           # Login/Register routes
│   ├── tasks.js          # Task management routes
│   └── api.js            # API endpoints
├── views/                 # HTML templates (EJS)
│   ├── index.ejs         # Home page
│   ├── login.ejs         # Login page
│   ├── dashboard.ejs     # Dashboard
│   └── tasks.ejs         # Tasks page
├── public/                # Static files
│   ├── css/              # Stylesheets
│   └── js/               # JavaScript files
└── deploy.sh             # Deployment script
```

## 🚀 EC2 pe Deploy Kaise Karein

### Step 1: EC2 Instance Banayein

1. AWS Console me jao → EC2 → Launch Instance
2. **Amazon Linux 2** ya **Ubuntu 22.04** choose karein
3. Instance type: **t2.micro** (free tier)
4. Security Group me ye ports open karein:
   - Port 22 (SSH) - Apni IP se
   - Port 80 (HTTP) - Har jagah se (0.0.0.0/0)
   - Port 3000 - Har jagah se (0.0.0.0/0)
5. Key pair create/select karein
6. Launch karein

### Step 2: EC2 se Connect Karein

```bash
ssh -i "your-key.pem" ec2-user@your-ec2-public-ip
```

### Step 3: Node.js Install Karein

**Amazon Linux ke liye:**
```bash
# System update
sudo yum update -y

# Node.js install
curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Check version
node --version
npm --version
```

**Ubuntu ke liye:**
```bash
# System update
sudo apt update
sudo apt upgrade -y

# Node.js install
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Check version
node --version
npm --version
```

### Step 4: Git Install aur Code Download

```bash
# Git install
sudo yum install git -y    # Amazon Linux
sudo apt install git -y    # Ubuntu

# Repository clone
git clone https://github.com/yourusername/task-manager-app.git
cd task-manager-app
```

### Step 5: Automatic Deployment (Sabse Aasan)

```bash
# Script ko executable banayein
chmod +x deploy.sh

# Deploy script run karein
./deploy.sh
```

✅ **Ho gaya!** Script automatically sab kuch setup kar dega:
- Dependencies install
- Service create
- Service start
- Auto-start enable

### Step 6: Test Karein

```bash
# Status check
sudo systemctl status nodeapp

# Local test
curl http://localhost:3000

# Browser me test (apni EC2 IP use karein)
http://YOUR_EC2_PUBLIC_IP:3000
```

## 🔧 Service Commands (Zaroori)

```bash
# Service status check
sudo systemctl status nodeapp

# Service start
sudo systemctl start nodeapp

# Service stop
sudo systemctl stop nodeapp

# Service restart
sudo systemctl restart nodeapp

# Logs dekhne ke liye
sudo journalctl -u nodeapp -f

# Last 50 lines dekho
sudo journalctl -u nodeapp -n 50
```

## 🔄 Code Update Kaise Karein

Jab aap apne GitHub repo me changes push karein:

```bash
# Project folder me jao
cd ~/task-manager-app

# Latest code pull karo
git pull origin main

# Agar naye dependencies hain to install karo
npm install

# Service restart karo
sudo systemctl restart nodeapp

# Status check karo
sudo systemctl status nodeapp
```

## 📊 Application Use Kaise Karein

### 1. Home Page
- Browser me jao: `http://YOUR_EC2_IP:3000`
- Features dekh sakte hain
- Login ya Sign Up button click karein

### 2. Register (Naya Account)
- Sign Up button pe click karein
- Username, Email, Password enter karein
- Password kam se kam 6 characters hona chahiye
- Sign Up button click karein

### 3. Login
- Login button pe click karein
- Email aur Password enter karein
- Demo account use kar sakte hain:
  - Email: `admin@example.com`
  - Password: `admin123`

### 4. Dashboard
- Login ke baad dashboard open hoga
- Yahan pe statistics dikhegi:
  - Total Tasks
  - Completed Tasks
  - Pending Tasks
  - In Progress Tasks
- Quick action buttons honge

### 5. Task Create Karna
- "Create New Task" button pe click karein
- Task title enter karein
- Description likhen
- Priority select karein (Low/Medium/High)
- "Create Task" button click karein

### 6. Tasks Dekhna
- "My Tasks" menu pe click karein
- Sare tasks dikhengi cards me
- Filter buttons se tasks filter kar sakte hain:
  - All Tasks
  - Pending
  - In Progress
  - Completed

### 7. Task Edit Karna
- Kisi task pe "Edit" button click karein
- Details change karein
- Status bhi change kar sakte hain
- "Update Task" click karein

### 8. Task Delete Karna
- Kisi task pe "Delete" button click karein
- Confirmation aayegi
- "OK" click karein

### 9. Task Status Change
- Task card me dropdown se status select karein
- Automatically update ho jayega:
  - Pending → In Progress → Completed

## 🎨 UI Features

- **Animations**: Smooth animations har jagah
- **Responsive**: Mobile, tablet, desktop sabpe kaam karega
- **Modern Design**: Gradient colors aur clean UI
- **Real-time Filtering**: Tasks instantly filter hongi
- **Interactive Cards**: Hover effects aur transitions

## ⚠️ Common Problems aur Solutions

### Problem 1: Service start nahi ho rahi
```bash
# Solution: Logs check karo
sudo journalctl -u nodeapp -n 50

# Manually test karo
node app.js

# Agar error dikhe to fix karo aur restart
sudo systemctl restart nodeapp
```

### Problem 2: Browser me open nahi ho raha
**Solution:**
1. Security Group check karo - port 3000 open hai?
2. Service running hai? `sudo systemctl status nodeapp`
3. Locally test karo: `curl http://localhost:3000`
4. EC2 public IP sahi use kar rahe ho?

### Problem 3: Port already in use
```bash
# Solution: Process find karo
sudo lsof -i :3000

# Process kill karo
sudo kill -9 <PID>

# Service restart karo
sudo systemctl restart nodeapp
```

### Problem 4: Dependencies install nahi ho rahe
```bash
# Solution: npm cache clean karo
npm cache clean --force

# Phir se install karo
npm install
```

## 🔒 Security Tips

1. **Production me:**
   - Environment variables use karein
   - Strong session secret use karein
   - Database add karein (MongoDB/PostgreSQL)

2. **SSH Access:**
   - Key pair safe rakhein
   - .pem file ki permissions: `chmod 400 your-key.pem`

3. **Firewall:**
   - Sirf zaroori ports hi open rakhein
   - SSH ko apni IP se hi allow karein

## 📱 Next Steps (Future Improvements)

Aap in features ko add kar sakte hain:
- MongoDB database integration
- Email notifications
- File upload
- Task sharing between users
- Dark mode
- Search functionality
- Categories aur tags

## 🆘 Help Chahiye?

- Logs dekho: `sudo journalctl -u nodeapp -f`
- Manual test karo: `node app.js`
- README.md file detail me padhein

## ✅ Final Checklist

- [ ] EC2 instance running hai
- [ ] Security Group ports open hain
- [ ] Node.js install hai
- [ ] Code clone ho gaya
- [ ] Dependencies install hain
- [ ] Service running hai
- [ ] Browser me open ho raha hai
- [ ] Login/Register kaam kar raha hai
- [ ] Tasks create/edit/delete ho rahe hain

Sab kuch theek hai? Congratulations! 🎉

---

**Made with ❤️ for Pakistani Developers**

Koi problem ho to README.md aur COMMANDS.md files check karein!