export default class StateHandlers {
    constructor(parent){
        this.self = parent
        this.curr_message = 0;
    }
    
    changeState(to){
        // can we change from and to?
        if( 'idle' == this.self.curr_state.id){
            if('speak' == to && this.self.y > 3){
                this.self.curr_state = this.self.states[1]
                console.log(this.self.name,"SPEAK",this.self.x, this.self.y)
                let x = (this.self.x*48)
                let y = ((this.self.y*48))
                this.curr_message = window.game.speech.addMessage(x,y,this.self.curr_state.data[Math.floor(Math.random() * this.self.curr_state.data.length)]);
            }
        }
        else if( 'speak' == this.self.curr_state.id){
            if('idle' == to){
                window.game.speech.removeMessage(this.curr_message)
                this.self.curr_state = this.self.states[0]
            }
        }
    }

    updateState(ctx, world, timestamp){
        const elapsed = timestamp - this.self.animate_start;

        if( 'idle' === this.self.curr_state.id ){
            if( elapsed > this.self.curr_state.time){
                //move in a random direction
                const dirArr = ['up','down','left','right'];
                this.self.move(ctx, world, dirArr[Math.floor(Math.random() * dirArr.length)])
                this.self.animate = true;
                this.self.animate_start = timestamp; 
                if( 0==Math.floor(Math.random() * 2) ){
                    this.changeState("speak")
                }
            }
        }
        else if('speak' === this.self.curr_state.id ){
            if( elapsed > this.self.curr_state.time){
                if( 0==Math.floor(Math.random() * 5) ){
                    this.changeState("idle")
                }
                this.self.animate_start = timestamp; 
            }
        }
    }
}