class OrientationChange {
    static #instance = null;
    #changeTask = [];
    #executed = false;
    constructor(){
        if (OrientationChange.#instance){return OrientationChange.#instance}
        Object.freeze(this);
        OrientationChange.#instance = this;
    }

    get length() {return this.#changeTask.length;}
    get count() {return this.#changeTask.length;}

    add(func){
        if (!this.#executed && typeof func === 'function'){
            this.remove(func);
            this.#changeTask.push(func);
        }
        return this;
    }

    addBatch(tasks) {
        if (!this.#executed && Array.isArray(tasks)){
            for (const task of tasks){this.add(task);}
        }
        return this;
    }

    has(func){
        if (typeof func === 'function'){
            return this.#changeTask.indexOf(func) !== -1;
        }
        return false;
    }

    async execute(){
        if (this.#executed) {console.warn('The task is currently being executed.');return false;}
        this.#executed = true;
        for (const task of this.#changeTask) {
            try { await Promise.resolve(task())} catch (error) {console.error('Task running error.', error.message);}
        }
        this.#executed = false;
        return true;
    }

    remove(func){
        if (!this.#executed && typeof func === 'function'){
            const index = this.#changeTask.indexOf(func);
            if (index !== -1) {
                this.#changeTask.splice(index, 1);
                return true;
            }
        }
        return false;
    }

    removeAt(index) {
        if (!this.#executed && typeof index === 'number' && index >= 0 && index < this.#changeTask.length){
            this.#changeTask.splice(index, 1);
            return true;
        }
        return false;
    }

    clear() {this.#changeTask = [];return true;}
}

export default class Orientation {
    static #instance = null;
    #media = null;
    change = null;

    constructor(){
        if (Orientation.#instance){return Orientation.#instance}
        this.change = new OrientationChange();
        this.#media = top.matchMedia('(orientation: landscape)');
        this.#media.onchange = ()=>{this.change.execute()};

        const changHandler = ()=>{
            if (this.#media.matches){
                document.documentElement.classList.remove('portrait');
            } else {
                document.documentElement.classList.add('portrait');
            }
        };
        const orient = screen.orientation;
        if (document.documentElement.classList.contains('dync')
             || (orient.type.startsWith('p') && (orient.angle == 90 || orient.angle == 270))
             || (orient.type.startsWith('l') && (orient.angle == 0 || orient.angle == 180))
        ) {
            this.change.add(changHandler);
        }
        changHandler();
        Object.freeze(this);
        Orientation.#instance = this;
    }

    get landscape(){return this.#media.matches;}
    get portrait(){return !this.#media.matches;}
    get matches(){return this.#media.matches ? 'landscape' : 'portrait'}

    destroy() {
        this.#media.onchange = null;
        this.change.clear();
        Orientation.#instance = null;
    }
}
