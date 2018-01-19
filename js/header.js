const naviVue = new Vue({
    el: '#navi',
    data: {
        name: ""
    },
    methods: {
        logout() {
            papla_logout(localStorage.getItem("apiKey"));
        },
        refreshName() {
            this.name = localStorage.getItem("userName");
        }
    },
    created: function () {
        this.refreshName();
    }
});