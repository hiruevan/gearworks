// File (Saving, loading, etc)

// extensions
let xtns = [];

function gw_toggleFileBox() {
    if (document.getElementsByClassName("file-button")[0].textContent.includes("▼")) {
        document.getElementsByClassName("file-box")[0].classList.remove("hidden");
        document.getElementsByClassName("file-button")[0].textContent = "File ▲";
    } else {
        document.getElementsByClassName("file-box")[0].classList.add("hidden");
        document.getElementsByClassName("file-button")[0].textContent = "File ▼";
    }
}

function gw_openProject() {
    if (!confirm("Are you sure you want to replace the current contents of the Editor?")) {
        return;
    }

    document.getElementById("project-uploader").click();
}

function gw_packageProject() {

}


/*

Special Symbols:
⇇⇉⇔

Hash \n || \r && #:
#: ↯
\n || \r: ↴

.gw1 file format

META
Project Title
Js Content
Images
Sounds
Extensions (Format of .gwx files)
END
*/

document.getElementById("project-uploader").addEventListener("change", function() {
    gw_toggleFileBox();
    const ext = this.files[0].name.split(".")[1];

    if (ext !== "gw1") {
        alert("Sorry, that isn't a valid Gearworks project file (.gw1)!");
        return;
    }
    var gw_reader = new FileReader();
    gw_reader.onload = function(e) {
        gw_loadProjectFile(e.target.result);
    };
    gw_reader.readAsText(this.files[0]);
})

function gw_loadProjectFile(text) {
    document.getElementsByClassName("uploaded-images")[0].innerHTML = "";
    document.getElementsByClassName("uploaded-sounds")[0].innerHTML = "";

    let pName = "";
    let content = "";
    gw_cabinet = {
        imageNames: [],
        imageUrls: [],
        soundNames: [],
        soundUrls: []
    };
    xtns = [];
    let xtnsFiles = [];

    let txt = text;

    // Hash specail *Broken* characters
    txt = txt.replaceAll("↯", "#");
    txt = txt.replaceAll("↴", "\n");

    if (!txt[13] == "1" || !txt[1] == "!") {
        alert("An error occured!")
        return;
    }
    for (let i = 0; i < txt.length; i++) {
        if (txt[i] == "⇇") {
            i++;
            // Document & Meta
            if (txt[i] == "!" || txt[i] == "M") {
                while (txt[i] != "⇉") {
                    i++;
                }
                // Thsese can be ignored
            }
            // Title
            if (txt[i] == "T") {
                while (txt[i] != "⇔") {
                    i++;
                }
                i++;
                while (txt[i] != "⇔") {
                    pName += txt[i];
                    i++;
                }
                i++;
                // Author Ignored
                while (txt[i] != "⇉") {
                    i++;
                }
            }
            // Js content
            if (txt[i] == "J") {
                while (txt[i] != "⇔") {
                    i++;
                }
                i++;
                while (txt[i] != "⇉") {
                    content += txt[i];
                    i++;
                }
            }
            // Images
            if (txt[i] == "I") {
                let name = "";
                let url = "";
                while (txt[i] != "⇔") {
                    i++;
                }
                i++;
                while (txt[i] != "⇔") {
                    name += txt[i];
                    i++;
                }
                i++;
                while(txt[i] != "⇉") {
                    url += txt[i];
                    i++;
                }

                gw_cabinet.imageNames.push(name);
                gw_cabinet.imageUrls.push(url);
                
            }
            // Sounds
            if (txt[i] == "S") {
                let name = "";
                let url = "";
                while (txt[i] != "⇔") {
                    i++;
                }
                i++;
                while (txt[i] != "⇔") {
                    name += txt[i];
                    i++;
                }
                i++;
                while(txt[i] != "⇉") {
                    url += txt[i];
                    i++;
                }

                gw_cabinet.soundNames.push(name);
                gw_cabinet.soundUrls.push(url);
            }
            // extensions
            if (txt[i] == "X") {
                while (txt[i] != "⇔") {
                    i++;
                }
                i++;
                let file = "";
                while (txt[i] != "⇉") {
                    file += txt[i];
                    i++;
                }
                xtnsFiles.push(file);
            }
            if (txt[i] == "E") {
                // Load everything In
                document.getElementById("name-input").value = pName;
                editor.setValue(content);
                for (let i = 0; i < gw_cabinet.imageNames.length; i++) {
                    document.getElementsByClassName("uploaded-images")[0].innerHTML += "<img class='imported-image' src='" + gw_cabinet.imageUrls[i] + "'><p class='image-text'>" + gw_cabinet.imageNames[i] + " <a style='font-size:15px;' href='" + gw_cabinet.imageUrls[i] + "' download='" + gw_cabinet.imageNames[i] + "'>Download</a> <a style='font-size:15px;' href='javascript:gw_cabinetRemove(" + '"' + gw_cabinet.imageNames[i] + '", "image")' + "'>Remove</a></p>";
                }
                for (let i = 0; i < gw_cabinet.soundNames.length; i++) {
                    document.getElementsByClassName("uploaded-sounds")[0].innerHTML += "<audio class='imported-sound' src='" + gw_cabinet.soundUrls[i] + "' controls></audio><p class='sound-text'>" + gw_cabinet.soundNames[i] + " <a style='font-size:15px;' href='" + gw_cabinet.soundUrls[i] + "' download='" + gw_cabinet.soundNames[i] + "'>Download</a> <a style='font-size:15px;' href='javascript:gw_cabinetRemove(" + '"' + gw_cabinet.soundNames[i] + '", "sound")' + ";'>Remove</a></p>";
                }
                for (let i = 0; i < xtnsFiles.length; i++) {
                    gw_loadExtension(gw_readExtensionFile(xtnsFiles[i]));
                }
                return;
            }
        }
    }
}

function gw_getDownloadFile() {
    let txt = "⇇!DOCTYPE⇔gw1⇉";
    txt += "⇇META⇔" + Date().toString() + "⇉";
    
    txt += "⇇TITLE⇔" + document.getElementById("name-input").value.replaceAll("#", "↯") + "⇔gw_user⇉";

    // Get editor Value
    let eValue = editor.getValue();

    // Hash specail *broken* characters
    eValue = eValue.replaceAll("#", "↯");
    eValue = eValue.replaceAll("\n", "↴");
    eValue = eValue.replaceAll("\r", "↴");

    txt += "⇇JSCONTENT⇔" + eValue + "⇉";
    for (let i = 0; i < gw_cabinet.imageNames.length; i++) {
        txt += "⇇IMAGE⇔" + gw_cabinet.imageNames[i] + "⇔" + gw_cabinet.imageUrls[i] + "⇉";
    }

    for (let i = 0; i < gw_cabinet.soundNames.length; i++) {
        txt += "⇇SOUND⇔" + gw_cabinet.soundNames[i] + "⇔" + gw_cabinet.soundUrls[i] + "⇉";
    }

    // Extension is ⇇XTEN⇉
    for (let i = 0; i < xtns.length; i++) {
        txt += "⇇XTEN⇔" + gw_getExtensionFile(xtns[i]) + "⇉";
    }
    

    txt += "⇇END⇉";

    return txt;
}

function gw_getExtensionFile(obj) {
    let txt = "←!DOCTYPE↭gwx→";
    txt += "←META↭" + obj.date + "→";
    txt += "←TITLE↭" + obj.name.replaceAll("#", "↯") + "↭" + obj.author.replaceAll("#", "↯") + "→";
    txt += "←OVERVEIW↭" + obj.overveiw.replaceAll("#", "↯").replaceAll("\n", "↴").replaceAll("\r", "↴") + "↭" + obj.color.replaceAll("#", "↯") + "→";
    txt += "←JSCONTENT↭" + obj.js.replaceAll("#", "↯").replaceAll("\n", "↴").replaceAll("\r", "↴") + "→";
    txt += "←DOCUMENTATION↭" + obj.docs.replaceAll("#", "↯").replaceAll("\n", "↴").replaceAll("\r", "↴") + "→"; 
    txt += "←END→";
    // for (let i = 0; i < specailSymbols.length; i++) {
    //     txt = txt.replaceAll(specailSymbols[i], '');
    // }
    return txt;
}

function gw_downloadProject() {
    gw_toggleFileBox();
    let name = document.getElementById("name-input").value;

    if (name == "") {
        name = "Untitled_Project";
    }
    name = name.replaceAll(" ", "_");

    gw_download(name + ".gw1", gw_getDownloadFile());
}

/*
.gwx File format

Special Symbols:
←→↭

META
Extension Title + Author
Overveiw + Color
Js Content
Docs (Overveiw of objs + Function Docs)
END
*/

document.getElementById("ext-uploader").addEventListener("change", function() {
    const ext = this.files[0].name.split(".")[1];

    if (ext !== "gwx") {
        alert("Sorry, that isn't a valid Gearworks extension file (.gwx)!");
        return;
    }
    var gw_reader = new FileReader();
    gw_reader.onload = function(e) {
        let xten = gw_readExtensionFile(e.target.result);
        gw_loadExtension(xten);
    };
    gw_reader.readAsText(this.files[0]);
});

function gw_loadExtension(ext) {
    if (document.getElementsByClassName(ext.name + "-" + ext.author).length > 0) {
        alert("You already loaded that extension.");
        return false;
    };
    xtns.push(ext);
    let d = document.createElement("div");
    d.classList.add(ext.name.replaceAll(" ", "_") + "-" + ext.author.replaceAll(" ", "_"));
    d.style = "background-color: " + ext.color;
    d.innerHTML += "<p><b>" + ext.name + "</b> <a href='javascript:gw_download(" + '"' + ext.name + '.gwx"' + ", gw_getExtensionFile(xtns[" + (xtns.length-1) + "]));'>Download</a> <a href='javascript:gw_xtnRemove(" + '"' + (ext.name) + '"' + ")'>Remove</a></p>";
    d.innerHTML += "<p><em>" + ext.overveiw + "</em></p>";
    d.innerHTML += "<p>" + ext.docs + "</p>";
    document.getElementsByClassName("extension-docs-holder")[0].appendChild(d);

    let s = document.createElement("script");
    // s.type = "module";
    s.textContent = ext.js;
    s.classList.add("ext-script");
    document.body.appendChild(s);
}

function gw_xtnRemove(xtnName) {
    let idx;
    for (let i = 0; i < xtns.length+1; i++) {
        if (i > xtns.length) return false;
        if (xtns[i].name == xtnName) {
            idx = i;
            break;
        }
    }

    document.getElementsByClassName(xtnName + "-" + xtns[idx].author)[0].remove();
    xtns.splice(idx, 1);
}
