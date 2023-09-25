import { json } from "node:stream/consumers";

const gameController = (websocket:string) => {
    let controllerId:number|null = null;
    const socket = new WebSocket(websocket);

    
    window.addEventListener("gamepadconnected", (e) => {
        controllerId = e.gamepad.index;
    });

    window.addEventListener("gamepaddisconnected", (e) => {
        controllerId = null;
    });



    function gamePadHandler(){
        let controller : Gamepad|null;
        let takeoff = false;
        let land = false;
        let axes0 = 0;
        let axes1 = 0;
        let axes2 = 0;
        let axes3 = 0;
        let emergency = false;
        if(controllerId){
            controller = navigator.getGamepads()[controllerId];
            takeoff = controller?.buttons[0].pressed!;
            land = controller?.buttons[1].pressed!;
            emergency = controller?.buttons[9].pressed!;
            // axes0= Math.round(Number(controller?.axes[0]!.toPrecision(2)));
            // axes1= Math.round(Number(controller?.axes[1]!.toPrecision(2)));
            // axes2= Math.round(Number(controller?.axes[2]!.toPrecision(2)));
            // axes3= Math.round(Number(controller?.axes[3]!.toPrecision(2)));
            axes0= controller?.axes[0]!;
            axes1= controller?.axes[1]!;
            axes2= controller?.axes[2]!;
            axes3= controller?.axes[3]!;
            console.log({type:"go", x:axes0, y:-axes3, z:-axes1})
            socket.send(JSON.stringify({type:"go", leftX:axes0, leftY:axes1, rightX:axes2,rightY:axes3}));
        }
        if(takeoff){
            socket.send(JSON.stringify({type:"takeoff"}));
        }

        if(land){
            socket.send(JSON.stringify({type:"land"}));
        }

        // if(axes0){
        //     socket.send(JSON.stringify({type:"moveX", val:axes0}));
        // }

        // if(axes1){
        //     socket.send(JSON.stringify({type:"moveZ", val:axes1}));
        // }

        // if(axes2){
        //     socket.send(JSON.stringify({type:"rotate", val:axes2}));
        // }

        // if(axes3){
        //     socket.send(JSON.stringify({type:"moveY", val:axes3}));
        // }

        if(emergency){
            socket.send(JSON.stringify({type:"emergency"}));
        }

        
    }

    setInterval(gamePadHandler,500);

}
 
export default gameController;


  