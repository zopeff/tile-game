import { Sprite } from "./sprite.js"
import { InventoryController } from "./inventory.js";
import { QuestController } from './data/quests/quests.js';

export class Player extends Sprite{
    constructor(){
        super("link", 0, 0, 'img/link_all.png')

        this.inventory = new InventoryController() 
        this.quests = new QuestController()
    }
    get WalkFrames(){
        return 1
    }

    toJSON(){
        let val = {id:'player',position:[this.position[0],this.position[1]],inventory:this.inventory,quests:this.quests}
        return val;
    }

    load(data){
        this.position = data.position
        this.inventory.load(data.inventory)
        this.quests.load(data.quests)
    }

    interact(ctx, world){
        // am I facing something to interact with?
        let facing = this.facingPosition;
        let o = world.canInteract(facing);
        if(o){
            console.log("Inteact with: " + o.name)
            // trigger 'interact' state?
            o.stateHandler.changeState('interact', {position:this.position})
        }
        
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
            // dont kill Ron!
            // let h = world.find(x,y)
            // if( h ){
            //     world.removeEntity(h)
            // }
        };
    }
}