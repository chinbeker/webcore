import Welcome from "../views/Welcome/welcome.js";
import Home from "../views/Home/Home.js";
import HelloWorld from "../views/HelloWorld/HelloWorld.js";


const router = {
    mode: "hash",
    routes: [
        {
            path: "/",
            redirect: '/home',
        },
        {
            path: "/home",
            name: "Home",
            cache: true,
            component: Home,
            meta: {title: '首页'},
            children: [
                {
                    path: "/welcome",
                    name: "Welcome",
                    cache: true,
                    component: Welcome,
                    meta: {title: '欢迎'}
                },

                {
                    path: "/helloworld",
                    name: "HelloWorld",
                    cache: true,
                    component: HelloWorld,
                    meta: {title: 'Hello World'},
                }
            ]
        }
    ]
};

export default router;
