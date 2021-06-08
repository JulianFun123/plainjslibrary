export function html(html){
    const el = document.createElement("div")
    el.innerHTML = html.raw
    return el.children
}

export const chtml = (html)=>html.raw.join(" ")
export const css = (c)=>c.raw.join(" ")

