/*
    Base interface for a character state handler.
    Basically a finite state machine
*/
export class StateHandler{
    constructor(parent){
        this.parent = parent
        this.updating_state = false;
    }

    get state(){
        return this.parent.curr_state // this should move into this class
    }
    set state(to){
        this.parent.curr_state = this.parent.states.find(s=>s.id===to)
    }
    
    getState(find){
        return this.parent.states.find(s=>s.id===find)
    }

    can(to){
        // can the current state transition to new state
        if( !this.parent.curr_state.to ){
            return false; // probably not a valid config
        }

        if( '*'===this.parent.curr_state.to[0] ){
            return true;
        }

        return this.parent.curr_state.to.find(s=>s===to)
    }

    // these should be implemented by the child class
    changeState(to, data){
    }

    updateState(ctx, world, timestamp){
    }
}