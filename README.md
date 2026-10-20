# Browser Expense Tracker

A small expense tracker that runs entirely in the browser. No server, no login.

## Features
- Add, edit and delete expenses
- Category and date on every expense
- Total expenditure (updates with filters)
- Filter by category or date
- Data persists after refresh (localStorage)
- Validation for empty, zero, negative and non-numeric values

## How to run
1. Download or clone the repository.
2. Open `index.html` in a browser.

## How it works
form submit -> validate -> update `expenses` array -> save to localStorage -> `render()`

## Files
- `index.html`: page structure
- `style.css`: styling
- `script.js`: logic and state
