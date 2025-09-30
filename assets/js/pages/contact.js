// contact-form.js
const ContactForm = {
  init: () => {
    const form = document.querySelector('.form');
    if (form) {
      const errorMessages = document.querySelectorAll('.error-message');
      errorMessages.forEach(error => {
        error.style.display = 'none';
      });
      
      form.addEventListener('submit', ContactForm.handleSubmit);

      const inputs = form.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.addEventListener('input', () => {
          const errorId = `${input.id}Error`;
          ContactForm.hideFieldError(input.id, errorId);
        });
      });
    }
  },

  isValidEmail: (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]{1,64}(?=.{5,319}$)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  },

  showFieldError: (inputId, errorId, message) => {
    const inputElement = document.getElementById(inputId);
    const errorElement = document.getElementById(errorId);
    
    if (inputElement) {
      inputElement.setAttribute('aria-invalid', 'true');
    }
    
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  },

  hideFieldError: (inputId, errorId) => {
    const inputElement = document.getElementById(inputId);
    const errorElement = document.getElementById(errorId);
    
    if (inputElement) {
      inputElement.setAttribute('aria-invalid', 'false');
    }
    
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  },

  handleSubmit: (e) => {
    e.preventDefault();
    
    let hasError = false;
    
    ['name', 'email', 'contact', 'checkbox'].forEach(id => {
      ContactForm.hideFieldError(id, `${id}Error`);
    });
    
    const name = document.getElementById('name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const contact = document.getElementById('contact')?.value.trim();
    const checkbox = document.getElementById('checkbox')?.checked;
    
    if (!name) {
      ContactForm.showFieldError('name', 'nameError', 'お名前を入力してください。');
      hasError = true;
    }
    
    if (!email) {
      ContactForm.showFieldError('email', 'emailError', 'メールアドレスを入力してください。');
      hasError = true;
    } else if (!ContactForm.isValidEmail(email)) {
      ContactForm.showFieldError('email', 'emailError', '正しいメールアドレスの形式で入力してください。');
      hasError = true;
    }
    
    if (!contact) {
      ContactForm.showFieldError('contact', 'contactError', '内容を入力してください。');
      hasError = true;
    }
    
    if (!checkbox) {
      ContactForm.showFieldError('checkbox', 'checkError', '「同意する」をチェックしてください。');
      hasError = true;
    }
    
    if (!hasError) {
      const form = e.target;
      const action = form.getAttribute('action');
      if (action) {
        window.location.href = action;
      }
    } else {
      const firstError = document.querySelector('[aria-invalid="true"]');
      if (firstError) {
        firstError.focus();
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ContactForm.init();
});