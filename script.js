// Get all input elements
const accountBalance = document.getElementById('accountBalance');
const riskPercentage = document.getElementById('riskPercentage');
const entryPrice = document.getElementById('entryPrice');
const stopLoss = document.getElementById('stopLoss');

// Get result elements
const riskAmountElement = document.getElementById('riskAmount');
const positionSizeElement = document.getElementById('positionSize');

// Function to validate number input
function isNumberKey(evt) {
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    // Allow decimal point
    if (charCode === 46) {
        const input = evt.target;
        if (input.value.includes('.')) {
            evt.preventDefault();
            return false;
        }
        return true;
    }
    // Allow only numbers
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
        return false;
    }
    return true;
}

// Function to validate input values
function validateInput(input) {
    // Ensure value is numeric
    let value = parseFloat(input.value) || 0;
    
    // Apply specific validation rules
    switch(input.id) {
        case 'riskPercentage':
            if (value > 100) {
                input.value = 100;
            }
            break;
        case 'accountBalance':
        case 'entryPrice':
        case 'stopLoss':
            if (value < 0) {
                input.value = 0;
            }
            break;
    }
    
    calculateRisk();
}

// Function to calculate risk and position size
function calculateRisk() {
    const balance = parseFloat(accountBalance.value) || 0;
    const risk = parseFloat(riskPercentage.value) || 0;
    const entry = parseFloat(entryPrice.value) || 0;
    const stop = parseFloat(stopLoss.value) || 0;

    // Calculate risk amount
    const riskAmount = (balance * risk) / 100;

    // Calculate position size
    let positionSize = 0;
    if (entry !== stop) {
        positionSize = riskAmount / Math.abs(entry - stop);
    }

    // Update display with formatted numbers
    riskAmountElement.textContent = `${riskAmount.toFixed(2)} USDT`;
    positionSizeElement.textContent = `${positionSize.toFixed(4)} Units`;
}

// Add event listeners to all inputs
[accountBalance, riskPercentage, entryPrice, stopLoss].forEach(input => {
    input.addEventListener('input', calculateRisk);
}); 