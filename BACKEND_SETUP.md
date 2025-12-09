# Backend Setup Guide - SQLite Version

## ✅ No Database Installation Required!

SQLite is file-based and comes with Node.js - no separate installation needed!

---

## Quick Start (3 Steps)

### 1. Install Node.js
Download and install: https://nodejs.org/ (v16 or higher)

Verify installation:
```bash
node --version
npm --version
```

### 2. Install Dependencies
```bash
cd C:\Users\yuuge\OneDrive\Desktop\ADMIN\backend
npm install
```

### 3. Start Server
```bash
npm start
```

You should see:
```
✅ SQLite database initialized
✅ Seeded 10 users successfully
🚀 Server running on http://localhost:3000
📊 API available at http://localhost:3000/api
💾 Using SQLite database
```

**That's it!** The database is automatically created with all your users.

---

## Configuration (Optional)

Create `.env` file in backend folder:
```
PORT=3000
SESSION_SECRET=my-secret-key
MAX_FILE_SIZE=10485760
```

---

## Test the API

### Check if server is running:
Open browser: http://localhost:3000/api/health

### Test login:
Use any API tool or browser console:
```javascript
fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'aadithyanrs9e@gmail.com',
        password: 'chair123'
    }),
    credentials: 'include'
})
```

---

## Database File

The SQLite database is stored as:
`C:\Users\yuuge\OneDrive\Desktop\ADMIN\backend\database.sqlite`

- This is a single file containing all your data
- Can be backed up easily
- Can be opened with SQLite browser tools

---

## Pre-loaded Users

All 10 users are automatically created:
- aadithyanrs9e@gmail.com / chair123 (Chair)
- archasunil777@gmail.com / vicechair123 (Vice Chair)
- ...and 8 more

---

## Next Steps

1. ✅ Start backend server: `npm start`
2. ⏳ Update frontend to use API (coming next)
3. ⏳ Test multi-user functionality

---

## Troubleshooting

### npm install fails?
- Make sure Node.js is installed
- Try: `npm install --force`

### Port 3000 already in use?
- Change PORT in `.env` to 3001
- Or stop other apps using port 3000

### Database not creating?
- Check write permissions in backend folder
- Look for `database.sqlite` file

---

🎉 **No MySQL/PostgreSQL needed - SQLite just works!**
