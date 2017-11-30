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
            if (this.$root.register)
            {
                console.log("Register new user", this.username, this.email, this.pw, this.pw_check);
            }
            else {
                console.log("Login existing user", this.email, this.pw);
                str = window.location.href;
                str = str.replace(/(\/[\w]+\.html)[\S]*/g, "/home.html");
                window.location.replace(str);
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