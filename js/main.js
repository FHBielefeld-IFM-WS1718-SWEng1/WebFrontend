Vue.component('login', {
    template: '#login-form',
    data: function () {
        return {
            username: '',
            email: '',
            pw: '',
            pw_check: ''
        }
    },
    methods: {
        login() {
            if (this.$root.register) {
                console.log("Register new user", this.username, this.email, this.pw, this.pw_check);
                if (this.pw == this.pw_check)
                    postRequest("register",
                        JSON.stringify({"name": this.username, "email": this.email, "password": this.pw}),
                        function (data) {
                            if (data.error)
                                console.log(data.error);
                        });
            }
            else {
                console.log("Login existing user", this.email, this.pw);
                papla_login(this.email, this.pw, function () {
                    str = window.location.href;
                    str = str.replace(/(\/[\w]+\.html)[\S]*/g, "/home.html");
                    window.location.replace(str);
                });
            }
        }
    }
});

new Vue({
    el: '.container',
    data: {
        register: true
    },
    methods: {
        switchToLogin() {
            this.register = false;
        },
        switchToRegister() {
            this.register = true;
        }
    }
})

function importScript(url) {
    var script = document.createElement("script");
    script.src = url;
    document.head.appendChild(script);
}