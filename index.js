// Character sets for password generation
const characterSets = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "~`!@#$%^&*()_-+={[}]|:;<>.?/"
};

// DOM elements
const lengthSlider = document.getElementById('length-slider');
const lengthValue = document.getElementById('length-value');
const uppercaseCheckbox = document.getElementById('uppercase');
const lowercaseCheckbox = document.getElementById('lowercase');
const numbersCheckbox = document.getElementById('numbers');
const symbolsCheckbox = document.getElementById('symbols');
const generateBtn = document.getElementById('generate-btn');
const passwordOutput = document.getElementById('password-output');
const copyBtn = document.getElementById('copy-btn');
const strengthFill = document.getElementById('strength-fill');
const strengthText = document.getElementById('strength-text');

// Event listeners
lengthSlider.addEventListener('input', updateLengthValue);
generateBtn.addEventListener('click', generatePassword);
copyBtn.addEventListener('click', copyPassword);

// Update character sets when checkboxes change
[uppercaseCheckbox, lowercaseCheckbox, numbersCheckbox, symbolsCheckbox].forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        if (passwordOutput.value) {
            generatePassword();
        }
    });
});

// Update length display
function updateLengthValue() {
    lengthValue.textContent = lengthSlider.value;
    if (passwordOutput.value) {
        generatePassword();
    }
}

// Generate password
function generatePassword() {
    console.log('Character sets:', characterSets);
    console.log('Character sets types:', {
        uppercase: typeof characterSets.uppercase,
        lowercase: typeof characterSets.lowercase,
        numbers: typeof characterSets.numbers,
        symbols: typeof characterSets.symbols
    });

    const length = parseInt(lengthSlider.value);
    let availableChars = '';

    // Build character set based on selected options
    if (uppercaseCheckbox && uppercaseCheckbox.checked) availableChars += characterSets.uppercase;
    if (lowercaseCheckbox && lowercaseCheckbox.checked) availableChars += characterSets.lowercase;
    if (numbersCheckbox && numbersCheckbox.checked) availableChars += characterSets.numbers;
    if (symbolsCheckbox && symbolsCheckbox.checked) availableChars += characterSets.symbols;
    
    // Ensure at least one character set is selected
    if (availableChars === '') {
        alert('Please select at least one character type!');
        return;
    }
    
    // Generate password
    let password = '';
    
    // Ensure password contains at least one character from each selected type
    const requiredChars = [];
    if (uppercaseCheckbox.checked) requiredChars.push(getRandomChar(characterSets.uppercase));
    if (lowercaseCheckbox.checked) requiredChars.push(getRandomChar(characterSets.lowercase));
    if (numbersCheckbox.checked) requiredChars.push(getRandomChar(characterSets.numbers));
    if (symbolsCheckbox.checked) requiredChars.push(getRandomChar(characterSets.symbols));
    
    // Add required characters
    for (let i = 0; i < requiredChars.length && i < length; i++) {
        password += requiredChars[i];
    }
    
    // Fill remaining length with random characters
    for (let i = password.length; i < length; i++) {
        password += getRandomChar(availableChars);
    }
    
    // Shuffle the password to avoid predictable patterns
    password = shuffleString(password);
    
    // Display password and update strength
    passwordOutput.value = password;
    updatePasswordStrength(password);
}

// Get random character from string
function getRandomChar(str) {
    // Add error checking
    if (typeof str !== 'string' || str.length === 0) {
        console.error('getRandomChar received invalid input:', str, typeof str);
        return '';
    }
    return str.charAt(Math.floor(Math.random() * str.length));
}

// Shuffle string characters
function shuffleString(str) {
    const array = str.split('');
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
}

// Copy password to clipboard
async function copyPassword() {
    if (!passwordOutput.value) {
        alert('Generate a password first!');
        return;
    }
    
    try {
        await navigator.clipboard.writeText(passwordOutput.value);
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('copied');
        
        setTimeout(() => {
            copyBtn.textContent = 'Copy';
            copyBtn.classList.remove('copied');
        }, 2000);
    } catch (err) {
        // Fallback for older browsers
        passwordOutput.select();
        document.execCommand('copy');
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('copied');
        
        setTimeout(() => {
            copyBtn.textContent = 'Copy';
            copyBtn.classList.remove('copied');
        }, 2000);
    }
}

// Calculate and update password strength
function updatePasswordStrength(password) {
    let score = 0;
    let feedback = '';
    
    // Length scoring
    if (password.length >= 15) score += 1;
    if (password.length >= 18) score += 1;
    if (password.length >= 22) score += 1;
    
    // Character variety scoring
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    
    // Additional complexity
    if (password.length >= 20) score += 1;
    
    // Determine strength level
    let strengthClass = '';
    let strengthPercentage = 0;
    
    if (score <= 2) {
        feedback = 'Weak';
        strengthClass = 'strength-weak';
        strengthPercentage = 20;
    } else if (score <= 4) {
        feedback = 'Fair';
        strengthClass = 'strength-fair';
        strengthPercentage = 40;
    } else if (score <= 6) {
        feedback = 'Good';
        strengthClass = 'strength-good';
        strengthPercentage = 60;
    } else if (score <= 7) {
        feedback = 'Strong';
        strengthClass = 'strength-strong';
        strengthPercentage = 80;
    } else {
        feedback = 'Very Strong';
        strengthClass = 'strength-very-strong';
        strengthPercentage = 100;
    }
    
    // Update UI
    strengthFill.className = `strength-fill ${strengthClass}`;
    strengthFill.style.width = `${strengthPercentage}%`;
    strengthText.textContent = feedback;
    strengthText.className = `strength-text ${strengthClass}`;
}

// Generate initial password on page load
window.addEventListener('load', generatePassword);
