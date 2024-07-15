// Calculator functionality
const calcScreen = document.getElementById('calc-screen');
let currentValue = '0';
let previousValue = null;
let operator = null;

document.querySelectorAll('#calculator-window .calc-btn').forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;

        if ('0123456789.'.includes(value)) {
            if (currentValue === '0' && value !== '.') {
                currentValue = value;
            } else {
                currentValue += value;
            }
        } else if ('+-*/'.includes(value)) {
            previousValue = currentValue;
            currentValue = '0';
            operator = value;
        } else if (value === '=') {
            if (previousValue !== null && operator !== null) {
                currentValue = String(eval(`${previousValue}${operator}${currentValue}`));
                previousValue = null;
                operator = null;
            }
        } else if (value === 'C') {
            currentValue = '0';
            previousValue = null;
            operator = null;
        } else if (value === '←') {
            currentValue = currentValue.slice(0, -1);
            if (currentValue === '') currentValue = '0';
        }

        calcScreen.textContent = currentValue;
    });
});
