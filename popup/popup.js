var isReading = false;

document.addEventListener("DOMContentLoaded", function() {
    var readButton = document.getElementById("read-button");

    readButton.addEventListener("click", function() {
      if(isReading) {
        if(confirm('Czy chcesz nadpisać aktualnie wczytywaną galaktyke na serwerze?')) {
          chrome.runtime.sendMessage({ 
            action: "stopReading",
            save: true
          }, () => handleError(chrome.runtime.lastError));
        }
        else {
          chrome.runtime.sendMessage({ 
            action: "stopReading",
            save: false
          }, () => handleError(chrome.runtime.lastError));
        }

        isReading = !isReading;
        updateButtonLabel();

        return;
      }

      isReading = !isReading;
      updateButtonLabel();

      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          chrome.runtime.sendMessage({ 
            action: "startReading", 
            tabId: tabs[0].id, 
            interval: document.getElementById("interval").value,
            galaxyFrom: document.getElementById("galaxy-from").value,
            galaxyTo: document.getElementById("galaxy-to").value
          });
      });
    });

    chrome.storage.sync.get(["isReading"]).then((result) => {
      isReading = result.isReading;
      updateButtonLabel();
    });

    chrome.runtime.sendMessage({ action: 'getCurrentSettings' }, (response) => setUpSettings(response));
});

const setUpSettings = (settings) => {
  document.getElementById("interval").value = settings.interval;
  document.getElementById("galaxy-from").value = settings.minGalaxy;
  document.getElementById("galaxy-to").value = settings.maxGalaxy;

  handleError(chrome.runtime.lastError);
}

const updateButtonLabel = () => {
  document.getElementById("read-button").innerHTML = isReading ? "Zatrzymaj wczytywanie" : "Rozpocznij wczytywanie";
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "updateCounters") {
      updateCounters(request.planetsFound, request.galaxy);
  }

  sendResponse({});
  return true;
});

const updateCounters = (planetsFound, galaxy) => {
  document.getElementById("planets-counter").innerText = (galaxy ? "Glalaxy " + galaxy + " - " : "") + "Planets found: " + planetsFound;
}

const handleError = (error) => {
  return true;
}