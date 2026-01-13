export default class ComponentTemplate {
    #href = null;
    #html = "<slot></slot>";
    #initial = true;
    #fragment = null;

    get initial(){return this.#initial;}
    get href(){return this.#href;}
    get html(){return this.#html;}

    set href(url){
        if (this.#initial){
            this.#href = URL.create(url);
            this.#initial = false;
        }
    }

    set html(value){
        if (this.#initial){
            this.#html = ComponentTemplate.compress(value);
            this.#initial = false;
        }
    }

    has(){
        return !String.isNullOrWhiteSpace(this.#html) || this.#href !== null;
    }

    async fragment(){
        if (this.#fragment === null){
            if (this.#href !== null){
                try {
                    const template = await URL.loader(this.#href);
                    this.#html = ComponentTemplate.compress(template);
                } catch {
                    throw new TypeError("Component template loading failed.");
                }
            }
            const fragment = document.createRange().createContextualFragment(this.#html);
            fragment.querySelectorAll('script').forEach(script => script.remove());
            this.#fragment = fragment;
        }
        return this.#fragment.cloneNode(true);
    }

    static compress(html){return html.replace(/\n\s*/g, "").replace(/>\s+</g, "><").trim()}
}
