const DOMParser = require('dom-parser');

export const readTableContent = (content, galaxy, system) => 
{
  const result = [];
  const parser = new DOMParser();

  const doc = parser.parseFromString(content, "text/html")
  const galaxyContent = doc.getElementsByClassName("galaxy-info")[0];

  console.log(galaxyContent);
  if(galaxyContent) {
    readTable(galaxyContent, result, galaxy, system);
  }

  return result;
}
  
const readTable = (tableContent, result, galaxy, system) => 
{
  for(let i = 0; i < tableContent.childNodes.length; i++) 
  {
      const child = tableContent.childNodes[i];
      const planetCol = child.getElementsByClassName("col-planet-name")[0];
      if(planetCol) 
      {
        const planetName = planetCol.getElementsByClassName("text-area")[0];

        if(planetName) 
        {
          const row = {};
          row.planetName = planetName.innerHTML.replaceAll('\n', '');
  
          const moonCol = child.getElementsByClassName("col-moon")[0];
          row.hasMoon = moonCol.childNodes.length === 3;
  
          const playerCol = child.getElementsByClassName("col-player")[0];

          if(playerCol) 
          {
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
            //row.link = window.location.href;
    
            result.push(row);
          }
        }
      }
  }
}

const getStatus = (playerCol) => 
{
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

const getRanking = (playerNameSpan) => 
{
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