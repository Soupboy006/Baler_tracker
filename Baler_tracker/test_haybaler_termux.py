#!/usr/bin/env python3
"""
Hay Baler Tracker - Terminal Test Version
Runs in Termux to test core logic and data flow
This is NOT the graphical Android app, but it tests:
- Data input and validation
- Data storage and retrieval
- Logic flow and decision making
- User interaction simulation
"""

import json
import os
from datetime import datetime

class Bale:
    def __init__(self, bale_id=None, bale_type="", length=0.0, width=0.0, height=0.0,
                 weight=0.0, notes="", latitude=0.0, longitude=0.0, field_name="", timestamp=None):
        self.id = bale_id if bale_id is not None else int(datetime.now().timestamp())
        self.type = bale_type
        self.length = length
        self.width = width
        self.height = height
        self.weight = weight
        self.notes = notes
        self.latitude = latitude
        self.longitude = longitude
        self.field_name = field_name
        self.timestamp = timestamp if timestamp is not None else datetime.now()

    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type,
            'length': self.length,
            'width': self.width,
            'height': self.height,
            'weight': self.weight,
            'notes': self.notes,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'field_name': self.field_name,
            'timestamp': self.timestamp.isoformat()
        }

    @classmethod
    def from_dict(cls, data):
        bale = Bale(
            bale_id=data['id'],
            bale_type=data['type'],
            length=data['length'],
            width=data['width'],
            height=data['height'],
            weight=data['weight'],
            notes=data['notes'],
            latitude=data['latitude'],
            longitude=data['longitude'],
            field_name=data['field_name']
        )
        bale.timestamp = datetime.fromisoformat(data['timestamp'])
        return bale

    def __str__(self):
        return f"""Bale #{self.id}
Type: {self.type} | Field: {self.field_name}
Dimensions: {self.length}' x {self.width}' x {self.height}'
Weight: {self.weight} lbs
Location: {self.latitude:.6f}, {self.longitude:.6f}
Notes: {self.notes}
Time: {self.timestamp.strftime('%Y-%m-%d %H:%M')}"""

class HayBalerTracker:
    def __init__(self, data_file="hay_bales.json"):
        self.data_file = data_file
        self.bales = self.load_bales()

    def load_bales(self):
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, 'r') as f:
                    data = json.load(f)
                    return [Bale.from_dict(bale_data) for bale_data in data]
            except:
                return []
        return []

    def save_bales(self):
        with open(self.data_file, 'w') as f:
            json.dump([bale.to_dict() for bale in self.bales], f, indent=2)

    def add_bale(self, bale):
        self.bales.append(bale)
        self.save_bales()
        return bale.id

    def get_bale_count(self):
        return len(self.bales)

    def list_bales(self):
        return self.bales

    def get_bale_by_id(self, bale_id):
        for bale in self.bales:
            if bale.id == bale_id:
                return bale
        return None

    def export_to_csv(self):
        """Export all bales to CSV format"""
        if not self.bales:
            return "No bales to export"

        csv_lines = ["ID,Type,Length,Width,Height,Weight,Notes,Latitude,Longitude,Field_Name,Timestamp"]
        for bale in self.bales:
            csv_lines.append(f"{bale.id},{bale.type},{bale.length},{bale.width},{bale.height},{bale.weight},\"{bale.notes}\",{bale.latitude},{bale.longitude},{bale.field_name},{bale.timestamp.isoformat()}")
        return "\n".join(csv_lines)

def print_menu():
    print("\n" + "="*50)
    print("🌾 Hay Baler Tracker - Terminal Test Version 🌾")
    print("="*50)
    print("1. Add new bale")
    print("2. View all bales")
    print("3. View bale details")
    print("4. Export data to CSV")
    print("5. Exit")
    print("="*50)

def main():
    tracker = HayBalerTracker()

    print("🌾 Hay Baler Tracker Terminal Test - Ready! 🌾")
    print("Type 'help' for instructions or choose an option (1-5)")

    while True:
        try:
            choice = input("\nEnter choice (1-5) or 'help': ").strip().lower()

            if choice == 'help':
                print_menu()
                continue

            elif choice == '1':
                print("\n--- Add New Bale ---")
                bale_type = input("Bale type (Alfalfa/Timothy/Grass/etc.): ").strip() or "Alfalfa"
                field_name = input("Field name: ").strip() or "Field 1"

                try:
                    length = float(input("Length (feet): ") or "8.0")
                    width = float(input("Width (feet): ") or "3.0")
                    height = float(input("Height (feet): ") or "4.0")
                    weight = float(input("Weight (lbs): ") or "1200.0")
                except ValueError:
                    print("❌ Invalid number! Please enter numbers for dimensions and weight.")
                    continue

                notes = input("Notes (optional): ").strip()

                # For demo: use pseudo-random but deterministic location based on input
                # REAL app: this would come from GPS
                import hashlib
                hash_input = f"{bale_type}_{field_name}_{notes}"
                hash_digest = hashlib.md5(hash_input.encode()).hexdigest()
                hash_int = int(hash_digest, 16)  # 0-65535
                base_lat = 25.0  # Approximate center of continental US
                base_lon = -95.0  # Approximate center of continental US
                lat_range = 20.0  # ~20 degrees latitude range
                lon_range = 30.0  # ~30 degrees longitude range

                latitude = base_lat + ((hash_int % (lat_range * 100)) / 100.0 - lat_range/2.0)
                longitude = base_lon + ((hash_int % (lon_range * 100)) / 100.0 - lon_range/2.0)

                # Keep within reasonable bounds
                latitude = max(-90.0, min(90.0, latitude))
                longitude = max(-180.0, min(180.0, longitude))

                bale = Bale(
                    bale_type=bale_type,
                    length=length,
                    width=width,
                    height=height,
                    weight=weight,
                    notes=notes,
                    latitude=latitude,
                    longitude=longitude,
                    field_name=field_name
                )

                bale_id = tracker.add_bale(bale)
                print(f"✅ Bale #{bale_id} saved successfully!")
                print(f"   Location: ({latitude:.4f}, {longitude:.6f})")

            elif choice == '2':
                print("\n--- All Bales ---")
                bales = tracker.list_bales()
                if not bales:
                    print("No bales recorded yet.")
                else:
                    print(f"{'ID':<4} {'Type':<12} {'Field':<12} {'Weight':<8} {'Notes':<20} {'Location':<20} {'Time':<20}")
                    print("-" * 80)
                    for bale in bales:
                        loc = f"({bale.latitude:.4f}, {bale.longitude:.6f})"
                        time_str = bale.timestamp.strftime('%m/%d %H:%M')
                        notes_display = (bale.notes[:17] + '...') if len(bale.notes) > 20 else bale.notes
                        print(f"{bale.id:<4} {bale.type:<12} {bale.field_name:<12} {bale.weight:<8.1f} {notes_display:<20} {loc:<20} {time_str:<20}")
                    print(f"Total: {len(bales)} bales")

            elif choice == '3':
                print("\n--- View Bale Details ---")
                try:
                    bale_id = int(input("Enter Bale ID to view: "))
                    bale = tracker.get_bale_by_id(bale_id)
                    if bale:
                        print("\n" + "="*50)
                        print(bale)
                        print("="*50)
                    else:
                        print("❌ Bale ID not found!")
                except ValueError:
                    print("❌ Please enter a valid number!")

            elif choice == '4':
                print("\n--- Export Data to CSV ---")
                csv_data = tracker.export_to_csv()
                print("CSV data ready for copy/paste:")
                print("-" * 50)
                print(csv_data)
                print("-" * 50)
                print("💡 Tip: Copy the above data and paste into a spreadsheet program!")

            elif choice == '5':
                print("\n👋 Thanks for using Hay Baler Tracker Terminal Test!")
                print("Your data is saved in hay_bales.json in this directory")
                break

            else:
                print("❌ Invalid choice! Please enter 1-5 or 'help'.")

        except KeyboardInterrupt:
            print("\n\n👋 Goodbye! Your data is safely saved.")
            break
        except Exception as e:
            print(f"\n❌ An error occurred: {e}")
            print("Please try again.")

if __name__ == "__main__":
    main()