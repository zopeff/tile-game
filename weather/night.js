export class Night{
    draw(ctx, timestamp){
        ctx.save()
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        let p = window.game.world.player.screenPos
        //need to move the center of the light to the rough center of the player
        p[0]+=72 
        p[1]+=64

        let startRadius = 20
        let endRadius = 90
        let gradient;

        if(window.game.world.player.inventory.has('lantern')){
            startRadius = 40
            endRadius = 250
            gradient = ctx.createRadialGradient((p[0]), (p[1]), startRadius, (p[0]), (p[1]), endRadius);
            gradient.addColorStop(0, "rgba(0,0,0,0.2)");
            gradient.addColorStop(.5, 'rgba(0,0,0,0.4)');
            gradient.addColorStop(.6, 'rgba(0,0,0,0.65)');
            gradient.addColorStop(.7, 'rgba(0,0,0,0.7)');
            gradient.addColorStop(.8, 'rgba(0,0,0,0.75)');
            gradient.addColorStop(.9, 'rgba(0,0,0,0.8)');
            gradient.addColorStop(1, 'rgba(0,0,0,0.8)');
        }
        else{
            gradient = ctx.createRadialGradient((p[0]), (p[1]), startRadius, (p[0]), (p[1]), endRadius);
            gradient.addColorStop(0, "rgba(0,0,0,0.4)");
            gradient.addColorStop(.5, 'rgba(0,0,0,0.6)');
            gradient.addColorStop(.6, 'rgba(0,0,0,0.65)');
            gradient.addColorStop(.7, 'rgba(0,0,0,0.7)');
            gradient.addColorStop(.8, 'rgba(0,0,0,0.75)');
            gradient.addColorStop(.9, 'rgba(0,0,0,0.8)');
            gradient.addColorStop(1, 'rgba(0,0,0,0.85)');
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.restore();
    }
}