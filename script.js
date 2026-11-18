const form = document.getElementById("registrationForm");
const formCard = document.getElementById("formCard");
const confirmationCard = document.getElementById("confirmationCard");
const submitButton = document.getElementById("submitButton");
const cancelEditButton = document.getElementById("cancelEditButton");
const passwordGroup = document.getElementById("passwordGroup");
const confirmPasswordGroup = document.getElementById("confirmPasswordGroup");
const registrationsTable = document.getElementById("registrationsTable");
const registryStatus = document.getElementById("registryStatus");
const storageKey = "techFestRegistrations";

let registrations = [];
let editingId = null;
let storageReady = false;

function setRegistryStatus(message) {
    registryStatus.textContent = message;
}

function isValidRegistration(record) {
    return record &&
        typeof record.id === "string" &&
        typeof record.fullName === "string" &&
        typeof record.email === "string" &&
        typeof record.phone === "string" &&
        typeof record.year === "string" &&
        Array.isArray(record.workshops) &&
        record.workshops.every(workshop => typeof workshop === "string") &&
        typeof record.comments === "string";
}

function loadRegistrations() {
    try {
        const saved = localStorage.getItem(storageKey);
        const parsed = saved ? JSON.parse(saved) : [];
        if (!Array.isArray(parsed) || parsed.some(record => !isValidRegistration(record))) {
            throw new Error("Stored registration data has an invalid format.");
        }
        registrations = parsed;
        storageReady = true;
    } catch (error) {
        storageReady = false;
        submitButton.disabled = true;
        setRegistryStatus("Saved registrations could not be loaded. Browser storage may be unavailable or the saved data may be invalid.");
    }
}

function saveRegistrations(nextRegistrations) {
    try {
        localStorage.setItem(storageKey, JSON.stringify(nextRegistrations));
        registrations = nextRegistrations;
        return true;
    } catch (error) {
        setRegistryStatus("Could not save your changes. Browser storage may be unavailable or full; no changes were applied.");
        return false;
    }
}

function setError(input, message, errorId) {
    if (input) input.classList.add("error");
    const errorBox = document.getElementById(errorId);
    errorBox.textContent = message;
}

function clearError(input, errorId) {
    if (input) input.classList.remove("error");
    document.getElementById(errorId).textContent = "";
}

function clearErrors() {
    document.querySelectorAll(".error").forEach(element => element.classList.remove("error"));
    document.querySelectorAll(".error-message").forEach(element => element.textContent = "");
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

function createRegistrationId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function renderRegistrations() {
    if (!storageReady) {
        document.getElementById("registrationCount").textContent = "—";
        document.getElementById("registrationCountLabel").textContent = "unavailable";
        document.getElementById("emptyState").textContent = "Registration data could not be loaded.";
        document.getElementById("emptyState").classList.remove("hidden");
        document.getElementById("tableWrap").classList.add("hidden");
        return;
    }

    const count = registrations.length;
    document.getElementById("registrationCount").textContent = count;
    document.getElementById("registrationCountLabel").textContent =
        count === 1 ? "person registered" : "people registered";
    document.getElementById("emptyState").classList.toggle("hidden", count > 0);
    document.getElementById("tableWrap").classList.toggle("hidden", count === 0);
    registrationsTable.replaceChildren();

    registrations.forEach(registration => {
        const row = document.createElement("tr");
        const values = [
            registration.fullName,
            registration.email,
            registration.year,
            registration.workshops.join(", ")
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actions = document.createElement("td");
        actions.className = "record-actions";
        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "button-secondary";
        editButton.textContent = "Edit";
        editButton.dataset.action = "edit";
        editButton.dataset.id = registration.id;
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "button-danger";
        deleteButton.textContent = "Delete";
        deleteButton.dataset.action = "delete";
        deleteButton.dataset.id = registration.id;
        actions.append(editButton, deleteButton);
        row.appendChild(actions);
        registrationsTable.appendChild(row);
    });
}

function resetForm() {
    form.reset();
    clearErrors();
}

function leaveEditMode() {
    editingId = null;
    passwordGroup.classList.remove("hidden");
    confirmPasswordGroup.classList.remove("hidden");
    document.getElementById("password").required = true;
    document.getElementById("confirmPassword").required = true;
    submitButton.textContent = "Register";
    cancelEditButton.classList.add("hidden");
    document.getElementById("formTitle").textContent = "Tech Fest Registration";
}

function showConfirmation(registration, wasUpdated) {
    document.getElementById("summaryName").textContent = registration.fullName;
    document.getElementById("summaryEmail").textContent = registration.email;
    document.getElementById("summaryYear").textContent = registration.year;
    document.getElementById("summaryWorkshops").textContent = registration.workshops.join(", ");
    document.getElementById("confirmationMessage").textContent = wasUpdated
        ? "Your registration has been updated."
        : "Your Tech Fest registration has been received.";
    formCard.classList.add("hidden");
    confirmationCard.classList.remove("hidden");
}

form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!storageReady) return;

    const valid = [
        validateName(),
        validateEmail(),
        validateYear(),
        editingId ? true : validatePassword(),
        editingId ? true : validateConfirmPassword(),
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
    const wasUpdated = Boolean(editingId);
    const registration = {
        id: editingId || createRegistrationId(),
        fullName: data.get("fullName").trim(),
        email: data.get("email").trim(),
        phone: data.get("phone").trim(),
        year: data.get("year"),
        workshops: data.getAll("workshops"),
        comments: data.get("comments").trim()
    };

    if (wasUpdated && !registrations.some(item => item.id === editingId)) {
        setRegistryStatus("This registration no longer exists. Refresh the list and try again.");
        return;
    }

    const nextRegistrations = wasUpdated
        ? registrations.map(item => item.id === editingId ? registration : item)
        : [registration, ...registrations];

    if (!saveRegistrations(nextRegistrations)) return;

    renderRegistrations();
    setRegistryStatus(wasUpdated ? "Registration updated." : "Registration added.");
    resetForm();
    leaveEditMode();
    showConfirmation(registration, wasUpdated);
});

function startEditing(registration) {
    editingId = registration.id;
    document.getElementById("fullName").value = registration.fullName;
    document.getElementById("email").value = registration.email;
    document.getElementById("phone").value = registration.phone;
    document.getElementById("year").value = registration.year;
    document.getElementById("comments").value = registration.comments;
    document.getElementById("terms").checked = true;
    document.querySelectorAll('input[name="workshops"]').forEach(checkbox => {
        checkbox.checked = registration.workshops.includes(checkbox.value);
    });
    document.getElementById("password").value = "";
    document.getElementById("confirmPassword").value = "";
    passwordGroup.classList.add("hidden");
    confirmPasswordGroup.classList.add("hidden");
    document.getElementById("password").required = false;
    document.getElementById("confirmPassword").required = false;
    document.getElementById("formTitle").textContent = "Update Registration";
    submitButton.textContent = "Save Changes";
    cancelEditButton.classList.remove("hidden");
    clearErrors();
    setRegistryStatus("");
    confirmationCard.classList.add("hidden");
    formCard.classList.remove("hidden");
    formCard.scrollIntoView({ behavior: "smooth", block: "start" });
    document.getElementById("fullName").focus({ preventScroll: true });
}

registrationsTable.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const registration = registrations.find(item => item.id === button.dataset.id);
    if (!registration) {
        setRegistryStatus("That registration could not be found. Refresh the list and try again.");
        return;
    }

    if (button.dataset.action === "edit") {
        startEditing(registration);
        return;
    }

    if (button.dataset.action === "delete" &&
        window.confirm(`Delete the registration for ${registration.fullName}?`)) {
        const nextRegistrations = registrations.filter(item => item.id !== registration.id);
        if (!saveRegistrations(nextRegistrations)) return;
        if (editingId === registration.id) {
            resetForm();
            leaveEditMode();
        }
        renderRegistrations();
        setRegistryStatus("Registration deleted.");
    }
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

cancelEditButton.addEventListener("click", function () {
    resetForm();
    leaveEditMode();
    setRegistryStatus("Update cancelled.");
    document.getElementById("fullName").focus();
});

document.getElementById("anotherButton").addEventListener("click", function () {
    resetForm();
    leaveEditMode();
    confirmationCard.classList.add("hidden");
    formCard.classList.remove("hidden");
    document.getElementById("fullName").focus();
});

loadRegistrations();
renderRegistrations();
