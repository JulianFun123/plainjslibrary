export default {
    template: `<h3 ref="myh3" style="color: #FF4343">Hello there ;)!</h3>`,
    mounted(){
        console.log("Okay, what?");
        console.log(this.$refs.myh3);
    }
}