const form = document.getElementById("registrationForm");
const formCard = document.getElementById("formCard");
const confirmationCard = document.getElementById("confirmationCard");

function setError(input, message, errorId) {
    if (input) input.classList.add("error");
    const errorBox = document.getElementById(errorId);
    errorBox.textContent = message;
}

function clearError(input, errorId) {
    if (input) input.classList.remove("error");
    document.getElementById(errorId).textContent = "";
}

function validateName() {
    const input = document.getElementById("fullName");
    if (input.value.trim().length < 3) {
        setError(input, "Name must be at least 3 characters.", "fullNameError");
        return false;
    }
    clearError(input, "fullNameError");
    return true;
}

function validateEmail() {
    const input = document.getElementById("email");
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(input.value.trim())) {
        setError(input, "Please enter a valid email address.", "emailError");
        return false;
    }
    clearError(input, "emailError");
    return true;
}

function validateYear() {
    const input = document.getElementById("year");
    if (!input.value) {
        setError(input, "Please select your year of study.", "yearError");
        return false;
    }
    clearError(input, "yearError");
    return true;
}

function validatePassword() {
    const input = document.getElementById("password");
    if (input.value.length < 8) {
        setError(input, "Password must be at least 8 characters.", "passwordError");
        return false;
    }
    if (!/\d/.test(input.value)) {
        setError(input, "Password must contain at least one number.", "passwordError");
        return false;
    }
    clearError(input, "passwordError");
    return true;
}

function validateConfirmPassword() {
    const password = document.getElementById("password");
    const input = document.getElementById("confirmPassword");

    if (input.value !== password.value) {
        setError(input, "Passwords do not match.", "confirmPasswordError");
        return false;
    }
    clearError(input, "confirmPasswordError");
    return true;
}

function validateWorkshops() {
    const workshops = document.querySelectorAll('input[name="workshops"]:checked');
    if (workshops.length === 0) {
        setError(null, "Please select at least one workshop.", "workshopsError");
        return false;
    }
    clearError(null, "workshopsError");
    return true;
}

function validateTerms() {
    const input = document.getElementById("terms");
    if (!input.checked) {
        setError(input, "You must agree to the terms.", "termsError");
        return false;
    }
    clearError(input, "termsError");
    return true;
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const valid = [
        validateName(),
        validateEmail(),
        validateYear(),
        validatePassword(),
        validateConfirmPassword(),
        validateWorkshops(),
        validateTerms()
    ];

    if (!valid.every(Boolean)) {
        const firstInvalid = form.querySelector(".error");
        if (firstInvalid) firstInvalid.focus();
        else document.querySelector('input[name="workshops"]').focus();
        return;
    }

    const data = new FormData(form);
    const workshops = data.getAll("workshops");

    document.getElementById("summaryName").textContent = data.get("fullName");
    document.getElementById("summaryEmail").textContent = data.get("email");
    document.getElementById("summaryYear").textContent = data.get("year");
    document.getElementById("summaryWorkshops").textContent = workshops.join(", ");

    formCard.classList.add("hidden");
    confirmationCard.classList.remove("hidden");
});

document.getElementById("fullName").addEventListener("input", validateName);
document.getElementById("email").addEventListener("input", validateEmail);
document.getElementById("year").addEventListener("change", validateYear);
document.getElementById("password").addEventListener("input", () => {
    validatePassword();
    if (document.getElementById("confirmPassword").value) validateConfirmPassword();
});
document.getElementById("confirmPassword").addEventListener("input", validateConfirmPassword);
document.querySelectorAll('input[name="workshops"]').forEach(box => {
    box.addEventListener("change", validateWorkshops);
});
document.getElementById("terms").addEventListener("change", validateTerms);

document.getElementById("anotherButton").addEventListener("click", function () {
    form.reset();

    document.querySelectorAll(".error").forEach(el => el.classList.remove("error"));
    document.querySelectorAll(".error-message").forEach(el => el.textContent = "");

    confirmationCard.classList.add("hidden");
    formCard.classList.remove("hidden");
    document.getElementById("fullName").focus();
});
