
/* 
    Blatently stolen from https://github.com/geoffb/canvas-rain-demo
*/

const FIXED_STEP = 16;
// Wind
const WIND_VELOCITY = -0.1; // Determines how slanted the rain drops fall, 0 = straight down

// Drop settings
const DROP_COUNT = 200; // Adjust for more/less rain drops
const DROP_WIDTH = 1; // Increase for thicker rain
const DROP_X_BUFFER = 50; // How far to the sides of the screen drops will spawn
const DROP_COLOR = "lightblue";
const DROP_MIN_VELOCITY = 0.5;
const DROP_MAX_VELOCITY = 0.8;
const DROP_MIN_LENGTH = 10;
const DROP_MAX_LENGTH = 40;
const DROP_MIN_ALPHA = 0.3;
const DROP_MAX_ALPHA = 1;


export class Rain{
    
    constructor(ctx){
        this.on = false;
        this.lastTime = 0;
        this.drops = []
        this.initDrops(ctx)
        console.log("looks rainy")
    }

    initDrops(ctx){
        for (let i = 0; i < DROP_COUNT; i++) {
            let drop = {};
            this.resetDrop(ctx, drop);
            drop.y = Math.randomInteger(0, ctx.canvas.height);
            this.drops.push(drop);
        }
    };
    
    // Reset a drop to the top of the canvas
    resetDrop(ctx, drop){
        let scale = Math.random();
        drop.x = Math.randomInteger(-DROP_X_BUFFER, ctx.canvas.width + DROP_X_BUFFER);
        drop.vx = WIND_VELOCITY;
        drop.vy = Math.lerp(DROP_MIN_VELOCITY, DROP_MAX_VELOCITY, scale);
        drop.l = Math.lerp(DROP_MIN_LENGTH, DROP_MAX_LENGTH, scale);
        drop.a = Math.lerp(DROP_MIN_ALPHA, DROP_MAX_ALPHA, scale);
        drop.y = Math.randomInteger(-drop.l, 0);
    };
    
    updateDrops(ctx, dt) {
        for (let i = this.drops.length - 1; i >= 0; --i) {
            let drop = this.drops[i];
            drop.x += drop.vx * dt;
            drop.y += drop.vy * dt;
    
            if (drop.y > ctx.canvas.height + drop.l) {
                this.resetDrop(ctx, drop);
            }
        }
    }
    
    renderDrops(ctx) {
        ctx.strokeStyle = DROP_COLOR;
        ctx.lineWidth = DROP_WIDTH;
        ctx.globalCompositeOperation = "lighter";
    
        for (var i = 0; i < this.drops.length; ++i) {
            var drop = this.drops[i];
    
            var x1 = Math.round(drop.x);
            var y1 = Math.round(drop.y);
    
            var v = { x: drop.vx, y: drop.vy };
            Math.normalizeVector(v);
            Math.scaleVector(v, -drop.l);
    
            var x2 = Math.round(x1 + v.x);
            var y2 = Math.round(y1 + v.y);
    
            ctx.globalAlpha = drop.a;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.closePath();
        }
    };

    draw(ctx, time){
        ctx.save();
        let dt = time - this.lastTime;
        if (dt > 100) { dt = FIXED_STEP; }
    
        while (dt >= FIXED_STEP) {
            this.updateDrops(ctx, FIXED_STEP);
            dt -= FIXED_STEP;
            this.lastTime = time;
        }

        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.renderDrops(ctx);
        ctx.restore();
    } 
}
