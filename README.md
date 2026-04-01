# Baler Tracker

A comprehensive tracking and monitoring system for baling equipment operations.

## Project Status
- **Phase**: Implementation Phase - Agricultural Hay Baler Focus
- **Status**: Active Development

## Overview
This project implements a tracking system for agricultural hay balers with real-time monitoring, production tracking, and maintenance scheduling capabilities.

## Features Implemented
- Real-time operational monitoring (RPM, temperature, pressure)
- Production counters (bales per hour, daily totals)
- Bale quality metrics (weight estimation, density)
- Operational status tracking
- Maintenance scheduling and alerts
- Historical data logging
- Dashboard visualization
- Mobile-responsive interface
- RESTful API for data access

## Technical Implementation
- Backend: Node.js with Express.js
- Frontend: HTML/CSS/JavaScript (vanilla)
- Database: SQLite for development
- API: RESTful endpoints for data retrieval

## Getting Started
1. Install dependencies: `npm install`
2. Start the server: `npm start` or `node server.js`
3. Access the dashboard at http://localhost:3000

## API Endpoints
- GET `/api/status` - Current operational status
- GET `/api/production` - Production statistics
- GET `/api/maintenance` - Maintenance schedules
- GET `/api/history` - Historical data

## Future Enhancements
- GPS tracking for mobile equipment
- Advanced analytics and reporting
- Integration with farm management systems
- Enhanced alerting system (email/SMS)
- Multi-user authentication

## License
MIT