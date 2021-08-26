import { UIDialog } from "../../uidialog.js";
export class QuestDialog extends UIDialog{
    constructor(){
        super()
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
        let div = document.createElement("div")
        div.innerHTML = this.build(itemList.join(''))
        div = div.firstChild
        div.style.left = (game.ctx.canvas.width / 2) - 225;
        document.getElementById('ui-layer').innerHTML="";
        document.getElementById('ui-layer').appendChild(div)

        return this;
    }

}