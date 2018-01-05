class PopupHandler {
    constructor(container, values, callbacks) {
        this.popupVue = new Vue({
            el: container,
            data: {
                show: values,
                callbackConfirm: callbacks
            },
            methods: {
                confirm(type, parameters) {
                    this.callbackConfirm[type](parameters);
                }
            }
        });
    }

    getVue() {
        return this.popupVue;
    }

    showPopup(type) {
        this.popupVue.show[type] = true;
    }

    hidePopup(type) {
        this.popupVue.show[type] = false;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async findPopup(id) {
        var element = document.getElementById(id);
        var timeout = 0;
        while (!element && timeout++<20) {
            await this.sleep(200)
            element = document.getElementById(id);
        }
        return element;
    }
}