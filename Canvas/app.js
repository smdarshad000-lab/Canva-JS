// const canvas = document.getElementById('myCanvas');

// const ctx = canvas.getContext('2d');

class Geometry{

    constructor(){
        this.canvas = document.getElementById('myCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.mouseX = 0;
        this.mouseY = 0;

        this.startListening();
        this.draw();
    }

    startListening(){
        this.canvas.addEventListener('mousemove', (event) => {
            this.mouseX = event.offsetX;
            this.mouseY = event.offsetY;
            this.draw();
        });
    }

    clear(){
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
    }

    draw(){
        this.clear();

        this.ctx.fillStyle = 'red';
        this.ctx.beginPath();
        this.ctx.arc(this.mouseX, this.mouseY, 4,0, Math.PI*2);
        this.ctx.fill();
    }
}

let app = new Geometry();