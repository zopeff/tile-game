import {NPCStateHandler} from './NPC1.states.js'
import {Item} from '../../item.js';

export default class Caveman_StateHandler extends NPCStateHandler{
    constructor(parent, states){
        super(parent, states)
        //this.quest_done = false;
    }
    
    changeState(to, data){
        this.updating_state = true;
        // can we change from and to?
        if( !this.can(to) ){
            return false;
        }
        if( 'talk' === to ){
            this.state = to
            console.log(this.parent.name,"SPEAK",this.parent.x, this.parent.y, 'Hello!')

            if( !this.data.hasBeenVisited ){
                this.curr_message = window.game.speech.addMessage(this.parent.x,this.parent.y,"Takes the foul box!");
                this.data.hasBeenVisited = true;
                this.data.quest_done = true
                window.game.world.player.give(new Item('Foul Box'))
            }
            else{
                this.curr_message = window.game.speech.addMessage(this.parent.x,this.parent.y,"I gaves it to you already!");                
            }
        }
        else{
            super.changeState(to,data)
        }
        this.updating_state = false;
        return true;
    }

    updateState(ctx, world, timestamp){
        const elapsed = timestamp - this.parent.animate_start;
        if(this.updating_state){            
            this.parent.animate_start = timestamp; 
            return;
        }
        if( 'talk' === this.state.id && elapsed > this.state.time){
            if(!world.player.near(this.parent.x, this.parent.y)){
                // oh well
                console.log("We hates it for ever!")
                window.game.speech.removeMessage(this.curr_message)
                this.changeState("idle")
            }           
        }

        super.updateState(ctx,world,timestamp)
    }

}