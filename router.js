import Router from "./framework/Router.js";
import About from "./views/About.js";
import Home from "./views/Home.js";

export default new Router([
    {
        path: "/",
        component: Home
    },
    {
        path: "/about",
        component: About
    },
    {
        path: "/split",
        component: /*Invokes when page visited*/() => import("./components/split/split.js")
    },

])