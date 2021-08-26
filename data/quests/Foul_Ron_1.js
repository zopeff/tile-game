import {Quest} from './quests.js'

export default class FoulRon_Quest extends Quest{
    constructor(id){
        super(id)
    }

    get description(){
        return "Somewhere in a cave lives a monster that stole Ron's box. Find the box and return it to him."
    }

    get title(){
        return "Find Foul Ole Ron's box"
    }

    canComplete(){
        return window.game.player.inventory.has('Foul Box')
    }

    setComplete(){
        super.setComplete()
        window.game.player.inventory.remove('Foul Box')
        this.completed = true;
    }
}