import app from "/Webcore/App.js";

const component = app.component.createBuilder();

component.name('welcome')
    .template(
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
    ).attributes(['content'])
    .inject('reactive','event');

component.methods({
    create(){
        const reactive = this.service('reactive');
        const event = this.service('event');

        this.state.content = reactive.element(this.selector('span'));
        const content = this.state.content;

        const eventbuilder = event.createBuilder(content.element);
        eventbuilder.click((event)=>{event.target.textContent = 'Hello World'});
        event.register(eventbuilder);
        // event.on(content.element, 'click', );
    },

    mount(target){
        target.append(this)
    }
});

component.onAttributeChanged(
    (name, old, value)=>{
        console.log(`组件属性监听：组件 'my-welcome' 的 ${name} 属性值发生改变: ${old} -> ${value}`);
    }
);


export default component.build();
