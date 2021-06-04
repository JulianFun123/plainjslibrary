import { $ } from "./jdom.js";
import PJF from "./PJF.js";


class Router extends PJF {
    constructor(routes){
        super({
            name: "router-view",
            template: `<div ref="page"></div>`
        })
        this.routes = routes
        for (const route of this.routes) {
            route.component.$router = this
        }
        window.addEventListener('popstate', ()=>{
            this.run()
        })


    }

    run(){
        for (const route of this.routes) {
            if (route.path == window.location.pathname) {
                console.log(route.component);
                $(this.$refs.page).html("").append((new PJF(route.component)).render())
            }
        }
    }

    push(url){
        window.history.pushState(url, url, url)
        this.run()
    }
    
}

export default Router