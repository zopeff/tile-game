
export class Thing{
    name = "";
    speed = 5;
    width = 100;
    height = 100;

    constructor(name, x,y,fill){
        this.name = name;
        this.x = x;
        this.y = y;
        
        this.fill = fill
    }

    hit(x,y){
        return ( x > this.x && 
            x < this.x+this.width &&
            y > this.y &&
            y < this.y+this.height
            );
    }

    move(ctx, x, y){
        this.x += Math.sign(x);
        this.y += Math.sign(y);

        //clamp(this.x + Math.sign(x), 0, 10) //map max
        //clamp(this.y + Math.sign(y), 0, 10) //map max
    }
    
    updateAnimate(ctx,timestamp){

    }

};

export class Sprite extends Thing{
    #sprite;

    constructor(name, x, y, path){
        super(name,x,y,'')
        this.#sprite = new Image();
        this.#sprite.src = path;
        let self = this;
        this.#sprite.onload = function(){
            self.ready = true;
        }

        this.column = 0;
        this.row = 0;
        this.frame = 0;
        this.width = 48;
        this.height = 48;

        this.scale_x = 3;
        this.scale_y=3;

        this.speed = 8; //48 / 6(num frames)
        // 0 = down
        // 1 = left
        // 2 = right
        // 3 = up
        this.facing = 0;
        this.animSpeed = 100;
        this.animate_start;
        this.max_frame = 0;
        this.animate_finished = null;
    }

    get position(){ return [this.x, this.y, this.width*this.scale_x, this.height*this.scale_y, this.facing]}
    set position(pos){this.x = pos.x; this.y=pos.y;}

    action(ctx){
        this.playAnimation(ctx, 1)
    }
    
    fire(ctx, finished){
        if( this.animate ){
            return; // only one at a time
        }
        this.column = 6
        this.frame = 0;
        this.max_frame = 4;
        this.animate = true
        this.animate_move = false;
        this.animate_finished = finished;
    }

    hit(x,y){
        return ( x > this.x && 
            x < this.x+(this.width*this.scale_x) &&
            y > this.y &&
            y < this.y+(this.height*this.scale_y)
            );
    }

    face(ctx, dir){
        switch(dir){
            case 'up':
                this.row = 3
                break;
            case 'down':
                this.row = 0
                break;
            case 'left':
                this.row = 1
                break;
            case 'right':
                this.row = 2
                break;
        }
        this.facing = dir
    }

    move(ctx, dir){
        if( this.animate && !this.animate_move ){
            return; // only one at a time
        }

        this.column = 0;
        let success = false;

        switch(dir){
            case 'up':
                success = super.move(ctx, 0, -this.speed )
                console.log("up")
                this.face(ctx,dir)
                break;
            case 'down':
                success = super.move(ctx, 0, this.speed )
                console.log("down")
                this.row = 0
                this.face(ctx,dir)
                break;
            case 'left':
                success = super.move(ctx, -this.speed,0 )
                console.log("left")
                this.row = 1
                this.face(ctx,dir)
                break;
            case 'right':
                success = super.move(ctx, this.speed,0 )
                console.log("right")
                this.row = 2
                this.face(ctx,dir)
                break;
        }

        this.max_frame = 5
        this.animate = true;
        this.animate_move = true;
    }

    updateAnimate(ctx,timestamp){
        if (this.animate_start === undefined){
            this.animate_start = timestamp;
        }
        const elapsed = timestamp - this.animate_start;
        if( this.animate && elapsed > 80){
            this.frame++;
            if(this.animate_move){
                //this.move(ctx,this.facing)
            }
            this.animate_start = timestamp;
            if( this.frame > this.max_frame ){
                if(this.animate_finished){
                    this.animate_finished()
                };
                this.frame = 0;
                this.column = 0;
                this.animate = false;
                this.animate_start = undefined
                this.animate_move = false;
                this.animate_finished = null;
            }    
        }
    }

    get screenPos(){
        return [(this.x * 48)-48,(this.y * 48)-72]
    }

    get hitBox(){
        return[
            this.screenPos[0]+42,
            this.screenPos[1]+32,
            (this.width*this.scale_x)-84, 
            (this.height*this.scale_y)-68
        ]
    }

    draw(ctx){
        let cur_frame = this.column + this.frame;

        let x = ((this.x-ctx.world.map.x) * 48)-48
        let y = ((this.y-ctx.world.map.y) * 48)-64
        ctx.drawImage(this.#sprite, 
            (cur_frame * this.width),
            (this.row * this.height),
            this.width, this.height,
            x,y,
            this.width*this.scale_x, this.height*this.scale_y);    

        // hit box
        // ctx.beginPath();
        // ctx.rect(...this.hitBox);
        // ctx.stroke();

    }
}