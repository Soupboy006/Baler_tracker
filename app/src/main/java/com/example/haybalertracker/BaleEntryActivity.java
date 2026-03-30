package com.example.haybalertracker;

import android.Manifest;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

public class BaleEntryActivity extends AppCompatActivity implements LocationListener {

    private EditText typeEditText;
    private EditText lengthEditText;
    private EditText widthEditText;
    private EditText heightEditText;
    private EditText weightEditText;
    private EditText notesEditText;
    private EditText fieldNameEditText;
    private Button saveBaleButton;
    private Button getLocationButton;
    private TextView locationTextView;

    private LocationManager locationManager;
    private double currentLatitude = 0.0;
    private double currentLongitude = 0.0;
    private boolean locationAvailable = false;

    private static final int REQUEST_LOCATION_PERMISSION = 1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.bale_entry_form);

        // Initialize UI components
        typeEditText = findViewById(R.id.typeEditText);
        lengthEditText = findViewById(R.id.lengthEditText);
        widthEditText = findViewById(R.id.widthEditText);
        heightEditText = findViewById(R.id.heightEditText);
        weightEditText = findViewById(R.id.weightEditText);
        notesEditText = findViewById(R.id.notesEditText);
        fieldNameEditText = findViewById(R.id.fieldNameEditText);
        saveBaleButton = findViewById(R.id.saveBaleButton);
        getLocationButton = findViewById(R.id.getLocationButton);
        locationTextView = findViewById(R.id.locationTextView);

        // Initialize location manager
        locationManager = (LocationManager) getSystemService(LOCATION_SERVICE);

        // Set up button click listeners
        saveBaleButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                saveBale();
            }
        });

        getLocationButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                getCurrentLocation();
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        checkLocationPermission();
    }

    private void checkLocationPermission() {
        if (ContextCompat.checkSelfPermission(this,
                Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED) {

            // Permission is not granted
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION},
                    REQUEST_LOCATION_PERMISSION);
        } else {
            // Permission already granted
            locationTextView.setText("Location permission granted");
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode,
                                           @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQUEST_LOCATION_PERMISSION) {
            if (grantResults.length > 0
                    && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // Permission granted
                locationTextView.setText("Location permission granted");
                Toast.makeText(this, "Location permission granted", Toast.LENGTH_SHORT).show();
            } else {
                // Permission denied
                locationTextView.setText("Location permission denied");
                Toast.makeText(this, "Location permission denied", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private void getCurrentLocation() {
        if (ContextCompat.checkSelfPermission(this,
                Manifest.permission.ACCESS_FINE_LOCATION)
                == PackageManager.PERMISSION_GRANTED) {

            // Request location updates
            try {
                locationManager.requestLocationUpdates(
                        LocationManager.GPS_PROVIDER,
                        0,
                        0,
                        this);
                locationTextView.setText("Getting location...");
            } catch (SecurityException e) {
                locationTextView.setText("Error accessing location");
                e.printStackTrace();
            }
        } else {
            locationTextView.setText("Please grant location permission first");
            Toast.makeText(this, "Please grant location permission", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    public void onLocationChanged(Location location) {
        // Location has changed
        currentLatitude = location.getLatitude();
        currentLongitude = location.getLongitude();
        locationAvailable = true;

        // Update UI
        locationTextView.setText(String.format(
                "Location: %.6f, %.6f", currentLatitude, currentLongitude));

        // Remove location updates to save battery
        locationManager.removeUpdates(this);
    }

    @Override
    public void onStatusChanged(String provider, int status, Bundle extras) {
        // Not used
    }

    @Override
    public void onProviderEnabled(String provider) {
        // Not used
    }

    @Override
    public void onProviderDisabled(String provider) {
        // Provider disabled
        locationTextView.setText("GPS disabled. Please enable GPS.");
        Toast.makeText(this, "Please enable GPS for location tracking", Toast.LENGTH_LONG).show();
    }

    private void saveBale() {
        // Validate input
        if (typeEditText.getText().toString().isEmpty()) {
            Toast.makeText(this, "Please enter bale type", Toast.LENGTH_SHORT).show();
            return;
        }

        if (lengthEditText.getText().toString().isEmpty() ||
                widthEditText.getText().toString().isEmpty() ||
                heightEditText.getText().toString().isEmpty() ||
                weightEditText.getText().toString().isEmpty()) {
            Toast.makeText(this, "Please enter all bale dimensions", Toast.LENGTH_SHORT).show();
            return;
        }

        // Create bale object
        Bale bale = new Bale();
        bale.setType(typeEditText.getText().toString());
        bale.setLength(parseDoubleOrZero(lengthEditText.getText().toString()));
        bale.setWidth(parseDoubleOrZero(widthEditText.getText().toString()));
        bale.setHeight(parseDoubleOrZero(heightEditText.getText().toString()));
        bale.setWeight(parseDoubleOrZero(weightEditText.getText().toString()));
        bale.setNotes(notesEditText.getText().toString());
        bale.setLatitude(currentLatitude);
        bale.setLongitude(currentLongitude);
        bale.setFieldName(fieldNameEditText.getText().toString());

        // Save to database
        DatabaseHelper dbHelper = new DatabaseHelper(this);
        dbHelper.addBale(bale);

        // Show success message
        Toast.makeText(this, "Bale saved successfully!", Toast.LENGTH_SHORT).show();

        // Clear form
        clearForm();

        // Optionally return to main screen
        // finish();
    }

    private double parseDoubleOrZero(String value) {
        try {
            return Double.parseDouble(value);
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }

    private void clearForm() {
        typeEditText.setText("");
        lengthEditText.setText("");
        widthEditText.setText("");
        heightEditText.setText("");
        weightEditText.setText("");
        notesEditText.setText("");
        fieldNameEditText.setText("");
        locationTextView.setText("Location not acquired");
        currentLatitude = 0.0;
        currentLongitude = 0.0;
        locationAvailable = false;
    }
}