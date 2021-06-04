import {$, $n} from './jdom.js'

class PJF {

    static globalComponents = []

    constructor(options = {}){
        options = {...{components: []}, ...options} 
        for (const name in options) {
            this[name] = options[name]
        }

        this.template = options.template
        this.components = {} 
        
        for (const component of PJF.globalComponents)
            this.components[component.name] = component    
        
        for (const component of options.components)
            this.components[component.name] = component    
            
        this.mixin = {}
        this.$refs = {}
        
        this.name = options.name

        this.dom = $n("dom").append(this.template)
    }

    template(name, template){
        this.templates[name] = {...this.mixin, ...template}
    }

    mixin(mixin){
        this.mixin = mixin
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
                vDom.$(selector).css(css)
            }
        }

        for (const componentName in this.components) {
            this.dom.$(componentName).html('').append(this.components[componentName].render())
        }


        if (this.created)
            this.created(this.dom)

        return this.dom
    }

    static component(pjf) {
        this.globalComponents.push(pjf)
    }

}

export default PJF