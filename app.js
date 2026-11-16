// const canvas = document.getElementById('myCanvas');

// const ctx = canvas.getContext('2d');

// class Geometry{

//     constructor(){
//         this.canvas = document.getElementById('myCanvas');
//         this.ctx = this.canvas.getContext('2d');

//         this.mouseX = 0;
//         this.mouseY = 0;      
// }

// const app = new Geometry();

// let canvas = document.getElementById("myCanvas");
// let context = canvas.getContext("2d");

// var window_height = window.innerHeight;
// var window_width = window.innerWidth;

// canvas.width = window_width;
// canvas.height = window_height;

// canvas.style.background = "#aff8";

// classImage{
//     constructor(imagePath, xpos, ypos, width, height){
//         this.imagePath= imagePath;
//         this.xpos = xpos;
//         this.ypos = ypos;
//         this.width = width;
//         this.height = height;
//     }
// }


// function createImage(){
//     let myImage = document.createImage('img');
//     myImage.src = imagePath;
//     myImage.onload = function(){
//         context.drawImage(myImage, xpos, ypos, width, height); 
//     }
// }

// let image = new Image('logo.png', 50, 50, 100, 100);
// createImage(context, image.imagePath, image.xpos, image.ypod, image.width, image.height);

// class Geometry {
//     constructor() {
//         this.canvas = document.getElementById("Canvas");
//         this.ctx = this.canvas.getContext("2d");
//         this.info = document.getElementById("info");

//         this.mouseX = 0;
//         this.mouseY = 0;

//         this.info.textContent = "Compass: click to set the center, then click again to set the radius.";

//         this.startListening();
//         this.draw();
//     }

//     startListening() {
//         this.canvas.addEventListener("mousemove", (event) => {
//             const point = this.getMousePosition(event);

//             this.mouseX = point.x;
//             this.mouseY = point.y;

//             this.draw();
//         });
//     }

//     getMousePosition(event) {
//         const rect = this.canvas.getBoundingClientRect();
//         const scaleX = this.canvas.width / rect.width;
//         const scaleY = this.canvas.height / rect.height;

//         return {
//             x: (event.clientX - rect.left) * scaleX,
//             y: (event.clientY - rect.top) * scaleY
//         };
//     }

//     clear() {
//         this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//     }

//     draw() {
//         this.clear();

//         this.ctx.fillStyle = "red";
//         this.ctx.beginPath();
//         this.ctx.arc(this.mouseX, this.mouseY, 4, 0, Math.PI * 2);
//         this.ctx.fill();
//     }
// }

// const app = new Geometry();


class Geometry {
    constructor() {
        this.canvas = document.getElementById("Canvas");
        this.ctx = this.canvas.getContext("2d");

        this.mouseX = 0;
        this.mouseY = 0;

        this.centerX = null;
        this.centerY = null;

        this.circles = [];

        this.info = document.getElementById("info");
        this.clearBtn = document.getElementById("clearBtn");

        this.mode = "compass";
        this.compassBtn = document.getElementById("compassBtn");
        this.protractorBtn = document.getElementById("protractorBtn");
        this.penBtn = document.gerElementById("penBtn");
        // for penBtn;
        this.pX = 400;
        this.pY = 480;
        this.pR = 260;
        this.draggingP = false;
        this.pOffsetX = 0;
        this.pOffsetY = 0;
        this.draggingCenter = false;
        this.centerOffset = 0;
        this.centerOffsetY = 0;
        this.movedCompass = false;
        this.drawing = false;
        this.stroke = [];
        this.strokes = []; 

        this.info.textContent = "Compass: click to set the center";

        this.startListening();
        this.startButtons();
        this.draw();
    }

    startListening() {
        let self = this;

        this.canvas.addEventListener("mousemove", function(event) {
            self.mouseX = event.offsetX;
            self.mouseY = event.offsetY;
            self.draw();
        });

        this.canvas.addEventListener("click", function(event) {
            self.handleClick(event.offsetX, event.offsetY);
        });

        // this.canvas.addEventListener("mousedown", function(event){
        //     self.handleMouseDown(event.offsetX, event.offsetY);
        // });

        // this.canvas.addEventListener("mouseup", function(event){
        //     self.handleMouseDown(event.offsetX, event.offsetY);
        // });

        // this.canvas.addEventListener("click", funciton(event){
        //     self.handleClick(event.offsetX, event.offsetY);
        // });
    }

    startButtons(){

        this.clearBtn.addEventListener("click", () => {
            this.circles = [];
            this.centerX = null;
            this.centerY = null;
            this.info.textContent = "Cleared. Clink to set a new ceneter.";
            this.draw();
        });

        this.protractorBtn.addEventListener("click", () =>{
            this.mode = "protractor";
            this.centerX = null;
            this.centerY = null;
            this.info.textContent = "Protractor: move the mouse to read the angle";
            this.draw();
        });

        this.compassBtn.addEventListener("click", () => {
            this.mode = "compass";
            this.centerX = null;
            this.centerY = null;
            this.info.textContent = "compass: click to set the center";
            this.draw();
        });

        this.penBtn.addEventListener("click", () => {
            this.setPenMode();

            this.mode = "pen";
            this.centerX = "null";
            this.centerY = "null";
            this.drawing = false;
            this.stroke = [];
            this.info.textContent = "pen: hold the moues drag to draw";
            this.draw();
        });
    }

    handleClick(x, y) {

        if(this.mode === "protractor"){
            return;
        }

        if (this.centerX === null) {
            this.centerX = x;
            this.centerY = y;
            this.info.textContent = "Now move the mouse and click again to set the radius";
        } else {
            let dx = x - this.centerX;
            let dy = y - this.centerY;
            let radius = Math.sqrt(dx * dx + dy * dy);
            this.info.textContent = "Circle saved. Click to set a new center.";

            this.circles.push({
                centerX: this.centerX,
                centerY: this.centerY,
                radius: radius
            });

            this.centerX = null;
            this.centerY = null;
        }

        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for(let i = 0; i < this.circles.length; i++){
            let circle = this.circles[i];

             this.ctx.beginPath();
            this.ctx.arc(circle.centerX, circle.centerY, circle.radius, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        if (this.centerX !== null) {
            let dx = this.mouseX - this.centerX;
            let dy = this.mouseY - this.centerY;
            let radius = Math.sqrt(dx * dx + dy * dy);

            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY, radius, 0, Math.PI * 2);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY);
            this.ctx.lineTo(this.mouseX, this.mouseY);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY, 4, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        if(this.mode === "protractor"){
            this.drawProtractor();
        }

        this.ctx.strokeStyle = "black";
        this.ctx.fillStyle = "black";
    }

    drawProtractor(){
        let cx = 400;
        let cy = 480;
        let r = 260;

        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r, Math.PI, 2* Math.PI);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(cx-r, cy);
        this.ctx.lineTo(cx + r, cy);
        this.ctx.stroke();

        for(let d = 0; d <= 180; d += 5){

            let angleRad = d * Math.PI/180;
            let outerX = cx + r * Math.cos(angleRad);
            let outerY = cy - r * Math.sin(angleRad);

            let innerLength = 15;

            if( d % 10 === 0){
                innerLength = 25;
            }

            let innerX = cx + (r - innerLength) * Math.cos(angleRad);
            let innerY = cy - (r - innerLength) * Math.sin(angleRad);

            this.ctx.beginPath();
            this.ctx.moveTo(innerX, innerY);
            this.ctx.lineTo(outerX, outerY);
            this.ctx.stroke();
        }

        this.ctx.font = "14px sans-serif";
        this.ctx.fillStyle = "#334155";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";

        for(let d = 0; d <= 180; d += 30){
            let angleRad = d * Math.PI / 180;
            let labelX = cx + (r - 45) * Math.cos(angleRad);
            let labelY = cy - (r - 45) * Math.sin(angleRad);
            this.ctx.fillText(d, labelX, labelY);
        }

        let dx = this.mouseX - cx;
        let dy = this.mouseY - cy;

        let degrees = Math.atan2(-dy, dx) * 180 / Math.PI;

        if(degrees < 0){
            degrees = degrees + 360;
        }

        if(degrees >= 0 && degrees <= 180){
            let angleRad = degrees * Math.PI / 180;
            let armX = cx + r * Math.cos(angleRad);
            let armY = cy - r * Math.sin(angleRad);

            this.ctx.beginPath();
            this.ctx.strokeStyle = "red";
            this.ctx.moveTo(cx, cy);
            this.ctx.lineTo(armX, armY);
            this.ctx.stroke();
            this.ctx.fillStyle = "red";
            this.ctx.fillText(Math.round(degrees) + "°", armX, armY - 20);
        }

        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "alphabetic";
    }

}

let geometry = new Geometry();