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
    txt = txt.replaceAll("↯", "#")
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
                document.getElementsByClassName("uploaded-sounds")[0].innerHTML += "<audio class='imported-sound' src='" + url + "' controls></audio><p>" + gw_cabinet.soundNames[gw_cabinet.soundNames.length - 1] + "</p>";
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
                    document.getElementsByClassName("uploaded-images")[0].innerHTML += "<img class='imported-image' src='" + gw_cabinet.imageUrls[i] + "'><p>" + gw_cabinet.imageNames[i] + "</p>";
                }
                for (let i = 0; i < gw_cabinet.soundNames.length; i++) {
                    document.getElementsByClassName("uploaded-sounds")[0].innerHTML += "<audio class='imported-sound' src='" + gw_cabinet.soundUrls[i] + "'><p>" + gw_cabinet.soundNames[i] + "</p>";
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
    txt += "⇇JSCONTENT⇔" + editor.getValue().replaceAll("#", "↯") + "⇉";
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
    txt += "←TITLE↭" + obj.name + "↭" + obj.author + "→";
    txt += "←OVERVEIW↭" + obj.overveiw + "↭" + obj.color.replaceAll("#", "↯") + "→";
    txt += "←JSCONTENT↭" + obj.js + "→";
    txt += "←DOCUMENTATION↭" + obj.docs + "→"; 
    txt += "←END→";
    for (let i = 0; i < specailSymbols.length; i++) {
        txt = txt.replaceAll(specailSymbols[i], '');
    }
    return txt;
}

function gw_downloadProject() {
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
    xtns.push(ext);
    let d = document.createElement("div");
    d.classList.add(ext.name.replaceAll(" ", "_") + "-" + ext.author.replaceAll(" ", "_"));
    d.style = "background-color: " + ext.color;
    d.innerHTML += "<p><b>" + ext.name + "</b></p>";
    d.innerHTML += "<p><em>" + ext.overveiw + "</em></p>";
    d.innerHTML += "<p>" + ext.docs + "</p>";
    document.getElementsByClassName("extension-docs-holder")[0].appendChild(d);

    let s = document.createElement("script");
    // s.type = "module";
    s.textContent = ext.js;
    s.classList.add("ext-script");
    document.body.appendChild(s);
}