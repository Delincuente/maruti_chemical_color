$(function () {

    // Get the form.
    var form = $('#contact-form');

    // Get the messages div.
    var formMessages = $('.form-message');
    $(formMessages).removeClass(function (index, className) {
        return (className.match(/(?!form-message|alert)\S+/g) || []).join(' ');
    });
    $(formMessages).hide();

    // Set up an event listener for the contact form.
    $(form).submit(function (e) {
        $(formMessages).hide();
        // Stop the browser from submitting the form.
        e.preventDefault();
        var error = 0;
        var companyName = $('#id_company_name').val();
        var email = $('#id_email').val();
        var phone = $('#id_phone').val();
        var productName = $('#id_product_name').val();
        var inquiryMessage = $('#id_inquiry_message').val();

        if (!companyName) {
            error++;
            $(formMessages).addClass("alert-danger");
            $(formMessages).text('Company Name is required').show();
        } else if (!email) {
            error++;
            $(formMessages).addClass("alert-danger");
            $(formMessages).text('Email is required').show();
        } else if (!phone) {
            error++;
            $(formMessages).addClass("alert-danger");
            $(formMessages).text('Phone number is required').show();
        } else if (!productName) {
            error++;
            $(formMessages).addClass("alert-danger");
            $(formMessages).text('Product Name is required').show();
        } else if (!inquiryMessage) {
            error++;
            $(formMessages).addClass("alert-danger");
            $(formMessages).text('Inquiry message is required').show();
        }

        if (error == 0) {
            let obj = {
                company_name: companyName,
                email: email,
                phone: phone,
                product_name: productName,
                inquiry_message: inquiryMessage,
            };
            // Submit the form using AJAX.
            $.ajax({
                type: 'POST',
                url: $(form).attr('action'),
                data: obj
            })
                .done(function (response) {
                    if (response) {
                        $(formMessages).addClass('alert-success');
                        $(formMessages).text(response.message).show();

                    }
                    $('#contact-form input,#contact-form textarea').val('');
                })
                .fail(function (data) {
                    $(formMessages).addClass('alert-danger');
                    if (data.responseJSON && data.responseJSON.message !== '') {
                        $(formMessages).text(data.responseJSON.message).show();
                    } else {
                        $(formMessages).text('Oops! An error occured and your message could not be sent.').show();
                    }
                });
        }
    });
});
