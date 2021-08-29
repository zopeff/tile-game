import {NPC} from './npc.js'
export class Thing{
    name = "";
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
    get canInteract(){return false}

    near(x,y){
        // are we currently 1 block away?
        return (this.x+1 === x || this.x-1 === x || this.x===x) && 
        (this.y+1 === y || this.y-1 === y || this.y===y)
    }

    move(ctx, world, x, y){
        let dx = this.x + Math.sign(x);
        let dy = this.y + Math.sign(y);

        if(world.canMove(dx,dy, this instanceof NPC)){
            this.x = dx;
            this.y = dy;
            return true;
        }

        return false;
    }
    
    updateAnimate(ctx, world, timestamp){

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
        this.width = 48;
        this.height = 48;

        this.scale_x = 3;
        this.scale_y=3;

        this.num_frames = 6;

        this.offset = [48,64]

        // 0 = down
        // 1 = left
        // 2 = right
        // 3 = up
        this.facing = 0;
        this.frame = 0;
        this.max_frame = 0
        this.animate_start;
        this.animate_finished = null;
        this.animate_xOffset = 0
        this.animate_yOffset = 0

    }


    get position(){ return [this.x, this.y, this.width*this.scale_x, this.height*this.scale_y, this.facing]}
    set position(pos){this.x = pos[0]; this.y=pos[1];}
    get facingPosition(){
        switch(this.facing){
            case 'up':
                return [this.x, this.y-1]
            case 'down':
                return [this.x, this.y+1]
            case 'left':
                return [this.x-1, this.y]
            case 'right':
                return [this.x+1, this.y]
        }
    }

    fire(ctx, world, finished){
        if( this.animate ){
            return; // only one at a time
        }
    }

    hit(x,y){
        console.log(this.name,x,y, this.x, this.y)
        //     this.x && x < this.x+(this.width*this.scale_x),y > this.y,y > this.y &&
        //     y < this.y+(this.height*this.scale_y))
        return ( x === this.x && y === this.y )
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

    move(ctx, world, dir){
        if( this.animate || this.animate_move ){
            return; // only one at a time
        }

        this.column = 0;
        let success = false;

        let offset = this.WalkSpeed * this.WalkFrames
        switch(dir){
            case 'up':
                success = super.move(ctx, world, 0, -1 )
                console.log(this.name,"up")
                this.animate_yOffset = offset;
                this.face(ctx,dir)
                break;
            case 'down':
                success = super.move(ctx, world, 0, 1 )
                console.log(this.name,"down")
                this.animate_yOffset = -offset;
                this.row = 0
                this.face(ctx,dir)
                break;
            case 'left':
                success = super.move(ctx, world, -1,0 )
                console.log(this.name,"left")
                this.animate_xOffset = offset;
                this.row = 1
                this.face(ctx,dir)
                break;
            case 'right':
                success = super.move(ctx, world, 1,0 )
                console.log(this.name,"right")
                this.animate_xOffset = -offset;
                this.row = 2
                this.face(ctx,dir)
                break;
        }

        if( !success ){
            this.animate_xOffset = 0
            this.animate_yOffset = 0
        }
        else{
            this.animate = true;
            this.max_frame = this.WalkFrames
            this.animate_move = true;
        }

        if( !(this instanceof NPC)){
            console.log(`Map: ${game.world.map.x}, P:${this.x}, Ps:${this.screenPos[0]}, Po:${this.animate_xOffset}`)
        }
        return success;
    }

    updateAnimate(ctx, world, timestamp){
        if (this.animate_start === undefined){
            this.animate_start = timestamp;
        }
        const elapsed = timestamp - this.animate_start;
        if( this.animate && elapsed > this.animateSpeed){
            this.frame++;
            if(this.animate_move){
                switch(this.facing){
                    case 'up':
                        this.animate_yOffset -= this.WalkSpeed;
                        break;
                    case 'down': 
                        this.animate_yOffset += this.WalkSpeed;
                        break;
                    case 'left':
                        this.animate_xOffset -= this.WalkSpeed;
                        break;
                    case 'right':
                        this.animate_xOffset += this.WalkSpeed;
                        break;
                }
            }
            this.animate_start = timestamp;
            if( this.frame > this.max_frame ){
                this.animate = false;
                this.animate_move = false;
                if(this.animate_finished){
                    this.animate_finished(ctx,world)
                };
                this.frame = 0;
                this.column = 0;
                this.animate_start = undefined
                this.animate_finished = null;
                this.animate_xOffset = 0;
                this.animate_yOffset = 0;   
                return false;     
            }
            return true;  
        }
        return false;
    }

    get screenPos(){
        if( !game.world.map ){
            return [0,0]
        }
        let x = ((this.x-game.world.map.x) * 48)-this.offset[0]
        let y = ((this.y-game.world.map.y) * 48)-this.offset[1]
        let mapOffset = game.world.map.mapDrawOffset

        return [x+mapOffset[0],y+mapOffset[1]]
    }

    get hitBox(){
        return[
            this.screenPos[0]+this.offset[0],
            this.screenPos[1]-this.offset[1],
            (this.width*this.scale_x), 
            (this.height*this.scale_y)-68
        ]
    }

    get WalkFrames(){
        return 0
    }
    get WalkSpeed(){
        return Math.ceil(48/this.WalkFrames-1)
    }
    get animateSpeed(){
        return 80
    }
    draw(ctx){
        let cur_frame = this.column + this.frame;
        let x = this.screenPos[0]
        let y = this.screenPos[1]

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