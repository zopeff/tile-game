export class Transitions{
    

    static circle(){

        document.getElementById('main-canvas').setAttribute("transition-style",'in:circle:center' )
        document.getElementById('main-canvas').addEventListener('animationend', function handler(e){
            document.getElementById('main-canvas').removeAttribute("transition-style")
        });
        
    }
}