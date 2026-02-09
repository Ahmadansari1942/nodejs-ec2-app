# 🗄️ MySQL Database Integration Guide

Complete guide to add MySQL database to your Task Manager app on EC2.

## 📋 What Will Happen:
- ✅ Install MySQL Server on EC2
- ✅ Create database and tables
- ✅ Update application code to use MySQL
- ✅ Store all data permanently in database
- ✅ Migrate from in-memory to database storage

---

## 🚀 Step-by-Step Deployment

### Step 1: Connect to EC2
```bash
ssh -i TASKS.pem ubuntu@18.234.131.63
```

---

### Step 2: Install MySQL Server
```bash
# Update system
sudo apt update

# Install MySQL
sudo apt install -y mysql-server

# Start MySQL service
sudo systemctl start mysql
sudo systemctl enable mysql

# Check status
sudo systemctl status mysql
```

---

### Step 3: Secure MySQL and Create Database
```bash
# Login to MySQL as root
sudo mysql

# Then run these SQL commands:
```

```sql
-- Set root password
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root123';
FLUSH PRIVILEGES;

-- Create database
CREATE DATABASE taskmanager;
USE taskmanager;

-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create tasks table
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status ENUM('pending', 'in-progress', 'completed') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password) 
VALUES ('admin', 'admin@example.com', '$2a$10$8K1p/a0dL3JKv5SXdEVZruPvHzxCONTvAQxH6QWCKY1C3DXq6Qkym');

-- Insert sample tasks
INSERT INTO tasks (user_id, title, description, status, priority) VALUES
(1, 'Complete project documentation', 'Write complete docs', 'pending', 'high'),
(1, 'Review pull requests', 'Review and merge PRs', 'in-progress', 'medium'),
(1, 'Deploy to production', 'Deploy to EC2', 'completed', 'high');

-- Verify tables
SHOW TABLES;
SELECT * FROM users;
SELECT * FROM tasks;

-- Exit MySQL
EXIT;
```

---

### Step 4: Update Application Code

```bash
cd ~/nodejs-ec2-app

# Create config folder
mkdir -p config

# Install MySQL package
npm install mysql2
```

Now create/update these files:

**1. Create `config/database.js`:**
```bash
nano config/database.js
```
(Paste the database.js content from above)

**2. Update `routes/auth.js`:**
```bash
nano routes/auth.js
```
(Replace with auth-mysql.js content)

**3. Update `routes/tasks.js`:**
```bash
nano routes/tasks.js
```
(Replace with tasks-mysql.js content)

**4. Update `routes/api.js`:**
```bash
nano routes/api.js
```
(Replace with api-mysql.js content)

**5. Update `app.js`:**
```bash
nano app.js
```
(Update to include database connection test)

---

### Step 5: Test Database Connection

```bash
cd ~/nodejs-ec2-app

# Test MySQL connection
mysql -u root -proot123 -e "USE taskmanager; SHOW TABLES;"

# Test application
node app.js
```

Press Ctrl+C to stop, then:

---

### Step 6: Restart Service

```bash
# Restart the service
sudo systemctl restart nodeapp

# Check status
sudo systemctl status nodeapp

# View logs
sudo journalctl -u nodeapp -n 50
```

---

### Step 7: Test Application

**Browser:**
```
http://18.234.131.63:3000
```

**Login:**
- Email: `admin@example.com`
- Password: `admin123`

**Test Features:**
1. ✅ Login with existing user
2. ✅ Create new tasks (will save to MySQL)
3. ✅ Edit tasks (will update in MySQL)
4. ✅ Delete tasks (will remove from MySQL)
5. ✅ Logout and login again (data persists!)

---

## 🔍 Verify Data Persistence

```bash
# Login to MySQL
mysql -u root -proot123

# Check data
USE taskmanager;
SELECT * FROM users;
SELECT * FROM tasks;
EXIT;
```

---

## 📊 MySQL Management Commands

```bash
# Start MySQL
sudo systemctl start mysql

# Stop MySQL
sudo systemctl stop mysql

# Restart MySQL
sudo systemctl restart mysql

# Check status
sudo systemctl status mysql

# Login to MySQL
mysql -u root -proot123

# Backup database
mysqldump -u root -proot123 taskmanager > backup.sql

# Restore database
mysql -u root -proot123 taskmanager < backup.sql
```

---

## 🔧 Useful SQL Queries

```sql
-- See all users
SELECT * FROM users;

-- See all tasks
SELECT * FROM tasks;

-- See tasks with user info
SELECT t.*, u.username, u.email 
FROM tasks t 
JOIN users u ON t.user_id = u.id;

-- Count tasks by status
SELECT status, COUNT(*) as count 
FROM tasks 
GROUP BY status;

-- Delete all tasks
DELETE FROM tasks;

-- Reset auto increment
ALTER TABLE tasks AUTO_INCREMENT = 1;
```

---

## ⚠️ Troubleshooting

### MySQL won't start:
```bash
sudo systemctl status mysql
sudo journalctl -u mysql -n 50
```

### Can't connect to database:
```bash
# Check MySQL is running
sudo systemctl status mysql

# Check credentials
mysql -u root -proot123

# Reset root password if needed
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root123';
FLUSH PRIVILEGES;
```

### Application can't connect:
```bash
# Check logs
sudo journalctl -u nodeapp -n 50

# Test database config
node -e "const db = require('./config/database'); db.testConnection();"
```

---

## 🎯 Benefits of MySQL Integration

✅ **Permanent Storage** - Data survives server restarts
✅ **Scalability** - Handle thousands of users and tasks
✅ **Data Integrity** - Foreign keys and constraints
✅ **Backup & Recovery** - Easy database backups
✅ **Query Performance** - Indexed searches
✅ **Multi-user Support** - Concurrent access
✅ **Production Ready** - Industry standard database

---

## 📈 Next Steps (Optional)

1. **Environment Variables:**
   ```bash
   # Create .env file
   nano .env
   ```
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=root123
   DB_NAME=taskmanager
   PORT=3000
   SESSION_SECRET=your-secret-key
   ```

2. **SSL/TLS for MySQL:**
   - Encrypt database connections

3. **Database Indexing:**
   - Add indexes for better performance

4. **Connection Pooling:**
   - Already implemented in database.js

5. **Automated Backups:**
   ```bash
   # Create backup script
   mysqldump -u root -proot123 taskmanager > /home/ubuntu/backups/$(date +%Y%m%d).sql
   ```

---

## ✅ Success Checklist

- [ ] MySQL server installed and running
- [ ] Database and tables created
- [ ] Sample data inserted
- [ ] mysql2 package installed
- [ ] Application code updated
- [ ] Service restarted successfully
- [ ] Can login and see existing data
- [ ] Can create new tasks (saved to DB)
- [ ] Can edit tasks (updated in DB)
- [ ] Can delete tasks (removed from DB)
- [ ] Data persists after logout/login
- [ ] Dashboard shows correct stats

---

**🎉 Congratulations! Your app now uses MySQL for permanent data storage!**
