class Router {
    constructor(routes){
        this.routes = routes

        this.template = `<div ref="currentPage">APP</div>`
        console.log(this);
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