import PJF from "../framework/PJF.js"

export default new PJF({
    template: `<h1>Homepage!</h1><a p-click="this.$router.push('/about')">Click me pls</a>`
})