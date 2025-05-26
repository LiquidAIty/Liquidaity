@echo off
echo 🧹 Clearing Nx cache...
call npx nx reset

echo 🛑 Killing ports...
call npx kill-port 3333 4200 4300 5555

echo 🔨 Rebuilding API...
call npx nx build api

echo 🔨 Rebuilding Client...
call npx nx build client

echo 🚀 Starting API server...
start cmd /k "npx nx serve api"

timeout /t 2 >nul
echo 🖥️ Starting Client server...
start cmd /k "npx nx serve client"

timeout /t 2 >nul
echo 🔍 Launching Prisma Studio...
start cmd /k "npx prisma studio"

echo 🧠 Launching Nx Graph...
start cmd /k "npx nx graph"

