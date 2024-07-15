// Browser functionality
const iframe = document.getElementById('browser-frame');
const urlBar = document.getElementById('url-bar');
const customHomepage = document.getElementById('custom-homepage');
const homeSearch = document.getElementById('home-search');
const homeSearchBtn = document.getElementById('home-search-btn');
const homeUrl = 'home';
let currentUrl = '';
let history = [];
let historyIndex = -1;

function loadUrl(url, addToHistory = true) {
    if (url === 'home') {
        showHomepage();
    } else {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        iframe.src = url;
        customHomepage.style.display = 'none';
        iframe.style.display = 'block';
    }
    currentUrl = url;
    urlBar.value = url;
    if (addToHistory) {
        if (historyIndex < history.length - 1) {
            history = history.slice(0, historyIndex + 1);
        }
        history.push(url);
        historyIndex = history.length - 1;
    }
    updateNavigationButtons();
}

function showHomepage() {
    iframe.style.display = 'none';
    customHomepage.style.display = 'flex';
    urlBar.value = 'home';
}

function search(query) {
    const searchUrl = `https://www.google.com/search?igu=1&q=${encodeURIComponent(query)}`;
    loadUrl(searchUrl);
}

function updateNavigationButtons() {
    document.getElementById('back-btn').disabled = historyIndex <= 0;
    document.getElementById('forward-btn').disabled = historyIndex >= history.length - 1;
}

document.getElementById('back-btn').addEventListener('click', () => {
    if (historyIndex > 0) {
        historyIndex--;
        loadUrl(history[historyIndex], false);
    }
});

document.getElementById('forward-btn').addEventListener('click', () => {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        loadUrl(history[historyIndex], false);
    }
});

document.getElementById('reload-btn').addEventListener('click', () => {
    if (currentUrl === 'home') {
        showHomepage();
    } else {
        iframe.src = iframe.src;
    }
});

document.getElementById('home-btn').addEventListener('click', () => {
    loadUrl(homeUrl);
});

document.getElementById('go-btn').addEventListener('click', () => {
    const input = urlBar.value.trim();
    handleInput(input);
});

urlBar.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const input = urlBar.value.trim();
        handleInput(input);
    }
});

homeSearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const input = homeSearch.value.trim();
        handleInput(input);
    }
});

homeSearchBtn.addEventListener('click', () => {
    const input = homeSearch.value.trim();
    handleInput(input);
});

function handleInput(input) {
    if (input === 'home') {
        showHomepage();
    } else if (input.startsWith('https://www.google.com/search?')) {
        loadUrl(input);
    } else if (input.includes('.') && !input.includes(' ')) {
        loadUrl(input);
    } else {
        search(input);
    }
}

iframe.addEventListener('load', () => {
    currentUrl = iframe.src;
    urlBar.value = currentUrl;
    if (currentUrl !== history[historyIndex]) {
        history.push(currentUrl);
        historyIndex = history.length - 1;
        updateNavigationButtons();
    }
});

// Initialize browser content
loadUrl(homeUrl);
