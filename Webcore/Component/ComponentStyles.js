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

    #create(){
        if (this.#styleSheet === null){
            if (this.#style === null){
                this.#styleSheet = [...ComponentStyles.base];
            } else {
                const sheet = new CSSStyleSheet();
                sheet.replaceSync(this.#style);
                this.#styleSheet = [...ComponentStyles.base, sheet];
            }
        }
        return this.#styleSheet;
    }

    styleSheet(){
        return this.#create();
    }

    async styleSheetAsync(){
        if (this.#styleSheet === null && this.#url !== null){
            try {
                const style = await URL.loader(this.#url);
                this.#style = ComponentStyles.compress(style);
                return this.#create();
            } catch  {
                throw new TypeError("Component style loading failed.");
            }
        } else {
            return this.#create();
        }
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
