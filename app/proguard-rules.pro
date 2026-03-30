# To enable ProGuard in your project, edit build.gradle
# to minifyEnabled true in the buildTypes section.

# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in ${android.sdk.dir}/tools/proguard/proguard-android.txt
# and edit the ${android.sdk.dir}/tools/proguard/proguard-android-optimize.txt
# for optimized builds.
# You can also use options from appendixes of ProGuard Manual
# that appear in http://developer.android.com/guide/developing/tools/proguard.html

# Keep our model classes so they can be accessed via reflection
-keepclassmembers class com.example.haybalertracker.Bale {
    *;
}

# Keep our database helper
-keepclassmembers class com.example.haybalertracker.DatabaseHelper {
    *;
}

# Keep our activities so they can be instantiated
-keepclassmembers class * extends android.app.Activity {
    <init>(...);
}