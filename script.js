document.addEventListener('DOMContentLoaded', () => {
  // Вставьте сюда ссылку веб-приложения Google Apps Script. Нужна ссылка, которая заканчивается на /exec
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxcEhONwZ27E1ujWCnMsj9Itf2HL_GfIQ0uQhfbecYhJfw0VwffWt1eCCgYsTrYIgK6dA/exec';

  const form = document.getElementById('guestForm');
  const statusBox = document.getElementById('status');
  const transfer = document.getElementById('transfer');
  const transferDetails = document.getElementById('transferDetails');

  if (!form || !statusBox) {
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');

  function showTransferDetails() {
    if (!transfer || !transferDetails) return;
    transferDetails.classList.toggle('hidden', transfer.value !== 'Да');
  }

  if (transfer) {
    transfer.addEventListener('change', showTransferDetails);
    showTransferDetails();
  }

  function valueOf(name) {
    const field = form.elements[name];
    return field ? String(field.value || '').trim() : '';
  }

  function getCheckedValues(name) {
    return Array.from(form.querySelectorAll(`input[name="${name}"]:checked`))
      .map(item => item.value)
      .join(', ');
  }

  function addHiddenField(targetForm, name, value) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value || '';
    targetForm.appendChild(input);
  }

  function getOrCreateHiddenIframe() {
    let iframe = document.getElementById('googleSubmitFrame');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.name = 'googleSubmitFrame';
      iframe.id = 'googleSubmitFrame';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
    }
    return iframe;
  }

  function finishForm() {
    form.reset();

    if (transferDetails) {
      transferDetails.classList.add('hidden');
    }

    statusBox.textContent = 'Анкета отправлена. Спасибо!';

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Отправить анкету';
    }
  }

  function showError(message) {
    statusBox.textContent = message;

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Отправить анкету';
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const url = GOOGLE_SCRIPT_URL.trim();

    if (!url || url.includes('PASTE_GOOGLE_APPS_SCRIPT')) {
      showError('Сначала вставьте ссылку Google Apps Script в файл script.js.');
      return;
    }

    if (!url.startsWith('https://script.google.com/macros/s/') || !url.endsWith('/exec')) {
      showError('Проверьте ссылку Google Apps Script: она должна начинаться с https://script.google.com/macros/s/ и заканчиваться на /exec.');
      return;
    }

    statusBox.textContent = '';

    if (submitButton) {
      submitButton.disabled = true;
    }

    const iframe = getOrCreateHiddenIframe();

    const googleForm = document.createElement('form');
    googleForm.method = 'POST';
    googleForm.action = url;
    googleForm.target = iframe.name;
    googleForm.style.display = 'none';

    const payload = {
      fullName: valueOf('fullName'),
      attendance: valueOf('attendance'),
      guestCount: valueOf('guestCount'),
      transfer: valueOf('transfer'),
      transferCity: valueOf('transferCity'),
      transferDistrict: valueOf('transferDistrict'),
      drinks: getCheckedValues('drinks'),
      food: getCheckedValues('food'),
      allergies: valueOf('allergies'),
      comment: valueOf('comment'),
      submittedAt: new Date().toISOString()
    };

    Object.entries(payload).forEach(([name, value]) => {
      addHiddenField(googleForm, name, value);
    });

    document.body.appendChild(googleForm);

    try {
      googleForm.submit();

      window.setTimeout(() => {
        if (googleForm.parentNode) {
          googleForm.parentNode.removeChild(googleForm);
        }

        finishForm();
      }, 700);
    } catch (error) {
      finishForm();
    }
  });
});
