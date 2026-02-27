// Utility Functions
class LifeLedgerUtils {
    
    static generateMedicalId(fullname, type) {
        const initials = fullname
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .join('');
        const number = Math.floor(1000 + Math.random() * 9000);
        return `${type}-${initials}-${number}`;
    }
    
    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    static validatePhone(phone) {
        const re = /^[\+]?[1-9][\d]{0,15}$/;
        return re.test(phone);
    }
    
    static formatDate(timestamp) {
        return new Date(timestamp * 1000).toLocaleDateString();
    }
    
    static showLoading(show = true) {
        const loader = document.getElementById('loadingSpinner');
        if (loader) {
            loader.style.display = show ? 'block' : 'none';
        }
    }
    
    static showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const container = document.querySelector('.container');
        container.insertBefore(alertDiv, container.firstChild);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
    
    static async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showAlert('Copied to clipboard!', 'success');
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }
}
