const canvas = document.getElementById("canvas");
const c2d = canvas.getContext("2d");
let loadInterval;
let mousedown = false;

canvas.width = 5000;
canvas.height =5000;

c2d.fillStyle = "#ff0000";

function grid() {
    for (var i = 0; i < canvas.width; i += 10) {
        c2d.beginPath();
        c2d.moveTo(i, 0);
        c2d.lineTo(i, canvas.height);
        c2d.stroke();
    }
    for (var i = 0; i < canvas.height; i += 10) {
        c2d.beginPath();
        c2d.moveTo(0, i);
        c2d.lineTo(canvas.width, i);
        c2d.stroke();
    }
}

function load(uuidFilter) {
    var loadForm = new FormData();
    var amount = 0;
    loadForm.append("action", "getPixels");
    if (!uuidFilter)
        loadForm.append("uuid", "0");
    else {
        var date = new Date(Date.now());
        loadForm.append("uuid", date.getUTCFullYear().toString() + (date.getUTCMonth() + 1).toString() + date.getUTCDate().toString() + date.getUTCHours().toString() + date.getUTCMinutes().toString() + date.getUTCSeconds().toString());
    }
    fetch("./Scripts/pixelplace.php", {
        method: "POST",
        mode: "no-cors",
        body: loadForm
    }).then(response => response.json()).then((data) => {
        var dataArr = data.split(";");
        for (var i = 0; i < dataArr.length; i++) {
            var data = dataArr[i].split(",");
            var pixel = new Pixel(data[0], data[1], c2d, data[2]);
            pixel.instantiate();
            amount++;
        }
    });
}

class Pixel {
    constructor(x, y, c2d, color) {
        this.x = x;
        this.y = y;
        this.c2d = c2d;
        this.color = color;
    }
    instantiate() {
        c2d.fillStyle = this.color;
        c2d.fillRect(10 * this.x, 10 * this.y, 10, 10);
    }
}

function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    return [x, y];
}
canvas.addEventListener("mousedown", function (e) {
    var ownerInfo = document.getElementById("ownerInfo");
    switch (e.button) {
        case 0:
            mousedown = true;
            ownerInfo.style.width = 0;
            ownerInfo.style.height = 0;
            ownerInfo.style.opacity = 0;
            ownerInfo.style.left = 0;
            ownerInfo.style.top = 0;
            break;
        case 2:
            const mousePos = getMousePosition(canvas, e);
            var loadForm = new FormData();
            loadForm.append("action", "getPixelByCoords");
            loadForm.append("coordx", Math.trunc(mousePos[0] / 10));
            loadForm.append("coordy", Math.trunc(mousePos[1] / 10));
            fetch("./Scripts/pixelplace.php", {
                method: "POST",
                mode: "no-cors",
                body: loadForm
            }).then(response => response.json()).then((dataArr) => {
                var data = dataArr.split(",");
                console.log(data[3]);
                if (data[2] != undefined) {
                    ownerInfo.style.width = "11rem";
                    ownerInfo.style.height = "8.2rem";
                    ownerInfo.style.opacity = 1;
                    ownerInfo.style.left = `${mousePos[0]}px`;
                    ownerInfo.style.top = `${mousePos[1]}px`;
                    document.getElementById("pixelColor").style.background = data[2];
                    document.getElementById("pixelColorName").innerHTML = data[2];
                    var red = parseInt((data[2]).slice(1, 3), 16);
                    var green = parseInt((data[2]).slice(2, 4), 16);
                    var blue = parseInt((data[2]).slice(3, 5), 16);
                    if (red >= 175 || green >= 175 || blue >= 175)
                        document.getElementById("pixelColorName").style.color = "#000";
                    else
                        document.getElementById("pixelColorName").style.color = "#fff";
                }
            });
            break;
    }
    notShowContext(e);
});

function notShowContext(event) {
    event = event || window.event;

    if (event.stopPropagation)
        event.stopPropagation();

    event.cancelBubble = true;
    return false;
}

function pickColor(){
    var colorPicked = document.getElementById("pixelColorName").innerHTML;
    document.getElementById("colorPreview").setAttribute("data-current-color",colorPicked);
    document.getElementById("colorPreview").style.backgroundImage = `linear-gradient(to right, ${colorPicked} 0%, ${colorPicked} 100%)`;
    
}

canvas.oncontextmenu = ()=> {
    return false;
};

ownerInfo.oncontextmenu = ()=> {
    return false;
};


canvas.addEventListener("mouseup", function (e) {
    mousedown = false;
});

canvas.addEventListener("mousemove", function (e) {
    if (mousedown) {
        const mousePos = getMousePosition(canvas, e);
        var pixel = new Pixel(Math.trunc(mousePos[0] / 10), Math.trunc(mousePos[1] / 10), c2d, document.getElementById("colorPreview").getAttribute("data-current-color"));
        pixel.instantiate();
        var loadForm = new FormData();
        loadForm.append("action", "pushPixel");
        loadForm.append("coordx", Math.trunc(mousePos[0] / 10));
        loadForm.append("coordy", Math.trunc(mousePos[1] / 10));
        loadForm.append("color", document.getElementById("colorPreview").getAttribute("data-current-color"));
        var date = new Date(Date.now());
        loadForm.append("uuid", (date.getUTCFullYear().toString() + (date.getUTCMonth() + 1).toString() + date.getUTCDate().toString() + date.getUTCHours().toString() + date.getUTCMinutes().toString() + date.getUTCSeconds().toString()));
        fetch("./Scripts/pixelplace.php", {
            method: "POST",
            mode: "no-cors",
            body: loadForm
        }).then(response => response.json()).then((data) => {
            
        });
    }
});


grid();

setInterval(()=>{
    load();

},100);