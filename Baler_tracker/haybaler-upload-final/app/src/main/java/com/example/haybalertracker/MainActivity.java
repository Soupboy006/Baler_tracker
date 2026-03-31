package com.example.haybalertracker;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import java.util.List;

public class MainActivity extends AppCompatActivity {

    private static final int REQUEST_LOCATION_PERMISSION = 1;
    private DatabaseHelper dbHelper;
    private TextView baleCountTextView;
    private Button addBaleButton;
    private Button viewBalesButton;
    private Button exportDataButton;
    private Location currentLocation;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Initialize database helper
        dbHelper = new DatabaseHelper(this);

        // Initialize UI components
        baleCountTextView = findViewById(R.id.baleCountTextView);
        addBaleButton = findViewById(R.id.addBaleButton);
        viewBalesButton = findViewById(R.id.viewBalesButton);
        exportDataButton = findViewById(R.id.exportDataButton);

        // Set up button click listeners
        addBaleButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                openBaleEntryForm();
            }
        });

        viewBalesButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                viewAllBales();
            }
        });

        exportDataButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                exportDataToCSV();
            }
        });

        // Update bale count display
        updateBaleCount();
    }

    @Override
    protected void onResume() {
        super.onResume();
        updateBaleCount();
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
            // In a real app, you would get current location here
            Toast.makeText(this, "Location permission granted", Toast.LENGTH_SHORT).show();
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
                Toast.makeText(this, "Location permission granted", Toast.LENGTH_SHORT).show();
            } else {
                // Permission denied
                Toast.makeText(this, "Location permission denied", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private void openBaleEntryForm() {
        Intent intent = new Intent(this, BaleEntryActivity.class);
        startActivity(intent);
    }

    private void viewAllBales() {
        Intent intent = new Intent(this, BaleListActivity.class);
        startActivity(intent);
    }

    private void exportDataToCSV() {
        // In a real implementation, this would export data to CSV
        Toast.makeText(this, "Data exported to CSV (feature coming soon)", Toast.LENGTH_SHORT).show();
    }

    private void updateBaleCount() {
        int count = dbHelper.getBalesCount();
        baleCountTextView.setText("Total Bales Tracked: " + count);
    }
}