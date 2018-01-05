class PopupHandler {
    constructor(container, values, callbacks) {
        this.popupVue = new Vue({
            el: container,
            data: {
                show: values,
                callbackConfirm: callbacks
            },
            methods: {
                confirm(type) {
                    this.callbackConfirm[type]();
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