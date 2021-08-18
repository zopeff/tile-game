import {World} from './world.js';
import {Sprite} from './thing.js';

export class Game{
    #_world;
    #canvas;
    #ctx;

    constructor(id){
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');    
    }

    async init(){
        this.resizeCanvas();
        this.canvas.focus();

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

    get world(){return this._world}
    

    render(timestamp){
        let self = this;

        this._world.render(this.ctx, timestamp)

        window.requestAnimationFrame(function(timestamp){self.render(timestamp)});
    }

    resizeCanvas(){
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx.imageSmoothingEnabled = false;
    }

    keyDown(e){
        //this._world.select()
        let pos = this._world.active.position
        switch(e.key){
            case " ": 
                let self = this;
                this._world.active.fire(this.ctx,function(){
                        let x = pos[0]
                        let y = pos[1]
                        switch(self._world.active.position[4]){
                            case 'up':y--;break;
                            case 'down':y++;break;
                            case 'right':x++;break;
                            case 'left':x--;break;
                        }
                        if( self._world.map.canBreak(x,y)){
                            self._world.map.updateMap(x,y,0)
                        }
                }); 
                break;
            case "ArrowRight":
                if(e.shiftKey){
                    this._world.map.scrollMap(this.ctx,1,0)
                }
                else{
                    if(this._world.isCenter(pos)[0]){
                        this._world.map.scrollMap(this.ctx,1,0)
                    }
                    this._world.active.move(this.ctx, this._world, 'right');
                    this.world.checkEvent(this.ctx)
                }
                break;
            case "ArrowLeft":
                if(e.shiftKey){
                    this._world.map.scrollMap(this.ctx,-1,0)
                }
                else{
                    if(this._world.isCenter(pos)[0]){
                        this._world.map.scrollMap(this.ctx,-1,0)
                    }
                    this._world.active.move(this.ctx, this._world,'left'); 
                    this.world.checkEvent(this.ctx)
                } 
                break;
            case "ArrowDown":
                if(e.shiftKey){
                    this._world.map.scrollMap(this.ctx,0,1)
                }
                else{
                    if(this._world.isCenter(pos)[1]){
                        this._world.map.scrollMap(this.ctx,0,1)
                    }
                    this._world.active.move(this.ctx, this._world, 'down' ); 
                    this.world.checkEvent(this.ctx)
                }
                break;
            case "ArrowUp":
                if(e.shiftKey){
                    this._world.map.scrollMap(this.ctx,0,-1)
                }
                else{
                    if(this._world.isCenter(pos)[1]){
                        this._world.map.scrollMap(this.ctx,0,-1)
                    }
                    this._world.active.move(this.ctx, this._world,'up'); 
                    this.world.checkEvent(this.ctx)
                }
                break;
        }
        // pos = this._world.active.position
        // let worldEvent = this._world.checkEvent(pos[0],pos[1])
        // if( worldEvent ){
        //     worldEvent(this.ctx,this._world)
        // }

    };
    
    mouseUp(e){
        //this._world.select(e.offsetX,e.offsetY)
    };
        
}