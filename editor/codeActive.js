// Where the code is accually run

// Not allowed js Keywords
const notAllowed = ['window', 'document'];

function gw_checkForSecurityIssues(txt) {
    for (let i = 0; i < notAllowed.length; i++) {
        if (txt.indexOf(notAllowed[i] + '.') !== -1) {
            gw_error("Security Alert! Cannot allow JavaScript keyword: " + notAllowed[i] + ". This causes a security issue; Avoid using this word.");
            return true;
        }
    }
    return false;
}

// Check Errors
function gw_primeScriptForErrors(code) {
    let raw = "try {" + code + "\n} catch (e) {gw_error(e)}";
    return raw;
}

// running code
function gw_run() {
    gw_stop();
    let script = document.createElement("script");
    script.classList.add("canvas-script");
    let raw = editor.getValue();
    raw = gw_primeScriptForErrors(raw);
    if (gw_checkForSecurityIssues(raw)) {
        return false;
    }
    script.innerHTML = raw;
    document.body.appendChild(script);
}

function gw_clearAllSounds() {
    $.each($('audio'), function () {
        $(this).stop();
    });
    let sounds = document.getElementsByClassName("canvas-sound");
    for (let i = 0; i < sounds.length; i++) {
        sounds[i].remove();
    }
}

function gw_stop() {
    forever = function() {}
    gw_clearAllSounds();
    
    let src = gw_canvas.toDataURL();
    console.log("Possible Thumnail:");
    console.log(src);

    gw_ctx.fillStyle = "white";
    gw_ctx.fillRect(0, 0, 800, 800);
    try {
        document.getElementsByClassName("canvas-script")[0].remove();
        console.log("Script Cleanup: Scripts cleaned.")
    } catch (e) {
        console.error("Script Cleanup: Scripts Cleaned; Nothing to remove.")
    }
}

// This repeats forever
function gw_repeat() {
    try {
        forever();
    } catch (e) {
        gw_error("Uncaught Error: " + e)
    }

    document.getElementById("m-x").textContent = mouse.x;
    document.getElementById("m-y").textContent = mouse.y;

    window.requestAnimationFrame(gw_repeat);
}
