import PJF from './framework/PJF.js'
import example from './components/example.js'
import router from './router.js'

const app = new PJF()

app.template("cool", {
    template: `<h2>Yeet <slot></slot></h2>`
})

app.template("yo", {
    template: `<h1>Hello world :)</h1><slot></slot><cool>Hello there</cool>`
})

app.template("example", example)


app.template("router-view", router)

app.run("#app")

router.run()