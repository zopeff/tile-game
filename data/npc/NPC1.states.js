export default class StateHandler {
    constructor(parent){
        this.self = parent
        this.curr_message = 0;
        this.updating_state = false;
    }
    
    get state(){
        return this.self.curr_state
    }
    set state(to){
        this.self.curr_state = this.self.states.find(s=>s.id===to)
    }
    
    getState(find){
        return this.self.states.find(s=>s.id===find)
    }

    can(to){
        // can the current state transition to new state
        if( !this.self.curr_state.to ){
            return false; // probably not a valid config
        }

        if( '*'===this.self.curr_state.to[0] ){
            return true;
        }

        return this.self.curr_state.to.find(s=>s===to)
    }

    changeState(to, data){
        this.updating_state = true;
        // can we change from and to?
        if( !this.can(to) ){
            return;
        }
        this.state = to
        if('speak' === to && this.self.y > 3){
            let msg = this.state.data[Math.floor(Math.random() * this.state.data.length)]
            console.log(this.self.name,"SPEAK",this.self.x, this.self.y, '"'+msg+'"')
            this.curr_message = window.game.speech.addMessage(this.self.x,this.self.y,msg);
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
            this.self.face(data.ctx,turn)
            console.log(this.self.name,"SPEAK",this.self.x, this.self.y, 'Hello!')
            this.curr_message = window.game.speech.addMessage(this.self.x,this.self.y,"Hello!");
        }
        this.updating_state = false;
    }

    updateState(ctx, world, timestamp){
        const elapsed = timestamp - this.self.animate_start;
        if(this.updating_state){            
            this.self.animate_start = timestamp; 
            return;
        }

        if( elapsed > this.self.curr_state.time){
            if( 'idle' === this.self.curr_state.id ){
                //move in a random direction
                const dirArr = ['up','down','left','right'];
                this.self.move(ctx, world, dirArr[Math.floor(Math.random() * dirArr.length)])
                if( 0==Math.floor(Math.random() * 2) ){
                    this.changeState("speak")
                }
            }
            else if('speak' === this.self.curr_state.id ){
                // done spaking, back to normal
                if( 0==Math.floor(Math.random() * 5) ){
                    this.changeState("idle")
                }
            }
            else if( 'interact' === this.self.curr_state.id ){
                // is player still standing there?
                if(!world.player.near(this.self.x, this.self.y)){
                    // oh well
                    console.log("I guess you are done")
                    window.game.speech.removeMessage(this.curr_message)
                    this.changeState("idle")
                }           
            }
            this.self.animate_start = timestamp; 
        }
    }
}