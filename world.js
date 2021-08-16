import {Map} from './map.js';
import {clamp,fetchRemoteResource} from './util.js';

export class World{
    entities = [];
    #map;
    #mapList;
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
        let e = this.#map.checkEvents(this.active.position[0],this.active.position[1])
        if( e ){
            e(ctx, this)
        }
    }

    constructor(ctx){
        ctx.world = this;
    }

    async init(){
    }

    addPlayer(o){
        this.entities.push(o)
        this.active = o
    }

    savePosition(){
        this.savedPositions.push({
            spawn:this.active.position,
            origin:[this.map.x,this.map.y]
        })
    }

    restorePosition(){
        let old = this.savedPositions.pop()
        this.active.position = {x:old.spawn[0],y:old.spawn[1]}
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
        this.active.position = {x:map.spawn[0],y:map.spawn[1]}
        let dx = clamp(Math.ceil(ctx.canvas.width / 48),0,this.#map.width)
        let dy = clamp(Math.ceil(ctx.canvas.height / 48),0,this.#map.height)

        this.center = [Math.ceil(dx/2),Math.ceil(dy/2)]

        if( dx == this.#map.width || dy == this.#map.height){
            return
        }

        if( this.active.position[0] != this.center[0] ){
            this.map.x = clamp(this.active.position[0]-this.center[0],0,this.#map.width-dx)
        }
        if( this.active.position[1] != this.center[1] ){
            this.map.y = clamp((this.active.position[1]-this.center[1]),0,this.#map.height-dy)
        }
    }

    addObject(o){
        this.entities.push(o)
    }

    get map(){return this.#map}

    find(x,y){
        return this.entities.filter(o=>{
            return o.hit(x,y)
        })
    }

    render (ctx, timestamp){
        ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height)
        this.#map.draw(ctx,timestamp);

        this.entities.forEach(o => {
            o.draw(ctx,timestamp)
            o.updateAnimate(ctx,timestamp)
        })
    }

    select(x,y){
        if(!x || !y){
            this.active = this.entities[0]
        }
        else{
            this.active = this.find(x,y)[0]
        }
        return this.active;
    }
}