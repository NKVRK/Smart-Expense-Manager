// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the app
    initApp();
});

// Toast notification function
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast ' + type;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Theme toggle functionality
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or respect OS preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        icon.className = 'fas fa-sun';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        icon.className = 'fas fa-moon';
    }
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            icon.className = 'fas fa-moon';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            icon.className = 'fas fa-sun';
        }
    });
}

// Form highlight animation
function highlightForm() {
    // const formSection = document.getElementById('formSection');
    // formSection.classList.add('form-glow');
    
    // setTimeout(() => {
    //     formSection.classList.remove('form-glow');
    // }, 1500);
}

// Generate a unique ID for transactions
function generateUniqueId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

// Input validation functions
function validateDescription(description) {
    if (!description || description.trim().length === 0) {
        return 'Description is required';
    }
    if (description.length > 100) {
        return 'Description must be 100 characters or less';
    }
    return null;
}

function validateAmount(amount) {
    if (!amount || isNaN(amount) || amount <= 0) {
        return 'Amount must be a positive number';
    }
    if (amount > 9999999) {
        return 'Amount cannot exceed ₹99,99,999';
    }
    return null;
}

function validateCategory(category) {
    if (!category) {
        return 'Category is required';
    }
    return null;
}

function validateDate(date) {
    if (!date) {
        return 'Date is required';
    }
    
    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (inputDate > today) {
        return 'Date cannot be in the future';
    }
    
    return null;
}

// Main app object
const expenseTracker = {
    transactions: [],
    editingId: null,
    chart: null,
    
    // Initialize the app
    init: function() {
        this.loadTransactions();
        this.setupEventListeners();
        this.setInitialDate();
        this.updateUI();
        this.initChart();
        setupThemeToggle(); // Initialize theme toggle
        this.setupKeyboardNavigation();
    },
    
    // Set up keyboard navigation
    setupKeyboardNavigation: function() {
        document.addEventListener('keydown', (e) => {
            // Focus management for better keyboard navigation
            if (e.key === 'Escape') {
                if (this.editingId) {
                    this.resetForm();
                    showToast('Edit cancelled', 'info');
                }
            }
        });
    },
    
    // Set today's date as default for the date input
    setInitialDate: function() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
    },
    
    // Load transactions from localStorage
    loadTransactions: function() {
        const storedTransactions = localStorage.getItem('expenseTransactions');
        if (storedTransactions) {
            this.transactions = JSON.parse(storedTransactions);
        } else {
            // Load with mock data if no stored data
            this.loadMockData();
        }
    },
    
    // Save transactions to localStorage
    saveTransactions: function() {
        localStorage.setItem('expenseTransactions', JSON.stringify(this.transactions));
    },
    
    // Load mock data with realistic transactions
    loadMockData: function() {
        // Get dates for the last 3 months in DD-MM-YYYY format
        const getDateString = (daysAgo) => {
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        };
        
        const mockData = [
            // Income entries
            { id: generateUniqueId(), description: 'Monthly Salary', amount: 75000, category: 'Income', date: getDateString(5) },
            { id: generateUniqueId(), description: 'Freelance Project', amount: 25000, category: 'Income', date: getDateString(35) },
            { id: generateUniqueId(), description: 'Stock Dividends', amount: 5000, category: 'Income', date: getDateString(65) },
            
            // Food & Groceries
            { id: generateUniqueId(), description: 'Big Bazaar Groceries', amount: -3200, category: 'Food', date: getDateString(2) },
            { id: generateUniqueId(), description: 'Reliance Fresh', amount: -1850, category: 'Food', date: getDateString(15) },
            { id: generateUniqueId(), description: 'Dmart Shopping', amount: -2750, category: 'Food', date: getDateString(45) },
            { id: generateUniqueId(), description: 'Restaurant Dinner', amount: -1200, category: 'Food', date: getDateString(7) },
            
            // Travel & Transport
            { id: generateUniqueId(), description: 'Ola Cab', amount: -450, category: 'Travel', date: getDateString(3) },
            { id: generateUniqueId(), description: 'Petrol', amount: -3000, category: 'Travel', date: getDateString(10) },
            { id: generateUniqueId(), description: 'Metro Recharge', amount: -1000, category: 'Travel', date: getDateString(25) },
            { id: generateUniqueId(), description: 'Uber Ride', amount: -350, category: 'Travel', date: getDateString(40) },
            
            // Bills & Utilities
            { id: generateUniqueId(), description: 'Electricity Bill', amount: -2500, category: 'Bills', date: getDateString(8) },
            { id: generateUniqueId(), description: 'Airtel Postpaid', amount: -599, category: 'Bills', date: getDateString(12) },
            { id: generateUniqueId(), description: 'Gas Cylinder', amount: -1100, category: 'Bills', date: getDateString(50) },
            
            // Shopping
            { id: generateUniqueId(), description: 'Amazon India', amount: -4500, category: 'Shopping', date: getDateString(18) },
            { id: generateUniqueId(), description: 'Myntra Fashion', amount: -3200, category: 'Shopping', date: getDateString(30) },
            
            // Entertainment
            { id: generateUniqueId(), description: 'Netflix India', amount: -649, category: 'Entertainment', date: getDateString(15) },
            { id: generateUniqueId(), description: 'Movie Tickets', amount: -800, category: 'Entertainment', date: getDateString(5) },
            
            // Healthcare
            { id: generateUniqueId(), description: 'Apollo Pharmacy', amount: -1200, category: 'Healthcare', date: getDateString(22) },
            
            // Education
            { id: generateUniqueId(), description: 'Coursera Course', amount: -3499, category: 'Education', date: getDateString(60) },
            
            // Other
            { id: generateUniqueId(), description: 'Gift', amount: -2000, category: 'Other', date: getDateString(28) }
        ];
        
        // Convert dates to YYYY-MM-DD format for input type="date" compatibility
        mockData.forEach(item => {
            const [day, month, year] = item.date.split('-');
            item.date = `${year}-${month}-${day}`;
        });
        
        this.transactions = mockData;
        this.saveTransactions();
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Form submission
        document.getElementById('expenseForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });
        
        // Filter application
        document.getElementById('applyFilters').addEventListener('click', () => {
            this.updateUI();
            showToast('Filters applied successfully', 'success');
        });
        
        // Reset filters
        document.getElementById('resetFilters').addEventListener('click', () => {
            this.resetFilters();
            showToast('Filters reset successfully', 'info');
        });
        
        // Input validation
        document.getElementById('description').addEventListener('input', (e) => {
            this.validateField('description', e.target.value);
        });
        
        document.getElementById('amount').addEventListener('input', (e) => {
            this.validateField('amount', e.target.value);
        });
        
        document.getElementById('category').addEventListener('change', (e) => {
            this.validateField('category', e.target.value);
        });
        
        document.getElementById('date').addEventListener('change', (e) => {
            this.validateField('date', e.target.value);
        });
    },
    
    // Validate individual form fields
    validateField: function(fieldName, value) {
        let error = null;
        
        switch(fieldName) {
            case 'description':
                error = validateDescription(value);
                break;
            case 'amount':
                error = validateAmount(value);
                break;
            case 'category':
                error = validateCategory(value);
                break;
            case 'date':
                error = validateDate(value);
                break;
        }
        
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(`${fieldName}Error`) || this.createErrorElement(fieldName);
        
        if (error) {
            field.setAttribute('aria-invalid', 'true');
            errorElement.textContent = error;
            errorElement.style.display = 'block';
        } else {
            field.setAttribute('aria-invalid', 'false');
            errorElement.style.display = 'none';
        }
        
        return error === null;
    },
    
    // Create error message element
    createErrorElement: function(fieldName) {
        const field = document.getElementById(fieldName);
        const errorElement = document.createElement('div');
        errorElement.id = `${fieldName}Error`;
        errorElement.className = 'error-message';
        field.parentNode.appendChild(errorElement);
        return errorElement;
    },
    
    // Handle form submission
    handleFormSubmit: function() {
        const description = document.getElementById('description').value.trim();
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;
        const date = document.getElementById('date').value;
        
        // Validate all fields
        const isDescriptionValid = this.validateField('description', description);
        const isAmountValid = this.validateField('amount', amount);
        const isCategoryValid = this.validateField('category', category);
        const isDateValid = this.validateField('date', date);
        
        if (!isDescriptionValid || !isAmountValid || !isCategoryValid || !isDateValid) {
            showToast('Please fix the errors in the form', 'error');
            return;
        }
        
        if (this.editingId) {
            // Update existing transaction
            const index = this.transactions.findIndex(t => t.id === this.editingId);
            if (index !== -1) {
                this.transactions[index] = {
                    ...this.transactions[index],
                    description,
                    amount: category === 'Income' ? Math.abs(amount) : -Math.abs(amount),
                    category,
                    date
                };
                showToast('Transaction updated successfully', 'success');
            }
            this.editingId = null;
        } else {
            // Add new transaction
            const newTransaction = {
                id: generateUniqueId(), // Using unique ID generator
                description,
                amount: category === 'Income' ? Math.abs(amount) : -Math.abs(amount),
                category,
                date
            };
            
            // Check for potential duplicates
            const isDuplicate = this.transactions.some(t => 
                t.description === newTransaction.description &&
                t.amount === newTransaction.amount &&
                t.category === newTransaction.category &&
                t.date === newTransaction.date
            );
            
            if (isDuplicate) {
                showToast('This transaction appears to be a duplicate', 'error');
                return;
            }
            
            this.transactions.push(newTransaction);
            showToast('Transaction added successfully', 'success');
        }
        
        // Save and update UI
        this.saveTransactions();
        this.updateUI();
        this.resetForm();
    },
    
    // Edit transaction
    editTransaction: function(id) {
        const transaction = this.transactions.find(t => t.id === id);
        if (transaction) {
            document.getElementById('description').value = transaction.description;
            document.getElementById('amount').value = Math.abs(transaction.amount);
            document.getElementById('category').value = transaction.category;
            document.getElementById('date').value = transaction.date;
            
            this.editingId = id;
            
            // Scroll to form section
            document.getElementById('formSection').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            
            // Highlight the form to draw attention
            highlightForm();
            
            // Change button text to indicate editing mode
            const submitButton = document.querySelector('#expenseForm button[type="submit"]');
            submitButton.innerHTML = '<i class="fas fa-edit" aria-hidden="true"></i> Update Transaction';
            submitButton.focus(); // Focus the button for keyboard users
            
            showToast('Editing transaction', 'info');
        }
    },
    
    // Delete transaction
    deleteTransaction: function(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            this.transactions = this.transactions.filter(t => t.id !== id);
            this.saveTransactions();
            this.updateUI();
            showToast('Transaction deleted successfully', 'success');
        }
    },
    
    // Reset form
    resetForm: function() {
        document.getElementById('expenseForm').reset();
        this.setInitialDate();
        this.editingId = null;
        
        // Clear error messages
        document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
        });
        
        // Reset button text
        const submitButton = document.querySelector('#expenseForm button[type="submit"]');
        submitButton.innerHTML = '<i class="fas fa-plus" aria-hidden="true"></i> Add Transaction';
    },
    
    // Reset all filters
    resetFilters: function() {
        document.getElementById('filterCategory').value = '';
        document.getElementById('filterDateFrom').value = '';
        document.getElementById('filterDateTo').value = '';
        this.updateUI();
    },
    
    // Update the UI with transactions and summary
    updateUI: function() {
        this.renderTransactions();
        this.updateSummary();
        this.updateChart();
    },
    
    // Filter transactions based on selected filters
    getFilteredTransactions: function() {
        const categoryFilter = document.getElementById('filterCategory').value;
        const dateFrom = document.getElementById('filterDateFrom').value;
        const dateTo = document.getElementById('filterDateTo').value;
        
        return this.transactions.filter(transaction => {
            // Category filter
            if (categoryFilter && transaction.category !== categoryFilter) {
                return false;
            }
            
            // Date range filter
            const transactionDate = new Date(transaction.date);
            if (dateFrom && new Date(dateFrom) > transactionDate) {
                return false;
            }
            if (dateTo && new Date(dateTo) < transactionDate) {
                return false;
            }
            
            return true;
        });
    },
    
    // Render transactions to the table
    renderTransactions: function() {
        const tbody = document.querySelector('#transactionsTable tbody');
        const emptyState = document.getElementById('emptyState');
        tbody.innerHTML = '';
        
        const filteredTransactions = this.getFilteredTransactions();
        
        if (filteredTransactions.length === 0) {
            emptyState.style.display = 'block';
            document.getElementById('transactionsTable').style.display = 'none';
            return;
        }
        
        emptyState.style.display = 'none';
        document.getElementById('transactionsTable').style.display = 'table';
        
        // Sort transactions by date (newest first)
        filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        filteredTransactions.forEach(transaction => {
            const row = document.createElement('tr');
            
            // Format date for display (DD-MM-YYYY)
            const dateObj = new Date(transaction.date);
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();
            const formattedDate = `${day}-${month}-${year}`;
            
            // Determine amount class based on sign
            const amountClass = transaction.amount < 0 ? 'expense' : 'income';
            const amountSign = transaction.amount < 0 ? '-' : '+';
            
            row.innerHTML = `
                <td>${formattedDate}</td>
                <td>${transaction.description}</td>
                <td><span class="category-badge">${transaction.category}</span></td>
                <td class="amount ${amountClass}">${amountSign}₹${Math.abs(transaction.amount).toLocaleString('en-IN')}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn btn-edit" onclick="expenseTracker.editTransaction(${transaction.id})" aria-label="Edit ${transaction.description} transaction">
                            <i class="fas fa-edit" aria-hidden="true"></i> Edit
                        </button>
                        <button class="action-btn btn-danger" onclick="expenseTracker.deleteTransaction(${transaction.id})" aria-label="Delete ${transaction.description} transaction">
                            <i class="fas fa-trash" aria-hidden="true"></i> Delete
                        </button>
                    </div>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    },
    
    // Update summary cards
    updateSummary: function() {
        const totalIncome = this.transactions
            .filter(t => t.amount > 0)
            .reduce((sum, t) => sum + t.amount, 0);
        
        const totalExpenses = this.transactions
            .filter(t => t.amount < 0)
            .reduce((sum, t) => sum + t.amount, 0);
        
        const balance = totalIncome + totalExpenses;
        
        document.getElementById('totalIncome').textContent = `₹${totalIncome.toLocaleString('en-IN')}`;
        document.getElementById('totalExpenses').textContent = `₹${Math.abs(totalExpenses).toLocaleString('en-IN')}`;
        document.getElementById('totalBalance').textContent = `₹${balance.toLocaleString('en-IN')}`;
        
        // Update ARIA live regions for screen readers
        const balanceElement = document.getElementById('totalBalance');
        balanceElement.setAttribute('aria-label', `Total balance: ₹${balance.toLocaleString('en-IN')}`);
    },
    
    // Initialize the chart
    initChart: function() {
        const ctx = document.getElementById('expenseChart').getContext('2d');
        
        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#ef476f', '#ff9e16', '#06d6a0', '#118ab2', 
                        '#073b4c', '#7209b7', '#f15bb5', '#90be6d', 
                        '#f3722c', '#4cc9f0'
                    ],
                    borderWidth: 2,
                    borderColor: function(context) {
                        // Use the background color for borders to create smooth edges
                        const chart = context.chart;
                        const {ctx, chartArea} = chart;
                        if (!chartArea) {
                            return null;
                        }
                        const index = context.dataIndex;
                        return context.dataset.backgroundColor[index];
                    },
                    borderRadius: 0, // Set to 0 for perfectly smooth edges
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.5,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: function(context) {
                                // Dynamically get text color based on theme
                                return getComputedStyle(document.documentElement).getPropertyValue('--text');
                            },
                            font: {
                                family: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                                size: 12
                            },
                            padding: 15,
                            boxWidth: 15,
                            usePointStyle: true
                        }
                    }
                },
                cutout: '60%',
                animation: {
                    animateScale: true,
                    animateRotate: true,
                    duration: 1000,
                    easing: 'easeOutQuart'
                },
                layout: {
                    padding: {
                        left: 5,
                        right: 5,
                        top: 5,
                        bottom: 5
                    }
                }
            }
        });
    },
    
    // Update the chart with current data
    updateChart: function() {
        // Show loading spinner
        document.getElementById('chartLoading').style.display = 'flex';
        
        // Simulate loading delay for demonstration
        setTimeout(() => {
            const categories = {};
            
            // Calculate total expenses by category
            this.transactions
                .filter(t => t.amount < 0)
                .forEach(t => {
                    if (!categories[t.category]) {
                        categories[t.category] = 0;
                    }
                    categories[t.category] += Math.abs(t.amount);
                });
            
            // Update chart data
            if (this.chart) {
                this.chart.data.labels = Object.keys(categories);
                this.chart.data.datasets[0].data = Object.values(categories);
                this.chart.update();
            }
            
            // Hide loading spinner
            document.getElementById('chartLoading').style.display = 'none';
        }, 800);
    }
};

// Initialize the application
function initApp() {
    expenseTracker.init();
}