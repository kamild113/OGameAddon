import { readTableContent } from './../helpers/contentReader.js';
//npx webpack --mode=production

var tabId = null;
var minGalaxy = 1;
var maxGalaxy = 6;
var galaxy = 1;
var system = 0;
var interval = 500;
var isReading = false;
var synchDate = null;
var listenerAdded = false;
var serverData = [];
var isLoading = false;
var dataLoaded = false;
var currentGalaxy = [];
var galaxiesMap = new Map();
var getDataUrl = "https://orion.ogamex.net/galaxy/galaxydata?";
//var getDataUrl = "https://orion.ogamex.net/galaxy/galaxydata?x=1&y=5";

chrome.storage.sync.set({"isReading": isReading});

const readSystem = (galaxy, system) => {
  if(system > 499) {
    sendToApi(galaxy, currentGalaxy);
    galaxy += 1;
    system = 1;
    currentGalaxy = [];
    if(galaxy > maxGalaxy || galaxy > 6) return; 
  }

  var options = {
    method: "GET"
  };

  const url = getDataUrl + "x=" + galaxy + "&y=" + system;

  fetch(url, options)
  .then(response=>response.text())
  .then(res => {
        const readedContent = readTableContent(res, galaxy, system);
        console.log(readedContent);
    }).catch(e => {
      console.error(e);
    });
}

/*const readServerContent = (content) => {
  chrome.scripting.executeScript(
    {
        target: { tabId },
        files: ["/helpers/contentReader.js"],
        args: [content]
    });
}*/

const startLoading = () => {
  readSystem(1, 1);
  
  /*if(dataLoaded) {
    var length = 0;
    galaxiesMap.forEach((_value, _key) => {
      if(_value)
        length += _value.planets.length;
    });

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      if(tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'dataLoaded', planetsFound: length, synchDate: synchDate }, () => handleError(chrome.runtime.lastError));  
      }
    });
  }
  else {
    if(!isLoading && !dataLoaded) {
      isLoading = true;
      loadData(1);
    }
  }*/
}

const loadData = function(galaxyIndex) {
  if(galaxyIndex > 6) {
    var length = 0;
    galaxiesMap.forEach((_value, _key) => {
      if(_value)
        length += _value.planets.length;
    });
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      if(tabs[0]) { 
        chrome.tabs.sendMessage(tabs[0].id, { action: 'dataLoaded', planetsFound: length, synchDate: synchDate },  () => handleError(chrome.runtime.lastError));  
      }
    });

    isLoading = false;
    dataLoaded = true;
    return;
  }
  
  readFromApi(galaxyIndex);
}

const handleError = (error) => {
  return true;
}

const listener = function (updatedTabId , info) {
    if (tabId === updatedTabId && info.status === 'complete') {
        readTabContent(tabId);
    }
};

if(!listenerAdded) {
  chrome.tabs.onUpdated.addListener(listener);
  listenerAdded = true;
}

function readTabContent() {
    chrome.scripting.executeScript(
    {
        target: { tabId },
        files: ["content/content.js"]
    });
}

function openNextPage() {
    if(system > 499) {
        sendToApi(galaxy, currentGalaxy);
        galaxy += 1;
        system = 1;
        currentGalaxy = [];
        if(galaxy > maxGalaxy || galaxy > 6) return; 
    }

    chrome.tabs.update(tabId, { url: `https://orion.ogamex.net/galaxy?x=${galaxy}&y=${system}` });
}

function toggleReading() {
    isReading = !isReading;
    chrome.storage.sync.set({"isReading": isReading});

    if(isReading)
      currentGalaxy = [];

    galaxy = minGalaxy;
    system = 1;

    openNextPage();
}


function stopReading(saveData) {
  isReading = false;
  chrome.storage.sync.set({"isReading": false});

  if(saveData) {
    sendToApi(galaxy, currentGalaxy);
  }
}

function readFromApi(galaxyIndex) {
  var url = "http://ogameaddon.ct8.pl/galaxy?galaxyIndex=" + galaxyIndex;
  var options = {
    method: "GET"
  };

  fetch(url, options)
  .then(response=>response.json())
  .then(res => {
        galaxiesMap.set(galaxyIndex, res);
        loadData(galaxyIndex + 1);
    }).catch(() => {
      loadData(galaxyIndex + 1);
    });
}

function sendToApi(galaxyIndex, result) {
  var synchDate = new Date().toLocaleString();
  var data = {"synchDate": synchDate, "planetsFound": result.length, "planets": result};
  galaxiesMap.set(galaxyIndex, data);
  var jsonResult = JSON.stringify(data);

  var url = "http://ogameaddon.ct8.pl/addGalaxy?galaxyIndex=" + galaxyIndex;
  var options = {
    method: "PUT",
    headers: {
      Accept: 'application.json',
      'Content-Type': 'application/json'
    },
    body: jsonResult
  };

  fetch(url, options);
}
  
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "startReading") {
        tabId = request.tabId;
        interval = request.interval;
        minGalaxy = parseInt(request.galaxyFrom);
        maxGalaxy = parseInt(request.galaxyTo);
        toggleReading();
    }
    else if (request.action === "stopReading") {
      stopReading(request.save);
    }
    else if(request.action === "readedTable") {
      if(request.system.toString() !== system.toString()) {
        openNextPage();

        sendResponse({});
        return true;
      }

      system++;

      if(request.result.length > 0) {
        onTableReaded(request.result);
      }
    }
    else if(request.action === "getPlanetsCount") {
      sendResponse(serverData.length);
    }
    else if(request.action === "getSynchDate") {
      sendResponse(synchDate);
    }
    else if(request.action === "getPlanets") {
      var planets = [];
      galaxiesMap.forEach((_value, _key) => {
        if(_value)
          planets = planets.concat(_value.planets);
      });

      sendResponse(planets);
    }
    else if (request.action === "loadData") {
      startLoading();
    }
    else if (request.action === "getCurrentSettings") {
      const settings = {
        interval,
        minGalaxy,
        maxGalaxy
      };

      sendResponse(settings);
    }

    sendResponse({});
    return false;
  });

  async function onTableReaded(rows) {
    currentGalaxy = currentGalaxy.concat(rows);
    chrome.runtime.sendMessage({ action: 'updateCounters', planetsFound: currentGalaxy.length, galaxy: galaxy }, () => handleError(chrome.runtime.lastError));

    await sleep(interval);

    if(isReading){
        openNextPage();
    }
  }

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
} 
