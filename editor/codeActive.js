// Disallowed JS keywords
const notAllowed = ['window', 'document'];

// Check for security issues
function gw_checkForSecurityIssues(txt) {
    // Check for not allowed js keywords
    for (let i = 0; i < notAllowed.length; i++) {
        if (txt.indexOf(notAllowed[i] + '.') !== -1) {
            gw_error("Illegal Javascript Keyword: '" + notAllowed[i] + "'. You cannot use document effecting keywords.");
            return true;
        }
    }

    // Check for illegal function calls
    const illegalFunctionPattern = /\b(gw_[a-zA-Z0-9_]*)\b/g;
    let match;
    while ((match = illegalFunctionPattern.exec(txt)) !== null) {
        gw_error("Illegal Function Call: '" + match[0] + "'. You cannot call Gear Works internal functions.");
        return true;
    }

    return false;
}

// Check for errors in the code
function gw_primeScriptForErrors(code) {
    let raw = "try {\n" + code + "\n} catch(e) { gw_error(e); }";
    return raw;
}

// Running code
function gw_run() {
    gw_stop();
    let script = document.createElement("script");
    script.classList.add("canvas-script");
    let raw = editor.getValue();
    if (gw_checkForSecurityIssues(raw)) {
        return false;
    }
    raw = gw_primeScriptForErrors(raw);
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
    console.log("Possible Thumbnail:");
    console.log(src);

    gw_ctx.fillStyle = "white";
    gw_ctx.fillRect(0, 0, gw_canvas.width, gw_canvas.height);
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
