export default {
    template: `
        <h3 ref="myh3" p-click="this.log" style="color: #FF4343">Hello there ;)!</h3>
    `,
    tag: "div",
    created(){
        console.log("Okay, what?");
    },
    style: {
        "h3": {
            background: '#00000022'
        }
    },
    log(e){
        console.log(e);
    }
}