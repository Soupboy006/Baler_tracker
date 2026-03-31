# Hay Baler Tracker

A simple Android application for tracking hay bales with GPS location, dimensions, weight, and field information.

## Features

- Track bale creation with date/time, type, dimensions, and weight
- GPS location capture for each bale
- Field name tracking
- Notes for additional information
- View all tracked bales in a list
- Data persistence using SQLite database
- Location permission handling

## Prerequisites

To build this app, you'll need:

1. **Android Studio** (recommended) or the Android SDK command-line tools
2. **Java Development Kit (JDK)** version 8 or higher
3. **Android SDK** with API level 21 or higher

## Building the APK

### Using Android Studio (Recommended)

1. Open Android Studio
2. Select "Open an existing project"
3. Navigate to the `HayBalerTracker` folder and select it
4. Wait for Gradle to sync the project
5. Click the "Run" button (green triangle) or select "Build > Build Bundle(s) / APK(s) > Build APK(s)"
6. The APK will be generated in `app/build/outputs/apk/debug/`

### Using Command Line

1. Navigate to the project directory:
   ```bash
   cd HayBalerTracker
   ```

2. Make the gradlew script executable (if not already):
   ```bash
   chmod +x gradlew
   ```

3. Build the debug APK:
   ```bash
   ./gradlew assembleDebug
   ```

4. The APK will be generated at:
   ```
   app/build/outputs/apk/debug/app-debug.apk
   ```

## Using the App

1. Install the generated APK on your Android device
2. When prompted, grant location permissions (required for GPS tracking)
3. Use the "Add New Bale" button to record bale information:
   - Enter bale type (e.g., Alfalfa, Timothy)
   - Enter field name
   - Enter dimensions (length, width, height in feet)
   - Enter weight (in pounds)
   - Add any notes
   - Tap "Get Location" to capture GPS coordinates
   - Tap "Save Bale" to store the record
4. Use "View All Bales" to see your tracked bales
5. Use "Export Data" to export your data (feature coming soon)

## Notes

- This app requires location services to be enabled for GPS tracking
- All data is stored locally on the device
- For best accuracy, use the app outdoors with clear sky view for GPS
- The app works offline once installed

## Customization

You can customize the app by modifying:
- String values in `res/values/strings.xml`
- Colors in `res/values/colors.xml`
- Layouts in the `res/layout` folder
- Logic in the Java source files under `src/main/java/com/example/haybalertracker/`

## License

This project is open source and available for modification and distribution.