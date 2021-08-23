export class InventoryController{
    constructor(){
        this.inventory = []
    }

    toJSON(){
        let val = this.inventory
        return val;
    }

    load(data){
        this.inventory = data
    }

    give(thing){
        this.inventory.push(thing)
    }
    has(itemName){
        return this.inventory.find(item=>item.name===itemName)
    }
    remove(itemName){
        this.inventory.splice(this.inventory.findIndex(item=>item.name===itemName),1)
    }    
}