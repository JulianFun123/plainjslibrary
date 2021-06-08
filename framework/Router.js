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

        const _this = this

        this.routerLink = {
            name: "router-link",
            url: "/",
            template: `<a ref="anchor" p-click="this.onClick"><slot></slot></a>`,
            created(){
                this.url = this.$attrs.to;
                this.$refs.anchor.attr("href", this.url)
            },
            onClick(e){
                _this.push(this.url)
                e.preventDefault()
                return false
            }
        }
    }

    created(){
        console.log(this.$refs);
    }

    async run(){
        if (this.onPageChange)
            this.onPageChange()
        for (const route of this.routes) {
            
            if (route.path == window.location.pathname) {
                console.log(route.component);
                if (typeof route.component == 'function') {
                    route.component = await route.component()

                    if (route.component.default)
                        route.component = route.component.default
                }
                console.log(route.component);
                let psf = route.component instanceof PJF ? route.component :  new PJF(route.component)
                this.$refs.page.html("").append(psf.render())

                if (this.onPageChanged)
                    this.onPageChanged(route)
                break;
            }
        }
    }

    push(url){
        window.history.pushState(url, url, url)
        this.run()
    }
    
}

export default Router