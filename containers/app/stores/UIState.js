import {observable, computed, reaction, action, observe} from 'mobx';

const throttle = (type, name, obj) => {
    obj = obj || window;
    let running = false;
    let func = function() {
        if (running) { return; }
        running = true;
        requestAnimationFrame(function() {
            obj.dispatchEvent(new CustomEvent(name));
            running = false;
        });
    };
    obj.addEventListener(type, func);
}

export default class UiState {

    @observable width;
    @observable height;


    constructor() {

        throttle("resize", "optimizedResize");

        this.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        this.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        window.addEventListener("optimizedResize", () => {
            this.updateUI()
        });
    }

    @action updateUI() {
        this.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        this.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    }
}
