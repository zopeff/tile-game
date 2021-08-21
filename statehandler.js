/*
    Base interface for a character state handler.
    Basically a finite state machine
*/
export class StateHandler{
    constructor(parent, states){
        this.id = parent.id
        this.parent = parent
        this.updating_state = false;
        this.states = states
        this.curr_state = this.states[0]
        this.data = {}
    }

    get state(){
        return this.curr_state // this should move into this class
    }
    set state(to){
        this.curr_state = this.states.find(s=>s.id===to)
    }

    getState(find){
        return this.states.find(s=>s.id===find)
    }

    can(to){
        // can the current state transition to new state
        if( !this.curr_state.to ){
            return false; // probably not a valid config
        }

        if( !this.states.find(s=>s.id===to) ){
            return false;
        }

        if( '*'===this.curr_state.to[0] ){
            return true;
        }

        return this.curr_state.to.find(s=>s===to)
    }

    toJSON(){
        let val = {id:this.id,data:this.data}
        return val
        //window.localStorage.setItem(this.id,JSON.stringify(val))
    }
    fromJSON(json){
        //let val = JSON.parse(window.localStorage.getItem(this.id))
        let val = JSON.parse(json)
        if( val ){
            this.data = val.data
        }
    }

    // these should be implemented by the child class
    changeState(to, data){
    }

    updateState(ctx, world, timestamp){
    }
}