package com.example.haybalertracker;

import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class BaleListActivity extends AppCompatActivity {

    private ListView baleListView;
    private TextView emptyListTextView;
    private DatabaseHelper dbHelper;
    private ArrayAdapter<Bale> adapter;
    private List<Bale> baleList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_bale_list);

        // Initialize UI components
        baleListView = findViewById(R.id.baleListView);
        emptyListTextView = findViewById(R.id.emptyListTextView);

        // Initialize database helper
        dbHelper = new DatabaseHelper(this);

        // Initialize bale list
        baleList = new ArrayList<>();

        // Set up adapter
        adapter = new ArrayAdapter<>(this,
                android.R.layout.simple_list_item_2,
                android.R.id.text1,
                baleList) {
            @Override
            public View getView(int position, View convertView, android.view.ViewGroup parent) {
                View view = super.getView(position, convertView, parent);
                Bale bale = getItem(position);

                if (bale != null) {
                    TextView text1 = view.findViewById(android.R.id.text1);
                    TextView text2 = view.findViewById(android.R.id.text2);

                    SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/yyyy HH:mm", Locale.getDefault());
                    String dateTime = sdf.format(bale.getTimestamp());

                    text1.setText(String.format("%s Bale - %s", bale.getType(), bale.getFieldName()));
                    text2.setText(String.format("Weight: %.1f lbs | %s", bale.getWeight(), dateTime));
                }

                return view;
            }
        };

        baleListView.setAdapter(adapter);
        baleListView.setEmptyView(emptyListTextView);

        // Set item click listener
        baleListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Bale selectedBale = baleList.get(position);
                showBaleDetails(selectedBale);
            }
        });

        // Load bales from database
        loadBales();
    }

    @Override
    protected void onResume() {
        super.onResume();
        loadBales();
    }

    private void loadBales() {
        // Get all bales from database
        baleList.clear();
        baleList.addAll(dbHelper.getAllBales());

        // Notify adapter of data change
        adapter.notifyDataSetChanged();

        // Show/hide empty list message
        if (baleList.isEmpty()) {
            emptyListTextView.setVisibility(View.VISIBLE);
            baleListView.setVisibility(View.GONE);
        } else {
            emptyListTextView.setVisibility(View.GONE);
            baleListView.setVisibility(View.VISIBLE);
        }
    }

    private void showBaleDetails(Bale bale) {
        StringBuilder details = new StringBuilder();
        details.append("Bale Details\n\n");
        details.append("Type: ").append(bale.getType()).append("\n");
        details.append("Field: ").append(bale.getFieldName()).append("\n");
        details.append("Dimensions: ").append(bale.getLength()).append("' x ")
                .append(bale.getWidth()).append("' x ").append(bale.getHeight()).append("'\n");
        details.append("Weight: ").append(bale.getWeight()).append(" lbs\n");
        details.append("Notes: ").append(bale.getNotes()).append("\n");
        if (bale.getLatitude() != 0.0 && bale.getLongitude() != 0.0) {
            details.append("Location: ").append(String.format("%.6f, %.6f",
                    bale.getLatitude(), bale.getLongitude())).append("\n");
        }
        details.append("Timestamp: ").append(bale.getTimestamp());

        // Show details in a dialog or new activity
        // For simplicity, we'll use a toast for now
        Toast.makeText(this, details.toString(), Toast.LENGTH_LONG).show();
    }
}