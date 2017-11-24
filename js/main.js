Vue.component('login', {
    template: '#login-form',
    data: function(){
        return {
            register: true,
            username: '',
            email: '',
            pw: '',
            pw_check: ''
        }
    },
    methods: {
        login(){
            if(this.register)
                console.log("Register new user", this.username, this.email, this.pw, this.pw_check);
            else
            {
                console.log("Login existing user", this.email, this.pw);
                str = window.location.href;
                str = str.replace(/(\/[\w]+\.html)[\S]*/g, "/home.html");
                window.location.replace(str);
            }
        }
    }
});


console.log("HELLO!"+main.currentView);