const naviVue = new Vue({
    el: '#navi',
    data: {
        name: ""
    },
    methods: {
        logout() {
            papla_logout(apiKey);
        },
        refreshName()
        {
            this.name = localStorage.getItem("userName");
        }
    }
});

naviVue.refreshName();