// Age Calculator project - CodeAlpha internship
// calculates age from date of birth

function calculateAge() {
  const dayInput   = document.getElementById('day');
  const monthInput = document.getElementById('month');
  const yearInput  = document.getElementById('year');
  const errorMsg   = document.getElementById('error-msg');
  const result     = document.getElementById('result');

  const day   = parseInt(dayInput.value.trim(), 10);
  const month = parseInt(monthInput.value.trim(), 10);
  const year  = parseInt(yearInput.value.trim(), 10);

  // --- Input Validation ---
  errorMsg.textContent = '';
  result.classList.add('hidden');

  if (!dayInput.value || !monthInput.value || !yearInput.value) {
    errorMsg.textContent = '⚠ Please fill in all three fields.';
    return;
  }
  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    errorMsg.textContent = '⚠ Please enter valid numbers.';
    return;
  }
  if (month < 1 || month > 12) {
    errorMsg.textContent = '⚠ Month must be between 1 and 12.';
    return;
  }
  if (day < 1 || day > daysInMonth(month, year)) {
    errorMsg.textContent = `⚠ Day must be between 1 and ${daysInMonth(month, year)} for that month.`;
    return;
  }
  if (year < 1900 || year > new Date().getFullYear()) {
    errorMsg.textContent = '⚠ Year must be between 1900 and today.';
    return;
  }

  const birthDate = new Date(year, month - 1, day);
  const today     = new Date();
  today.setHours(0, 0, 0, 0);

  if (birthDate > today) {
    errorMsg.textContent = '⚠ Date of birth cannot be in the future.';
    return;
  }

  // --- Age Calculation ---
  let ageYears  = today.getFullYear() - birthDate.getFullYear();
  let ageMonths = today.getMonth()    - birthDate.getMonth();
  let ageDays   = today.getDate()     - birthDate.getDate();

  if (ageDays < 0) {
    ageMonths--;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    ageDays += prevMonth.getDate();
  }
  if (ageMonths < 0) {
    ageYears--;
    ageMonths += 12;
  }

  
  // Total days lived
  const totalDays = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));

  // Day of week born
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const bornDay = days[birthDate.getDay()];

  // Next birthday
  let nextBirthday = new Date(today.getFullYear(), month - 1, day);
  if (nextBirthday <= today) nextBirthday.setFullYear(today.getFullYear() + 1);
  const daysToNext = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
  const nextBirthdayText = daysToNext === 0
    ? '🎉 Happy Birthday today!'
    : `Next birthday in ${daysToNext} day${daysToNext !== 1 ? 's' : ''}`;

  
  animateNumber('years-val',  ageYears,  600);
  animateNumber('months-val', ageMonths, 700);
  animateNumber('days-val',   ageDays,   800);

  document.getElementById('next-birthday').textContent = nextBirthdayText;
  document.getElementById('day-of-week').textContent   = `Born on a ${bornDay}`;
  document.getElementById('total-days').textContent    = `Total days lived: ${totalDays.toLocaleString()}`;

  result.classList.remove('hidden');
}



function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

function animateNumber(id, target, duration) {
  const el = document.getElementById(id);
  const start = performance.now();
  const from = 0;

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(from + (target - from) * ease);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

// Allow Enter key to trigger calculation
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') calculateAge();
});

// Auto-move focus: DD → MM → YYYY
['day','month'].forEach((id, i) => {
  const next = ['month','year'][i];
  const maxLen = [2, 2][i];
  document.getElementById(id).addEventListener('input', function() {
    if (this.value.length >= maxLen) {
      document.getElementById(next).focus();
    }
  });
});

document.getElementById('year').addEventListener('input', function() {
  if (this.value.length >= 4) this.blur();
});