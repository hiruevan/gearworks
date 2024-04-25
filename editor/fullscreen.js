// Fullscreen
function gw_fullscreen() {
    gw_goInFullscreen(document.getElementsByClassName("canvas-div")[0]);
    document.getElementsByClassName("right")[0].textContent = "Escape";
    document.getElementsByClassName("right")[0].setAttribute("onclick", "gw_escapeFullscreen();");
}

function gw_escapeFullscreen() {
    gw_goOutFullscreen(document.getElementsByClassName("canvas-div")[0]);
    document.getElementsByClassName("right")[0].textContent = "Fullscreen";
    document.getElementsByClassName("right")[0].setAttribute("onclick", "gw_fullscreen();");
}

/* Get into full screen */
var gw_goInFullscreen = function(element) {
	if (element.requestFullscreen) {
		element.requestFullscreen();
	} else if(element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	} else if(element.webkitRequestFullscreen) {
		element.webkitRequestFullscreen();
	} else if(element.msRequestFullscreen) {
		element.msRequestFullscreen();
	}
    element.classList.add("fullscreen");
};

/* Get out of full screen */
function gw_goOutFullscreen(element) {
	if(document.exitFullscreen) {
		document.exitFullscreen();
	} else if(document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	} else if(document.webkitExitFullscreen) {
		document.webkitExitFullscreen();
	} else if(document.msExitFullscreen) {
		document.msExitFullscreen();
	}
    element.classList.remove("fullscreen");
};

/* Is currently in full screen or not */
var gw_isFullScreen = function() {
	var full_screen_element = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || null;
	// If no element is in full-screen
	if(full_screen_element === null) {
		return false;
	} else {
		return true;
	}
};

// Check to escape fullscreen
if (document.addEventListener) {
    document.addEventListener('fullscreenchange', gw_exitHandler, false);
    document.addEventListener('mozfullscreenchange', gw_exitHandler, false);
    document.addEventListener('MSFullscreenChange', gw_exitHandler, false);
    document.addEventListener('webkitfullscreenchange', gw_exitHandler, false);
}

function gw_exitHandler() {
    if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
        // When the user exits fullscreen
        gw_escapeFullscreen();
    }
}