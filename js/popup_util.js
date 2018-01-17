class PopupHandler {
    constructor(container, values, callbacks) {
        this.popupVue = new Vue({
            el: container,
            data: {
                show: values,
                callbackMethods: callbacks,
                hoverBG: false
            },
            methods: {
                callback(type, parameters) {
                    return this.callbackMethods[type](parameters);
                },
                showAny() {
                    for (var k in this.show)
                        if (this.show[k])
                            return true;
                    return false;
                },
                hideAll() {
                    for (var k in this.show)
                        this.show[k] = false;
                }
            }
        });
        const c_container = container.slice(1);
        const c_vue = this.popupVue;
        document.body.addEventListener('click', function (e) {
            var elem = document.elementFromPoint(event.clientX, event.clientY);
            if (elem.className === c_container)
                c_vue.hideAll()
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
        while (!element && timeout++ < 20) {
            await this.sleep(200)
            element = document.getElementById(id);
        }
        return element;
    }
}
