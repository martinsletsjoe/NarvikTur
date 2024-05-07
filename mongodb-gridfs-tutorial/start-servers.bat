@echo off
:: Navigate to the backend directory and start the server
cd "C:\Users\M\Desktop\Martin\repos\NarvikTur\mongodb-gridfs-tutorial"
START /B node server.js

:: Navigate to the Vite frontend directory
cd "frontend/my-gridfs-frontend"
START /B npm run dev
