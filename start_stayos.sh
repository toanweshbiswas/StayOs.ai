#!/bin/bash
# StayOs — Start All Services
# Run this script from Terminal to start backend + dashboard + frontend

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

STAYOS="/Users/anweshbiswas/Desktop/StayOs"

echo "🛑 Killing any existing StayOs processes..."
pkill -f "ts-node-dev.*stayos" 2>/dev/null
pkill -f "vite" 2>/dev/null
sleep 1

echo ""
echo "🚀 Starting Backend (port 3001)..."
osascript -e 'tell application "Terminal"
  activate
  do script "export NVM_DIR=\"$HOME/.nvm\"; [ -s \"$NVM_DIR/nvm.sh\" ] && . \"$NVM_DIR/nvm.sh\"; export PATH=\"/opt/homebrew/bin:/usr/local/bin:$PATH\"; cd /Users/anweshbiswas/Desktop/StayOs/backend && npm run dev"
  set the custom title of front window to "StayOs Backend"
end tell'

sleep 2

echo "🎨 Starting Dashboard (port 5174)..."
osascript -e 'tell application "Terminal"
  activate
  do script "export NVM_DIR=\"$HOME/.nvm\"; [ -s \"$NVM_DIR/nvm.sh\" ] && . \"$NVM_DIR/nvm.sh\"; export PATH=\"/opt/homebrew/bin:/usr/local/bin:$PATH\"; cd /Users/anweshbiswas/Desktop/StayOs/dashboard && npm run dev"
  set the custom title of front window to "StayOs Dashboard"
end tell'

sleep 2

echo "🌐 Starting Frontend (port 3000)..."
osascript -e 'tell application "Terminal"
  activate
  do script "export NVM_DIR=\"$HOME/.nvm\"; [ -s \"$NVM_DIR/nvm.sh\" ] && . \"$NVM_DIR/nvm.sh\"; export PATH=\"/opt/homebrew/bin:/usr/local/bin:$PATH\"; cd \"/Users/anweshbiswas/Desktop/StayOs/stayos-_-premium-furnished-rentals-&-managed-living (1)\" && npm run dev"
  set the custom title of front window to "StayOs Frontend"
end tell'

echo ""
echo "✅ All services starting in separate Terminal windows!"
echo ""
echo "   Backend:   http://localhost:3001/api/health"
echo "   Dashboard: http://localhost:5174"
echo "   Frontend:  http://localhost:3000"
echo ""
echo "Wait ~5 seconds then open the URLs above in your browser."
