import {World} from './world.js';
import {Sprite} from './thing.js';
import {SpeechBubble} from './speech.js';

export class Game{
    #world;
    #canvas;
    #ctx;
    // debug helpers
    dbg_loadMap(name){
        this.world.loadMap(this.ctx,name)
    }
    //

    constructor(id){
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');    
        window.game = this;
    }

    async init(){
        this.resizeCanvas();
        this.canvas.focus();
        this.speech = new SpeechBubble()

        this.#world = new World(this.ctx);
        await this.#world.init();
        let self = this;

        window.addEventListener('resize', function(){self.resizeCanvas()}, false);
        this.canvas.addEventListener('keydown', (e)=>self.keyDown(e),);
        this.canvas.addEventListener('mouseup', (e)=>self.mouseUp(e) );

        this.#world.addPlayer( new Sprite("link", 0, 0, 'img/link_all.png'))
        await this.#world.loadMap(this.ctx )
        
        window.requestAnimationFrame(function(timestamp){self.render(timestamp)});
    }

    get world(){return this.#world}
    

    render(timestamp){
        let self = this;

        this.#world.render(this.ctx, timestamp)
        this.speech.draw(this.ctx, this.world)

        window.requestAnimationFrame(function(timestamp){self.render(timestamp)});
    }

    resizeCanvas(){
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx.imageSmoothingEnabled = false;
    }

    keyDown(e){
        //this.#world.select()
        let pos = this.#world.player.position
        switch(e.key){
            case "e":
                this.#world.player.interact(this.ctx,this.world); 
                break;
            case " ": 
                this.#world.player.fire(this.ctx,this.world); 
                break;
            case "ArrowRight":
                if(e.shiftKey){
                    this.#world.map.scrollMap(this.ctx,1,0)
                }
                else{
                    if(this.#world.player.move(this.ctx, this.#world, 'right') && this.#world.isCenter(pos)[0]){
                        this.#world.map.scrollMap(this.ctx,1,0)
                    }
                    this.world.checkEvent(this.ctx)
                }
                break;
            case "ArrowLeft":
                if(e.shiftKey){
                    this.#world.map.scrollMap(this.ctx,-1,0)
                }
                else{
                    if(this.#world.player.move(this.ctx, this.#world,'left') && 
                        this.#world.isCenter(pos)[0]){
                        this.#world.map.scrollMap(this.ctx,-1,0)
                    }
                     
                    this.world.checkEvent(this.ctx)
                } 
                break;
            case "ArrowDown":
                if(e.shiftKey){
                    this.#world.map.scrollMap(this.ctx,0,1)
                }
                else{
                    if(this.#world.player.move(this.ctx, this.#world, 'down' ) && 
                        this.#world.isCenter(pos)[1]){
                        this.#world.map.scrollMap(this.ctx,0,1)
                    }
                    this.world.checkEvent(this.ctx)
                }
                break;
            case "ArrowUp":
                if(e.shiftKey){
                    this.#world.map.scrollMap(this.ctx,0,-1)
                }
                else{
                    if(this.#world.player.move(this.ctx, this.#world,'up') && 
                        this.#world.isCenter(pos)[1]){
                        this.#world.map.scrollMap(this.ctx,0,-1)
                    }
                    ; 
                    this.world.checkEvent(this.ctx)
                }
                break;
        }
    };
    
    mouseUp(e){
        //this.#world.select(e.offsetX,e.offsetY)
    };


    save(){
        let val = this.#world.toJSON();
        window.localStorage.setItem("game",val)
    }

    load(){
        this.speech.removeAll();
        let val = window.localStorage.getItem("game")
        let data = JSON.parse(val)
        this.#world.loadFromSave(this.ctx, data)
    }
        
}