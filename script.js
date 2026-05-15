const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxcEhONwZ27E1ujWCnMsj9Itf2HL_GfIQ0uQhfbecYhJfw0VwffWt1eCCgYsTrYIgK6dA/exec'';

const form = document.getElementById('guestForm');
const statusBox = document.getElementById('status');
const transfer = document.getElementById('transfer');
const transferDetails = document.getElementById('transferDetails');
const submitButton = form.querySelector('button[type="submit"]');

transfer.addEventListener('change', () => {
  transferDetails.classList.toggle('hidden', transfer.value !== 'Да');
});

function getCheckedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
    .map(item => item.value)
    .join(', ');
}

function showSuccess() {
  form.reset();
  transferDetails.classList.add('hidden');
  statusBox.textContent = 'Спасибо! Анкета отправлена.';
  submitButton.disabled = false;
  submitButton.textContent = 'Отправить анкету';
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (GOOGLE_SCRIPT_URL.includes('PASTE_GOOGLE_APPS_SCRIPT')) {
    statusBox.textContent = 'Сначала вставьте ссылку Google Apps Script в файл script.js.';
    return;
  }

  const data = new FormData(form);
  data.set('drinks', getCheckedValues('drinks'));
  data.set('food', getCheckedValues('food'));
  data.set('submittedAt', new Date().toISOString());

  statusBox.textContent = 'Отправляем...';
  submitButton.disabled = true;
  submitButton.textContent = 'Отправляем...';

  let finished = false;

  const finishOnce = () => {
    if (finished) return;
    finished = true;
    showSuccess();
  };

  // Google Apps Script при mode: 'no-cors' часто принимает данные,
  // но браузер не отдаёт нормальный ответ сайту. Поэтому показываем успех
  // через короткую паузу, не дожидаясь полного ответа от Google.
  const successTimer = setTimeout(finishOnce, 1800);

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: data,
      keepalive: true
    });

    clearTimeout(successTimer);
    finishOnce();
  } catch (error) {
    clearTimeout(successTimer);
    finished = true;
    submitButton.disabled = false;
    submitButton.textContent = 'Отправить анкету';
    statusBox.textContent = 'Не удалось отправить анкету. Проверьте интернет и попробуйте ещё раз.';
  }
});
