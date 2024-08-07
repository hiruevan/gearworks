// Cabinet
let gw_cabinet = {
    imageNames: [],
    imageUrls: [],
    soundNames: [],
    soundUrls: []
};

// Remove from cabinet
function gw_cabinetRemove(url, type) {
    if (type == "image") {
        if (!gw_cabinet.imageNames.includes(url)) return false;
        let idx = gw_cabinet.imageNames.indexOf(url);
        let img = document.getElementsByClassName("imported-image")[idx];
        let txt = document.getElementsByClassName("image-text")[idx];
        img.remove();
        txt.remove();
        gw_cabinet.imageNames.splice(idx, 1);
        gw_cabinet.imageUrls.splice(idx, 1);
    } else if (type == "sound") {
        if (!gw_cabinet.soundNames.includes(url)) return false;
        let idx = gw_cabinet.soundNames.indexOf(url);
        let audio = document.getElementsByClassName("imported-sound")[idx];
        let txt = document.getElementsByClassName("sound-text")[idx];
        audio.remove();
        txt.remove();
        gw_cabinet.soundNames.splice(idx, 1);
        gw_cabinet.soundUrls.splice(idx, 1);
    }
}

// Images
document.getElementById('img-upload').addEventListener('change', function() {
    if (this.files && this.files[0]) {
        var img = document.getElementById('add-img');
        const ext = this.files[0].name.split(".")[1];
        img.onload = () => {
            URL.revokeObjectURL(img.src);  // no longer needed, free memory
        }

        if (ext != "png" && ext != "jpg" && ext != "jpeg" && ext != "svg") {
            alert("Sorry, that's not a valid image!");
            return;
        }

        img.src = URL.createObjectURL(this.files[0]); // set src to blob url

        // Add list entry
        gw_cabinet.imageNames.push(this.files[0].name);

        gw_imgToDataURL(img.src, function(url) {
            document.getElementsByClassName("uploaded-images")[0].innerHTML += "<img class='imported-image' src='" + url + "'><p class='image-text'>" + gw_cabinet.imageNames[gw_cabinet.imageNames.length - 1] + " <a style='font-size:15px;' href='" + url + "' download='" + gw_cabinet.imageNames[gw_cabinet.imageNames.length - 1] + "'>Download</a> <a style='font-size:15px;' href='javascript:gw_cabinetRemove(" + '"' + gw_cabinet.imageNames[gw_cabinet.imageNames.length - 1] + '", "image")' + "'>Remove</a></p>";
            gw_cabinet.imageUrls.push(url);
        }, ext);
    }
});

function gw_imgToDataURL(src, callback, filetype) {
    var image = new Image();
    image.crossOrigin = 'Anonymous';
    image.onload = function(){
       var canvas = document.createElement('canvas');
       var context = canvas.getContext('2d');
       canvas.height = this.naturalHeight;
       canvas.width = this.naturalWidth;
       context.drawImage(this, 0, 0);
       var dataURL = canvas.toDataURL('image/' + filetype);
       callback(dataURL);
    };
    image.src = src;
}

// Sounds
document.getElementById('sound-upload').addEventListener('change', function() {
    if (this.files && this.files[0]) {
        const ext = this.files[0].name.split(".")[1];
        gw_cabinet.soundNames.push(this.files[0].name);

        if (ext != "wav" && ext != "mp3" && ext != "m4a" && ext != "wma" && ext != "ogg") {
            alert("Sorry, that's not a valid audio file!");
            return;
        }

        gw_audioToBase64(this.files[0]).then(result => gw_addResult(result));
    }
});

function gw_addResult(r) {
    let url = r;
    document.getElementsByClassName("uploaded-sounds")[0].innerHTML += "<audio class='imported-sound' src='" + url + "' controls></audio><p class='sound-text'>" + gw_cabinet.soundNames[gw_cabinet.soundNames.length - 1] + " <a style='font-size:15px;' href='" + url + "' download='" + gw_cabinet.soundNames[gw_cabinet.soundNames.length - 1] + "'>Download</a> <a style='font-size:15px;' href='javascript:gw_cabinetRemove(" + '"' + gw_cabinet.soundNames[gw_cabinet.soundNames.length - 1] + '", "sound")' + ";'>Remove</a></p>";
    gw_cabinet.soundUrls.push(url);
}

async function gw_audioToBase64(audioFile) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onerror = reject;
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(audioFile);
    });
}
