
export class QuestDialog{
    constructor(){
        this.visible = false;
    }

    show(items){
        this.dismiss();

        let itemList = []
        items.quests.forEach(item => {
            let li = `<dt>${item.title}</dt><dd >${item.description}</dd>`
           itemList.push(!item.isComplete()? li :
           `<span class='completed'><i class="fas fa-check" style='margin-right: 5px;float:left;color:green'></i>${li}</span>`
            )
        });
        let template = `<div class='dialog-frame'><div class='dialog-icon dialog-icon-quest'></div><div class='dialog-content'><dl>${itemList.join('')}</dl></div></div>`
        let div = document.createElement("div")
        div.innerHTML = template
        div = div.firstChild
        div.style.left = (game.ctx.canvas.width / 2) - 225;
        document.getElementById('ui-layer').innerHTML="";
        document.getElementById('ui-layer').appendChild(div)

        return this;
    }

    dismiss(){
        this.visible = false;
        document.getElementById('ui-layer').innerHTML="";
    }
}