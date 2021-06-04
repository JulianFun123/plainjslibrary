# PlainJSFramework
> This is just a testing project.

I just wanted to build something like Vue to look how it may would work with the difference that this is completly Vanilla JavaScript with the built-in module system (No webpack, no npm, just plain web).

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
        const routes = new Router([
            {
                path: "/",
                components: {template: `<h2>HI</h2>`}
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
                <span p-text="hello"></span>
                <test></test>
                <test></test>
                <test></test>
            </div>`,
            hello: "Hello there",
            watch: {
                hello(from, to){
                    console.log(to)
                }
            }
        })


        app.appendTo("#app")

        router.run()
    </script>
</body>
</html>
```