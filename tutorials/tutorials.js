// For loading the tutorial list JSON
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

// Load the tutorial list JSON
let jsonFile = loadFile("./tutorials/tutorialList.json");
const tutorials = JSON.parse(jsonFile);

// Loads tutorials into html
tutorials.load = function(name) {
    let n = '';
    for (let i = 1; i < decodeURI(name).length; i++) {
       n += decodeURI(name)[i];
    }
    if (this[n]) {
        // Hide initial page
        document.getElementById("main").classList = "hidden";

        let container = document.createElement("div");
        container.classList.add("container");
        container.innerHTML += '<p><a href="./tutorials">Back</a></p><h2>Tutorials > ' + n + '</h2><div class="videos">';

        for (let i = 0; i < this[n].length; i++) {
            if (this[n][i].module == 'method') { // This is for 'Methods' AKA the docs format
                // Color the code
                let coloredName = this[n][i].name;
                let coloredExample = this[n][i].example;
                let strsToHighlight = Object.keys(this[n][i]["to_highlight"])
                for (let m = 0; m < strsToHighlight.length; m++) {
                    coloredName = coloredName.replaceAll(strsToHighlight[m], "<span style='color: " + this[n][i]["to_highlight"][strsToHighlight[m]] + ";'>" + strsToHighlight[m] + "</span>");
                    if (this[n][i]["to_highlight"][strsToHighlight[m]] == "blue") this[n][i]["to_highlight"][strsToHighlight[m]] = 'rgb(60, 85, 255)';
                    if (this[n][i]["to_highlight"][strsToHighlight[m]] == "darkblue") this[n][i]["to_highlight"][strsToHighlight[m]] = 'rgb(122, 40, 255)';
                    coloredExample = coloredExample.replaceAll(strsToHighlight[m], "<span style='color: " + this[n][i]["to_highlight"][strsToHighlight[m]] + ";'>" + strsToHighlight[m] + "</span>");
                }

                // Fix anoying issue with x's, y's, z's a's, b's, c's, or r's in a function's parameters in their names
                coloredName = coloredName.replaceAll("/x/", "x");
                coloredName = coloredName.replaceAll("/y/", "y");
                coloredName = coloredName.replaceAll("/z/", "z");
                coloredName = coloredName.replaceAll("/a/", "a");
                coloredName = coloredName.replaceAll("/b/", "b");
                coloredName = coloredName.replaceAll("/c/", "c");
                coloredName = coloredName.replaceAll("/r/", "r");

                // Fix same issue with operators
                coloredName = coloredName.replaceAll("/=/", "=");
                coloredExample = coloredExample.replaceAll("/=/", "=");

                // Make example multiline
                coloredExample = coloredExample.replaceAll("\n", "<br>");
                
                coloredExample = coloredExample.replaceAll("|", "");

                // Append the docs to the container
                container.innerHTML += '<label><code>' + coloredName + '</code> (' + this[n][i].type + ')</label>';
                container.innerHTML += '<p>' + this[n][i].use + '<br>';
                container.innerHTML += '<u>For Example:</u><br><examplecode>' + coloredExample + '</examplecode></p><br><br>';
            } if (this[n][i].module == 'video') { // Videos
                container.innerHTML += '<h3>' + this[n][i].name + '</h3>';
                container.innerHTML += '<video width="512" height="288" controls="controls"><source src="./tutorials/videos/' + n + '/' + this[n][i].video + '.mp4"></video>';
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
        console.warn("The User has requested a tutorials page that does not exist.");
    }
}

// Loads search page into html
tutorials.setupSearch = function(query) {
    // Hide initial page
    document.getElementById("main").classList = "hidden";

    let n = '';
    for (let i = 3; i < query.length; i++) {
        n += query[i];
    }

    let container = document.createElement("div");
    container.classList.add("container");
    container.innerHTML += '<p><a href="./tutorials">Back</a></p><h2>Tutorial Search > ' + n + '</h2><ul class="results"></ul>';

    document.getElementById('list').appendChild(container);

    return n;
}

// Searches the tutorials and places the relevant ones on the page
tutorials.search = function(query) {
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

    // Search all tutorials and rate them based on matching the query tokens
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
    values.sort();
    values.reverse();
    for (let i = 0; i < values.length; i++) {
        if (values[i] > 0) {
            toBeInserted.push(getKeyByValue(ratings, values[i]));
        }
    }

    // Plcae items in html
    for (let i = 0; i < toBeInserted.length; i++) {
        if (toBeInserted[i] !== 'load' && toBeInserted[i] !== 'Template') {
            document.getElementsByClassName("results")[0].innerHTML += '<li><a href="./tutorials?' + encodeURI(toBeInserted[i]) + '">' + toBeInserted[i] + '</a></li>';
        }
    }
    if (toBeInserted.length == 0) {
        document.getElementsByClassName("results")[0].innerHTML += '<h2>No Results</h2>';
    }
}

tutorials.getRating = function(key, tokens) {
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
        aTag.href = "./tutorials?q=" + searchBar.value;
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
}

// Where the magic happens, loads a tutorial, or searches for one.
window.onload = function() {
    if (window.location.search[1] == "q" && window.location.search[2] == "=") {
        // Setup page
        const q = tutorials.setupSearch(decodeURI(window.location.search));

        // Search for tutorial
        tutorials.search(q)
    } else if (window.location.search.length > 1) {
        
        // Load tutorial
        let tutorialName = window.location.search;
        tutorials.load(tutorialName);
    }
}
