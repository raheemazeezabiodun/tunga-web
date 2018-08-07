export function initNavUIController() {
    $(document).on('click', '.navbar-collapse.in', function(e) {
        if ($(e.target).is('a') && !$(e.target).hasClass('dropdown-toggle')) {
            $(this).collapse('hide');
        }
    });

    $(document).on('click', '#sidebar', function(e) {
        if ($(e.target).data('toggle') != 'collapse') {
            $('#sidebar.collapse').css('display', 'none');
        }
    });
}

export function toggleSlideIn(
    selector,
    action = 'toggle',
    onStart = null,
    onComplete = null,
) {
    var slideBox = $(selector);
    slideBox.animate(
        {width: action},
        {
            duration: 250,
            easing: 'swing',
            start: onStart,
            complete: onComplete,
        },
    );
}

export function initSideBarToggle() {
    $('[data-toggle="sidebar-collapse"]').on('click', function() {
        toggleSlideIn(
            $(this).data('target'),
            'toggle',
            function() {
                $('#navbar.collapse').collapse('hide');
                var running = $('#running-tasks');
                running.removeClass('bottom');
            },
            resizeSideBar,
        );
    });

    $('#navbar.collapse').on('show.bs.collapse', function() {
        toggleSlideIn('#sidebar.collapse', 'hide');
    });
}

export function resizeSideBar() {
    var running = $('#running-tasks');
    running.removeClass('bottom');
    var sidebar = $('#sidebar').height();
    var content = $('#sidebar .wrapper').height() + 40;
    if (content < sidebar) {
        running.addClass('bottom');
    }
}
