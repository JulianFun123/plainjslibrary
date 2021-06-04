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

            $(selector).$(name).each(el => {
                const slot = el.innerHTML
                const vDom = $n("dom").html(template.template)

                template.$refs = {}
                
                vDom.$("slot").each(innerEl=>{
                    innerEl.innerHTML = slot
                })

                $(el).html("")

                if (template.beforeRender)
                    template.beforeRender

                $(el).append(vDom)


                vDom.$("[ref]").each(el => {
                    template.$refs[el.getAttribute("ref")] = el
                })

                if (template.mounted)
                    template.mounted(vDom)
                
                this.run(el)
            })
        }
    }

}

export default PJF