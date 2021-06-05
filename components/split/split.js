export default {
    name: 'Hello',
    html: "<i>yee</i>",
    template: await(await fetch(import.meta.url+"/../split.html")).text(),
}