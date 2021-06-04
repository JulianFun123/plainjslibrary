import {$, $n} from './jdom.js'



class PJF {

    static globalComponents = {}
    static gmixin = {}

    set (get){
        console.log("changed");
        console.log(get);
        return get
    }

    constructor(options = {}){
        options = {...{components: {}, ...{watch: {}}}, ...options} 
        for (const name in PJF.gmixin) {
            this[name] = PJF.gmixin[name]
        }
        for (const name in options) {
            this[name] = options[name]
        }

        this.template = options.template
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

        this.dom = $($n("dom").append(this.template).getElem().children[0])

        
        const props = {}
        
        PJF.watch(this, null, (name, oldValue, value)=>{
            this.updateDynamics()
            
            if (this.watch[name])
                this.watch[name](oldValue, value)
        }, ['dom', "name", "$refs", "components", "attributes","template", "watch"])

        

        //Object.defineProperties(this, props);
    }


    template(name, template){
        this.templates[name] = {...this.mixin, ...template}
    }

    render(renderFirstTime = false){
        if (this.slot) {
            this.dom.$("slot").each(el => {
                el.innerHTML = this.slot
            })
        }
        

        if (this.dom.attr('ref'))
            this.$refs[this.dom.attr('ref')] = this.dom

        this.dom.$("[ref]").each(el => {
            this.$refs[el.getAttribute("ref")] = $(el)
        })

        this.dom.$("input[p-model], textarea[p-model]").each(el => {
            el = $(el)
            el.on("input",()=>{
                this[el.attr("p-model")] = el.val()
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
            this.dom.$("[p-"+name+"]").each(addEventToElement)
            this.dom.each(addEventToElement)
        }

        this.updateDynamics()

        if (this.style) {
            for (const selector in this.style) {
                const css = this.style[selector]
                this.dom.$(selector).css(css)
            }
        }

        this.dom.pjf = this;
        
        for (const componentName in this.components) {
            this.dom.$(componentName).each(el => {
                let pjf 
                if (this.components[componentName] instanceof PJF)
                    pjf = this.components[componentName]
                else
                    pjf = (new PJF(this.components[componentName]))

                pjf.slot = el.innerHTML;

                pjf.$attrs = {}
                for (const attr of el.attributes)
                    pjf.$attrs[attr.name] = attr.value
                    
                $(el).html('').append(pjf.render(true))
            })
        }


        if (this.created)
            this.created(this.dom)
        
            

        return this.dom
    }

    reload(){
        this.dom.elem.parentNode.replaceChild(this.dom.elem, this.render().elem)
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
            this.dom.$("[p-text='"+name+"']").each(el => { $(el).text(PJF.unpackObject(this, name)) })
            this.dom.$("[p-html='"+name+"']").each(el => { $(el).text(PJF.unpackObject(this, name)) })
            this.dom.$("[p-model='"+name+"']").each(el => {
                const val = PJF.unpackObject(this, name)
                if(el instanceof HTMLInputElement) {
                    el.value = val
                }
            })
        }
    }

    static component(v, pjf=false) {
        if (!pjf)
            this.globalComponents[v.name] = v
        else
            this.globalComponents[v] = pjf
    }

    static mixin(mixin) {
        PJF.gmixin = {...PJF.gmixin, ...mixin}
    }

    static watch(object, defGetter, defSetter, exclude=[], namePrefix=""){
        for (const name in object) {
            if (exclude.includes(name))
                continue;
            let value = object[name]
            let oldValue
    
            console.log(namePrefix+name);
            if (delete object[name]) {
                Object.defineProperty(object, name, {
                    get: ()=>{
                        if (defGetter)
                            defGetter()
                        return value
                    }, 
                    set: (val)=>{
                        oldValue = value
                        console.log(val);
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
                console.log(name);
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

    appendTo(selector){
        $(selector).append(this.render(true))
    }

}

export default PJF