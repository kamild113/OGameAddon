(function() {
    const result = readContent(document.documentElement.outerHTML);

    const url = new URL(window.location.href);
    const galaxy = url.searchParams.get("x");
    const system = url.searchParams.get("y");

    if(result.length > 0)
      chrome.runtime.sendMessage({ action: 'readedTable', result, galaxy, system });
  })();


function readContent(content) 
{
  const result = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html")
  const galaxyContent = doc.getElementById("galaxyContent").getElementsByClassName("galaxy-info")[0];

  if(galaxyContent) {
    readTable(galaxyContent, result);
  }

  return result;
}
  
function readTable(tableContent, result) 
{
  const url = new URL(window.location.href);
  const galaxy = url.searchParams.get("x");
  const system = url.searchParams.get("y");

  for(let i = 1; i <= 15; i++) 
  {
      const child = tableContent.children[i];
      const planetCol = child.getElementsByClassName("col-planet-name")[0];
      const planetName = planetCol.getElementsByClassName("text-area")[0];

      if(planetName) 
      {
        const row = {};
        row.planetName = planetName.innerHTML.replaceAll('\n', '');

        const moonCol = child.getElementsByClassName("col-moon")[0];
        row.hasMoon = moonCol.children.length > 0;

        const playerCol = child.getElementsByClassName("col-player")[0];
        const playerName = playerCol.getElementsByClassName("text-area")[0];
        row.playerName = playerName.innerHTML;
        row.status = getStatus(playerCol);
        row.ranking = getRanking(playerName);

        const allianceCol = child.getElementsByClassName("col-alliance")[0];
        const alliance = allianceCol.getElementsByClassName("text-area")[0];
        if(alliance) {
          row.alliance = alliance.innerHTML;
        }

        row.galaxy = galaxy;
        row.system = system;
        row.link = window.location.href;

        result.push(row);
      }
  }
}

function getStatus(playerCol) {
  const tooltip = playerCol.getElementsByClassName("tooltip")[0];
  if(tooltip){
    const tooltipHtml = tooltip.getAttribute("data-tooltip-content");

    return tooltipHtml.substring(
      tooltipHtml.indexOf(">") + 1, 
      tooltipHtml.lastIndexOf("<")
      );
  }

  return "";
}

function getRanking(playerNameSpan) {
  const tooltipHtml = playerNameSpan.getAttribute("data-tooltip-content");
  if(tooltipHtml){
    const pattern = /(?<=<a class='galaxy-shortcut-action' href='\/statistics\?rel=[a-f0-9-]+'>)\d+\.*\d+(?=<\/a>)/;

    const match = tooltipHtml.match(pattern);

    if (match) 
    {
      const result = match[0].replace(".", "");
      return parseInt(result);
    } 
    else 
    {
      return "";
    }
  }

  return "";
}
