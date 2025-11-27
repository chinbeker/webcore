export default class UtilityService {
    static #instance = null;

    constructor(){
        if (UtilityService.#instance){
            return UtilityService.#instance;
        }
        UtilityService.#instance = this;
    }

    typeOf(target){
        if (target === undefined) {return 'undefined';}
        if (target === null) {return 'null';}
        return Object.prototype.toString.call(target).replace(/^\[object (\S+)\]$/, '$1').toLowerCase();
    }

    cob(target){
        const obj = Object.create(null);
        if (target !== undefined){
            if (this.typeOf(target) === 'object'){
                Object.assign(obj, target);
            } else {
                obj.value = target;
            }
        }
        return obj;
    }

    cpo(value, func){
        const obj = Object.create(null);
        if (value !== undefined) {obj.value = value;};
        if (typeof func === 'function'){
            return new Proxy(obj, {
                get: (target, prop) => {return target.value;},
                set: (target, prop, value) => {
                    func(value, target.value);
                    target.value = value;value = null;
                    return true;
                }
            });
        };
        return obj;
    };

    cfn(target, func){
        if (target === undefined) {return null;}
        if (typeof func !== 'function') {return null;}
        if (func.length == 1) {return ()=>{func(target)};}
        if (func.length > 1) {return (...args)=>{func(target, ...args)};}
        return null;
    };



    getRandomInteger(max, current){
        if (typeof max !== 'number') {throw new Error('Error')}
        let randnum = Math.floor(Math.random()*max);
        if (typeof current === 'number') {
            while (randnum == current) {randnum = Math.floor(Math.random()*max)}
        }
        return randnum;
    }

    numberToUpperCase(num){
        if (typeof num != 'number' || num > 9 || num < 0) {throw new Error('Error')}
        return ['\u3007','\u4e00','\u4e8c','\u4e09','\u56db','\u4e94','\u516d','\u4e03','\u516b','\u4e5d'][num];
    }

    // 生成随机颜色
    getRandomColor(type = 'hex') {
        const bytes = this.randomBytes(3);
        switch (type) {
            case 'hex':
                return '#' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');

            case 'rgb':
                return `rgb(${bytes[0]}, ${bytes[1]}, ${bytes[2]})`;

            case 'hsl': {
                const h = bytes[0] / 255 * 360;
                const s = 50 + (bytes[1] / 255 * 50); // 50-100%
                const l = 30 + (bytes[2] / 255 * 40); // 30-70%
                return `hsl(${h.toFixed(1)}, ${s.toFixed(1)}%, ${l.toFixed(1)}%)`;
            }
            default:
                throw new Error('不支持的色彩类型: ' + type);
        }
    }

}
