// The forever loop (Used by learning coders)
function forever() {}

// Toggles sidebar (With css animation)
function gw_toggleSideBar() {
    if (document.getElementsByClassName('side-bar-control')[0].textContent === "◀") {
        document.getElementsByClassName('side-bar')[0].classList.add('side-bar-in');
        document.getElementsByClassName('side-bar')[0].classList.remove('side-bar-out');
        document.getElementById('editor').style.left = "2%"
        document.getElementsByClassName('side-bar-control')[0].textContent = "▶";

    } else {
        document.getElementsByClassName('side-bar')[0].classList.add('side-bar-out');
        document.getElementsByClassName('side-bar')[0].classList.remove('side-bar-in');
        document.getElementById('editor').style.left = "17%"
        document.getElementsByClassName('side-bar-control')[0].textContent = "◀";

    }
}

// Sidebar tabs
function gw_switchToConsole() {
    document.getElementsByClassName("tab")[1].classList.add("selected");
    document.getElementsByClassName("tab")[0].classList.remove("selected");
    document.getElementsByClassName("docs")[0].classList.add("hidden");
    document.getElementsByClassName("console")[0].classList.remove("hidden");
}

function gw_switchToDocs() {
    document.getElementsByClassName("tab")[0].classList.add("selected");
    document.getElementsByClassName("tab")[1].classList.remove("selected");
    document.getElementsByClassName("console")[0].classList.add("hidden");
    document.getElementsByClassName("docs")[0].classList.remove("hidden");
}

function gw_stripHTMLTags(str) {
    str = str.toString();
    str = str.replaceAll("<br><div>", "\n");
    str = str.replaceAll("<div><br>", "\n");
    str = str.replaceAll("<div><div>", "\n");
    str = str.replaceAll("<br>", "\n");
    str = str.replaceAll("<div>", "\n");
    str = str.replaceAll("&nbsp;", " ");
    str = str.replaceAll("&lt;", "<");
    str = str.replaceAll("&gt;", ">");
    return str.replaceAll(/<[^>]*>/g, '');
}

// Text Editor Zoom code
let gw_codeZoom = 2;
let gw_zoomClasses = ["xsmall", "small", "norm", "large", "xlarge"];
function gw_zoomIn() {
    gw_codeZoom++;
    document.getElementsByClassName("zoom")[1].classList.remove("disabled");
    if (gw_codeZoom === 4) {
        document.getElementsByClassName("zoom")[0].classList.add("disabled");
    } else {
        if (gw_codeZoom > 4) {
            gw_codeZoom = 4;
            return;
        }
        document.getElementsByClassName("zoom")[0].classList.remove("disabled");
    }
    document.getElementsByClassName("editor-text")[0].classList.remove(gw_zoomClasses[gw_codeZoom-1]);
    document.getElementsByClassName("editor-text")[0].classList.add(gw_zoomClasses[gw_codeZoom]);
}

function gw_zoomOut() {
    gw_codeZoom--;
    document.getElementsByClassName("zoom")[0].classList.remove("disabled");
    if (gw_codeZoom === 0) {
        document.getElementsByClassName("zoom")[1].classList.add("disabled");
    } else {
        if (gw_codeZoom < 0) {
            codeZoom = 0;
            return;
        }
        document.getElementsByClassName("zoom")[1].classList.remove("disabled");
    }
    document.getElementsByClassName("editor-text")[0].classList.remove(gw_zoomClasses[gw_codeZoom+1]);
    document.getElementsByClassName("editor-text")[0].classList.add(gw_zoomClasses[gw_codeZoom]);
}

/*User input in project running*/

// Mouse position handling
let mouse = {
    x: 0,
    y: 0
}
document.getElementById("cvs").addEventListener("mousemove", function(e) {
    let cvsWidth = (window.innerWidth*0.25 - 35);
    let leftCvsPos = (window.innerWidth - 35) - cvsWidth;
    let mathWidth = cvsWidth;
    const fullWidth = window.innerHeight - 15;
    if (document.getElementsByClassName("right")[0].textContent == "Escape") {
        mathWidth = fullWidth;
        leftCvsPos = (window.innerWidth - fullWidth)/2;
    }
    mouse.x = e.clientX - leftCvsPos;
    mouse.x = Math.floor((mouse.x*800)/mathWidth);
    if (mouse.x < 0) {
        mouse.x = 0;
    } else if (mouse.x > 800) {
        mouse.x = 800;
    }
    let cvsDivTop = (window.innerHeight*0.07 + 15)
    let topCvsPos =  cvsDivTop + 20;
    if (document.getElementsByClassName("right")[0].textContent == "Escape") {
        topCvsPos = 15;
    }
    mouse.y = e.clientY - topCvsPos;
    mouse.y = Math.floor((mouse.y*800)/mathWidth);
    if (mouse.y < 0) {
        mouse.y = 0;
    } else if (mouse.y > 800) {
        mouse.y = 800;
    }
    
});

// Keyboard
let keyboard = [];
window.addEventListener("keydown", function(e) {
    if (!keyboard.includes(e.key)) {
        keyboard.push(e.key);
    }
});
window.addEventListener("keyup", function(e) {
    if (keyboard.includes(e.key)) {
        if (e.key == "Shift") {
            keyboard = [];
        } else {
            keyboard.splice(keyboard.indexOf(e.key), 1);
        }
    }
});