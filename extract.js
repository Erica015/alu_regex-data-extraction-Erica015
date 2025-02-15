// Regular expressions for validation
const patterns = {
    email: /^[a-zA-Z0-9._-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
    url: /^https?:\/\/([\w\.-]+)\.([a-zA-Z]{2,})\.([\w]{2,})(\/[\w-])\/?$/,
    phone: /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
    creditCard: /^\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}$/,
    time: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$|^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(?:AM|PM)$/i,
    htmlTags:
        /^<[a-z][a-z0-9](?:\s+[a-z0-9-]+(?:=["'][^"']["'])?)\s(?:\/?)>$/i,
    hashtag: /^#[A-Za-z]\w*$/,
    currency: /^\$\d+(\.\d{2})?$/,
};

// Error messages for each input type
const errorMessages = {
    email:
        "Please enter a valid email (e.g., user@example.com or firstname.lastname@company.co.uk)",
    url: "Please enter a valid URL (e.g., https://www.example.com)",
    phone: "Please enter a valid phone number (e.g., (123) 456-7890)",
    creditCard: "Please enter a valid 16-digit credit card number",
    time: "Please enter a valid time (e.g., 14:30 or 2:30 PM)",
    htmlTags: 'Please enter valid HTML tags (e.g., <p> or <div class="example">)',
    hashtag: "Please enter a valid hashtag starting with # (e.g., #example)",
    currency: "Please enter a valid currency amount (e.g., $19.99)",
};

// Get form and input elements
const form = document.querySelector("form");
const inputs = {
    email: document.getElementById("email"),
    url: document.getElementById("url"),
    phone: document.getElementById("phone"),
    creditCard: document.getElementById("credit-card"),
    time: document.getElementById("time"),
    htmlTags: document.getElementById("html-tags"),
    hashtag: document.getElementById("hashtag"),
    currency: document.getElementById("currency"),
};

// Create error message elements for each input
Object.keys(inputs).forEach((inputType) => {
    const input = inputs[inputType];
    if (input) {
        // Create error message container
        const errorDiv = document.createElement("div");
        errorDiv.className = "error-message";
        errorDiv.style.color = "#e53e3e";
        errorDiv.style.fontSize = "0.875rem";
        errorDiv.style.marginTop = "-15px";
        errorDiv.style.marginBottom = "15px";
        errorDiv.style.display = "none";
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
    }
});

// Validation functions for each input type
const validators = {
    email: (value) => {
        return patterns.email.test(value);
    },
    url: (value) => {
        return patterns.url.test(value);
    },
    phone: (value) => {
        return patterns.phone.test(value);
    },
    creditCard: (value) => {
        return patterns.creditCard.test(value);
    },
    time: (value) => {
        return patterns.time.test(value);
    },
    htmlTags: (value) => {
        console.log("The html tag value", patterns.htmlTags.test(value));
        return patterns.htmlTags.test(value);
    },
    hashtag: (value) => {
        return patterns.hashtag.test(value);
    },
    currency: (value) => {
        return patterns.currency.test(value);
    },
};

// Function to show error message
function showError(input, message) {
    const errorDiv = input.nextSibling;
    if (errorDiv && errorDiv.className === "error-message") {
        errorDiv.textContent = message;
        errorDiv.style.display = "block";
    }
}

// Function to hide error message
function hideError(input) {
    const errorDiv = input.nextSibling;
    if (errorDiv && errorDiv.className === "error-message") {
        errorDiv.style.display = "none";
    }
}

// Function to validate a single input
function validateInput(input) {
    if (!input) return false;

    const inputType = input.id.replace("-", "");
    const value = input.value.trim();

    // Skip validation if field is empty (unless it's required)
    if (!value && !input.hasAttribute("required")) {
        resetInputStyle(input);
        hideError(input);
        return true;
    }

    if (validators[inputType]) {
        const isValid = validators[inputType](value);
        updateInputStyle(input, isValid);
        if (!isValid) {
            showError(input, errorMessages[inputType]);
        } else {
            hideError(input);
        }
        return isValid;
    }

    return false;
}

// Function to update input styling
function updateInputStyle(input, isValid) {
    input.style.backgroundColor = isValid ? "#f0fff4" : "#fff5f5";
    input.style.borderColor = isValid ? "#48bb78" : "#fc8181";

    if (!isValid) {
        input.setCustomValidity(errorMessages[input.id.replace("-", "")]);
    } else {
        input.setCustomValidity("");
    }
}

// Function to reset input styling
function resetInputStyle(input) {
    input.style.backgroundColor = "";
    input.style.borderColor = "";
    input.setCustomValidity("");
    hideError(input);
}

// Function to validate all inputs
function validateAllInputs() {
    let isAllValid = true;
    Object.values(inputs).forEach((input) => {
        if (input && !validateInput(input)) {
            isAllValid = false;
        }
    });
    return isAllValid;
}

// Function to handle input changes
function handleInput(event) {
    const input = event.target;

    validateInput(input);

    // Validate all fields that come after this one
    let foundCurrent = false;
    Object.values(inputs).forEach((otherInput) => {
        if (otherInput === input) {
            foundCurrent = true;
        } else if (foundCurrent && otherInput.value.trim()) {
            validateInput(otherInput);
        }
    });
}

// Function to handle form submission
function handleSubmit(event) {
    event.preventDefault();

    const isValid = validateAllInputs();

    if (isValid) {
        console.log("Form is valid, submitting...");
        // Uncomment the following line to submit the form
        // form.submit();
    } else {
        // Focus on the first invalid input
        Object.values(inputs).some((input) => {
            if (input && input.value.trim() && !validateInput(input)) {
                input.focus();
                return true;
            }
            return false;
        });
    }
}

// Add event listeners
Object.values(inputs).forEach((input) => {
    if (input) {
        // Validate on input change
        input.addEventListener("input", handleInput);

        // Validate on blur
        input.addEventListener("blur", (e) => {
            validateInput(e.target);
        });

        // Initial validation if field has a value
        if (input.value.trim()) {
            validateInput(input);
        }
    }
});

// Format credit card number as user types
inputs.creditCard.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/(\d{4})(?=\d)/g, "$1-");
    e.target.value = value;
});

// Format phone number as user types
inputs.phone.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 6) {
        value =value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;

    }
    e.target.value = value;
});

// Add form submit listener
form.addEventListener("submit", handleSubmit);

// Initial validation of all fields that have values
document.addEventListener("DOMContentLoaded", () => {
    validateAllInputs();
});