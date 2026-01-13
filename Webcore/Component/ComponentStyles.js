export default class ComponentStyles {
    #href = null;
    #style = null;
    #initial = true;
    #styleSheet = null;

    get initial(){return this.#initial;}
    get href(){return this.#href;}
    get style(){return this.#style;}

    set href(url){
        if (this.#initial){
            this.#href = URL.create(url);;
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
            if (this.#style === null && this.#href !== null){
                try {
                    const style = await URL.loader(this.#href);
                    this.#style = ComponentStyles.compress(style);
                } catch  {
                    throw new TypeError("Component style loading failed.");
                }
            }
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(this.#style);
            this.#styleSheet = [...ComponentStyles.base, sheet];
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
