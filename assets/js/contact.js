// contact-form.js
const ContactForm = {
  init: () => {
    const form = document.querySelector('.form');
    if (form) {
      // 初期状態ですべてのエラーメッセージを非表示に
      const errorMessages = document.querySelectorAll('.error-message');
      errorMessages.forEach(error => {
        error.style.display = 'none';
      });
      
      form.addEventListener('submit', ContactForm.handleSubmit);

      // 入力項目にイベントリスナーを追加
      const inputs = form.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.addEventListener('input', () => {
          const errorId = `${input.id}Error`;
          ContactForm.hideFieldError(errorId);
        });
      });
    }
  },

  // フォーム固有のバリデーション関数
  isValidEmail: (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]{1,64}(?=.{5,319}$)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  },

  // 個別のフィールドエラー表示
  showFieldError: (elementId, message) => {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  },

  // エラーメッセージを非表示にする
  hideFieldError: (elementId) => {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  },

  handleSubmit: (e) => {
    e.preventDefault();
    
    let hasError = false;
    
    // すべてのエラーを一旦非表示に
    ['nameError', 'emailError', 'contactError', 'checkError'].forEach(id => {
      ContactForm.hideFieldError(id);
    });
    
    const name = document.getElementById('name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const contact = document.getElementById('contact')?.value.trim();
    const checkbox = document.getElementById('checkbox')?.checked;
    
    // バリデーション
    if (!name) {
      ContactForm.showFieldError('nameError', 'お名前を入力してください。');
      hasError = true;
    }
    
    if (!email) {
      ContactForm.showFieldError('emailError', 'メールアドレスを入力してください。');
      hasError = true;
    } else if (!ContactForm.isValidEmail(email)) {
      ContactForm.showFieldError('emailError', '正しいメールアドレスの形式で入力してください。');
      hasError = true;
    }
    
    if (!contact) {
      ContactForm.showFieldError('contactError', '内容を入力してください。');
      hasError = true;
    }
    
    if (!checkbox) {
      ContactForm.showFieldError('checkError', '「同意する」をチェックしてください。');
      hasError = true;
    }
    
    // エラーがなければ送信
    if (!hasError) {
      const form = e.target;
      const action = form.getAttribute('action');
      if (action) {
        window.location.href = action;
      }
    }
  }
};

// ContactFormの初期化
document.addEventListener('DOMContentLoaded', () => {
  ContactForm.init();
});