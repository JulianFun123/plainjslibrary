import PJF from "../framework/PJF.js"
const example = await PJF.import("/components/example.pjf")


export default {
    template: `
    <div>
        <h1>About!</h1>
        <router-link to="/">Go home</router-link>
        <br><br>
        <test>Yay</test>
        <example></example>
    </div>`,
    components: {
        example
    }
}