export default class ReactiveElement {
    #element = null;
    #value = '';
    constructor(element, content){
        if (element instanceof HTMLElement){
            this.#element = element;
        } else {
            this.#element = document.createElement('div');
        }
        if (content && typeof content === 'string'){
            this.#element.textContent = content;
            this.#value = content;
        }
    }

    get element(){return this.#element;}
    get value(){return this.#value;}
    set value(value){
        if (typeof this.onchange === 'function'){
            if (this.#value !== value){this.onchange(value, this.#value, this.#element);}
        }
        this.#value = value;
        this.#element.textContent = value;
    }

    mount(target){
        if (typeof target === 'string'){
            const node = document.querySelector(target);
            if (node){node.append(this.#element)}
        } else if (target instanceof HTMLElement){
            target.append(this.#element);
        }
        return this;
    }

    unmount() {
        this.#element.remove();
        return this;
    }
}
