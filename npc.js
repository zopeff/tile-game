import {Sprite} from "./thing.js"

export class NPC extends Sprite{
    constructor(options,x,y){
        super(options.name,x,y,options.tiles.img)
        this.width = options.tiles.width;
        this.height = options.tiles.height;
        this.animate = true;
        this.animate_move = true;
        this.offset = [0,38]
        this.states = options.states;
        this.curr_state = this.states[0]
        import('./data/npc/'+this.name+'.states.js').then(module=>{
            this.stateHandlers = new module.default(this)
        })
    }

    udpateState(){

    }

    updateAnimate(ctx, world, timestamp){
        
        if (this.animate_start === undefined){
            this.animate_start = timestamp;
        }
        const elapsed = timestamp - this.animate_start;

        if( this.stateHandlers ){
            if( elapsed > 100 ){
                this.stateHandlers.updateState(ctx,world, timestamp)
            }
        }
    }
}
