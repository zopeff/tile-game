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
        
        this.bubbleWidth = 6
        this.bubbleHeight = 3
        
        this.bubbles = []
        
    }

    addMessage(x,y,msg){
        this.bubbles.push({
            x:(x*48)-48,
            y:(y*48)-144,
            message:msg
        })
        return this.bubbles.length
    }

    removeMessage(index){
        this.bubbles = this.bubbles.splice(index,1)
    }

    removeAll(){
        this.bubbles = []
    }

    draw(ctx, world){

        this.bubbles.forEach( msg =>{
            function createBubble(width){
                let answer = []
                let i = 0;
                // first row
                answer.push(471)
                for(i=0;i<width-2;i++){
                    answer.push(472)
                }
                answer.push(473)
                // second row
                answer.push(537)
                answer.push(474)
                for(i=0;i<width-3;i++){
                    answer.push(538)
                }
                answer.push(539)
                // third row
                answer.push(0)
                answer.push(507)
                for(i=0;i<width-3;i++){
                    answer.push(0)
                }

                return answer
            }
            let mx = msg.x-(world.map.x*48)
            let my = msg.y-(world.map.y*48)

            ctx.font = '24px Zelda';
            let metrics = ctx.measureText(msg.message)
            let data = createBubble(Math.ceil(metrics.width/48)+2)
            this.bubbleWidth = Math.ceil(metrics.width/48)+2

            let sy = my
            for(let y = 0; y < this.bubbleHeight; y++,sy+=48){
                let sx = mx
                for(let x = 0; x < this.bubbleWidth; x++,sx+=48){
                    let i = data[y*this.bubbleWidth+x]
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
            ctx.font = '24px Zelda';
            ctx.fillText(msg.message,mx+50,my+50)
        })
    }
}