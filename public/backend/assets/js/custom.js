const goToTop = () => {
    document.body.scrollIntoView({
        behavior: "smooth",
    });
};

function onInquiry(e) {
    var id = $(e).data('product');
    window.location = BASE_URL + '/contact-us?product=' + id;
}