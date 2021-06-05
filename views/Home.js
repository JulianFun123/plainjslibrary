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
        </div>
    `,
    style: {
        "#button": {
            'font-size': "30px",
            padding: "10px"
        }
    },
    watch: {
        clicks(from, to){
            console.log(`Changed from ${from} to ${to}"`);
        }
    }
}