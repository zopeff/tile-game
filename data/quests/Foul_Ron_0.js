import {Quest} from './quests.js'

export default class FoulRon_FirstQuest extends Quest{
    constructor(id){
        super(id)
    }

    get description(){
        return "Find Ron and talk to him. It sounds like he needs some help."
    }

    get title(){
        return "Talk to Foul Ole Ron"
    }

    canComplete(){
        // should have some way of knowing if the player
        // talked to ron or not
        return true
    }

    setComplete(){
        super.setComplete()
        this.completed = true;
    }
}