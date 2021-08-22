import {Sprite} from "./thing.js"

export class NPC extends Sprite{
    constructor(options,x,y){
        super(options.name,x,y,options.tiles.img)
        this.id = options.id;
        this.width = options.tiles.width;
        this.height = options.tiles.height;
        this.animate = true;
        this.animate_move = true;
        this.offset = [0,38]
        this.loaded = false;
        this.loadStateHandler(options);
    }

    async loadStateHandler(options){
        await import('./data/npc/'+this.id+'.states.js').then(module=>{
            this.loaded = true;
            this.stateHandler = new module.default(this, options.states)
        })

    }

    getSaveData(){
        return {name:this.name,id:this.id,position:[this.x,this.y],stateData:this.stateHandler}
    }
    toJSON(){
        let val = this.getSaveData()
        return val
    }

    restoreState(data){
        let self = this;
        setTimeout(()=>{
            if( !this.loaded ){
                self.restoreState(data)
                return;
            }
            this.stateHandler.data = data.data
        },500)
    }

    get canInteract(){return this.stateHandler.can('interact')}

    udpateState(){

    }

    updateAnimate(ctx, world, timestamp){
        
        if (this.animate_start === undefined){
            this.animate_start = timestamp;
        }
        const elapsed = timestamp - this.animate_start;

        if( this.stateHandler ){
            if( elapsed > 100 ){
                this.stateHandler.updateState(ctx,world, timestamp)
            }
        }
    }
}
