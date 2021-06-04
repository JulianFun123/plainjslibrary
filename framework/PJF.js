import {$, $n} from './jdom.js'

class PJF {

    static globalComponents = {}
    static gmixin = {}

    constructor(options = {}){
        options = {...{components: {}}, ...options} 
        for (const name in PJF.gmixin) {
            this[name] = PJF.gmixin[name]
        }
        for (const name in options) {
            this[name] = options[name]
        }

        this.template = options.template
        this.components = {} 
        
        for (const componentName in {...PJF.globalComponents, ...options.components}) {
            const component = PJF.globalComponents[componentName]
            
            if (componentName == component)
                this.components[component.name] = component
            else
                this.components[componentName] = component
        }    
        
        this.$refs = {}
        
        this.name = options.name

        this.dom = $n("dom").append(this.template)
    }

    template(name, template){
        this.templates[name] = {...this.mixin, ...template}
    }

    render(){
        
        this.dom.$("[ref]").each(el => {
            this.$refs[el.getAttribute("ref")] = el
        })

        for (const name of ["abort", "afterprint", "animationend", "animationiteration", "animationstart", "beforeprint", "beforeunload", "blur", "canplay", "canplaythrough", "change", "click", "contextmenu", "copy", "cut", "dblclick", "drag", "dragend", "dragenter", "dragleave", "dragover", "dragstart", "drop", "durationchange", "ended", "error", "focus", "focusin", "focusout", "fullscreenchange", "fullscreenerror", "hashchange", "input", "invalid", "keydown", "keypress", "keyup", "load", "loadeddata", "loadedmetadata", "loadstart", "message", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseover", "mouseout", "mouseup", "offline", "online", "open", "pagehide", "pageshow", "paste", "pause", "play", "playing", "progress", "ratechange", "resize", "reset", "scroll", "search", "seeked", "seeking", "select", "show", "stalled", "submit", "suspend", "timeupdate", "toggle", "touchcancel", "touchend", "touchmove", "touchstart", "transitionend", "unload", "volumechange", "waiting", "wheel", "altKey", "altKey", "animationName", "bubbles", "button", "buttons", "cancelable", "charCode", "clientX", "clientY", "code", "createEvent", "ctrlKey", "ctrlKey", "currentTarget", "data", "defaultPrevented", "deltaX", "deltaY", "deltaZ", "deltaMode", "detail", "elapsedTime", "elapsedTime", "eventPhase", "getModifierState", "inputType", "isTrusted", "key", "keyCode", "location", "metaKey", "metaKey", "newURL", "oldURL", "pageX", "pageY", "persisted", "preventDefault", "propertyName", "relatedTarget", "relatedTarget", "screenX", "screenY", "shiftKey", "shiftKey", "stopImmediatePropagation", "stopPropagation", "target", "targetTouches", "timeStamp", "touches", "transitionend", "type", "which", "which", "view", ]) {
            this.dom.$("[p-"+name+"]").each(el => {
                el.addEventListener(name, (e)=>{
                    const r = eval(el.getAttribute("p-click"))
                    if (typeof r == 'function') {
                        r(e)
                    }
                });
            })
        }

        if (this.style) {
            for (const selector in this.style) {
                const css = this.style[selector]
                this.dom.$(selector).css(css)
            }
        }

        
        for (const componentName in this.components) {

            this.dom.$(componentName).each(el => {
                let pjf 
                if (this.components[componentName] instanceof PJF)
                    pjf = this.components[componentName]
                else
                    pjf = (new PJF(this.components[componentName]))

                $(el).html('').append(pjf.render())
            })
        }


        if (this.created)
            this.created(this.dom)

        return this.dom
    }

    static component(name, pjf=false) {
        if (!pjf)
            this.globalComponents[name.name] = name
        else
            this.globalComponents[name] = pjf
    }

    static mixin(mixin) {
        PJF.gmixin = {...PJF.gmixin, ...mixin}
    }

    appendTo(selector){
        $(selector).append(this.render())
    }

}

export default PJF