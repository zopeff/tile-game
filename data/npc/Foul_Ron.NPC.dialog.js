const DIALOG = [
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
        trigger:{type:'quest',id:'quest_0'}
    }
]

export default class FoulRon_DialogHandler{
    constructor(parent){
        this.parent = parent;
        this.curr = 0
    }

    next(){
        this.curr++
    }

    isDone(){
        return this.curr === DIALOG.length
    }

    nextMsg(){
        if( !DIALOG[this.curr].trigger ){
            let x = this.parent.x
            let y = this.parent.y
            if('player'===DIALOG[this.curr].who){
                x = window.game.player.position[0]
                y = window.game.player.position[1]
            }
            return window.game.speech.addMessage(x,y,DIALOG[this.curr++].msg);
        }
        else{
            console.log(DIALOG[this.curr])
            this.next()
            return -1;
        }
    }
}