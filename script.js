// Get all input elements
const accountBalance = document.getElementById('accountBalance');
const riskPercentage = document.getElementById('riskPercentage');
const entryPrice = document.getElementById('entryPrice');
const stopLoss = document.getElementById('stopLoss');
const riskUsd = document.getElementById('riskUsd');

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
    // Debounce calculations for better performance
    if (this.timeout) clearTimeout(this.timeout);
    
    this.timeout = setTimeout(() => {
        const balance = parseFloat(accountBalance.value) || 0;
        const risk = parseFloat(riskPercentage.value) || 0;
        const riskUsdValue = parseFloat(riskUsd.value) || 0;
        const entry = parseFloat(entryPrice.value) || 0;
        const stop = parseFloat(stopLoss.value) || 0;

        // Calculate risk amount from percentage
        const riskAmount = (balance * risk) / 100;
        
        // Update risk USD input when percentage changes
        if (!riskUsd.matches(':focus')) {
            riskUsd.value = riskAmount.toFixed(2);
        }
        
        // Calculate position size using risk USD
        let positionSize = 0;
        if (entry !== stop) {
            positionSize = riskUsdValue / Math.abs(entry - stop);
        }

        // Use requestAnimationFrame for smooth updates
        requestAnimationFrame(() => {
            riskAmountElement.textContent = `${riskAmount.toFixed(2)} USDT`;
            positionSizeElement.textContent = `${positionSize.toFixed(4)} Units`;
        });
    }, 100);
}

// Add event listeners to all inputs
[accountBalance, riskPercentage, entryPrice, stopLoss].forEach(input => {
    input.addEventListener('input', calculateRisk);
});

// Add these calculations to your existing code
function calculateAdditionalMetrics() {
    // Calculate R/R (Risk/Reward) Ratio
    const riskRewardRatio = Math.abs((targetPrice - entryPrice) / (entryPrice - stopLoss));
    
    // Calculate potential profit/loss
    const potentialProfit = positionSize * (targetPrice - entryPrice);
    const potentialLoss = positionSize * Math.abs(entryPrice - stopLoss);
}

// Save calculations to local storage
function saveToLocalStorage() {
    const data = {
        accountBalance: accountBalance.value,
        riskPercentage: riskPercentage.value,
        entryPrice: entryPrice.value,
        stopLoss: stopLoss.value
    };
    localStorage.setItem('calculatorData', JSON.stringify(data));
}

// Load saved calculations
function loadFromLocalStorage() {
    const saved = localStorage.getItem('calculatorData');
    if (saved) {
        const data = JSON.parse(saved);
        accountBalance.value = data.accountBalance || '';
        riskPercentage.value = data.riskPercentage || '';
        entryPrice.value = data.entryPrice || '';
        stopLoss.value = data.stopLoss || '';
        calculateRisk();
    }
}

function exportCalculation() {
    const data = {
        accountBalance: accountBalance.value,
        riskPercentage: riskPercentage.value,
        entryPrice: entryPrice.value,
        stopLoss: stopLoss.value,
        riskAmount: riskAmountElement.textContent,
        positionSize: positionSizeElement.textContent
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'position-calculation.json';
    a.click();
}

// Add swipe gestures for mobile
let touchstartX = 0;
let touchendX = 0;

document.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    handleGesture();
});

function handleGesture() {
    if (touchendX < touchstartX) showAdditionalInfo();
    if (touchendX > touchstartX) hideAdditionalInfo();
}

// Add touch event handling
document.addEventListener('DOMContentLoaded', function() {
    // Prevent double-tap zoom on iOS
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
            // Allow click events to still work
            const target = event.target;
            if (target.tagName === 'INPUT') {
                target.focus();
            }
        }
        lastTouchEnd = now;
    }, false);

    // Prevent pull-to-refresh
    document.body.addEventListener('touchmove', function(event) {
        // Only prevent if at top and scrolling down
        if (window.pageYOffset === 0 && event.touches[0].clientY > 50) {
            event.preventDefault();
        }
    }, { passive: true });

    // Better input handling for mobile
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        // Prevent zoom on focus for iOS
        input.addEventListener('focus', function() {
            document.body.scrollTop = document.body.scrollTop;
        });

        // Better number input handling
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.value = '0';
            }
        });
    });
}); 