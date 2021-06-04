import PJF from "./PJF.js";

class Router extends PJF {
    constructor(routes){
        super({
            name: "router-view",
            template: `<div ref="page"></div>`
        })
        this.routes = routes
    }

    

    run(){
        for (const route of this.routes) {
            if (route.path == window.location.pathname) {
                this.$refs.currentPage.innerHTML = route.component.template
                console.log(this);
                this.reloadComponent()
            }
        }
    }

    
}

export default Router