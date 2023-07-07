

const injectScript = (scriptPath) => {
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL(scriptPath);
    s.onload = function() { this.remove(); };
    (document.head || document.documentElement).appendChild(s);
}

