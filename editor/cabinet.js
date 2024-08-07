// Cabinet
let gw_cabinet = {
    imageNames: [],
    imageUrls: [],
    soundNames: [],
    soundUrls: []
};

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
            document.getElementsByClassName("uploaded-images")[0].innerHTML += "<img class='imported-image' src='" + url + "'><p>" + gw_cabinet.imageNames[gw_cabinet.imageNames.length - 1] + " <a style='font-size:15px' href='" + url + "' download='" + gw_cabinet.imageNames[gw_cabinet.imageNames.length - 1] + "'>Download</a></p>";
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
    document.getElementsByClassName("uploaded-sounds")[0].innerHTML += "<audio class='imported-sound' src='" + url + "' controls></audio><p>" + gw_cabinet.soundNames[gw_cabinet.soundNames.length - 1] + " <a style='font-size:15px' href='" + url + "' download='" + gw_cabinet.soundNames[gw_cabinet.soundNames.length - 1] + "'>Download</a></p>";
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
