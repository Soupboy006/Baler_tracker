const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database('./baler_tracker.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Create tables if they don't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS operational_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        rpm REAL,
        temperature REAL,
        pressure REAL,
        status TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS production_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        bales_produced INTEGER,
        bales_per_hour REAL,
        total_bales_today INTEGER,
        average_weight REAL,
        density REAL
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS maintenance_schedule (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        maintenance_type TEXT,
        description TEXT,
        interval_hours INTEGER,
        last_performed DATETIME,
        next_due DATETIME,
        is_completed BOOLEAN DEFAULT 0
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        alert_type TEXT,
        message TEXT,
        is_read BOOLEAN DEFAULT 0,
        priority TEXT
      )
    `);

    // Insert sample data if tables are empty
    const checkMaintenance = `SELECT COUNT(*) as count FROM maintenance_schedule`;
    db.get(checkMaintenance, [], (err, row) => {
      if (err) {
        console.error(err);
        return;
      }

      if (row.count === 0) {
        // Insert sample maintenance data
        const insertMaintenance = `
          INSERT INTO maintenance_schedule
          (maintenance_type, description, interval_hours, last_performed, next_due, is_completed)
          VALUES
          ('Lubrication', 'Grease all fittings and check oil levels', 8, datetime('now', '-2 hours'), datetime('now', '+6 hours'), 0),
          ('Blade Inspection', 'Check and sharpen cutting blades', 24, datetime('now', '-1 day'), datetime('now', '+23 hours'), 0),
          ('Belt Tension', 'Inspect and adjust belt tension', 12, datetime('now', '-6 hours'), datetime('now', '+6 hours'), 0),
          ('Hydraulic Check', 'Check hydraulic fluid levels and pressure', 24, datetime('now', '-12 hours'), datetime('now', '+12 hours'), 0)
        `;
        db.run(insertMaintenance, (err) => {
          if (err) {
            console.error('Error inserting maintenance data:', err.message);
          } else {
            console.log('Sample maintenance data inserted');
          }
        });
      }
    });
  });
}

// API Routes
app.get('/api/status', (req, res) => {
  // Get latest operational data
  db.get(`
    SELECT * FROM operational_data
    ORDER BY timestamp DESC
    LIMIT 1
  `, [], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // If no data exists, return simulated data
    if (!row) {
      res.json({
        rpm: Math.floor(Math.random() * 50) + 100,
        temperature: Math.floor(Math.random() * 20) + 80,
        pressure: Math.floor(Math.random() * 30) + 50,
        status: Math.random() > 0.2 ? 'running' : 'idle',
        timestamp: new Date().toISOString()
      });
      return;
    }

    res.json(row);
  });
});

app.get('/api/production', (req, res) => {
  db.get(`
    SELECT * FROM production_data
    ORDER BY timestamp DESC
    LIMIT 1
  `, [], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // If no data exists, return simulated data
    if (!row) {
      res.json({
        bales_produced: Math.floor(Math.random() * 10) + 5,
        bales_per_hour: Math.floor(Math.random() * 20) + 10,
        total_bales_today: Math.floor(Math.random() * 100) + 50,
        average_weight: Math.floor(Math.random() * 50) + 400,
        density: Math.floor(Math.random() * 20) + 60,
        timestamp: new Date().toISOString()
      });
      return;
    }

    res.json(row);
  });
});

app.get('/api/maintenance', (req, res) => {
  db.all(`
    SELECT * FROM maintenance_schedule
    ORDER BY next_due ASC
  `, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json(rows);
  });
});

app.get('/api/history', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  db.all(`
    SELECT od.*, pd.bales_produced, pd.bales_per_hour
    FROM operational_data od
    LEFT JOIN production_data pd ON od.timestamp = pd.timestamp
    ORDER BY od.timestamp DESC
    LIMIT ?
  `, [limit], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json(rows);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Baler Tracker server running on port ${PORT}`);
});

module.exports = app;