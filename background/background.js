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
var serverData = [];
var isLoading = false;
var dataLoaded = false;
var currentGalaxy = [];
var galaxiesMap = new Map();
var getDataUrl = "https://orion.ogamex.net/galaxy/galaxydata?";

chrome.storage.sync.set({"isReading": isReading});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "startReading") {
      interval = request.interval;
      minGalaxy = parseInt(request.galaxyFrom);
      maxGalaxy = parseInt(request.galaxyTo);
      startReading();
  }
  else if (request.action === "stopReading") {
    stopReading(request.save);
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

const startReading = () => 
{
  isReading = true;
  chrome.storage.sync.set({"isReading": isReading});

  if(isReading)
    currentGalaxy = [];

  galaxy = minGalaxy;
  system = 1;

  readSystem();
}

const stopReading = (saveData) => 
{
  isReading = false;
  chrome.storage.sync.set({"isReading": false});

  if(saveData) 
  {
    sendToApi(galaxy, currentGalaxy);
  }
}

const readSystem = () => 
{
  if(!isReading)
  {
    return;
  }

  if(system > 499) 
  {
    sendToApi(galaxy, currentGalaxy);
    galaxy += 1;
    system = 1;
    currentGalaxy = [];
    if(galaxy > maxGalaxy || galaxy > 6) 
    {
      isReading = false;
      return;
    } 
  }

  const options = {
    method: "GET"
  };

  updatePopup();

  const url = getDataUrl + "x=" + galaxy + "&y=" + system;

  fetch(url, options)
  .then(response=>response.text())
  .then(async res => {
        const readedContent = readTableContent(res, galaxy, system);
        currentGalaxy = currentGalaxy.concat(readedContent);
        system++;

        await sleep(interval);
        readSystem();
    }).catch(e => {
      console.error(e);
    });
}

const updatePopup = () => {
  chrome.runtime.sendMessage({
    action: "updateCounters",  
    planetsFound: currentGalaxy.length,
    galaxy
  }, () => handleError(chrome.runtime.lastError));
}

const startLoading = () => {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    if(tabs[0]) {
      tabId = tabs[0].id;
    }
  });

  if(dataLoaded) {
    var length = 0;
    galaxiesMap.forEach((_value, _key) => {
      if(_value)
        length += _value.planets.length;
    });

    chrome.tabs.sendMessage(tabId, { action: 'dataLoaded', planetsFound: length, synchDate: synchDate }, () => handleError(chrome.runtime.lastError));  
  }
  else {
    if(!isLoading && !dataLoaded) {
      isLoading = true;
      loadData(1);
    }
  }
}

const loadData = function(galaxyIndex) {
  if(galaxyIndex > 6) 
  {
    let length = 0;
    galaxiesMap.forEach((_value, _key) => {
      if(_value)
        length += _value.planets.length;
    });
    
    chrome.tabs.sendMessage(tabId, { action: 'dataLoaded', planetsFound: length, synchDate: synchDate }, () => handleError(chrome.runtime.lastError));  

    isLoading = false;
    dataLoaded = true;
    return;
  }
  
  readFromApi(galaxyIndex);
}

const readFromApi = (galaxyIndex) => {
  const url = "http://ogameaddon.ct8.pl/galaxy?galaxyIndex=" + galaxyIndex;
  const options = {
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

const sendToApi = (galaxyIndex, result) => {
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

const handleError = (error) => {
  return true;
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
} 
