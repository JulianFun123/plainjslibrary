import {$, $n} from './jdom.js'

class PJF {
    constructor(){
        this.templates = {}
        this.mixin = {}
    }

    template(name, template){
        this.templates[name] = {...this.mixin, ...template}
    }

    mixin(mixin){
        this.mixin = mixin
    }

    run(selector){
        for (const name in this.templates) {
            const template = this.templates[name]
            template.reloadComponent = ()=>{
                this.render($(selector).$(name), template)    
            }
            this.render($(selector).$(name), template)
            if (template.mounted)
                template.mounted()
        }
    }

    render(selector, template){
        selector.each(el => {
            const slot = el.innerHTML
            const vDom = $n("dom").append(template.template)

            template.$refs = {}
            
            vDom.$("slot").each(innerEl=>{
                innerEl.innerHTML = slot
            })

            $(el).html("")

            if (template.beforeRender)
                template.beforeRender

            $(el).append(vDom)
            
            if (template.style) {
                for (const selector in template.style) {
                    const css = template.style[selector]
                    vDom.$(selector).css(css)
                }
            }

            vDom.$("[ref]").each(el => {
                template.$refs[el.getAttribute("ref")] = el
            })

            vDom.$("[p-click]").each(el => {
                el.addEventListener("click", (e)=>{
                    const a = function(e){
                        const r = eval(el.getAttribute("p-click"))

                        if (typeof r == 'function') {
                            r(e)
                        }
                    }
                    a.bind(template)(e)
                });
            })

            console.log(template);

            if (template.rendered)
                template.mounted(vDom)

            this.run(el)
        })
    }

}

export default PJF