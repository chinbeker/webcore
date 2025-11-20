import App from "/Webcore/App.js";

export default class InitialService {
    static instance = null;
    default = null;
    open = null;
    loaded = null;
    executed = false;

    constructor(){
        if (InitialService.instance){
            return InitialService.instance;
        }
        InitialService.instance = this;
        self.addEventListener('DOMContentLoaded', ()=>{
            try {
                if (typeof this.loaded === 'function'){this.loaded();}
                this.executed = true;this.loaded = null;
            } catch (error) {
                console.error('Initialization task execution failed: ', error)
                return false;
            }
        },{once: true});
    }

    execute(){
        console.log('6. 开始运行初始化程序……');
        if (!this.executed && typeof this.default === 'function'){
            try {
                if (typeof this.default === 'function'){this.default()}
                if (typeof this.load === 'function'){this.open()}
                this.executed = true;
                this.default = null;
                this.load = null;
            } catch (error) {
                console.error('Initialization task execution failed: ', error)
                return false;
            }
        }
        return true;
    }
}
