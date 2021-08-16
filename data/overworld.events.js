export default class MapEvents {
    // scheduled events that happen 
    // events that the player triggers
    checkEvents(x,y){
        if( x === 16 && y === 5 ){
            return function(ctx,world){
                world.savePosition();
                world.loadMap(ctx,'house')
            }
        }
        if( x === 44 && y === 16 ){
            return function(ctx,world){
                world.savePosition();
                world.loadMap(ctx,'cave')
            }
        }
    }
}