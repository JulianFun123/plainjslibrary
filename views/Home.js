export default {
    clicks: 0,
    template: `
        <div>
            <h1>Welcome!</h1>
            <br>
            <button id="button" p-text="'Click me! ('+this.clicks+')'" p-click="this.clicks++"></button>
            <p p-if="this.clicks > 30">Clicked more than 30 times!</p>
            <br><br><br>
            Clicks input (Max to current value)
            <input type="number" min="0" p-attr="{max: this.clicks}" p-model="clicks">

            Curly brace syntax: {{this.clicks}}

            <div id="myDiv" p-click="this.$emit('hey', 'Clicked on me')">
                <h1>Recursive dynamic Style example</h1>
            </div>
        </div>
    `,
    style() {return {
        "#button": {
            'font-size': "30px",
            padding: "10px"
        },
        "#myDiv": {
            'background': '#0003',
            'margin-top': "50px",
            'h1': {
                color: '#323232',
                background: `rgba(0, 255, 0, ${this.clicks/255})`,
                display: 'inline-block'
            }
        }
    }},
    created(){
        this.$on("hey", (a)=>{
            alert(a)
        })
    },
    watch: {
        clicks(from, to){
            console.log(`Changed from ${from} to ${to}"`);
        }
    }
}