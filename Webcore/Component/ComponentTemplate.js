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

    #create(){
        if (this.#fragment === null){
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

    fragment(){
        return this.#create()
    }

    async fragmentAsync(){
        if (this.#fragment === null && this.#url !== null){
            try {
                const template = await URL.loader(this.#url);
                this.#html = ComponentTemplate.compress(template);
                return this.#create();
            } catch {
                throw new TypeError("Component template loading failed.");
            }
        } else {
            return this.#create();
        }
    }

    static compress(html){return html.replace(/\n\s*/g, "").replace(/>\s+</g, "><").trim()}
}
