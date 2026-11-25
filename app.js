class Geometry {
    constructor() {
        this.canvas = document.getElementById("Canvas");
        this.ctx = this.canvas.getContext("2d");

        this.mouseX = 0;
        this.mouseY = 0;

        this.centerX = null;
        this.centerY = null;

        this.arcRadius = 0;
        this.arcStartAngle = 0;
        this.arcDrawing = false;
        this.arcs = [];

        this.circles = [];

        this.info = document.getElementById("info");
        this.clearBtn = document.getElementById("clearBtn");

        this.mode = "compass";
         
        // this.info = document.getElementById("info");
        this.compassBtn = document.getElementById("compassBtn");
        this.protractorBtn = document.getElementById("protractorBtn");
        this.penBtn = document.getElementById("penBtn");
        // for penBtn;
        this.pX = 400;
        this.pY = 480;
        this.pR = 260;
        this.draggingP = false;
        this.pOffsetX = 0;
        this.pOffsetY = 0;
        this.draggingCenter = false;
        this.centerOffsetX = 0;
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

    setCompassMode(){
        this.mode = "compass";
        this.centerX = null;
        this.centerY = null;

        this.arcRadius = 0;
        this.arcStartAngle = 0;
        this.arcDrawing = false;
        this.draggingCenter = false;
        this.movedCompass = false;
        this.draggingCenter = false;
        this.info.textContent = "compass: click to set the center, then click again to set the radius";
        this.draw();
    }

    setProtractorMode(){
        this.mode = "protractor";
        this.centerX = null;
        this.centerY = null;

        this.arcDrawing = false;
        this.draggingP = false;
        this.draggingCenter = false;
        this.info.textContent = "protractor: move the mouse to read the angle";
        this.draw();
    }

    setPenMode(){
        this.mode = "pen";
        this.centerX = null;
        this.centerY = null;
        this.arcDrawing = false;
        this.drawing = false;
        this.draggingCenter = false;
        this.info.textContent = "pen: hold the mouse and drag to draw";
        this.draw();
    }

    startListening() {
        let self = this;

        this.canvas.addEventListener("mousemove", function(event) {
            self.mouseX = event.offsetX;
            self.mouseY = event.offsetY;
            self.handleMouseMove();
            self.draw();
        });

        // this.canvas.addEventListener("click", function(event) {
        //     self.handleClick(event.offsetX, event.offsetY);
        // });

        this.canvas.addEventListener("mousedown", function(event){
            self.handleMouseDown(event.offsetX, event.offsetY);
        });

        this.canvas.addEventListener("mouseup", function(event){
            self.handleMouseUp(event.offsetX, event.offsetY);
        });

        this.canvas.addEventListener("click", function(event){
            self.handleClick(event.offsetX, event.offsetY);
        });


    }

    startButtons(){

       this.compassBtn.addEventListener("click", () => {
        this.setCompassMode();
       });

       this.protractorBtn.addEventListener("click", ()=> {
        this.setProtractorMode();
       });

       this.penBtn.addEventListener("click", () => {
        this.setPenMode();
       });

       this.clearBtn.addEventListener("click", () => {
        this.arcs = [];
        this.strokes = [];
        this.stroke = [];
        this.drawing = false;
        this.arcRadius = 0;
        this.arcStartAngle = 0;
        this.arcDrawing = false; 
        this.centerX = null;
        this.centerY = null;
        this.draggingCenter = false;
        this.draggingP = false;
        this.movedCompass = false;
        this.info.textContent = "Cleared. Click to set a new center";
        this.draw();
       });
    }

    handleClick(x, y) {
        if(this.mode !== "compass"){
            return;
        }

        if(this.movedCompass){
            this.movedCompass = false;
            return;
        }

        if(this.centerX === null){
            this.centerX = x;
            this.centerY = y;
            this.info.textContent = "Move the mouse and click again to set the radius";
        }else if(this.arcDrawing === false){
            let dx = x - this.centerX;
            let dy = y - this.centerY;
            let radius = Math.sqrt(dx*dx + dy*dy);

            if(radius <= 20){
                return;
            }

            this.arcRadius = radius;
            this.arcStartAngle = Math.atan2(-dy, dx);
            this.arcDrawing = true;
        }   else {
            let dx = x - this.centerX;
            let dy = y - this.centerY;
            let dist = Math.sqrt(dx*dx + dy*dy);

            if(dist <= 20){
                return;
            }

            let endAngle = Math.atan2(-dy, dx);
            let diff = this.getArcDiff(this.arcStartAngle, endAngle);

            if(Math.abs(diff) < 0.05){
                return;
            }


            this.arcs.push({
                centerX: this.centerX,
                centerY: this.centerY,
                radius: this.arcRadius,
                startAngle: this.arcStartAngle,
                diff: diff
            });

            this.centerX = null;
            this.centerY = null;
            this.arcDrawing = false;
            this.info.textContent = "arc saved click to set a new center";
        }

        this.draw();
    }

    handleMouseDown(x, y){
        if(this.mode === "compass"){

            if(this.centerX !== null){
                let dx = x - this.centerX;
                let dy = y - this.centerY;
                let dist = Math.sqrt(dx*dx + dy*dy);

                if(dist <= 20){
                    this.draggingCenter = true;
                    this.movedCompass = false;
                    this.centerOffsetX = this.centerX-x;
                    this.centerOffsetY = this.centerY-y;
                }
            }
        }

            else if(this.mode === "protractor"){
                // let dx = x-this.pX;
                // let dy = y-this.pY;
                // let dist = Math.sqrt(dx*dx + dy*dy);
                // this.draggingP = true;
                    this.draggingP = true;
                    this.pOffsetX = this.pX-x;
                    this.pOffsetY = this.pY-y;
                
            }

            else if(this.mode === "pen"){
                this.drawing = true;
                this.stroke = [];
                this.stroke.push({ x:x, y:y});
            }

            this.draw();
    }

    handleMouseMove(){
        if(this.draggingCenter){
            this.centerX = this.mouseX + this.centerOffsetX;
            this.centerY = this.mouseY + this.centerOffsetY;
            this.movedCompass = true;
        }

        if(this.draggingP){
            this.pX = this.mouseX + this.pOffsetX;
            this.pY = this.mouseY + this.pOffsetY;
        }

        if(this.drawing){
            this.stroke.push({ x: this.mouseX, y: this.mouseY });
        }
    }

    handleMouseUp(x,y){
        this.draggingCenter = false;
        this.draggingP = false;

        if(this.drawing){
            if(this.stroke.length > 1){
                this.strokes.push(this.stroke);
            }

            this.stroke = [];
            this.drawing = false;

            this.draw();
        }
    }

    getArcDiff(startAngle, endAngle){
        let diff = endAngle - startAngle;

        while(diff > Math.PI){
            diff = diff - 2*Math.PI;
        }

        while(diff < -Math.PI){
            diff = diff + 2 * Math.PI;
        }

        return diff;
    }


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for(let i = 0; i < this.arcs.length; i++){
            let arc = this.arcs[i];

            this.ctx.beginPath();
            // this.ctx.arc(arc.centerX, arc.centerY, arc.radius, -arc.startAngle, -arc.StartAngle - arc.diff, arc.diff > 0);
            this.ctx.arc(arc.centerX, arc.centerY, arc.radius, -arc.startAngle, -arc.startAngle - arc.diff, arc.diff > 0);
            this.ctx.stroke();
        }

        if (this.centerX !== null && this.arcDrawing === false){
            let dx = this.mouseX - this.centerX;
            let dy = this.mouseY - this.centerY;
            let radius = Math.sqrt(dx * dx + dy * dy);

            let endAngle = Math.atan2(-dy, dx);
            let diff = this.getArcDiff(this.arcStartAngle, endAngle);
            

            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY, radius, 0, Math.PI*2);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY);
            this.ctx.lineTo(this.mouseX, this.mouseY);
            // this.centerY - this.arcRadius * Math.sin(this.arcStartAngle));
            this.ctx.stroke();


            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY, 6, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.font = "14px sans-serif";
            this.ctx.fillStyle = "red";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";

            let labelX = (this.centerX + this.mouseX) / 2;
            let labelY = (this.centerY + this.mouseY) / 2 - 12;

            this.ctx.fillText(Math.round(radius) + "px", labelX, labelY);
        }

        if(this.centerX !== null && this.arcDrawing === true){
             let dx = this.mouseX - this.centerX;
            let dy = this.mouseY - this.centerY;
            let endAngle = Math.atan2(-dy, dx);
            let diff = this.getArcDiff(this.arcStartAngle, endAngle);

            this.ctx.beginPath();
            this.ctx.arc(
                this.centerX,
                this.centerY,
                this.arcRadius,
                -this.arcStartAngle,
                -this.arcStartAngle - diff,
                diff > 0
            );
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY);
            this.ctx.lineTo(this.centerX + this.arcRadius * Math.cos(this.arcStartAngle),
                            this.centerY - this.arcRadius * Math.sin(this.arcStartAngle));
            this.ctx.stroke();


            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY);
            this.ctx.lineTo(this.mouseX, this.mouseY);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY, 6, 0, Math.PI * 2);
            this.ctx.fill();

            let degrees = Math.abs(diff) * 180 / Math.PI;

            this.ctx.font = "14px sans-serif";
            this.ctx.fillStyle = "red";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";

            let labelAngle = this.arcStartAngle + diff;
            let labelX = this.centerX + (this.arcRadius + 25) * Math.cos(labelAngle);
            let labelY = this.centerY - (this.arcRadius + 25) * Math.sin(labelAngle);

            this.ctx.fillText(Math.round(degrees) + "°", labelX, labelX);
        }

        if(this.mode === "protractor"){
            this.drawProtractor();
        }

        if(this.mode === "compass" && this.centerX === null){
            this.ctx.beginPath();
            this.ctx.moveTo(this.mouseX - 10, this.mouseY);
            this.ctx.lineTo(this.mouseX + 10, this.mouseY);
            this.ctx.moveTo(this.mouseX, this.mouseY - 10);
            this.ctx.lineTo(this.mouseX, this.mouseY + 10);
            this.ctx.stroke();
        }

        if(this.stroke.length > 0){
            this.ctx.beginPath();
            this.ctx.moveTo(this.stroke[0].x, this.stroke[0].y);
            for(let i = 1; i < this.stroke.length; i++){
                this.ctx.lineTo(this.stroke[i].x, this.stroke[i].y);
            }

            this.ctx.stroke();
        }

        for (let s = 0; s < this.strokes.length; s++) {
            let saved = this.strokes[s];
            this.ctx.beginPath();
            this.ctx.moveTo(saved[0].x, saved[0].y);
            for (let i = 1; i < saved.length; i++) {
                this.ctx.lineTo(saved[i].x, saved[i].y);
            }
            this.ctx.stroke();
        }

        this.ctx.strokeStyle = "black";
        this.ctx.fillStyle = "black";

        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "alphabetic";
    }

    drawProtractor(){
        let cx = this.pX;
        let cy = this.pY;
        let r = this.pR;

        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r, Math.PI, 2* Math.PI);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r-70, Math.PI, 2*Math.PI);
        this.ctx.stroke();

        // this.ctx.beginPath();
        // this.ctx.arc(cx,cy, r, Math.PI, 2*Math.PI);
        // this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(cx - r, cy);
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
            this.ctx.strokeStyle = "black";
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