# Smart Expense Manager [Live URL](https://smart-expense-manager.vercel.app/)

A modern, responsive expense tracking application built with HTML, CSS, and JavaScript that helps you manage your finances effectively.

## Features

- **Dashboard Overview:** View total balance, income, and expenses at a glance  
- **Visual Analytics:** Interactive doughnut chart showing expense breakdown by category  
- **Transaction Management:** Add, edit, and delete transactions with full validation  
- **Smart Filtering:** Filter transactions by category and date range  
- **Dark/Light Theme:** Toggle between light and dark modes with persistent preferences  
- **Responsive Design:** Works seamlessly on desktop, tablet, and mobile devices  
- **Data Persistence:** All data is saved to localStorage  
- **Accessibility:** Built with ARIA labels and keyboard navigation support  

## File Structure

```text
expense-manager/
├── index.html          # Main HTML file
├── style.css           # Styles and responsive design
├── script.js           # Application logic and functionality
└── README.md           # This documentation file
```

## Installation

1. Clone or download the project files  
2. Ensure all three files (`index.html`, `style.css`, `script.js`) are in the same directory  
3. Open `index.html` in a web browser  
4. No build process or dependencies required!  

## Usage

### Adding a Transaction
- Fill in the transaction details:  
  - Description (max 100 characters)  
  - Amount (positive number)  
  - Category (select from dropdown)  
  - Date (defaults to current date)  
- Click **"Add Transaction"** to save  

### Editing a Transaction
- Click the **"Edit"** button next to any transaction in the history table  
- The form will populate with the transaction details  
- Make your changes and click **"Update Transaction"**  

### Filtering Transactions
- Use the category dropdown to filter by specific categories  
- Set date ranges using the "From Date" and "To Date" fields  
- Click **"Apply Filters"** to see filtered results  
- Use **"Reset Filters"** to clear all filters  

### Viewing Analytics
The chart automatically updates to show your expense distribution by category. Hover over chart segments to see exact amounts.

### Theme Switching
Click the moon/sun icon in the header to toggle between light and dark themes. Your preference is saved automatically.

## Validation Rules

- **Description:** Required, max 100 characters  
- **Amount:** Required, positive number, max ₹99,99,999  
- **Category:** Required selection from dropdown  
- **Date:** Required, cannot be a future date  

## Categories

The application supports the following transaction categories:  

- Food & Groceries  
- Travel & Transport  
- Bills & Utilities  
- Shopping  
- Entertainment  
- Healthcare  
- Education  
- Income  
- Other  

## Browser Compatibility

Works in all modern browsers including:  

- Chrome 60+  
- Firefox 60+  
- Safari 12+  
- Edge 79+  

## Technical Details

### Data Structure
Transactions are stored as objects with the following properties:  

```javascript
{
  id: number,           // Unique identifier
  description: string,  // Transaction description
  amount: number,       // Positive for income, negative for expenses
  category: string,     // Transaction category
  date: string          // YYYY-MM-DD format
}
```

### Storage
Data is persisted using browser localStorage with the key `expenseTransactions`.

### Chart Implementation
Uses Chart.js for the doughnut chart visualization with:  

- Responsive design  
- Custom color scheme  
- Smooth animations  
- Legend with category labels  

### Accessibility Features
- ARIA labels for screen readers  
- Keyboard navigation support  
- Focus indicators for interactive elements  
- Semantic HTML structure  
- Color contrast compliant with WCAG guidelines  

## Customization

### Adding New Categories
- Update the category dropdown in `index.html`  
- Add corresponding color in the chart configuration in `script.js`  

### Modifying Colors
- Edit the CSS custom properties in the `:root` section of `style.css` to change the color scheme.  

### Styling Changes
- All styles are contained in `style.css` with clear comments for each section.  

## Performance Considerations

- Efficient rendering with DOM manipulation only when necessary  
- Chart updates are debounced to prevent excessive redraws  
- localStorage operations are optimized  

## Browser Storage

The application uses approximately:  

- ~5KB for the application code  
- Variable storage for transaction data (typically < 100KB for most users)  

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues and enhancement requests!

## Support

For questions or issues, please check the browser console for any error messages and ensure you're using a supported browser.

## Future Enhancements

Potential features for future versions:  

- Data export/import functionality  
- Recurring transactions  
- Budget setting and tracking  
- Multi-currency support  
- Backup to cloud storage  
- Receipt image attachment  
- Reports and statistics  
- Data categorization rules  
- Shared expenses with multiple users  

> **Note:** This is a client-side application. All data is stored locally in your browser and will be lost if you clear browser data or use private/incognito mode.
