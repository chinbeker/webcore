export default class LayoutService {
    static #instance = null;
    executed = false;
    root = null;
    font = Object.create(null);

    constructor(){
        if (LayoutService.#instance){return LayoutService.#instance}
        this.executed = false;
        this.root = document.documentElement;
        this.setupFontScaling();
        this.setupUserExperience();
        console.log('4. 页面基本布局已完成');
        this.executed = true;
        Object.freeze(this);
        LayoutService.#instance = this;
    }

    get fontSize(){return parseFloat(getComputedStyle(this.root).getPropertyValue('font-size'));}

    // 桌面端与移动端横竖屏字体优化
    setupFontScaling(){
        if (this.executed){return false;}
        const root = this.root;
        if (root.classList.contains('dync')){return false;}

        const orient = screen.orientation;
        this.font.base = 28.57;
        this.font.initial = parseFloat(getComputedStyle(root).getPropertyValue('font-size')) || 15.4;

        const angle = ()=>{
            if (screen.orientation.angle == 0 || screen.orientation.angle == 180) {
                this.root.classList.add('portrait');
            } else {
                this.root.classList.remove('portrait');
            }
        };

        const desktop = ()=>{
            if (screen.orientation.angle == 0 || screen.orientation.angle == 180){
                this.root.style.fontSize = this.font.portrait;
                this.root.classList.add('portrait');
            } else {
                this.root.style.fontSize = this.font.landscape;
                this.root.classList.remove('portrait');
            }
        };

        const min = (screen.width /  this.font.initial) <  this.font.base || (screen.height /  this.font.initial) <  this.font.base;
        if (orient.type.startsWith('p') && (orient.angle == 0 || orient.angle == 180)) {
            root.classList.add('portrait');
            if (min) {
                this.font.portrait = (top.innerWidth / this.font.base) + 'px';
                root.style.fontSize = this.font.portrait;
                if (top.innerWidth > screen.width) {
                    this.font.landscape = (top.innerWidth / screen.height * (screen.width / this.font.base)) + 'px';
                    orient.onchange = desktop;
                } else {
                    orient.onchange = angle;
                }
            } else {
                orient.onchange = angle;
            }
        } else if (orient.type.startsWith('l') && (orient.angle == 90 || orient.angle == 270)) {
            if (min) {
                if (top.innerWidth > screen.width){
                    this.font.portrait = (top.innerWidth / this.font.base) + 'px';
                    this.font.landscape = (top.innerWidth / screen.width * (screen.height / this.font.base)) + 'px';
                    root.style.fontSize = this.font.landscape;
                    orient.onchange = desktop;
                } else {
                    this.font.portrait = (screen.height / this.font.base) + 'px';
                    root.style.fontSize = this.font.portrait;
                    orient.onchange = angle;
                }
            } else {
                orient.onchange = angle;
            }
        }
        return true;
    }

    // 其他用户界面优化
    setupUserExperience() {
        if (this.executed){return false;}
        if (this.root.classList.contains('ban')){
            this.root.oncontextmenu = (event)=>{
                event.preventDefault(); event.stopPropagation(); return false;
            };
        };
        const empty = function(){};
        document.addEventListener('touchstart', empty, {passive:true});
        window.onbeforeunload = ()=>{document.removeEventListener('touchstart', empty);}
        return true;
    }

}
