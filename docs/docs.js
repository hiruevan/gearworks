// For loading the docs list JSON
function loadFile(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status==200) {
    result = xmlhttp.responseText;
    }
    return result;
}

// Sorts arrays
function sortAsc(arr) {
    return arr.slice().sort((a, b) => a - b);
}

// Load the docs list JSON
let jsonFile = loadFile("./docs/docList.json");
const docs = JSON.parse(jsonFile);

// Load the global stuff from JSON
const globalStyle = JSON.parse(loadFile("./docs/globalColoring.json"));

// Loads docs into html
docs.load = function(name) {
    let n = '';
    for (let i = 1; i < decodeURI(name).length; i++) {
       n += decodeURI(name)[i];
    }
    if (this[n]) {
        // Hide initial page
        document.getElementById("main").classList = "hidden";

        let container = document.createElement("div");
        container.classList.add("container");
        container.innerHTML += '<p><a href="./docs">Back</a></p><h2>Master Docs > ' + n + '</h2>';
        
        for (let i = 0; i < this[n].length; i++) {
            if (this[n][i].module == 'method') { // This is for 'Methods' AKA the docs format
                // Color the code
                let coloredName = this[n][i].name;
                let coloredExample = this[n][i].example;
                let strsToHighlight = Object.keys(this[n][i]["to_highlight"]);
                let autoToHighlight = Object.keys(globalStyle);

                for (let m = 0; m < strsToHighlight.length; m++) {
                    coloredName = coloredName.replaceAll(strsToHighlight[m], "<span style='color: " + this[n][i]["to_highlight"][strsToHighlight[m]] + ";'>" + strsToHighlight[m] + "</span>");
                    if (this[n][i]["to_highlight"][strsToHighlight[m]] == "blue") this[n][i]["to_highlight"][strsToHighlight[m]] = 'rgb(60, 85, 255)';
                    if (this[n][i]["to_highlight"][strsToHighlight[m]] == "darkblue") this[n][i]["to_highlight"][strsToHighlight[m]] = 'rgb(122, 40, 255)';
                    coloredExample = coloredExample.replaceAll(strsToHighlight[m], "<span style='color: " + this[n][i]["to_highlight"][strsToHighlight[m]] + ";'>" + strsToHighlight[m] + "</span>");
                }

                for (let m = 0; m < autoToHighlight.length; m++) {
                    coloredName = coloredName.replaceAll(autoToHighlight[m], "<span style='color: " + globalStyle[autoToHighlight[m]] + ";'>" + autoToHighlight[m] + "</span>");
                    console.log(coloredName);
                    if (globalStyle[autoToHighlight[m]] == "blue") globalStyle[autoToHighlight[m]] = 'rgb(60, 85, 255)';
                    if (globalStyle[autoToHighlight[m]] == "darkblue") globalStyle[autoToHighlight[m]] = 'rgb(122, 40, 255)';
                    coloredExample = coloredExample.replaceAll(autoToHighlight[m], "<span style='color: " + globalStyle[autoToHighlight[m]] + ";'>" + autoToHighlight[m] + "</span>");
                }

                // Make example multiline
                coloredExample = coloredExample.replaceAll("\n", "<br>");

                // Use custom syntax
                coloredName = coloredName.replaceAll("|", "");
                coloredExample = coloredExample.replaceAll("|", "");
                coloredName = coloredName.replaceAll("@", "");
                coloredExample = coloredExample.replaceAll("@", "");
                coloredName = coloredName.replaceAll("$", "");
                coloredExample = coloredExample.replaceAll("$", "");
                coloredName = coloredName.replaceAll("~", "");
                coloredExample = coloredExample.replaceAll("~", "");
                
                // Numbers
                coloredExample = coloredExample.replaceAll("⁰", "0");
                coloredExample = coloredExample.replaceAll("¹", "1");
                coloredExample = coloredExample.replaceAll("²", "2");
                coloredExample = coloredExample.replaceAll("³", "3");
                coloredExample = coloredExample.replaceAll("⁴", "4");
                coloredExample = coloredExample.replaceAll("⁵", "5");
                coloredExample = coloredExample.replaceAll("⁶", "6");
                coloredExample = coloredExample.replaceAll("⁷", "7");
                coloredExample = coloredExample.replaceAll("⁸", "8");
                coloredExample = coloredExample.replaceAll("⁹", "9");


                // Append the docs to the container
                container.innerHTML += '<label><code>' + coloredName + '</code> (' + this[n][i].type + ')</label>';
                container.innerHTML += '<p>' + this[n][i].use + '<br>';
                container.innerHTML += '<u>For Example:</u><br><examplecode>' + coloredExample + '</examplecode></p><br><br>';
            } if (this[n][i].module == 'video') { // Videos
                container.innerHTML += '<h3>' + this[n][i].name + '</h3>';
                container.innerHTML += '<video width="512" height="288" controls="controls"><source src="./tutorials/videos/' + n + '/' + this[n][i].video + '.mp4"><track src="./tutorials/videos/' + n + '/' + this[n][i].video + '.vtt" kind="subtitles" srclang="en" label="English"></video>';
                container.innerHTML += '<p>' + this[n][i].desc + '</p>';
            } else if (this[n][i].module == 'download') { // Downloadable gw1 files
                container.innerHTML += '<h3>' + this[n][i].name + '</h3>';
                container.innerHTML += '<p><a href="' + this[n][i].location + '" download>Download</a> | <a href="./editor?loc=' + encodeURI(this[n][i].location) + '" target="_blank">Load in Editor</a></p>';
            } else if (this[n][i].module == 'desc') { // Just plain text
                if (this[n][i].name !== null) {
                    container.innerHTML += '<h3>' + this[n][i].name + '</h3>';
                }
                container.innerHTML += '<p>' + this[n][i].value + '</p><br>';
            }
        }

        container.innerHTML += '</div>';
        document.getElementById('list').appendChild(container);
    } else {
        console.warn("The User has requested a DOCS page that does not exist.");
    }
}

// Loads search page into html
docs.setupSearch = function(query) {
    // Hide initial page
    document.getElementById("main").classList = "hidden";

    let n = '';
    for (let i = 3; i < query.length; i++) {
        n += query[i];
    }

    let container = document.createElement("div");
    container.classList.add("container");
    container.innerHTML += '<p><a href="./docs">Back</a></p><h2>Master Docs Search > ' + n + '</h2><ul class="results"></ul>';

    document.getElementById('list').appendChild(container);

    return n;
}

// Searches the docs and places the relevant ones on the page
docs.search = function(query) {
    // Tokenize the query
    const tokenBreakers = [' ', '\n', '\r', '?', '!', '.', ',', '#', '%', '$', '*', '-', ';', ':', '(', ')', '&', '^', '@', '`', '"', "'", '/', '<', '>'];
    const tokens = [''];
    for (let i = 0; i < query.length; i++) {
        if (tokenBreakers.includes(query[i])) {
            if (i == query.length - 1) break;
            tokens.push('');
        } else {
            tokens[tokens.length - 1] += query[i].toLowerCase();
        }
    }

    // Clear blank tokens
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] == '') {
            tokens.splice(i, 1);
            i--;
        }
    }

    // Search all docs and rate them based on matching the query tokens
    let keys = Object.keys(this);
    let ratings = {};
    for (let i = 0; i < keys.length - 1; i++) {
        ratings[keys[i]] = this.getRating(keys[i], tokens);
    }

    // Log user's tokens
    console.log("User Tokens:");
    console.log(tokens);

    // Log ratings
    console.log("Search Ratings:");
    console.log(ratings);

    let values = Object.values(ratings);
    let toBeInserted = [];
    values = sortAsc(values);
    values = values.reverse();

    for (let i = 0; i < values.length; i++) {
        if (values[i] > 0) {
            toBeInserted.push(getKeyByValue(ratings, values[i]));
        }
    }

    // Plcae items in html
    for (let i = 0; i < toBeInserted.length; i++) {
        if (toBeInserted[i] !== 'load' && toBeInserted[i] !== 'Template_Catogory') {
            document.getElementsByClassName("results")[0].innerHTML += '<li><a href="./docs?' + encodeURI(toBeInserted[i]) + '">' + toBeInserted[i] + '</a></li>';
        }
    }
    if (toBeInserted.length == 0) {
        document.getElementsByClassName("results")[0].innerHTML += '<h2>No Results</h2>';
    }
}

docs.getRating = function(key, tokens) {
    let rating = 0;
    if (key == 'load' || key == 'setupSearch' || key == 'search' || key == 'getRating') return false;
    for (let t = 0; t < tokens.length; t++) {
        if (key.toLowerCase().includes(tokens[t])) rating += 40;
        for (let i = 0; i < this[key].length; i++) {
            try {if (this[key][i].name.toLowerCase().includes(tokens[t])) {
                rating += (30 + Math.random()*7) / this[key].length;
            }} catch{}
            try {if (this[key][i].use.toLowerCase().includes(tokens[t])) {
                rating += (10 + Math.random()*2) / this[key].length;
            }} catch{}
            try {if (this[key][i].type.toLowerCase().includes(tokens[t])) {
                rating += (18 + Math.random()*4) / this[key].length;
            }} catch{}
            try {if (this[key][i].example.toLowerCase().includes(tokens[t])) {
                rating += (12 + Math.random()*12) / this[key].length;
            }} catch{}
            try {if (this[key][i].desc.toLowerCase().includes(tokens[t])) {
                rating += (10 + Math.random()*2) / this[key].length;
            }} catch{}
            try{if (this[key][i].value.toLowerCase().includes(tokens[t])) {
                rating += (10 + Math.random()*4) / this[key].length;
            }} catch{}
        }
    }
    return Math.round(rating);
}

// Searching
const searchBar = document.getElementsByClassName('search')[0];
searchBar.addEventListener('keypress', function(e) {
    if (e.key == "Enter") {
        let aTag = document.createElement("a");
        aTag.href = "./docs?q=" + searchBar.value;
        aTag.click();
    }
});

function getKeyByValue(object, value) {
    for (let prop in object) {
        if (object.hasOwnProperty(prop)) {
            if (object[prop] === value)
                return prop;
        }
    }
    return false;
}

// Where the magic happens, loads a docs page, or searches for one.
window.onload = function() {
    if (window.location.search[1] == "q" && window.location.search[2] == "=") {
        // Setup page
        const q = docs.setupSearch(decodeURI(window.location.search));

        // Search for docs page
        docs.search(q)
    } else if (window.location.search.length > 1) {
        
        // Load docs page
        let docsName = window.location.search;
        docs.load(docsName);
    }
}
