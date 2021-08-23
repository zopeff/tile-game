import {NPCStateHandler} from './NPC1.states.js'
export default class FoulRon_StateHandler extends NPCStateHandler{
    constructor(parent, states){
        super(parent, states)
    }

    async loadDialogHandler(){
        let module = await import('/data/npc/'+this.id+'.dialog.js')
        this.dialogHandler = new module.default(this.parent)
    }
    
    async changeState(to, data){
        this.updating_state = true;
        // can we change from and to?
        if( !this.can(to) ){
            return false;
        }
        if( 'talk' === to ){
            this.state = to
            if( !this.data.hasBeenVisited ){
                if( this.state.dialog ){
                    if(!this.dialogHandler){
                        await this.loadDialogHandler()
                    }
                    if( !this.dialogHandler.isDone() ){
                        window.game.speech.removeMessage(this.curr_message)
                        this.curr_message = this.dialogHandler.nextMsg();
                    }
                    else{
                        this.data.hasBeenVisited = true;
                    }
                }
                else{
                    this.curr_message = window.game.speech.addMessage(this.parent.x,this.parent.y,"Hello!");
                }
            }
            else if( !this.data.quest_done ){
                if(window.game.world.player.hasInventory('Foul Box')){
                    this.curr_message = window.game.speech.addMessage(this.parent.x,this.parent.y,"You found it!");
                    window.game.world.player.removeInventory('Foul Box')
                    this.data.quest_done = true;
                }
                else{
                    this.curr_message = window.game.speech.addMessage(this.parent.x,this.parent.y,"Back already? Where is my box?");
                }
            }
            else{
                this.curr_message = window.game.speech.addMessage(this.parent.x,this.parent.y,"Many thanks friend!");                
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
                console.log("Good luck!")
                window.game.speech.removeMessage(this.curr_message)
                this.changeState("idle")
            }           
        }

        super.updateState(ctx,world,timestamp)
    }

}