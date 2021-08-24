const ALERT_STACK_ID = 'alert-stack';
const MAX_ALERTS = 3;
const ALERT_MARGIN = 30
const ALERT_HEIGHT = 100
const ALERT_LIFE = 5000; // 5 seconds

export class ToastAlert{
    constructor(message){
        this.create(message)
        this.done = false
    }

    create(message){
        let template = "<div class='alert-content'><div class='alert-icon'></div><div class='alert-text'>%%alert%%</div></div>"
        let children = [...document.getElementById(ALERT_STACK_ID).children]
        let div = document.createElement("div")
        div.innerHTML = template.replace("%%alert%%",message);
        div.className = 'alert-toast alert'
        div.id = 'alert-id'

        document.getElementById(ALERT_STACK_ID).prepend(div)
        document.getElementById(ALERT_STACK_ID).addEventListener('transitionend', this.animationHandler,true);
        let self = this
        setTimeout(()=> {
            let d = document.getElementById('alert-id')
            d.classList.add('pushNew');
    
            children.forEach((c,i)=>{
                c.classList.add('pushCurrent')
                if( MAX_ALERTS-1 <= i){
                    c.classList.add('fade')
                }
            })
        },250)
        // alerts expire and fade out after ALERT_LIFE seconds
        setTimeout(()=>{
            div.classList.add('expire')
        },ALERT_LIFE)        
    }

    animationHandler(e) {
        let stack = document.getElementById(ALERT_STACK_ID)
        let children = [...stack.children]
        console.log('fade in complete')
        let top=ALERT_MARGIN
        for(let i=0;i<children.length;i++,top+=ALERT_HEIGHT+ALERT_MARGIN){
            let c = children[i]
            c.classList.remove('pushNew')
            c.classList.remove('pushCurrent')
            c.style.top = top + 'px'
        }

        if( e.target.classList.contains('expire') ){
            e.target.parentNode.removeChild(e.target)
        }
        
        if( MAX_ALERTS <= children.length && !stack.lastChild.classList.contains('expire')){
            stack.removeChild(stack.lastChild) // only 2 alerts are shown at once
        }

    }
}