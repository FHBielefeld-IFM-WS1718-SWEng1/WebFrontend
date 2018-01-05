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
}