export default class HelloWorld extends webcore.component.builder {
    static tag = 'hello-world';
    static get observedAttributes() {return ['content'];}

    constructor(){
        super();
    }

    // 创建组件
    create(){
        this.template(
            `<div class="root">
                <p> Hello World </p>
            </div>`
        )
        .styles(
            `.root {
                display:flex;
                height: 100%;
                align-items: center;
                justify-content: center;
                color: red;
                font-size: 5rem;
                font-weight: bold;
            }
            p {
                margin-top: -5em;
                cursor: pointer;
            }`
        )
        .mode('closed')
        .inject(['event'])
        .configuration({
            framework: "webcore",
            version: "1.0.0",
            author: "HUACHEN"
        })
    }

    // 初始化（组件逻辑）
    init(){
        this.render();
    }

    render(){
        const event = this.service('event');
        const p = this.selector('p');

        event.select(p).click(
            ()=>{p.textContent = "Webcore"}
        ).bind();
    }

    // 生命周期
    onConnected(){
        // console.log("Hello World 组件已经挂载到页面")
    }

    onAttributeChanged(attr, value, old){

    }

    onAdopted(){

    }

    onDisconnected(){
        // console.log("Hello World 组件已经卸载")
    }

    onRouteChange(route){
        // console.log(route)
    }
}
