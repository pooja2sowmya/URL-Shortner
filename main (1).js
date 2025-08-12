const urlForm = document.querySelector('.shorten-url-form');
const resultDisplayArea = document.querySelector('.content');
const urlInputArea = document.getElementById('textarea');

urlForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const currUrl = urlInputArea.value.trim();
  if (!currUrl) return;

  try {
    const response = await fetch('https://url-shortener-service.p.rapidapi.com/shorten', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': 'a6b9a6582amsh9ec090d9b167ff4p12202djsn065a9c008690',
        'X-RapidAPI-Host': 'url-shortener-service.p.rapidapi.com'
      },
      body: new URLSearchParams({ url: currUrl })
    });

    if (!response.ok) {
      showError('Please enter a valid link');
      return;
    }

    const data = await response.json();
    const shortUrl = data?.result_url;
    displayResult(currUrl, shortUrl);
    urlInputArea.value = '';
  } catch (err) {
    showError('Network error. Try again.');
  }
});

function showError(message) {
  urlInputArea.style.border = '2px solid var(--red)';
  document.querySelector('.error-msg').textContent = message;
}

function displayResult(originalUrl, shortUrl) {
  const html = `
    <div class="url-results">
      <div class="left-result"><h3>${originalUrl.slice(0, 50)}...</h3></div>
      <div class="right-result">
        <h3 class="result-url">${shortUrl}</h3>
        <button class="btn cyan-btn copyBtn">Copy</button>
      </div>
    </div>
  `;
  resultDisplayArea.insertAdjacentHTML('afterbegin', html);
  urlInputArea.style.border = 'none';
  document.querySelector('.error-msg').textContent = '';
}

// Copy button functionality
document.body.addEventListener('click', (e) => {
  if (e.target.classList.contains('copyBtn')) {
    const button = e.target;
    const urlText = button.parentElement.querySelector('.result-url').textContent;
    navigator.clipboard.writeText(urlText);

    button.textContent = 'Copied!';
    button.style.background = 'hsl(255, 11%, 22%)';
    button.disabled = true;

    setTimeout(() => {
      button.textContent = 'Copy';
      button.style.background = 'hsl(180, 66%, 49%)';
      button.disabled = false;
    }, 3000);
  }
});
