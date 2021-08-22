import {Rain} from './rain.js';
import {Night} from './night.js';


export class WeatherController{
    
    constructor(){
        this.on = false;
        this.currWeather = [];
    }

    #toggle(ctx, Type){
        if( this.currWeather.find(w => w instanceof Type) ){
            this.currWeather = this.currWeather.filter( w => !(w instanceof Type))
        }
        else{
            this.currWeather.push(new Type(ctx))
        }
    }

    get current(){
        return this.currWeather
    }

    restore(w){
        this.currWeather = w
    }

    draw(ctx, time){
        ctx.save()
        this.currWeather.forEach(w=>w.draw(ctx,time))
        ctx.restore();
    }

    toggleNight(ctx){
        this.#toggle(ctx, Night)
    }

    toggleRain(ctx){
        this.#toggle(ctx, Rain)
    }

    clear(){
        this.currWeather = []
    }
}