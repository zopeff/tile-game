export default class MapEvents {
    checkEvents(x,y){
        if( y === 9 ){
            return async function(ctx,world){
                await world.loadMap(ctx)
                world.restorePosition();
            }
        }
    }
}