# BaleTracker Web Application

A modern, responsive web application for tracking and managing hay bales.

## Features

- Add new hay bales with ID, weight, and date
- View all bales in a responsive table
- Edit existing bale entries
- Delete bales from inventory
- Real-time statistics (total bales, total weight, average weight)
- Data persistence using localStorage
- Mobile-responsive design

## Technologies Used

- HTML5
- CSS3 (Flexbox, Grid, Responsive Design)
- Vanilla JavaScript (ES6+)
- localStorage for data persistence

## File Structure

```
BaleTrackerWeb/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Stylesheet
├── js/
│   └── app.js          # Application logic
└── README.md           # This file
```

## How to Use

1. Open `index.html` in any modern web browser
2. Add new bales using the form
3. View your bale inventory in the table
4. Use the Edit and Delete buttons to manage entries
5. Statistics update automatically in the header section

## Features in Detail

### Add Bale Form
- Bale ID: Unique identifier for each bale (text input)
- Weight: Weight in kilograms (number input with validation)
- Date: Date of baling (date input)

### Bale Inventory Table
- Displays all recorded bales
- Shows Bale ID, Weight, and Date
- Action buttons for editing and deleting entries

### Statistics Dashboard
- Total Bales: Count of all bales in inventory
- Total Weight: Combined weight of all bales
- Average Weight: Mean weight per bale

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (responsive design)

## Local Storage

All bale data is stored in the browser's localStorage, meaning:
- Data persists between browser sessions
- No server or database required
- Data is specific to each browser/device
- Clearing browser data will remove all bale records

## Customization

To customize the application:
- Modify `css/style.css` for styling changes
- Update `js/app.js` for functionality changes
- Adjust the form fields in `index.html` if you need to track additional bale properties

## License

This project is open source and available for personal and commercial use.
