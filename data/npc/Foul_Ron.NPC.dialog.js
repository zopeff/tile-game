const QUEST_DIALOG = [
    {
        who:'player',
        msg: "Hey, what's wrong?!"
    },
    {
        who:'npc',
        msg:"Stranger, everything! First you wander into town from who knows where."
    },
    {
        who:'npc',
        msg:"Then late at night, some monster came in and stole my box!"
    },
    {
        who:'player',
        msg:"A monster?! Really?" 
    },
    {
        who:'npc',
        msg:"Really! Not that you can do anything about it...." 
    },
    {
        who:'player',
        msg:"I can help, at least it's somehting I can do to repay you for letting me stay in your house." 
    },
    {
        who:'npc',
        msg:"Oh! That would be great, just bring me back my box! It's very important to me!"
    },
    {
        who:'player',
        msg:"Did you happen to see where the monster went?"
    },
    {
        who:'npc',
        msg:"I didnt, but I've heard something scarey lives in the cave behind the castle..." 
    },
    {
        trigger:{type:'quest',id:'Foul_Ron_0'}
    }
]

const THANKS_DIALOG = [
    {
        who:'npc',
        msg:"You found it! THank you soooo much!"
        // maybe change the NPC state to cause it to run around happy!
    },
    {
        who:'player',
        msg:"You are very welcome!" 
    },
    {
        trigger:{type:'alert',text:'You completed the quest!'}
    }
]

const IDLE_DIALOG = [
    {
        who:'npc',
        msg:"Many Thanks Friend!"
    }
]

export default class FoulRon_DialogHandler{
    constructor(parent){
        this.parent = parent;
        this.setContext()
    }

    setContext(quest){
        let newDialog
        if( !quest ){
            newDialog = QUEST_DIALOG;
        }
        else if( quest.canComplete() ){
            newDialog = THANKS_DIALOG;
        }

        if( newDialog != this.currDialog ){
            this.currDialog = newDialog
            this.curr = 0
        }
    }

    next(){
        this.curr++
    }

    isDone(){
        return this.curr === this.currDialog.length
    }

    nextMsg(){
        window.game.speech.removeMessage(this.curr_message)
        if( !this.currDialog[this.curr].trigger ){
            let x = this.parent.x
            let y = this.parent.y
            if('player'===this.currDialog[this.curr].who){
                x = window.game.player.position[0]
                y = window.game.player.position[1]
            }
            this.curr_message = window.game.speech.addMessage(x,y,this.currDialog[this.curr++].msg);
            return this.curr_message;
        }
        else{
            console.log(this.currDialog[this.curr])
            window.game.triggerEvent(this.currDialog[this.curr].trigger)
            this.next()
            return -1;
        }
    }
}