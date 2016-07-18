// Input float label
$(document).ready(function () {
    var $input = $('.input-float-label input');

    $input.blur(function () {
        if (this.value !== '') {
            $(this).addClass('top-label');
        } else {
            $(this).removeClass('top-label');
        }
    });

    if ($input.val() !== '') {
        $input.addClass('top-label');
    }

    $input.on('show-input', function(event) {
        if (event.target.value !== '') {
            $(this).addClass('top-label');
        }
        else {
            $(this).removeClass('top-label');
        }
    });
});
