let objectDetector;
let status;
let objects = [];
let video;
let canvas, ctx;
const width = 1280;
const height = 860;

async function make() {
    video = await getVideo();

    objectDetector = await ml5.objectDetector("cocossd", startDetecting);

    canvas = createCanvas(width, height);
    ctx = canvas.getContext("2d");
}

window.addEventListener("DOMContentLoaded", function () {
    make();
});

function startDetecting() {
    console.log("model ready");
    detect();
}

function detect() {
    objectDetector.detect(video, function (err, results) {
        if (err) {
            console.log(err);
            return;
        }
        objects = results;

        if (objects) {
            draw();
        }

        detect();
    });
}

function draw() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    ctx.drawImage(video, 0, 0);
    for (let i = 0; i < objects.length; i += 1) {
        ctx.font = "16px Arial";
        ctx.fillStyle = "green";
        ctx.fillText(objects[i].label, objects[i].x + 4, objects[i].y + 16);

        ctx.beginPath();
        ctx.rect(
            objects[i].x,
            objects[i].y,
            objects[i].width,
            objects[i].height
        );
        ctx.strokeStyle = "green";
        ctx.stroke();
        ctx.closePath();
    }
}

async function getVideo() {
    const videoElement = document.createElement("video");
    videoElement.setAttribute("style", "display: none;");
    videoElement.width = width;
    videoElement.height = height;
    document.body.appendChild(videoElement);

    const capture = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = capture;
    videoElement.play();

    return videoElement;
}

function createCanvas(w, h) {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    document.body.appendChild(canvas);
    return canvas;
}
