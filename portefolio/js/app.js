(function() {
    function openNavBar() {
        $('#jc_nav_bar button.hamburger').addClass('is-active');
        $('#jc_nav_bar').addClass('jc_nav_expand');
        $('.jc_nav_anchor').addClass('jc_nav_show');
        $('.jc_nav_anchor').addClass('jc_nav_show');
    }

    function closeNavBar() {
        $('#jc_nav_bar button.hamburger').removeClass('is-active');
        $('#jc_nav_bar').removeClass('jc_nav_expand');
        $('.jc_nav_anchor').removeClass('jc_nav_show');
    }
    $('#jc_nav_bar').hover(openNavBar, closeNavBar);
    $('#jc_nav_hamburger').click(function() {
        if ($('#jc_nav_bar button.hamburger').hasClass('is-active')) {
            closeNavBar();
        } else {
            openNavBar();
        }
    })
})()