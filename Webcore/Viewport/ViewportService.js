export default class ViewportService {
    static #instance = null;
    #orientation = null;
    #taskQueue = [];
    #isExecuting = false;

    constructor(){
        if (ViewportService.#instance){return ViewportService.#instance}
        this.#orientation = top.matchMedia('(orientation: landscape)');
        this.#orientation.onchange = ()=>{this.execute()};

        const changHandler = ()=>{
            if (this.#orientation.matches){
                document.documentElement.classList.remove('portrait');
            } else {
                document.documentElement.classList.add('portrait');
            }
        };
        const orient = screen.orientation;
        if ( document.documentElement.classList.contains('dync')
             || (orient.type.startsWith('p') && (orient.angle == 90 || orient.angle == 270))
             || (orient.type.startsWith('l') && (orient.angle == 0 || orient.angle == 180))
        ) {
            this.add(changHandler);
        }
        changHandler();
        ViewportService.#instance = this;
    }

    get length() {return this.#taskQueue.length;}
    get count() {return this.#taskQueue.length;}
    get landscape(){return this.#orientation.matches;}
    get portrait(){return !this.#orientation.matches;}
    get orientation(){return this.#orientation.matches ? 'landscape' : 'portrait'}

    add(func){
        if (!this.#isExecuting && typeof func === 'function'){
            this.remove(func);
            this.#taskQueue.push(func);
        }
        return this;
    }

    addBatch(tasks) {
        if (!this.#isExecuting && Array.isArray(tasks)){
            for (const task of tasks){this.add(task);}
        }
        return this;
    }

    has(func){
        if (typeof func === 'function'){
            return this.#taskQueue.indexOf(func) !== -1;
        }
        return false;
    }

    async execute(){
        if (this.#isExecuting) {console.warn('The task is currently being executed.');return false;}
        this.#isExecuting = true;
        for (const task of this.#taskQueue) {
            try { await Promise.resolve(task())} catch (error) {console.error('Task running error.', error.message);}
        }
        this.#isExecuting = false;
        return true;
    }

    remove(func){
        if (!this.#isExecuting && typeof func === 'function'){
            const index = this.#taskQueue.indexOf(func);
            if (index !== -1) {
                this.#taskQueue.splice(index, 1);
                return true;
            }
        }
        return false;
    }

    removeAt(index) {
        if (!this.#isExecuting && typeof index === 'number' && index >= 0 && index < this.#taskQueue.length){
            this.#taskQueue.splice(index, 1);
            return true;
        }
        return false;
    }

    clear() {this.#taskQueue = [];return true;}

    destroy() {
        this.#orientation.onchange = null;
        this.#taskQueue = [];
        Viewport.#instance = null;
    }
}
