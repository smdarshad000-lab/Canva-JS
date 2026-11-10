// // const canvas = document.getElementById('myCanvas');

// // const ctx = canvas.getContext('2d');

// class Geometry{

//     constructor(){
//         this.canvas = document.getElementById('myCanvas');
//         this.ctx = this.canvas.getContext('2d');

//         this.mouseX = 0;
//         this.mouseY = 0;

//         this.startListening();
//         this.draw();
//     }

//     startListening(){
//         this.canvas.addEventListener('mousemove', (event) => {
//             this.mouseX = event.offsetX;
//             this.mouseY = event.offsetY;
//             this.draw();
//         });
//     }

//     clear(){
//         this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
//     }

//     draw(){
//         this.clear();

//         this.ctx.fillStyle = 'red';
//         this.ctx.beginPath();
//         this.ctx.arc(this.mouseX, this.mouseY, 4,0, Math.PI*2);
//         this.ctx.fill();
//     }
// }

// let app = new Geometry();


let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");

var window_height = window.innerHeight;
var window_width = window.innerWidth;

canvas.width = window_width;
canvas.height = window_height;

canvas.style.background = "#aff8";

classImage{
    constructor(imagePath, xpos, ypos, width, height){
        this.imagePath= imagePath;
        this.xpos = xpos;
        this.ypos = ypos;
        this.width = width;
        this.height = height;
    }
}


function createImage(){
    let myImage = document.createImage('img');
    myImage.src = imagePath;
    myImage.onload = function(){
        context.drawImage(myImage, xpos, ypos, width, height); 
    }
}

let image = new Image('logo.png', 50, 50, 100, 100);
createImage(context, image.imagePath, image.xpos, image.ypod, image.width, image.height);
