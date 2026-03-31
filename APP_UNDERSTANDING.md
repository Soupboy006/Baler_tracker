# Hay Baler Tracker - App Logic Documentation
## For Reference When Building/Using the App

## 📊 DATA MODEL (Bale.java)
Each bale stores:
- **ID**: Unique database identifier (auto-generated)
- **Type**: Bale type (Alfalfa, Timothy, Grass, etc.)
- **Dimensions**: Length, Width, Height (in feet)
- **Weight**: Bale weight (in pounds)
- **Notes**: Free-text observations
- **Location**: GPS coordinates (latitude, longitude)
- **Field Name**: Which field the bale came from
- **Timestamp**: When the bale was recorded (auto-set to current time)

## 💾 STORAGE (DatabaseHelper.java)
- Uses SQLite database (`hayBalerTracker.db`)
- Single table: `bales`
- All data persists between app launches and phone reboots
- Simple CRUD operations (Create, Read, Update, Delete)

## 🖥️ USER INTERFACE FLOW
**MainActivity**:
- Shows bale count on startup
- Three main buttons: Add Bale, View Bales, Export Data
- Handles location permission requests

**BaleEntryActivity**:
- Form for entering all bale data
- "Get Location" button requests GPS coordinates
- "Save Bale" button validates input and stores to database

**BaleListActivity**:
- Shows all bales in a scrollable list
- Tapping a bale shows detailed information in a popup

## 🧪 HOW TO TEST WHEN YOU GET COMPUTER ACCESS:
1. Install Android Studio
2. Extract this zip file
3. Open project in Android Studio
4. Click "Run" (green ▶️ button)
5. Install resulting APK on Android device
6. Test using the scenarios above

## 🌾 REAL-WORLD USAGE:
- Track each bale as you produce it
- Know exactly where each bale came from (GPS)
- Document quality, field conditions, cutter observations
- Generate reports on yield per field, average bale weight, etc.
- Works completely offline once installed