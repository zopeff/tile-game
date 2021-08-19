import {World} from './world.js';
import {Sprite} from './thing.js';
import {SpeechBubble} from './speech.js';

export class Game{
    #_world;
    #canvas;
    #ctx;
    // debug helpers
    dbg_loadMap(name){
        this._world.loadMap(this.ctx,name)
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

        this._world = new World(this.ctx);
        await this._world.init();
        let self = this;

        window.addEventListener('resize', function(){self.resizeCanvas()}, false);
        this.canvas.addEventListener('keydown', (e)=>self.keyDown(e),);
        this.canvas.addEventListener('mouseup', (e)=>self.mouseUp(e) );

        this._world.addPlayer( new Sprite("link", 0, 0, 'img/link_all.png'))
        await this._world.loadMap(this.ctx )
        
        window.requestAnimationFrame(function(timestamp){self.render(timestamp)});
    }

    get world(){return this.#_world}
    

    render(timestamp){
        let self = this;

        this._world.render(this.ctx, timestamp)
        this.speech.draw(this.ctx, this.world)

        window.requestAnimationFrame(function(timestamp){self.render(timestamp)});
    }

    resizeCanvas(){
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx.imageSmoothingEnabled = false;
    }

    keyDown(e){
        //this._world.select()
        let pos = this._world.player.position
        switch(e.key){
            case "e":

                break;
            case " ": 
                this._world.player.fire(this.ctx,this.world); 
                break;
            case "ArrowRight":
                if(e.shiftKey){
                    this._world.map.scrollMap(this.ctx,1,0)
                }
                else{
                    if(this._world.player.move(this.ctx, this._world, 'right') && this._world.isCenter(pos)[0]){
                        this._world.map.scrollMap(this.ctx,1,0)
                    }
                    this.world.checkEvent(this.ctx)
                }
                break;
            case "ArrowLeft":
                if(e.shiftKey){
                    this._world.map.scrollMap(this.ctx,-1,0)
                }
                else{
                    if(this._world.player.move(this.ctx, this._world,'left') && 
                        this._world.isCenter(pos)[0]){
                        this._world.map.scrollMap(this.ctx,-1,0)
                    }
                     
                    this.world.checkEvent(this.ctx)
                } 
                break;
            case "ArrowDown":
                if(e.shiftKey){
                    this._world.map.scrollMap(this.ctx,0,1)
                }
                else{
                    if(this._world.player.move(this.ctx, this._world, 'down' ) && 
                        this._world.isCenter(pos)[1]){
                        this._world.map.scrollMap(this.ctx,0,1)
                    }
                    this.world.checkEvent(this.ctx)
                }
                break;
            case "ArrowUp":
                if(e.shiftKey){
                    this._world.map.scrollMap(this.ctx,0,-1)
                }
                else{
                    if(this._world.player.move(this.ctx, this._world,'up') && 
                        this._world.isCenter(pos)[1]){
                        this._world.map.scrollMap(this.ctx,0,-1)
                    }
                    ; 
                    this.world.checkEvent(this.ctx)
                }
                break;
        }
    };
    
    mouseUp(e){
        //this._world.select(e.offsetX,e.offsetY)
    };
        
}