export default class ComponentTemplate {
    #url = null;
    #html = "<slot></slot>";
    #initial = true;
    #fragment = null;

    get initial(){return this.#initial;}
    get url(){return this.#url;}
    get html(){return this.#html;}

    set url(url){
        if (this.#initial){
            this.#url = URL.create(url);
            this.#initial = false;
        }
    }

    set html(value){
        if (this.#initial){
            this.#html = ComponentTemplate.compress(value);
            this.#initial = false;
        }
    }

    async fragment(){
        if (this.#fragment === null){
            if (this.#url !== null){
                try {
                    const template = await URL.loader(this.#url);
                    this.#html = ComponentTemplate.compress(template);
                } catch {
                    throw new TypeError("Component template loading failed.");
                }
            }

            if (String.isNullOrWhiteSpace(this.#html)){
                this.#fragment = document.createDocumentFragment();
                const root = document.createElement("div");
                root.classList.add("root");
                this.#fragment.append(root);
            } else {
                const fragment = document.createRange().createContextualFragment(this.#html);
                fragment.querySelectorAll('script').forEach(script => script.remove());
                this.#fragment = fragment;
            }
        }
        return this.#fragment.cloneNode(true);
    }

    static compress(html){return html.replace(/\n\s*/g, "").replace(/>\s+</g, "><").trim()}
}
