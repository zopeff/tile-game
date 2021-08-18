import {Sprite} from "./thing.js"

export class NPC extends Sprite{
    constructor(options,x,y){
        super(options.name,x,y,options.tiles.img)
        this.width = options.tiles.width;
        this.height = options.tiles.height;
        this.animate = true;
        this.animate_move = true;
        this.offset = [0,38]

        this.state = 'idle'
    }

    updateAnimate(ctx, world, timestamp){
        
        if (this.animate_start === undefined){
            this.animate_start = timestamp;
        }
        const elapsed = timestamp - this.animate_start;

        if( 'idle' === this.state ){
            if( elapsed > 1500){
                const dirArr = ['up','down','left','right'];
                this.move(ctx, world, dirArr[Math.floor(Math.random() * dirArr.length)])
                this.animate = true;
                this.animate_start = timestamp; 
            }        
        }
    }
}
