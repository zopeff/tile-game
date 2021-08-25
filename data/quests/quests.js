import { ToastAlert, TOAST_ICONS } from '../../toast.js';

const QUEST_FOLDER = './'

export class Quest{

    constructor(id){
        this.id = id

        this.completed = false;
    }

    get description(){
        return ""
    }

    get title(){
        return ""
    }

    canComplete(){
        return !this.completed;
    }

    setComplete(){
        new ToastAlert("You completed the quest!<br/>"+this.title, TOAST_ICONS.ICON_QUEST)
        this.when = new Date()
        this.completed = true;
    }

    isComplete(){
        return this.completed
    }

}

export class QuestController{
    constructor(){
        this.quests = []
    }

    toJSON(){
        let val = this.quests
        return val;
    }
    
    load(data){
        this.quests = data
    }
    
    async loadQuest(quest){
        let module = await import(QUEST_FOLDER+quest+'.js')
        return new module.default(quest)
    }

    handleQuestEvent(e){
        // add to active quests
        this.add(e.id)
    }

    async add(questId){
        let q = await (this.loadQuest(questId))
        this.quests.push(q)
        new ToastAlert("You got a new quest!<br/>"+q.title, TOAST_ICONS.ICON_QUEST)
    }

    has(questID){
        return this.quests.find(q => (q.id === questID) && !q.completed)
    }

    hasActiveQuest(questID){
        let q = this.has(questID)
        return q ? !q.completed : false
    }

    hasCompletedQuest(questID){
        let q = this.has(questID)
        return q ? q.completed : false
    }

}