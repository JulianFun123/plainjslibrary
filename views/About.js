import { $ } from "../framework/jdom.js"
import { css } from "../framework/literals.js"
import PJF from "../framework/PJF.js"
//Firefox currently doesn't support that
// const example = await PJF.import("/components/example.pjf")


export default {
    template: `
    <div>
        <h1>About!</h1>
        <router-link to="/">Go home</router-link>
        <router-link to="/split">Split component</router-link>
        <br><br>
        <test>Yay</test>
        <example></example>
    </div>`,
    style: css`
        h1 {
            color: #545454; 
        }
    `,
    components: {
        
    }
}
