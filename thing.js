import {NPC} from './npc.js'
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

        this.speed = 8; //48 / 6(num frames)
        this.num_frames = 6;

        this.offset = [48,64]

        // 0 = down
        // 1 = left
        // 2 = right
        // 3 = up
        this.facing = 0;
        this.frame = 0;
        this.animSpeed = 100;
        this.animate_start;
        this.max_frame = 0;
        this.animate_finished = null;
    }

    get position(){ return [this.x, this.y, this.width*this.scale_x, this.height*this.scale_y, this.facing]}
    set position(pos){this.x = pos.x; this.y=pos.y;}
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

    interact(ctx, world){
        // am I facing something to interact with?
        let facing = this.facingPosition;
        let o = world.canInteract(facing);
        if(o){
            console.log("Inteact with: " + o.name)
            // trigger 'interact' state?
            o.stateHandler.changeState('interact', {ctx:ctx,position:this.position})
        }
        
    }

    action(ctx){
        this.playAnimation(ctx, 1)
    }
    
    fire(ctx, world, finished){
        if( this.animate ){
            return; // only one at a time
        }
        this.column = 6
        this.frame = 0;
        this.max_frame = 4;
        this.animate = true
        this.animate_move = false;
        this.animate_finished = function(ctx,world){
            let x = world.player.position[0]
            let y = world.player.position[1]
            switch(world.player.position[4]){
                case 'up':y--;break;
                case 'down':y++;break;
                case 'right':x++;break;
                case 'left':x--;break;
            }
            if( world.map.canBreak(x,y)){
                world.map.updateMap(x,y,0)
            }
            let h = world.find(x,y)
            if( h ){
                world.remove(h)
            }
        };
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
        if( this.animate && !this.animate_move ){
            return; // only one at a time
        }

        this.column = 0;
        let success = false;


        switch(dir){
            case 'up':
                success = super.move(ctx, world, 0, -1 )
                console.log(this.name,"up")
                this.face(ctx,dir)
                break;
            case 'down':
                success = super.move(ctx, world, 0, 1 )
                console.log(this.name,"down")
                this.row = 0
                this.face(ctx,dir)
                break;
            case 'left':
                success = super.move(ctx, world, -1,0 )
                console.log(this.name,"left")
                this.row = 1
                this.face(ctx,dir)
                break;
            case 'right':
                success = super.move(ctx, world, 1,0 )
                console.log(this.name,"right")
                this.row = 2
                this.face(ctx,dir)
                break;
        }

        this.max_frame = 5
        this.animate = true;
        this.animate_move = true;
        return success;
    }

    updateAnimate(ctx, world, timestamp){
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
                    this.animate_finished(ctx,world)
                };
                this.frame = 0;
                this.column = 0;
                this.animate = false;
                this.animate_start = undefined
                this.animate_move = false;
                this.animate_finished = null;
            }
            return true;  
        }
        return false;
    }

    get screenPos(){
        return [(this.x * 48)-this.offset[0],(this.y * 48)-this.offset[1]]
    }

    get hitBox(){
        return[
            this.screenPos[0]+this.offset[0],
            this.screenPos[1]-this.offset[1],
            (this.width*this.scale_x), 
            (this.height*this.scale_y)-68
        ]
    }

    draw(ctx){
        let cur_frame = this.column + this.frame;

        let x = ((this.x-ctx.world.map.x) * 48)-this.offset[0]
        let y = ((this.y-ctx.world.map.y) * 48)-this.offset[1]
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