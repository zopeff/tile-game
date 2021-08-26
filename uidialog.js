
export class UIDialog{
    constructor(){
        this.visible = false;
    }

    build(content){
        return `<div class='dialog-frame'><div class='dialog-icon dialog-icon-quest'></div><div class='dialog-content'>${content}</div></div>`
    }

    show(message){
        this.dismiss();

        let div = document.createElement("div")
        div.innerHTML = this.build(message)
        div = div.firstChild
        div.style.left = (game.ctx.canvas.width / 2) - 225;
        div.style.height = 460;
        document.getElementById('ui-layer').appendChild(div)

        let self = this;
        document.getElementsByTagName("BODY")[0].addEventListener('keydown', (e)=>self.keyDown(e) );

        return this;
    }

    keyDown(e){
        switch(e.key){
            case 'Escape':
                this.dismiss()
               break;
        }
    }

    dismiss(){
        this.visible = false;
        document.getElementById('ui-layer').innerHTML="";
        document.getElementsByTagName("BODY")[0].removeEventListener('keydown', this.keyDown);
    }
}