const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxcEhONwZ27E1ujWCnMsj9Itf2HL_GfIQ0uQhfbecYhJfw0VwffWt1eCCgYsTrYIgK6dA/exec';

const form = document.getElementById('guestForm');
const statusBox = document.getElementById('status');
const transfer = document.getElementById('transfer');
const transferDetails = document.getElementById('transferDetails');

transfer.addEventListener('change', () => {
  transferDetails.classList.toggle('hidden', transfer.value !== 'Да');
});

function getCheckedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
    .map(item => item.value)
    .join(', ');
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (GOOGLE_SCRIPT_URL.includes('PASTE_GOOGLE_APPS_SCRIPT')) {
    statusBox.textContent = 'Сначала вставьте ссылку Google Apps Script в код страницы.';
    return;
  }

  const data = new FormData(form);
  data.set('drinks', getCheckedValues('drinks'));
  data.set('food', getCheckedValues('food'));
  data.set('submittedAt', new Date().toISOString());

  statusBox.textContent = 'Отправляем...';

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: data
    });

    form.reset();
    transferDetails.classList.add('hidden');
    statusBox.textContent = 'Спасибо! Анкета отправлена.';
  } catch (error) {
    statusBox.textContent = 'Не удалось отправить анкету. Попробуйте ещё раз.';
  }
});
