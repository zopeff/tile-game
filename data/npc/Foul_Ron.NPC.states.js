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
            // this is almost to the point where this could all be part of the base
            // class and driven totally through the JSON config file
            window.game.speech.removeAll()
            this.state = to
            let quest = window.game.player.quests.has('Foul_Ron_0') // need to move this to config
            if(this.state.dialog && !this.dialogHandler){
                await this.loadDialogHandler()
                this.dialogHandler.setContext(quest)
            }

            if( !quest ){
                if( !this.dialogHandler.isDone() ){
                    this.dialogHandler.nextMsg();
                }
            }
            else if( !quest.completed ){
                this.dialogHandler.setContext(quest)
                if(quest.canComplete()){
                    if( !this.dialogHandler.isDone() ){
                        this.dialogHandler.nextMsg();
                    }
                    else{
                        quest.setComplete()
                    }
                }
                else{
                    // these can go to dialog?
                    this.curr_message = window.game.speech.addMessage(this.parent.x,this.parent.y,"Back already? Where is my box?");
                }
            }
            else{
                // these can go to dialog?
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