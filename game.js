import {World} from './world.js';
import {Player} from './player.js';
import {SpeechBubble} from './speech.js';
import {WeatherController} from './weather/weather.js';
import { ToastAlert } from './toast.js';
import { QuestDialog } from './data/quests/dialog.js';
import { UIDialog } from './uidialog.js';
export class Game{
    #world;

    // debug helpers
    dbg_loadMap(name){
        this.world.loadMap(this.ctx,name)
    }

    dbg_toast(msg){
        new ToastAlert(msg)
    }
    //

    constructor(id){
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d',{ alpha: false });   
        
        this.canvasOffscreen = document.createElement('canvas');
        this.ctxOffscreen = this.canvasOffscreen.getContext('2d',{ alpha: false })

        window.game = this;
    }

    async init(){
        this.resizeCanvas();
        this.canvas.focus();
        this.speech = new SpeechBubble()
        this.weather = new WeatherController();

        this.#world = new World(this.ctx);
        await this.#world.init();
        let self = this;

        window.addEventListener('resize', function(){self.resizeCanvas()}, false);
        this.canvas.addEventListener('keydown', (e)=>self.keyDown(e),);
        this.canvas.addEventListener('mouseup', (e)=>self.mouseUp(e) );

        this.#world.addPlayer( new Player())

        if( "zopeff.github.io" === window.location.hostname ){
            await this.#world.loadMap(this.ctx, 'house')
            this.player.position = [12,12]
            this.#world.centerMapOnPlayer(this.ctx)
            this.showWelcome()
            this.player.quests.add("Foul_Ron_0")
        }
        else{
            // skip the intro for local dev
            await this.#world.loadMap(this.ctx, 'overworld')
        }
        
        window.requestAnimationFrame(function(timestamp){self.render(timestamp)});
    }

    get world(){return this.#world}
    
    showWelcome(){
        new UIDialog().show(
            `        <div>
            <h2>Welcome to the game!</h2>
            
  
            <p>Your goal is to complete both the quests.</p>
            <br/><p>Controls:<br/>
            <p>
            <i class="far fa-caret-square-left"></i>
            <i class="far fa-caret-square-right"></i>
            <i class="far fa-caret-square-up"></i>
            <i class="far fa-caret-square-down"></i>
            <p>Arrow keys move your character around</p><br/>
            <p>The <span class="fa-layers fa-fw" >
              <i class="far fa-square"></i>
              <span class="fa-layers-text" data-fa-transform="shrink-4">E</span>
            </span>
            key is used to talk to the other people you meet along the way
            </p><br/>
            <p>
              The
              <span class="fa-layers fa-fw" >
                <i class="far fa-square"></i>
                <span class="fa-layers-text" data-fa-transform="shrink-4">Q</span>
              </span>
              key is used to open your <em>quest log</em>.
            </p><br/>
            
            <p>The <strong>[space]</strong> key is used to swing your sword.</p>
            <br/>
            <p>The <strong>[esc]</strong> key is used to close dialogs like this.</p>
            <br/>
            <p>
              The
              <span class="fa-layers fa-fw" >
                <i class="far fa-square"></i>
                <span class="fa-layers-text" data-fa-transform="shrink-4">H</span>
              </span>
              key will show you this message again.
            </p><br/>
            <br/>Have fun!
          </div>`
        )
    }

    render(timestamp){
        let self = this;

        this.#world.render(this.ctx, timestamp)

        this.speech.draw(this.ctx, this.world)
        this.weather.draw(this.ctx,timestamp)

        window.requestAnimationFrame(function(timestamp){self.render(timestamp)});
    }

    resizeCanvas(){
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx.imageSmoothingEnabled = false;

        this.canvasOffscreen.width = this.canvas.width+200;
        this.canvasOffscreen.height = this.canvas.height+200;
        this.ctxOffscreen.imageSmoothingEnabled = false;
    }

    keyDown(e){
        let pos = this.#world.player?.position || [0,0]
        switch(e.key){
            case 'h':
                this.showWelcome()
                break;
            case 'Escape':
                if( this.questDialog ){
                    this.questDialog.dismiss()
                    delete this.questDialog
               }
               break;
            case "q":
                if( this.questDialog ){
                     this.questDialog.dismiss()
                     delete this.questDialog
                }
                else{
                    this.questDialog = new QuestDialog().show(this.player.quests)
                }
                break;
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

    clearWeather(){
        this.weather.clear();
    }
    toggleRain(){
        this.weather.toggleRain(this.ctx);
    }
    toggleNight(){
        this.weather.toggleNight(this.ctx);
    }
    setWeather(weather){
        this.clearWeather()
        if('night'===weather){
            this.toggleNight();
        }
        if('rain'===weather){
            this.toggleRain();
        }
    }

    get player(){
        return this.world.player
    }

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

    triggerEvent(event){
        switch(event.type){
            case 'quest':
                this.player.quests.handleQuestEvent(event)
                break;
            case 'alert':
                alert(event.text)
                break;
        }
    }
        
}