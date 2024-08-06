function gw_loadFile(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status==200) {
      result = xmlhttp.responseText;
    }
    return result;
}

window.onload = function() {
    let projectToLoad = "";
    if (window.location.search.length > 8 && window.location.search.includes("sample=")) { // Sample based project load
        projectToLoad = "./samples/"
        for (let i = 8; i < window.location.search.length; i++) {
            projectToLoad += window.location.search[i];
        }
        projectToLoad += ".gw1";
    } else if (window.location.search.length > 5 && window.location.search.includes("loc=")) { // Location based project load
        for (let i = 5; i < window.location.search.length; i++) {
            projectToLoad += window.location.search[i];
        }
    }
    if (projectToLoad.length > 1) { // Load project
        const fileContent = gw_loadFile(projectToLoad);
        gw_loadProjectFile(fileContent);
    }
}
