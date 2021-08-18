import {Map} from './map.js';
import {NPC} from './thing.js';
import {clamp,fetchRemoteResource} from './util.js';

export class World{
    entities = [];
    #map;
    #mapList;
    #npcList;
    active = null;
    loaded = false;
    savedPositions = [];

    isCenter(playerPos){
        console.log(playerPos[0], playerPos[1], 
            this.map.x,this.map.y,
            this.center[0],this.center[1],
            playerPos[0]-this.map.x === this.center[0],playerPos[1]-this.map.y === this.center[1])
        return [
            playerPos[0]-this.map.x === this.center[0],
            playerPos[1]-this.map.y === this.center[1]
        ];
    }

    checkEvent(ctx){
        let e = this.#map.checkEvents(this.player.position[0],this.player.position[1])
        if( e ){
            e(ctx, this)
        }
    }

    constructor(ctx){
        ctx.world = this;
    }

    async init(){
        this.#npcList = await fetchRemoteResource("./data/npc/npc.json")
    }

    addPlayer(o){
        //this.entities.push(o)
        this.player = o
    }

    addNPC(o){
        this.entities.push( new NPC(o) )
    }

    savePosition(){
        this.savedPositions.push({
            spawn:this.player.position,
            origin:[this.map.x,this.map.y]
        })
    }

    restorePosition(){
        let old = this.savedPositions.pop()
        this.player.position = {x:old.spawn[0],y:old.spawn[1]}
        this.map.x = old.origin[0]
        this.map.y = old.origin[1]
    }

    async findMap(name){
        if( !this.#mapList ){
            this.#mapList = await fetchRemoteResource("./data/maps.json")
        }
        if( !name ){
            return this.#mapList[0]
        }
        return this.#mapList.find(map=>map.name===name)
    }

    async loadMap(ctx,mapToLoad){
        let map = await this.findMap(mapToLoad)
        this.#map = new Map(map);
        await this.#map.load(ctx);
        this.player.position = {x:map.spawn[0],y:map.spawn[1]}
        let dx = clamp(Math.ceil(ctx.canvas.width / 48),0,this.#map.width)
        let dy = clamp(Math.ceil(ctx.canvas.height / 48),0,this.#map.height)

        this.center = [Math.ceil(dx/2),Math.ceil(dy/2)]

        if( dx == this.#map.width || dy == this.#map.height){
            return
        }

        if( this.player.position[0] != this.center[0] ){
            this.map.x = clamp(this.player.position[0]-this.center[0],0,this.#map.width-dx)
        }
        if( this.player.position[1] != this.center[1] ){
            this.map.y = clamp((this.player.position[1]-this.center[1]),0,this.#map.height-dy)
        }

        this.addNPC(this.#npcList[0])
    }

    addObject(o){
        this.entities.push(o)
    }

    get map(){return this.#map}

    find(x,y){
        let o = this.entities.find(o=>{
            return o.hit(x,y)
        })
        console.log( "Hit:  ",o)
        return o
    }

    remove(r){
        this.entities = this.entities.filter(o=>{
            return r!=o
        })
    }

    canMove(x,y, isNPC){
        if(!this.map.canMove(x,y)){
            return false;
        }
        if(this.entities.find(e=>e.x===x&&e.y===y)){
            return false;
        }
        if( isNPC ){
            if( x === this.player.x && y === this.player.y){
                return false
            }
        }
        return true
    }

    render (ctx, timestamp){
        ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height)
        this.#map.draw(ctx,timestamp);

        this.entities.forEach(o => {
            o.draw(ctx,timestamp)
            o.updateAnimate(ctx, this, timestamp)
        })
        this.player.draw(ctx,timestamp)
        this.player.updateAnimate(ctx, this, timestamp)
    }

    select(x,y){
        if(!x || !y){
            this.player = this.entities[0]
        }
        else{
            this.player = this.find(x,y)[0]
        }
        return this.player;
    }
}