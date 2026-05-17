# AgroAssist Frontend

AI-powered crop disease detection app for Indian farmers.

## Setup

```bash
npm install
```

## Important — Set your backend IP

Open `src/constants/api.js` and change `LOCAL_IP` to your computer's IP address:
```js
const LOCAL_IP = '192.168.1.9'  // ← change this
```

Find your IP with: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)

## Run

```bash
# Start backend first
cd backend && uvicorn app.main:app --reload --port 8000

# Start frontend
npx expo start

# Press 'a' for Android, 'w' for Web, scan QR for phone
```

## Features
- Phone OTP authentication
- Crop disease detection with AI
- Chat with AI advisor
- Multilanguage: English, Marathi, Hindi
- Weather updates
- Treatment recommendations

## Screens
- Phone → OTP → Complete Profile
- Home Dashboard
- Disease Detection (Camera/Gallery)
- Results with treatment plan
- AI Chat advisor
- Profile & settings
