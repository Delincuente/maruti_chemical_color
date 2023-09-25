$('#inquiry-list').DataTable({
    ordering: false,
    processing: true,
    serverSide: true,
    ajax: {
        url: BASE_URL + '/admin/paginate/inquiry-list',
        type: 'POST',
        data: function (d) {
            // d.search = $('#filter_search').val();
            // d.jamiat = $('#filter_jamiat').val();
            // d.jamaat = $('#filter_jamaat').val();
        },
    },
    bPaginate: true,
    columns: [
        {data: "index", sortable: false},
        {data: "company_name", sortable: false},
        {data: "product_name", sortable: false},
        {data: "email", sortable: false},
        {data: "date", sortable: false},
        {data: "action"}
    ],
    lengthMenu: [5, 10, 25, 50, 100],
    columnDefs: [
        {
            render: function (data, type, row) {
                var btn = '';
                btn += '<a href="' + BASE_URL + '/admin/' + row.uuid + '/inquiry-details" role="button" class="btn btn-dark m-1" ><i class="bi bi-eye"></i></a>';
                btn += '<a href="javascript:void(0);" data-uuid="' + row.uuid + '" role="button" class="btn btn-danger m-1" onclick="deleteInquiry(this)"><i class="bi bi-trash"></i></a>';
                return [btn].join('');
            },
            targets: $('#inquiry-list th#action').index(),
            orderable: false,
            searchable: false
        }
    ]
});

function deleteInquiry(e) {
    var $btn = $(e);
    var uuid = $btn.data('uuid');
    var modelId = $('#verticalycentered');

    $.get(BASE_URL + '/admin/' + uuid + '/inquiry-delete', function (response) {
        modelId.html(response);
        modelId.modal({
            backdrop: 'static',
            keyboard: false
        });
        modelId.modal('show');
    }).fail(function (error) {
        toastr.error('Oops...something went wrong. Please try again.');
    });
}

function destroyInquiry(e) {
    var $btn = $(e);
    var uuid = $btn.data('uuid');

    $.post(BASE_URL + '/admin/' + uuid + '/inquiry-delete', function (response) {
        var message = response.message;
        if (response.status == 200) {
            $('#inquiry-list').DataTable().draw();
            $('#verticalycentered').modal('hide');
            // window.location = BASE_URL + '/admin/dashboard';
        } else {
            alert(message);
        }
    }).fail(function (error) {
        alert('Oops...something went wrong. Please contact to support team.');
    });
}