import {clamp,fetchRemoteResource} from './util.js';

export class Map{
    #tiles; // 40x36
    #mapPath;
    #tilesetPath;
    #imgPath;
    #name;
    map = {
        loaded:false
    }

    constructor(map){
        this.x = map.origin[0];
        this.y = map.origin[1];    
        this.#name = map.name;
        this.#mapPath = map.mapPath
        this.#tilesetPath = map.tilesPath
        this.#imgPath = map.imgPath
        this.spawn = map.spawn;
        this.origin = map.origin
    }

    get name(){return this.#name};

    async load(ctx){
        this.#tiles = new Image()
        this.#tiles.src = this.#imgPath
        let mapData = await fetchRemoteResource(this.#mapPath);
        this.map.tileSet = await fetchRemoteResource(this.#tilesetPath);
        let module = await import('./data/'+this.name+'.events.js');
        this.events = new module.default

        this.map.data = mapData.layers
        this.width = mapData.width
        this.height = mapData.height
        this.map.loaded=true;

        let self = this;
        this.#tiles.onload = function(){
            self.draw(ctx) 
        }
    }

    scrollMap(ctx,x,y){
        let dx = clamp(Math.ceil(ctx.canvas.width / 48),0,this.width)
        let dy = clamp(Math.ceil(ctx.canvas.height / 48),0,this.height)
        if( this.x+x>this.width-dx ){
            return false;
        }
        if( this.y+y>this.height-dy ){
            return false;
        }
        //if( dx == this.width || dy == this.height){
        //    return false;
       // }

        this.x = clamp(this.x+x,0,this.width)
        this.y = clamp(this.y+y,0,this.height)
        return true
    }

    canMove(x,y){
        if(x<0||y<0||x>this.width||y>this.height){
            return false
        }
        let i = y*this.width+x
        console.log("P:"+x,y,i,this.map.data[2].data[i])
        return this.map.data[2].data[i] == 0;
    }

    canBreak(x,y){
        if(x<0||y<0||x>this.width||y>this.height){
            return false
        }
        if( !this.map.tileSet.tiles){
            return;
        }
        let i = y*this.width+x
        let id = this.map.data[1].data[i]
        let m = this.map.tileSet.tiles.find(tile=>tile.id===id&&tile.properties)
        console.log("P:"+x,y,i,m)
        if(m){
            let p = m.properties.find(p=>p.name="breakable"&&p.value===true)
            return p || false
        }
        return false
    }

    checkEvents(x,y){
        return this.events.checkEvents(x,y)
    }

    updateMap(x,y,val){
        let i = y*this.width+x
        this.map.data[1].data[i] = val;
    }

    getTileFrame(t,elapsed){
        if(!this.map.tileSet.tiles){
            return t
        }
        let i = this.map.tileSet.tiles.findIndex(tile=>tile.id===t&&tile.animation)
        if( -1==i ){
            return t; // not an animated tile
        }
        let anim = this.map.tileSet.tiles[i]
        if( !anim.hasOwnProperty('curr') || anim.curr === anim.animation.length-1){
            anim.curr = 0
            anim.tick = elapsed
        }
        else if( anim.animation[anim.curr].duration < (elapsed - anim.tick) ){
            anim.curr++;
            anim.tick = elapsed
        }
        return anim.animation[anim.curr].tileid
    }



    draw(ctx,timestamp){
        if( !this.map.loaded ){
            return
        }

        if (this.animate_start === undefined){
            this.animate_start = timestamp;
        }
        const elapsed = timestamp - this.animate_start;

        this.map.data.forEach(layer => {
            if(layer.data ){
                let dx = clamp(Math.ceil(ctx.canvas.width / 48), 0, layer.width)
                let dy = clamp(Math.ceil(ctx.canvas.height / 48), 0, layer.height)
                let sy = 0
                for(let y = this.y; y < this.y+dy; y++,sy+=48){
                    let sx = 0
                    for(let x = this.x; x < this.x+dx; x++,sx+=48){
                        let i = y*layer.width+x
                        let t = layer.data[i]-1
                        if( t > -1){
                            t = this.getTileFrame(t,elapsed)
                            ctx.drawImage(this.#tiles, 
                                ((t % 40) * 16), 
                                (Math.floor(t/40) * 16),
                                16, 16,
                                sx, sy,
                                48, 48);    
                        }
                    }    
                } 
            }         
        });

    }

}