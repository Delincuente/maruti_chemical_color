function onSubmit() {
    $('.invalid-feedback').hide();
    var error = 0;
    var userName = $('#id_username').val();
    var password = $('#id_password').val();

    if (!userName) {
        error++;
        $('#id_username-error').show();
    }
    if (!password) {
        error++;
        $('#id_password-error').show();
    }

    if (error == 0) {
        let obj = {
            user_name: userName,
            password: password
        };

        $.post(BASE_URL + '/admin/sign-in', obj, function (response) {
            window.location = BASE_URL + '/admin/dashboard';
        }).fail(function (error) {
            $('#id_login_error').text(error.responseJSON.message);
        });
    }
}