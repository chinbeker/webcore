import app from "/Webcore/App.js";

export default class Welcome extends app.component.builder() {
    static tag = 'welcome';
    static get observedAttributes() {return ['content'];}

    constructor(){
        super();
        this.hook();
    }

    create(){
        this.template(
            `<div>
                <h1><span>Welcome</span></h1>
            </div>`
        ).styles(
            `h1 {
                font-size: 5em;
                line-height: 5em;
                text-align: center;
                color: red;
            }`
        ).inject(['reactive', 'event']);
    }

    hook(){
        const {reactive, event} = this.services;
        // const reactive = this.service('reactive');
        // const event = this.service('event');

        this.state.content = reactive.element(this.selector('span'));
        const content = this.state.content;

        event.select(content.element).click((event)=>{event.target.textContent = 'Hello World'}).bind();
    }


    onAttributeChanged(name, old, value){
        console.log(`组件属性监听：组件 'my-welcome' 的 ${name} 属性值发生改变: ${old} -> ${value}`);
    }

    mount(target){target.append(this)}
}
