import {StateHandler} from '../../statehandler.js'
export default class NPCStateHandler extends StateHandler{
    constructor(parent){
        super(parent)
        this.curr_message = 0;
    }
    
    changeState(to, data){
        this.updating_state = true;
        // can we change from and to?
        if( !this.can(to) ){
            return;
        }
        this.state = to
        if('speak' === to && this.parent.y > 3){
            let msg = this.state.data[Math.floor(Math.random() * this.state.data.length)]
            console.log(this.parent.name,"SPEAK",this.parent.x, this.parent.y, '"'+msg+'"')
            this.curr_message = window.game.speech.addMessage(this.parent.x,this.parent.y,msg);
        }        
        else if( 'idle' === to){
            window.game.speech.removeMessage(this.curr_message)
        }
        else if( 'interact' === to ){
            // data is the player pos
            // turn to face the player
            let turn = 'up'
            switch(data.position[4]){
                case 'up':
                    turn = 'down';break;
                case 'down':
                    turn = 'up';break;
                case 'left':
                    turn = 'right';break;
                case 'right':
                    turn = 'left';break;
            }
            this.parent.face(data.ctx,turn)
            console.log(this.parent.name,"SPEAK",this.parent.x, this.parent.y, 'Hello!')
            this.curr_message = window.game.speech.addMessage(this.parent.x,this.parent.y,"Hello!");
        }
        this.updating_state = false;
    }

    updateState(ctx, world, timestamp){
        const elapsed = timestamp - this.parent.animate_start;
        if(this.updating_state){            
            this.parent.animate_start = timestamp; 
            return;
        }

        if( elapsed > this.state.time){
            if( 'idle' === this.state.id ){
                //move in a random direction
                const dirArr = ['up','down','left','right'];
                this.parent.move(ctx, world, dirArr[Math.floor(Math.random() * dirArr.length)])
                if( 0==Math.floor(Math.random() * 2) ){
                    this.changeState("speak")
                }
            }
            else if('speak' === this.state.id ){
                // done spaking, back to normal
                if( 0==Math.floor(Math.random() * 5) ){
                    this.changeState("idle")
                }
            }
            else if( 'interact' === this.state.id ){
                // is player still standing there?
                if(!world.player.near(this.parent.x, this.parent.y)){
                    // oh well
                    console.log("I guess you are done")
                    window.game.speech.removeMessage(this.curr_message)
                    this.changeState("idle")
                }           
            }
            this.parent.animate_start = timestamp; 
        }
    }
}