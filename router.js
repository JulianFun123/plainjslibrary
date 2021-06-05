import split from "./components/split/split.js";
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
        component: split
    },

])