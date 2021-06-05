import PJF from './framework/PJF.js'
import example from './components/example.js'
import router from './router.js'
import { $ } from './framework/jdom.js'

PJF.component({
    name: "test",
    test: "hello",
    template: `<h2 p-click="alert(this.test)">Compo<slot></slot>nent ;)</h2>`,
    created(){
        this.test = Math.random()*10000
    }
})

PJF.component(router)
PJF.component(router.routerLink)


const app = new PJF({
    template: `
    <div>
        <h1 p-click="console.log('Hello there')">Hello there!</h1><router-view></router-view>
    <test></test><test>SLOT</test><router-link to="/about">Hello</router-link><hello></hello>
    </div>`,
    components: {
        "hello": {
            a: Math.random()*10000,
            data: {
                myData: "Here"
            },
            cond: true,
            template: `
                <div>
                    <input type="text" p-model="data.myData">
                    <input type="text" p-model="data.myData">
                    <span p-text="'Okay: '+this.data.myData">asd</span>
                    <textarea p-model="data.myData"></textarea>
                    <test ref="test"></test>

                    <input type="checkbox" p-model="cond">
                    
                    <p p-if="this.cond">Hello there</p>


                    <p p-text="this.cond ? 'TRUE': 'FALSE'"></p>

                    <p p-attr="{contenteditable: true}" p-model="data.myData">Ye</p>
                </div>
            `,
            created(){
                console.log(this.$refs.test);
            },
            watch: {
                a(from, to){
                    console.log(to);
                },
                'data.myData'(o, n){
                    console.log("CHANGED "+n);
                },
                cond(a,b){
                    console.log(b);
                }
            }
        }
    }
})


app.appendTo("#app")

router.run()
