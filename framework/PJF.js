import { nestedCSS } from './helper/nestedCSS.js'
import {$, $n} from './jdom.js'



class PJF {

    static globalComponents = {}
    static gmixin = {}

    constructor(options = {}){
        options = {...{components: {}, ...{watch: {}}}, ...options} 
        for (const name in PJF.gmixin) {
            this[name] = PJF.gmixin[name]
        }
        for (const name in options) {
            this[name] = options[name]
        }

        if (options.template)
            this.template = options.template
        else if (!this.template)
            this.template = ""
        
        if (!this.components)
            this.components = {} 

        const allComponents = {...PJF.globalComponents, ...options.components}

        for (const componentName in allComponents) {
            const component = allComponents[componentName]
            
            if (componentName == component)
                this.components[component.name] = component
            else
                this.components[componentName] = component
        }

        this.watch = options.watch
        

        this.$refs = {}        
        this.name = options.name

        this.$events = {}

        if (typeof this.template == 'function')
            this.template = this["template"]()

        this.template = this.template.replaceAll("{{", '<text-node p-text="').replaceAll("}}", '"></text-node>')


        this.$textBlocks = []

        if (this.template !== "") {
            this.$dom = $($n("dom").append(this.template).getElem().children[0])

            this.$dom.$('text-node').each(el => {
                const textEl = document.createTextNode("a")
                this.$textBlocks.push({el: textEl, eval: el.getAttribute("p-text")})
                el.replaceWith(textEl)
            })
        }

        
        const props = {}
        
        PJF.watch(this, null, (name, oldValue, value)=>{
            this.updateDynamics()
            
            if (this.watch[name])
                this.watch[name](oldValue, value)
        }, ['$dom', "name", "$refs", "components", "attributes","template", "watch"])
    }

    $on(name, callable) {
        if (!this.$events[name])
            this.$events[name] = []
        
        this.$events[name].push(callable)
    }

    $emit(name, ...args) {
        if (this.$events[name]){
            for (const callable of this.$events[name]) {
                const res = callable.bind(this, args)()
                if (res && typeof res == 'object' && res.cancelled) {
                    break
                }
            }
        }
    }



    render(renderFirstTime = false){
        if (this.slot) {
            this.$dom.$("slot").each(el => {
                el.innerHTML = this.slot
            })
        }
        

        if (this.$dom.attr('ref'))
            this.$refs[this.$dom.attr('ref')] = this.$dom

        this.$dom.$("[ref]").each(el => {
            this.$refs[el.getAttribute("ref")] = el.pjf ? el.pjf : $(el)
        })

        this.$dom.$("input[p-model], textarea[p-model]").each(el => {
            el.addEventListener("input",()=>{
                PJF.setUnpackObjectValue(this, el.getAttribute("p-model"), el.type=='checkbox' ? el.checked : el.value)
            })
        })

        for (const name of ["abort", "afterprint", "animationend", "animationiteration", "animationstart", "beforeprint", "beforeunload", "blur", "canplay", "canplaythrough", "change", "click", "contextmenu", "copy", "cut", "dblclick", "drag", "dragend", "dragenter", "dragleave", "dragover", "dragstart", "drop", "durationchange", "ended", "error", "focus", "focusin", "focusout", "fullscreenchange", "fullscreenerror", "hashchange", "input", "invalid", "keydown", "keypress", "keyup", "load", "loadeddata", "loadedmetadata", "loadstart", "message", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseover", "mouseout", "mouseup", "offline", "online", "open", "pagehide", "pageshow", "paste", "pause", "play", "playing", "progress", "ratechange", "resize", "reset", "scroll", "search", "seeked", "seeking", "select", "show", "stalled", "submit", "suspend", "timeupdate", "toggle", "touchcancel", "touchend", "touchmove", "touchstart", "transitionend", "unload", "volumechange", "waiting", "wheel", "altKey", "altKey", "animationName", "bubbles", "button", "buttons", "cancelable", "charCode", "clientX", "clientY", "code", "createEvent", "ctrlKey", "ctrlKey", "currentTarget", "data", "defaultPrevented", "deltaX", "deltaY", "deltaZ", "deltaMode", "detail", "elapsedTime", "elapsedTime", "eventPhase", "getModifierState", "inputType", "isTrusted", "key", "keyCode", "location", "metaKey", "metaKey", "newURL", "oldURL", "pageX", "pageY", "persisted", "preventDefault", "propertyName", "relatedTarget", "relatedTarget", "screenX", "screenY", "shiftKey", "shiftKey", "stopImmediatePropagation", "stopPropagation", "target", "targetTouches", "timeStamp", "touches", "transitionend", "type", "which", "which", "view", ]) {
            const addEventToElement = el => {
                if (el.getAttribute("p-"+name)) {
                    el.addEventListener(name, (function(e){
                        const r = eval(el.getAttribute("p-"+name))
                        if (typeof r == 'function') {
                            r.bind(this)(e)
                        }
                    }).bind(this));
                }
                
            }
            this.$dom.$("[p-"+name+"]").each(addEventToElement)
            this.$dom.each(addEventToElement)
        }
        
        let style = this.style

        if (style) {
            if (typeof style == 'function')
                style = style.bind(this)(this)
                
            if (typeof style == 'object') {
                nestedCSS(style , this.$dom.getFirstElement())
            } else if (typeof style == 'string') {
                console.log("OOO");
                if (!this.$styleSheetEngine) {
                    this.$styleSheetEngine = new CSSStyleSheet()
                    const el = document.createElement('div');
                    const shadow = el.attachShadow({mode: 'open'})
                    shadow.adoptStyleSheets = [this.$styleSheetEngine]
                    console.log(shadow);
                }
                this.$styleSheetEngine.replace(style)
            }
        }

        this.$dom.pjf = this;
        this.$dom.getFirstElement().pjf = this;

        this.ifElements = {}

        this.$dom.$("[p-if]").each(el => {
            const tag = Math.floor(Math.random()*1000000)
            el.setAttribute("data-p-if-tag", tag)
            
            this.ifElements[tag] = el
        })

        
        for (const componentName in this.components) {
            this.$dom.$(componentName).each(el => {
                let pjf 
                if (this.components[componentName] instanceof PJF)
                    pjf = this.components[componentName]
                else
                    pjf = (new PJF(this.components[componentName]))

                pjf.slot = el.innerHTML;

                pjf.$attrs = {}
                for (const attr of el.attributes)
                    pjf.$attrs[attr.name] = attr.value
                const rendered = pjf.render(true)
                rendered.pjf = pjf
                const newEl = rendered.getFirstElement()
                const attrs = el.attributes

                el.replaceWith(newEl)
                
                for (const attr of attrs) {
                    if (!newEl.hasAttribute(attr.name))
                        newEl.setAttribute(attr.name, attr.value)
                }

                //$(el).html('').append(rendered)
            })
        }

        this.updateDynamics()

        if (this.created)
            this.created(this.$dom)
        
            

        return this.$dom
    }

    reload(){
        this.$dom.elem.parentNode.replaceChild(this.$dom.elem, this.render().elem)
    }

    updateDynamics(){
        const list = []

        const recAdd = (obj, con="")=>{
            for (const name in obj) {
                list.push(con+name)

                if (typeof obj[name] == 'object' && obj[name].constructor == ({}).constructor)
                    recAdd(obj[name], name+".")
            }
        }

        recAdd(this)

        for (const name of list) {
            this.$dom.$("[p-model='"+name+"']").each(el => {
                const val = PJF.unpackObject(this, name)
                if(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
                    if (el.type=='checkbox')
                        el.checked = val
                    else
                        el.value = val
                }
            })
        }
        try {
            this.$dom.$("[p-text]").each(el => { 
                $(el).text(eval(el.getAttribute("p-text"))) 
            })
            this.$dom.$("[p-html]").each(el => { $(el).html(eval(el.getAttribute("p-html"))) })

            this.$dom.$("[p-attr]").each(el => {
                const obj = eval('('+el.getAttribute("p-attr")+')')
                for (const n in obj){
                    el.setAttribute(n, obj[n])
                    if (obj[n] === false)
                        el.removeAttribute(n)
                }
            })

            for (const text of this.$textBlocks) {
                console.log(text);
                text.el.textContent = eval(text.eval)
            }
        } catch(e){
            console.log(e);
        }
        
        for (const elI in this.ifElements ) {
            const el = this.ifElements[elI]

            const cond = eval(el.getAttribute("p-if"))
            
            const cEl = $("[data-p-if-tag='"+el.getAttribute("data-p-if-tag")+"']").getFirstElement();
            const dEl = $("p-dummy[data-p-if-dummy-tag='"+el.getAttribute("data-p-if-tag")+"']").getFirstElement();
            
            if (cond) {
                const dummy = $("[data-p-if-dummy-tag='"+el.getAttribute("data-p-if-tag")+"']").getFirstElement()
                if (!cEl)
                    dummy.parentNode.replaceChild(el, dummy)
            } else if(!dEl) {
                const dummy = $n("p-dummy").attr("data-p-if-dummy-tag", el.getAttribute("data-p-if-tag")).css({display:"none", "width":0,height:0,overflow:'hidden',opacity:0}).getFirstElement()
                el.parentNode.replaceChild(dummy, el)
            }
            
            this.ifElements
        }

        if (this.style && typeof this.style == 'function') {
            nestedCSS(this.style.bind(this)(this), this.$dom.getFirstElement())
        }

    }

    static component(v, pjf=false) {
        if (!pjf)
            this.globalComponents[v.name] = v
        else
            this.globalComponents[v] = pjf
    }

    /* TODO
    static async import(url) {
        const t = $n("div").html(await (await fetch(url)).text());
        let script = `
        
        `+t.$("script") ? t.$("script").html() : 'export default {}';
        const template = (await import('data:text/javascript;charset=utf-8,'+encodeURIComponent(script), "https://google")).default
        template.template = t.$("template").html()
        return template
    } */

    static mixin(mixin) {
        PJF.gmixin = {...PJF.gmixin, ...mixin}
    }

    static watch(object, defGetter, defSetter, exclude=[], namePrefix=""){
        for (const name in object) {
            if (exclude.includes(name))
                continue;
            let value = object[name]
            let oldValue
    
            if (delete object[name]) {
                Object.defineProperty(object, name, {
                    get: ()=>{
                        if (defGetter)
                            defGetter()
                        return value
                    }, 
                    set: (val)=>{
                        oldValue = value
                        value = val
                        defSetter(namePrefix+name, oldValue, value)
                        return val
                    }, 
                    enumerable: true, 
                    configurable: true
                });
            }

            if (object[name].constructor == ({}).constructor) {
                this.watch(object[name], defGetter, defSetter, [], name+".")
            }
        }
    }

    static unpackObject(object, path){
        let out = object

        for (const part of path.split(".")) {
            out = out[part]
        }

        return out
    }

    static setUnpackObjectValue(object, path, value){
        let out = object

        const a = []
        for (const part of path.split(".")) {
            a.push(part)
            
            if (a.join(".") == path)
                out[part] = value;
            out = out[part]
        }
    }

    appendTo(selector){
        $(selector).append(this.render(true))
    }

}

export default PJF