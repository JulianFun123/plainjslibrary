import PJF from './framework/PJF.js'
import navigation from './components/navigation.js'
console.log(import.meta);
// Inizializing router
import router from './router.js'
PJF.component(router)
PJF.component(router.routerLink)

PJF.component({
    name: "test",
    test: "hello",
    template: `<h2 p-click="alert(this.test)">Example global component.</h2>`,
})


// Creating PJF instance
const app = new PJF({
    template: `
    <div>
        <nav></nav>
        <!-- This is where route.component gets rendered into -->
        <router-view id="page"></router-view>
    </div>`,
    components: {
        nav: navigation
    }
})

// Append to element div named app in index.html
app.appendTo("#app")

// Run first route
router.run()