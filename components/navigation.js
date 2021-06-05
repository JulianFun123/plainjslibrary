export default {
    name: "nav",
    template: `
        <div id="nav" ref="test">
            <router-link id="logo" to="/">Hello World App</router-link>
            
            <div id="right" ref="right">
                <router-link to="/">Home</router-link>
                <router-link to="/about">About</router-link>
            </div>
        </div>
    `,
    style: {
        "#nav": {
            display: "none"
        }
    }
}