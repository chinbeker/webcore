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
        self.addEventListener("DOMContentLoaded", ()=>{
            try {
                if (typeof this.loaded === "function"){this.loaded();this.loaded = null;}
                this.executed = true;
            } catch (error) {
                console.error("Initialization task execution failed: ", error)
                return false;
            }
        }, {once: true});
        Object.seal(this);
        InitialService.instance = this;
    }

    execute(){
        console.log("6. 开始运行初始化程序……");
        if (!this.executed && typeof this.default === "function"){
            try {
                if (typeof this.default === "function"){this.default();this.default = null;}
                if (typeof this.open === "function"){this.open();this.open = null;}
                this.executed = true;
            } catch (error) {
                console.error("Initialization task execution failed: ", error)
                return false;
            }
        }
        return true;
    }
}
