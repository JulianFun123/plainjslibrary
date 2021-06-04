import PJF from './framework/PJF.js'
import example from './components/example.js'
import router from './router.js'
import { $ } from './framework/jdom.js'

const exampleComponent = new PJF({
    name: "test",
    template: `<h2 p-click="this.exampleMethod">Component ;)</h2>`,
    exampleMethod(){
        alert("example")
    }
})

PJF.component(exampleComponent)

const app = new PJF({
    template: `<h1 p-click="console.log('Hello there')">Hello there!</h1><test></test>`
})

$("#app").append(app.render())