export default {
    name: 'Hello',
    template: await (await fetch(import.meta.url+"/../split.html")).text()
}