# PlainJSFramework
> This is just a testing project.

I just wanted to build something like Vue to look how it may would work with the difference that this is completly Vanilla JavaScript with the built-in module system (No webpack, no npm, just plain web).

> Why to not use? The project is too new in two ways. 1. It's too new for being stable and 2. it is too modern. Older browsers don't support any of the new ES6 features and the Firefox does not support async at top level for module until the most recent versions. 

For more example usage just look into `index.js`
## Example:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="app"></div>

    <script type="module">
        import PJF from './framework/PJF.js'
        import Router from './framework/Router.js'
        import example from './components/example.js'
        const router = new Router([
            {
                path: "/",
                component: {template: `<h2>HI</h2>`}
            }
        ])

        // registering global component
        PJF.component({
            name: "test",
            test: "hello",
            // Use this.test to access the variable
            template: `<h2 p-click="alert(this.test)">Component ;)</h2>`,
            created(){
                this.test = Math.random()*10000
            }
        })

        PJF.component(router)


        const app = new PJF({
            template: 
            `<div>
                <h1 p-click="console.log('Hello there')">Hello there!</h1>
                <router-view></router-view>
                <input id="helloInput" p-model="hello">
                <span p-text="'Enter: '+this.hello"></span>
                <button p-click="alertMe">CLICK ME</button>

                Curly brace syntax: {{}}

                <test></test>
                <test></test>
            </div>`,
            hello: "Hello there",
            watch: {
                hello(from, to){
                    console.log("Changed "+to)
                }
            },
            alertMe(){
                alert("You've input: "+this.hello)
            },
            style:{
                "#helloInput": {
                    'font-size': "20px"
                }
            }
        })


        app.appendTo("#app")

        router.run()
    </script>
</body>
</html>
```

## Optional
#### WebPack
You really want to use webpack for this test project? Okay... just do it. You might remove split components, because they don't work on webpack.
```js
module.exports = {
    entry: './index.js',
    output: {
        path: `${__dirname}/dist/`,
        filename: "app.compiled.js"
    }
}
```