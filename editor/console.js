// Console logging
function gw_error(log) {
    let id = Math.random()*97249857;
    toLog = String(log).replaceAll("\n", "<br>");
    document.getElementsByClassName("console-logs")[0].innerHTML += "<div id='" + id + "' class='error log'>" + toLog + "</div>";
    gw_switchToConsole();
    gw_escapeFullscreen();
    if (document.getElementsByClassName('side-bar-control')[0].textContent === "▶") {
        gw_toggleSideBar();
    }
    let aTag = document.createElement("a");
    aTag.href = "#" + id;
    document.body.appendChild(aTag);
    aTag.click();
    gw_stop();
}

function gw_log(log) {
    toLog = String(log).replaceAll("\n", "<br>");
    document.getElementsByClassName("console-logs")[0].innerHTML += "<div class='log'>" + toLog + "</div>";
}

function gw_warn(log) {
    toLog = String(log).replaceAll("\n", "<br>");
    document.getElementsByClassName("console-logs")[0].innerHTML += "<div class='warn log'>" + toLog + "</div>";
}

function gw_clearConsole() {
    document.getElementsByClassName("console-logs")[0].innerHTML = "";
}