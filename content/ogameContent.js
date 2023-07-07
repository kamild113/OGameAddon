
const gameContainer = document.getElementById("game-bg");

createContent();
addEventListeners();

function createContent() {
    const conent = document.createElement("div");
    conent.id = "addon-content";
    conent.className = "addon-content";

    conent.innerHTML = `
                        <div>
                          <span style="font-size: 16px" class="text-area">Załadowane planety: </span> <span style="font-size: 16px; color: #9C0;" class="text-area" id="planets-counter">0</span>
                        </div>

                        <span style="font-size: 16px" class="text-area">Wyszukiwanie po nicku</span> 
                        <div>
                            <input id="nick-name" type="text" placeholder="Nick" />
                            <span class="button" id="search-button">Szukaj</span>
                        </div>
                        <span style="display: block; margin-top: 30px; font-size: 16px" class="text-area">Wyszukiwanie nieaktywnych</span> 
                        <div>
                            <span class="text-area">Nieaktywni od</span> 
                            <input id="inactive-from-galaxy" type="text" style="width: 30px;" placeholder="x"/> <span class="text-area">:</span> <input id="inactive-from-system" type="text" style="width: 30px;" placeholder="y"/>
                            <span class="text-area">do</span>
                            <input id="inactive-to-galaxy" type="text" style="width: 30px;" placeholder="x"/> <span class="text-area">:</span> <input id="inactive-to-system" type="text" style="width: 30px;" placeholder="y"/>
                            <div>
                                <span class="text-area">Max ranking:</span> 
                                <input id="max-ranking" type="text" style="width: 40px;"/>
                                <span class="button" id="search-inactive">Szukaj</span>
                            </div>                         
                        </div>
                          <div class="content-section" id="output-container" hidden=true>
                            <div class="header">
                              <span class="title">Wyniki</span>
                            </div>
                            <div class="content" id="output-content" style="min-height:500px;position:relative;">

                            </div>
                            <div class="footer"></div>
                          </div>
                        <div id="busy-indicator-container" class="busy-indicator-container">
                          <span id="busy-indicator" class="busy-indicator"/>
                        </div>`;

    if(gameContainer !== null) {
      gameContainer.appendChild(conent);
    
      chrome.runtime.sendMessage({ action: 'loadData'});
  
      setIsBusy(true);
    }
}

function setIsBusy(isBusy) {
  const busyIndicatorContainer = document.getElementById("busy-indicator-container");
  const addonContent = document.getElementById("addon-content");
  addonContent.classList.toggle("busy", isBusy);

  busyIndicatorContainer.hidden = !isBusy;
}

function addEventListeners() {
  if(gameContainer === null) {
    return;
  }

  document.getElementById("nick-name").addEventListener("keydown", function (e) {
    if (e.code === "Enter") {
        search();
    }
  });

  const searchButton = document.getElementById("search-button");
  searchButton.addEventListener("click", () => search());

  const searchInactiveButton = document.getElementById("search-inactive");
  searchInactiveButton.addEventListener("click", () => searchInactive());


  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "dataLoaded") {
      onDataLoaded(request.planetsFound)
    }

    return true;
  });
}

function onDataLoaded(planetsFound) {
  const planetsCounter = document.getElementById("planets-counter");
  planetsCounter.innerText = planetsFound;

  setIsBusy(false);
}

function search() {
    const nickName = document.getElementById("nick-name").value.toLowerCase();
    console.log("Searching " + nickName);

    chrome.runtime.sendMessage({ action: 'getPlanets' }, function(response) {
      const outputContainer = document.getElementById("output-container");
      const output = document.getElementById("output-content");
      output.innerHTML = "";
  
      const outputContent = document.createElement("div");
  
      var planets = response;
      var playerDetails = null;
      var planetsWithMoon = 0;
      var planetsFound = 0;
  
      for(let i = 0; i < planets.length; i++) {
  
        if(planets[i].playerName.toLowerCase() === nickName) {
          if(playerDetails === null) {
            playerDetails = document.createElement("h4");
            playerDetails.innerText = "#" + planets[i].ranking + " " + planets[i].playerName + " | Status: " + planets[i].status + (planets[i].alliance ? " | Alliance: " + planets[i].alliance  : "");
            outputContent.appendChild(playerDetails);
          }
  
          const row = document.createElement("div");
          row.innerHTML = "#" + (outputContent.children.length) + " &ensp; | " + planets[i].galaxy + ": " + planets[i].system  + " | Planet: " ;
  
          const planetLink = document.createElement("a");
          planetLink.className = "planet-link";
          planetLink.innerText = planets[i].planetName;
          planetLink.onclick = () => {
            document.getElementById("galaxyInput").value = planets[i].galaxy;
            document.getElementById("systemInput").value = planets[i].system;

            injectScript('/content/getGalaxyData.js')
          };

          row.appendChild(planetLink);
  
          if(planets[i].hasMoon) {
            var moonImg = document.createElement("img");
            moonImg.src = "https://orion.ogamex.net/assets/images/V2/planet/moon/1/1_small.jpg";
            moonImg.style.width = "20px";
            moonImg.style.marginLeft = "10px";
            row.appendChild(moonImg);
            planetsWithMoon++;
          }
    
          outputContent.appendChild(row);
          planetsFound++;
        }
      }
      
      const planetsWithMoonDiv = document.createElement("div");
      planetsWithMoonDiv.innerText = "Z księzycem: " + planetsWithMoon;
  
      if(playerDetails) {
        playerDetails.appendChild(planetsWithMoonDiv);
      }
      
      output.appendChild(outputContent);
      outputContainer.hidden = planetsFound === 0;
    });
  }

  function searchInactive() {
    chrome.runtime.sendMessage({ action: 'getPlanets' }, function(response) {
      const outputContainer = document.getElementById("output-container");
      const output = document.getElementById("output-content");
      output.innerHTML = "";
  
      const outputContent = document.createElement("div");
  
      var planets = response;
      var inactivePlanets = [];
      var planetsFound = 0;
  
      for(let i = 0; i < planets.length; i++) {
  
        if(planets[i].status.includes("inactive") && isPlanetInRange(planets[i])) {
          inactivePlanets.push(planets[i]);    
        }
      }
  
      inactivePlanets = inactivePlanets.sort((a,b) => a.ranking - b.ranking);
  
      for(let i = 0; i < inactivePlanets.length; i++) {
          const row = document.createElement("div");
          row.innerHTML = "#" + (outputContent.children.length + 1) + " &ensp;| Ranking: " + inactivePlanets[i].ranking + " | "  + inactivePlanets[i].galaxy + ": " + inactivePlanets[i].system  + " | " + inactivePlanets[i].playerName + " | Planet: " ;
  
          const planetLink = document.createElement("a");
          planetLink.innerText = inactivePlanets[i].planetName;
          planetLink.className = "planet-link";
          planetLink.onclick = () => {
            document.getElementById("galaxyInput").value = inactivePlanets[i].galaxy;
            document.getElementById("systemInput").value = inactivePlanets[i].system;

            injectScript('/content/getGalaxyData.js')
          };
  
          row.appendChild(planetLink);
  
          if(inactivePlanets[i].hasMoon) {
            var moonImg = document.createElement("img");
            moonImg.src = "https://orion.ogamex.net/assets/images/V2/planet/moon/1/1_small.jpg";
            moonImg.style.width = "20px";
            moonImg.style.marginLeft = "10px";
            row.appendChild(moonImg);
          }
    
          outputContent.appendChild(row);
          planetsFound++;
      }
      
      output.appendChild(outputContent);
      outputContainer.hidden = planetsFound === 0;
    });
  }
  
  function isPlanetInRange(planet) {
    var inactiveFromGalaxy = document.getElementById("inactive-from-galaxy").value;
    var inactiveFromSystem = document.getElementById("inactive-from-system").value;
    var inactiveToGalaxy = document.getElementById("inactive-to-galaxy").value;
    var inactiveToSystem = document.getElementById("inactive-to-system").value;
    var maxRanking = document.getElementById("max-ranking").value;
  
    if(!inactiveFromGalaxy || !inactiveFromSystem || !inactiveToGalaxy || !inactiveToSystem || !maxRanking) {
      return false;
    }
  
    inactiveFromGalaxy = parseInt(inactiveFromGalaxy);
    inactiveFromSystem = parseInt(inactiveFromSystem);
    inactiveToGalaxy = parseInt(inactiveToGalaxy);
    inactiveToSystem = parseInt(inactiveToSystem);
    maxRanking = parseInt(maxRanking);
  
    var planetGalaxy = parseInt(planet.galaxy);
    var planetSystem = parseInt(planet.system);
  
    var coordinatesFrom = inactiveFromGalaxy === 1 ? inactiveFromSystem : (inactiveFromGalaxy - 1) * 499 + inactiveFromSystem;
    var coordinatesTo = inactiveToGalaxy === 1 ? inactiveToSystem : (inactiveToGalaxy - 1) * 499 + inactiveToSystem;
  
    var planetCoordinates = planetGalaxy === 1 ? planetSystem : (planetGalaxy - 1) * 499 + planetSystem;

    //console.log("Coordinates from: " + coordinatesFrom + " Coordinates to: " + coordinatesTo + " Planet coords: " + planetCoordinates);
  
    return (planetCoordinates >= coordinatesFrom && planetCoordinates <= coordinatesTo && planet.ranking <= maxRanking);
  }