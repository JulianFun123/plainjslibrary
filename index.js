import PJF from './framework/PJF.js'
import example from './components/example.js'
import router from './router.js'
import { $ } from './framework/jdom.js'

PJF.component({
    name: "test",
    test: "hello",
    template: `<h2 p-click="alert(this.test)">Compo<slot></slot>nent ;)</h2>`,
    created(){
        this.test = Math.random()*10000
    }
})

PJF.component(router)
PJF.component(router.routerLink)


const app = new PJF({
    template: `
    <div>
        <h1 p-click="console.log('Hello there')">Hello there!</h1><router-view></router-view>
    <test></test><test>SLOT</test><router-link to="/about">Hello</router-link>
    </div>`
})


app.appendTo("#app")

router.run()
