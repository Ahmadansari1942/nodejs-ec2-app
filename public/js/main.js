// Main JavaScript file

// Show alert messages
function showAlert(message, type = 'success') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.position = 'fixed';
    alert.style.top = '20px';
    alert.style.right = '20px';
    alert.style.zIndex = '10000';
    alert.style.minWidth = '250px';
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.opacity = '0';
        alert.style.transition = 'opacity 0.3s';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

// Confirm delete
window.confirmDelete = function(message = 'Are you sure you want to delete this?') {
    return confirm(message);
};

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form validation
const forms = document.querySelectorAll('form[data-validate]');
forms.forEach(form => {
    form.addEventListener('submit', function(e) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = 'var(--danger-color)';
            } else {
                input.style.borderColor = 'var(--border-color)';
            }
        });
        
        if (!isValid) {
            e.preventDefault();
            showAlert('Please fill in all required fields', 'error');
        }
    });
});

// Auto-hide alerts
const alerts = document.querySelectorAll('.alert');
alerts.forEach(alert => {
    setTimeout(() => {
        alert.style.opacity = '0';
        alert.style.transition = 'opacity 0.3s';
        setTimeout(() => alert.remove(), 300);
    }, 5000);
});

console.log('Task Manager App loaded successfully!');
