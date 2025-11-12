import ComponentBuilder from "/System/Component/ComponentBuilder.js";

const component = new ComponentBuilder();

component.name('my-welcome')
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
    ).attributes(['content']);

component.methods({
    create(){
        const span = this.root.querySelector('span');
        span.onclick = ()=>{span.textContent = 'Hello World'}
    },

    mount(target){
        target.append(this)
    }
});

component.onAttributeChanged(
    (name, old, value)=>{
        console.log(`属性 ${name} 变化: ${old} -> ${value}`);
    }
);


export default component.build();
