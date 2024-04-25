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
    if (window.location.search.length > 7) {
        let projectToLoad = "";
        for (let i = 0; i < window.location.search.length; i++) {
            projectToLoad += window.location.search[i];
        }

        const fileContent = gw_loadFile("./samples/" + projectToLoad + ".gw1");

        gw_loadProjectFile(fileContent);
    }
}