import Welcome from "/src/views/Welcome/welcome.js";

export default class HomeView extends webcore.component.builder {
    static tag = 'view-home';

    constructor(){
        super();
    }

    create(){
        this.styles('/src/views/Home/Home.css')
        .template('/src/views/Home/Home.html')
        .mode('closed')
        .inject(['event', 'http', 'router', 'cache', 'reactive'])
    }

    init(){
        this.hook();
        // this.render();
        // console.dir(this);
    }

    hook(){
        const {event, router} = this.services;
        this.element.router = this.selector('router-view')


        // event.select(this.selector('a')).click(()=>{
        //     router.push('/home/welcome');
        // }).bind();


    }

    render(params){
        this.element.router.render(params)
    }



    // 生命周期
    onConnected(){
        // console.log("Home 组件已经挂载到页面")
    }

    onAttributeChanged(attr, value, old){

    }

    onAdopted(){

    }

    onDisconnected(){
        // console.log("Home 组件已经卸载")
    }

    // 路由触发事件
    onRouteBefore(route){
        return true;
    }

    onRouteAfter(route){

    }
}
