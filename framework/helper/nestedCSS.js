export function nestedCSS(json, dom){
    for (const selector in json) {
        const val = json[selector]

        console.log(selector);

        if (typeof val == 'object') {
            console.log(selector);
            (selector instanceof HTMLElement ? [selector] : dom.querySelectorAll(selector)).forEach(el => {
                nestedCSS(val, el)
            })
        } else {
            dom.style[selector] = val
        }
    }
}