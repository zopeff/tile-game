import { Game } from './game.js';
import {Map} from './map.js';
import {NPC} from './npc.js';
import {fetchRemoteResource} from './util.js';
import {Transitions} from './transitions.js';

export class AnimationController{
    constructor(dx,dy, updateFn){
        this.dx = dx
        this.dy = dy
        this.update = updateFn
    }
}
export class World{
    entities = [];
    #map;
    #mapList;
    #npcList;
    active = null;
    loaded = false;
    savedPositions = [];
    mapState = {}

    constructor(ctx){
        ctx.world = this;
        this.animationController = null;
        this.mapScroll = [0,0];

    }

    isCenter(playerPos){
        return [
            playerPos[0]-this.map.x === this.center[0],
            playerPos[1]-this.map.y === this.center[1]
        ];
    }

    checkEvent(ctx){
        if(!this.#map) return;
        let e = this.#map.checkEvents(this.player.position[0],this.player.position[1])
        if( e ){
            e(ctx, this)
        }
    }

    getSaveData(){
        return {currentMap:this.#map.name,player:this.player,maps:this.mapState};
    }
    toJSON(){
        this.saveMapState()
        return JSON.stringify(this.getSaveData())
    }

    saveMapState(){
        this.mapState[this.#map.name] = {name: this.#map.name, weather:window.game.weather.current, entities:this.entities.map(e=>e.getSaveData())}
    }

    getMapState(mapName){
        return this.mapState[mapName];
    }

    restoreMapState(ctx, mapName){
        let state = this.mapState[mapName]
        if( !state ){
            return false;
        }
        //reset everything the map might have loaded
        this.reset()

        if( state.entities ){
            this.addEntities(state.entities)
        }

        if( state.weather ){
            window.game.weather.restore(state.weather)
        }

        return true;
    }

    async loadFromSave(ctx, data){
        this.#map = null

        this.mapState = data.maps

        await this.loadMap(ctx, data.currentMap )
        this.restoreMapState(ctx, data.currentMap)

        this.player.load(data.player)
        this.centerMapOnPlayer(ctx)
    }

    reset(){
        this.removeAllEntities()
    }

    async init(){
        this.#npcList = await fetchRemoteResource("./data/npc/npc.json")
    }

    addPlayer(o){
        this.player = o
    }

    addNPC(o,x,y){
        this.entities.push( new NPC(o,x,y) )
        return this.entities[this.entities.length-1]
    }

    savePosition(){
        this.savedPositions.push(this.player.position)
    }

    restorePosition(ctx){
        let old = this.savedPositions.pop()
        if(old){
            this.player.position = old;
        }
        this.centerMapOnPlayer(ctx)
    }

    async findMap(name){
        if( !this.#mapList ){
            this.#mapList = await fetchRemoteResource("./data/maps/maps.json")
        }
        if( !name ){
            return this.#mapList[0]
        }
        return this.#mapList.find(map=>map.name===name)
    }

    addEntities(npcList){
        if( npcList ){
            npcList.forEach(npc=>{
                let i = this.#npcList.find(n=>npc.id===n.id)
                if( i ){
                    i.name = npc.name ? npc.name : i.name
                    let e = this.addNPC(i,npc.position[0],npc.position[1])
                    if( npc.stateData ){
                        e.restoreState(npc.stateData)
                    }
                }
            })
        }
    }

    centerMapOnPlayer(ctx){
        let dx = Math.clamp(Math.ceil(ctx.canvas.width / 48),0,this.#map.width)
        let dy = Math.clamp(Math.ceil(ctx.canvas.height / 48),0,this.#map.height)

        this.center = [Math.ceil(dx/2),Math.ceil(dy/2)]

        if( dx == this.#map.width || dy == this.#map.height){
            return
        }

        if( this.player.position[0] != this.center[0] ){
            this.map.x = Math.clamp(this.player.position[0]-this.center[0],0,this.#map.width-dx)
        }
        if( this.player.position[1] != this.center[1] ){
            this.map.y = Math.clamp((this.player.position[1]-this.center[1]),0,this.#map.height-dy)
        }
    }

    async loadMap(ctx,mapToLoad){
        // is there a map already loaded?
        if( this.#map ){
            // save the current map state
            this.saveMapState();
        }

        let mapConfig = await this.findMap(mapToLoad)
        this.#map = new Map(mapConfig);
        await this.#map.load(ctx);
        this.player.position = mapConfig.player.position
        window.game.speech.removeAll()

        if(!this.restoreMapState(ctx,mapConfig.name)){
            // setup all the NPCs based on the default config
            this.removeAllEntities();
            this.addEntities(mapConfig.entities)
            this.centerMapOnPlayer(ctx)
        }
        Transitions.circle('in')
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

    removeEntity(r){
        this.entities = this.entities.filter(o=>{
            return r!=o
        })
    }

    removeAllEntities(){
        this.entities = []
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

    canInteract(pos){
        return this.entities.find(e=>(e.x===pos[0]&&e.y===pos[1]&&e.canInteract));
    }

    // render (ctx, timestamp){
    //     if( !this.#map ){
    //         return;
    //     }
    //     if (this.animate_start === undefined){
    //         this.animate_start = timestamp;
    //     }
    //     const elapsed = timestamp - this.animate_start;

    //     ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height)
    //     this.#map.draw(ctx,timestamp);

    //     this.entities.sort( (l,r) => l.y < r.y )
    //     .filter(o => {
    //         // might be better to do this at the actual point
    //         // of draw and avoid this extra loop
    //         return (o.x >= this.map.x && o.y >= this.map.y &&
    //             o.x < (this.map.x+Math.ceil(ctx.canvas.width/48)) && 
    //             o.y < (this.map.y+Math.ceil(ctx.canvas.height/48)))
    //     } )
    //     .forEach(o => {
    //         o.draw(ctx,timestamp)
    //         o.updateAnimate(ctx, this, timestamp)
    //         this.animate_start = timestamp;
    //     })
    //     this.player.draw(ctx,timestamp)
    //     this.player.updateAnimate(ctx, this, timestamp)
    // }

    render (ctx, timestamp){
        if( !this.#map ){
            return;
        }
        
        game.ctxOffscreen.clearRect(0,0,game.ctxOffscreen.canvas.width, game.ctxOffscreen.canvas.height)
        game.ctx.clearRect(0,0,game.ctx.canvas.width, game.ctx.canvas.height)
        this.#map.draw(game.ctxOffscreen,timestamp);

        this.entities.sort( (l,r) => l.y < r.y )
        .filter(o => {
            // might be better to do this at the actual point
            // of draw and avoid this extra loop
            return (o.x >= this.map.x && o.y >= this.map.y &&
                o.x < (this.map.x+Math.ceil(game.ctxOffscreen.canvas.width/48)) && 
                o.y < (this.map.y+Math.ceil(game.ctxOffscreen.canvas.height/48)))
        } )
        .forEach(o => {
            o.draw(game.ctxOffscreen,timestamp)
            o.updateAnimate(game.ctxOffscreen, this, timestamp)
        })

        let dx = this.map.x === 0? 0: 48;
        let dy = this.map.y === 0? 0: 48;
        game.ctx.drawImage(game.ctxOffscreen.canvas,
            dx+this.mapScroll[0], dy+this.mapScroll[1],
            ctx.canvas.width, ctx.canvas.height,
            0,0,
            game.ctx.canvas.width, game.ctx.canvas.height)

        this.player.draw(game.ctx,timestamp)
        this.player.updateAnimate(game.ctx, this, timestamp)
    }

    updateAnimate(ctx, timestamp){
        if (this.animate_start === undefined){
            this.animate_start = timestamp;
        }
        const elapsed = timestamp - this.animate_start;

        if( elapsed > 20){
            if( this.animationController ){
                this.animationController.update()
            }
            this.animate_start = timestamp;
        }
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