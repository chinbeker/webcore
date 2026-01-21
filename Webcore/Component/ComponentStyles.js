export default class ComponentStyles {
    #url = null;
    #style = null;
    #initial = true;
    #styleSheet = null;

    get initial(){return this.#initial;}
    get url(){return this.#url;}
    get style(){return this.#style;}

    set url(url){
        if (this.#initial){
            this.#url = URL.create(url);;
            this.#initial = false;
        }
    }

    set style(value){
        if (this.#initial){
            this.#style = ComponentStyles.compress(value);
            this.#initial = false;
        }
    }

    async styleSheet(){
        if (this.#styleSheet === null){
            if (this.#url !== null){
                try {
                    const style = await URL.loader(this.#url);
                    this.#style = ComponentStyles.compress(style);
                } catch  {
                    throw new TypeError("Component style loading failed.");
                }
            }

            if (String.isNullOrWhiteSpace(this.#style)){
                this.#styleSheet = [...ComponentStyles.base];
            } else {
                const sheet = new CSSStyleSheet();
                sheet.replaceSync(this.#style);
                this.#styleSheet = [...ComponentStyles.base, sheet];
            }
        }
        return this.#styleSheet;
    }

    static compress(style){
        return style.replace(/\n\s*/g, "")
        .replace(/\s*{\s*/g, "{")
        .replace(/\s*}\s*/g, "}")
        .replace(/\s*:\s*/g, ":")
        .replace(/\s*;\s*/g, ";")
        .replace(/;\s*}/g, "}")
        .trim();
    }
}
