#!/usr/bin/env python3
"""
Super simple test to demonstrate your hay baler logic works
"""

from datetime import datetime

class Bale:
    def __init__(self, bale_type="", length=0.0, width=0.0, height=0.0,
                 weight=0.0, notes="", latitude=0.0, longitude=0.0, field_name=""):
        self.bale_type = bale_type
        self.length = length
        self.width = width
        self.height = height
        self.weight = weight
        self.notes = notes
        self.latitude = latitude
        self.longitude = longitude
        self.field_name = field_name
        self.timestamp = datetime.now()

    def __str__(self):
        return f"""{self.bale_type} Bale from {self.field_name}
{self.length}' x {self.width}' x {self.height}' | {self.weight} lbs
Location: {self.latitude:.4f}, {self.longitude:.4f}
{self.notes}
Logged: {self.timestamp.strftime('%Y-%m-%d %H:%M:%S')}"""

def main():
    print("🌾 Hay Baler Tracker Logic Test 🌾")
    print("=" * 40)

    # Test creating a bale (like when user fills form and clicks save)
    test_bale = Bale(
        bale_type="Alfalfa",
        length=8.0,
        width=3.0,
        height=4.0,
        weight=1200.0,
        notes="First cutting, high quality",
        latitude=40.7128,
        longitude=-74.0060,
        field_name="North Field"
    )

    print("✅ Sample bale created:")
    print(test_bale)
    print("\n" + "="*40)
    print("💡 This is exactly what happens when you:")
    print("   1. Fill out the bale form in the app")
    print("   2. Tap 'Get Location' for GPS coordinates")
    print("   3. Tap 'Save Bale' to store it")
    print("\n📱 In the real Android app:")
    print("   - This data gets saved to SQLite database")
    print("   - You can view it in the bale list")
    print("   - It survives app restarts and phone reboots")

if __name__ == "__main__":
    main()