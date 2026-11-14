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
    }

    startButtons(){

        this.clearBtn.addEventListener("click", () => {
            this.circles = [];
            this.centerX = null;
            this.centerY = null;
            this.info.textContent = "Cleared. Clink to set a new ceneter.";
            this.draw();
        })
    }

    handleClick(x, y) {
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

        this.ctx.beginPath();
        this.ctx.arc(this.mouseX, this.mouseY, 5, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

let geometry = new Geometry();