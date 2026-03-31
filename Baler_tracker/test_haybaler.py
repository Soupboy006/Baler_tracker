#!/usr/bin/env python3
"""
Simple terminal-based Hay Bale Tracker to test the core logic
This runs in Termux and demonstrates the same data structure and logic
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
Type: {self.type}
Field: {self.field_name}
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

def main():
    tracker = HayBalerTracker()

    print("🌾 Hay Baler Tracker - Terminal Test Version 🌾")
    print("=" * 50)

    while True:
        print("\nOptions:")
        print("1. Add new bale")
        print("2. View all bales")
        print("3. View bale details")
        print("4. Exit")

        choice = input("\nEnter choice (1-4): ").strip()

        if choice == "1":
            print("\n--- Add New Bale ---")
            bale_type = input("Bale type (Alfalfa/Timothy/Grass): ").strip() or "Alfalfa"
            field_name = input("Field name: ").strip() or "Field 1"

            try:
                length = float(input("Length (feet): ") or "8.0")
                width = float(input("Width (feet): ") or "3.0")
                height = float(input("Height (feet): ") or "4.0")
                weight = float(input("Weight (lbs): ") or "1200.0")
            except ValueError:
                print("❌ Invalid number! Using defaults.")
                length, width, height, weight = 8.0, 3.0, 4.0, 1200.0

            notes = input("Notes (optional): ").strip()

            # For demo, we'll use fake coordinates
            # In real app, this would come from GPS
            latitude = 40.7128 + (hash(bale_type + field_name) % 1000) / 100000.0
            longitude = -74.0060 + (hash(bale_type + field_name) % 1000) / 100000.0

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

        elif choice == "2":
            print("\n--- All Bales ---")
            bales = tracker.list_bales()
            if not bales:
                print("No bales recorded yet.")
            else:
                for bale in bales:
                    print(f"#{bale.id} | {bale.type} | {bale.field_name} | {bale.weight}lbs | {bale.timestamp.strftime('%m/%d %H:%M')}")
            print(f"Total: {len(bales)} bales")

        elif choice == "3":
            try:
                bale_id = int(input("Enter bale ID to view: "))
                bale = tracker.get_bale_by_id(bale_id)
                if bale:
                    print("\n" + "="*40)
                    print(bale)
                    print("="*40)
                else:
                    print("❌ Bale not found!")
            except ValueError:
                print("❌ Please enter a valid number!")

        elif choice == "4":
            print("👋 Thanks for using Hay Baler Tracker!")
            break

        else:
            print("❌ Invalid choice! Please enter 1-4.")

if __name__ == "__main__":
    main()