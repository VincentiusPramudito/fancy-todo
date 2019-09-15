$(document).ready(function () {
    console.log('document ready!')
    if (localStorage.token === undefined) {
        $("#logout").hide()
        $('.register-form').hide()
        $('.container').hide()
        $('.form-add-todo').hide()
        $('#add-todo-button').hide()
    } else {
        hasLogin(localStorage.username)
    }

    $("#add-todo-button").click(function () {
        $(".form-add-todo").modal("show");
        // $("#add-todo-button").css("display", "none");
    });

    $("#add-todo-button-cancel").click(function () {
        $(".form-add-todo").modal("hide");
        // $("#add-todo-button").css("display", "block");
    });

    $("#form-add-todo").submit(addTodo);

})

function hasLogin() {
    $('.login-form').hide()
    $('.g-signin2').hide()
    $('.register-form').hide()
    $('#logout').show()
    $('.container').show()
    $('#add-todo-button').show()
    $('.form-add-todo').hide()
    $("#author").text(`Author: ${localStorage.username}`);
    showTodos()
}

function login() {
    event.preventDefault();
    if (!$('#username-login').val() || !$('#password-login').val()) {
        swal({
            title: "Please Fill All Column!",
            icon: "error",
            buttons: false,
            timer: 2000
        });
    } else {
        const data = {
            username: $('#username-login').val(),
            password: $('#password-login').val()
        };

        $.ajax({
            url: `http://localhost:3000/api/login`,
            type: 'POST',
            data
        })
            .done(function ({ token, username }) {
                localStorage.setItem('token', token)
                localStorage.setItem('username', username)
                swal("Login Success!", `Welcome back, ${username}!`, "success")
                hasLogin()
            })
            .fail(function (gg, textStatus) {
                console.log('Err:', textStatus)
                swal({
                    title: "User doesn't exist. Please register first!",
                    icon: "error",
                });
            })
    }
}

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/api/google-login',
        data: {
            token: id_token
        }
    })
        .done(function (data) {
            const { token, username } = data
            localStorage.setItem('token', token)
            localStorage.setItem('username', username)
            swal("Good Job!", `Welcome to the todos app, ${username}!`, "success");
            hasLogin()
        })
        .fail(function (gg, textStatus) {
            console.log('Error', textStatus);
        })
}

function signOut() {

    swal({
        title: 'Are you sure want to logout?',
        icon: 'warning',
        buttons: true,
        
    })
        .then((result) => {
            if (result) {
                swal(
                    'Good bye!',
                    'You logged out from application!',
                    'success'
                )

                localStorage.clear()
                sessionStorage.clear()
                var auth2 = gapi.auth2.getAuthInstance();
                auth2.signOut().then(function () {
                    console.log('User signed out.');
                });
                $('#username-login').val("")
                $('#password-login').val("")
                $('#username-register').val("")
                $('#password-register').val("")
                $("#logout").hide()
                $('.register-form').hide()
                $('.login-form').show()
                $('.g-signin2').show()
                $('.container').hide()
                $('.form-add-todo').hide()
                $('#add-todo-button').hide()
            }
        })
}

function showRegister() {
    $('.register-form').show()
    $('.login-form').hide()
    $('.g-signin2').hide()
    $("#logout").hide()
    $('.container').hide()
}

function register() {
    event.preventDefault();
    if (!$('#username-register').val() || !$('#password-register').val()) {
        swal({
            title: "Please Fill All Column!",
            icon: "error",
            buttons: false,
            timer: 2000
        });
    } else {
        const data = {
            username: $('#username-register').val(),
            password: $('#password-register').val()
        };

        $.ajax({
            url: `http://localhost:3000/api/register`,
            type: 'POST',
            data
        })
            .done(function ({ token, username }) {
                console.log(token, username)
                localStorage.setItem('token', token)
                localStorage.setItem('username', username)
                hasLogin()
                $('#username-register').val("")
                $('#password-register').val("")
                swal("Register Success!", `Welcome to the Todos App, ${username}`, "success");
            })
            .fail(function (gg, textStatus) {
                console.log('Err:', textStatus)
                swal({
                    title: "Username already exist. Please register with another username!",
                    icon: "error",
                });
            })
    }
}

function back() {
    $("#logout").hide()
    $('.register-form').hide()
    $('.login-form').show()
    $('.g-signin2').show()
    $('.container').hide()
}
