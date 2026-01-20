# 🚀 MERN Deployment Guide - MongoDB Atlas, Render & Vercel

## Project Overview
- **Backend**: Node.js + Express (Render)
- **Frontend**: React (Vercel)
- **Database**: MongoDB Atlas
- **API Port**: 10000

---

## ✅ Phase 1: Local Development Setup

### 1.1 Backend Configuration

**File**: `backend/.env`
```env
PORT=10000
MONGO_URI=mongodb+srv://sms:Talemwa123@sms.txt8o0u.mongodb.net/sms?retryWrites=true&w=majority
JWT_SECRET=SuperSecretJWT123
NODE_ENV=development
```

**Start Backend Locally**:
```bash
cd backend
npm install
npm run dev
```

✅ You should see:
```
✅ Connected to MongoDB Atlas
✅ Server started at port 10000
📡 API ready: http://localhost:10000
```

### 1.2 Frontend Configuration

**File**: `frontend/.env`
```env
REACT_APP_BASE_URL=http://localhost:10000
```

**Start Frontend Locally**:
```bash
cd frontend
npm install
npm start
```

✅ Open http://localhost:3000 and test login/registration

**Test the Connection**:
- Try logging in with a test account
- Check browser DevTools → Network tab
- Verify API calls go to `http://localhost:10000`

---

## 🌍 Phase 2: Deploy Backend to Render

### 2.1 Prepare for Deployment

1. **Install Render CLI** (optional):
   ```bash
   npm install -g render
   ```

2. **Ensure backend is ready**:
   - ✅ Backend runs locally with MongoDB Atlas
   - ✅ All environment variables are set
   - ✅ package.json has proper scripts

### 2.2 Deploy to Render

1. Go to [https://render.com](https://render.com)
2. Sign up or log in
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository (or paste Git URL)
5. Configure:

   | Setting | Value |
   |---------|-------|
   | **Name** | `sms-backend` |
   | **Root Directory** | `backend` |
   | **Environment** | `Node` |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |
   | **Plan** | `Free` (or paid) |

6. Add Environment Variables:
   ```
   PORT = 10000
   MONGO_URI = mongodb+srv://sms:Talemwa123@sms.txt8o0u.mongodb.net/sms?retryWrites=true&w=majority
   JWT_SECRET = SuperSecretJWT123
   NODE_ENV = production
   ```

7. Click **"Create Web Service"**

⏳ Wait 3-5 minutes for deployment

✅ You'll get a URL like: `https://sms-backend.onrender.com`

### 2.3 Verify Backend Deployment

```bash
curl https://sms-backend.onrender.com/
```

Or visit in browser and check console for MongoDB connection message.

---

## 🎨 Phase 3: Update Frontend for Production

### 3.1 Update Frontend Environment

**File**: `frontend/.env.production`
```env
REACT_APP_BASE_URL=https://sms-backend.onrender.com
```

**File**: `frontend/.env` (development stays the same)
```env
REACT_APP_BASE_URL=http://localhost:10000
```

### 3.2 Build Frontend Locally (Test)

```bash
cd frontend
npm run build
```

✅ Should complete without errors
✅ Creates `build/` directory

### 3.3 Verify Build Works

```bash
npm install -g serve
serve -s build -l 3000
```

Visit http://localhost:3000 and test login/data fetching

---

## 🌐 Phase 4: Deploy Frontend to Vercel

### 4.1 Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up or log in (recommend GitHub auth)
3. Click **"New Project"**
4. Import your GitHub repository
5. Configure:

   | Setting | Value |
   |---------|-------|
   | **Project Name** | `sms-frontend` |
   | **Framework** | `React` |
   | **Root Directory** | `frontend` |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `build` |

6. Add Environment Variables:
   ```
   REACT_APP_BASE_URL = https://sms-backend.onrender.com
   ```

7. Click **"Deploy"**

⏳ Wait 2-3 minutes for deployment

✅ You'll get a URL like: `https://sms-frontend.vercel.app`

### 4.2 Verify Frontend Deployment

1. Visit your Vercel URL
2. Test login functionality
3. Check browser DevTools → Network
4. Verify API calls go to `https://sms-backend.onrender.com`

---

## 🔗 Integration Testing

### Full End-to-End Test

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Visit frontend URL | Page loads |
| 2 | Enter login credentials | API call succeeds |
| 3 | Check MongoDB | Data appears in Atlas |
| 4 | Refresh page | Data persists |
| 5 | Try registration | New user created in MongoDB |

### Debug Checklist

| Issue | Solution |
|-------|----------|
| "API not found" error | Verify `REACT_APP_BASE_URL` in Vercel |
| MongoDB connection fails | Check `MONGO_URI` in Render |
| CORS errors | Backend has `cors()` middleware enabled |
| 404 routes | Check backend routing in `routes/route.js` |

---

## 📝 Important Files

### Backend
- `.env` - Local development variables
- `.env.production` - Render production variables
- `index.js` - Main server file
- `package.json` - Dependencies & scripts

### Frontend
- `.env` - Local development (API_URL=localhost:10000)
- `.env.production` - Production (API_URL=Render URL)
- `src/redux/userRelated/userHandle.js` - Uses REACT_APP_BASE_URL

---

## 🔐 Security Notes

### ⚠️ NEVER commit `.env` files to GitHub

**Already ignored**:
```
.env
.env.local
.env.production.local
```

### Store credentials in deployment platform

- **Render**: Dashboard → Environment Variables
- **Vercel**: Project Settings → Environment Variables
- **MongoDB Atlas**: Already secured, connection string is safe with IP whitelist

---

## 🚀 Deployment Checklist

- [ ] Backend .env configured locally
- [ ] Frontend .env pointing to localhost:10000
- [ ] Backend runs with `npm run dev` locally
- [ ] Frontend runs with `npm start` locally
- [ ] Backend deploys to Render successfully
- [ ] Render shows "Connected to MongoDB Atlas" in logs
- [ ] Frontend .env.production configured with Render URL
- [ ] Frontend deploys to Vercel successfully
- [ ] Login works on live frontend
- [ ] Data appears in MongoDB Atlas
- [ ] No CORS errors in browser console
- [ ] Render and Vercel environment variables are set

---

## 🎯 Your Deployment URLs

Once deployed, you'll have:

```
Frontend:  https://sms-frontend.vercel.app
Backend:   https://sms-backend.onrender.com
Database:  MongoDB Atlas (sms cluster)
```

---

## 📞 Troubleshooting

### Backend won't start locally
```bash
# Check if port 10000 is available
lsof -i :10000  # Mac/Linux
netstat -ano | findstr :10000  # Windows
```

### MongoDB connection fails
```bash
# Verify connection string
mongosh "mongodb+srv://sms:Talemwa123@sms.txt8o0u.mongodb.net/sms"
```

### Frontend can't reach backend
1. Check REACT_APP_BASE_URL in Network tab
2. Verify backend is running
3. Check CORS is enabled in backend
4. Test with curl: `curl https://sms-backend.onrender.com/`

### Render free tier limitation
- Free tier sleeps after 15 minutes of inactivity
- First request takes ~30 seconds to wake up
- Upgrade to paid for always-on

---

## 📚 Useful Commands

### Local Testing
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm start

# Terminal 3: Test API
curl http://localhost:10000/
```

### Production Build
```bash
# Frontend
cd frontend && npm run build

# Backend (already simple with npm start)
cd backend && npm start
```

### View Logs
```bash
# Render logs
# Dashboard → sms-backend → Logs

# Vercel logs
# Dashboard → sms-frontend → Deployments → Logs
```

---

**✅ Deployment Complete!** Your MERN app is now live and ready for demonstration.
