const MIN_WIDTH = 4
const MIN_HEIGHT = 3
const MAX_TEXT_WIDTH = 450

const FONT = '24px Yanone Kaffeesatz'
//const FONT = '24px Zelda'

export class SpeechBubble{
    bubbles;
    
    constructor(){
        let self = this;

        this.img = new Image();
        this.img.src = './img/objects.png'
        this.img.onload = function(){
            self.ready = true;
        }

        this.tileWidth = 16;
        this.tileHeight = 16;
            
        this.bubbles = []

    }

    addMessage(x,y,msg){
        // bump the coords if the map is being centered
        
        this.bubbles.push({
            x:((x*48)-48)+game.world.map.mapDrawOffset[0],
            y:((y*48)-144)+game.world.map.mapDrawOffset[1],
            message:msg
        })
        return this.bubbles.length
    }

    removeMessage(index){
        if( index > 0){
            this.bubbles = this.bubbles.splice(index,1)
        }
    }

    removeAll(){
        this.bubbles = []
    }

    draw(ctx, world){

        this.bubbles.forEach( msg =>{
            function createBubble(width,height){
                let answer = []
                let i = 0;
                // first row
                answer.push(471)
                for(i=0;i<width-2;i++){
                    answer.push(472)
                }
                answer.push(473)
                // second row
                for(let j = 0; j < height-MIN_HEIGHT; j++ ){
                    answer.push(504)
                    for(i=0;i<width-2;i++){
                        answer.push(505)
                    }
                    answer.push(506)
                }
                answer.push(537)
                answer.push(474)
                for(i=0;i<width-3;i++){
                    answer.push(538)
                }
                answer.push(539)
                // last row
                answer.push(0)
                answer.push(507)
                for(i=0;i<width-3;i++){
                    answer.push(0)
                }

                return answer
            }
            let mx = msg.x-(world.map.x*48)
            let my = msg.y-(world.map.y*48)

            ctx.font = FONT;
            let metrics
            // split the message on spaces
            let m = msg.message.split(' ');
            let lines = []
            let line = m[0]
            let maxWidth = 0;
            for(let i = 1; i < m.length ; i++){
                let test = line + " " + m[i]
                metrics = ctx.measureText(test)
                if( metrics.width > MAX_TEXT_WIDTH ){
                    lines.push(line.trim())
                    line = m[i]
                }
                else{
                    line = test
                }
                if( maxWidth < metrics.width){
                    maxWidth = metrics.width
                }
            }
            lines.push(line.trim())
            let bubbleWidth = Math.clamp(Math.ceil(maxWidth/48)+2,MIN_WIDTH,12)
            let bubbleHeight = Math.clamp(lines.length+2,MIN_HEIGHT, MIN_HEIGHT+1 )
            let data = createBubble(bubbleWidth,bubbleHeight)

            my = my - Math.clamp((lines.length-1)*48,0,64)
            let sy = my
            for(let y = 0; y < bubbleHeight; y++,sy+=48){
                let sx = mx
                for(let x = 0; x < bubbleWidth; x++,sx+=48){
                    let i = data[y*bubbleWidth+x]
                    if(i!=0){
                        ctx.drawImage(this.img, 
                            ((i % 33) * 16), 
                            (Math.floor(i/33) * 16),
                            this.tileWidth, this.tileHeight,
                            sx,sy,
                            48,48);    
                    }
                }
            }
            
            // now the message
            ctx.font = FONT;
            // little hack to help center the text
            if( lines.length === 1){
                my += 55 
            }
            else if( lines.length === 2){
                my += 65 
            }
            else{
                my += 45
            }
            for(let i = 0; i<lines.length; i++, my+=35){
                let m = lines[i]
                ctx.fillText(m,mx+50,my)
            }
        })
    }
}