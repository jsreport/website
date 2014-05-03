 (function ($) {
        $("#createFlatWindow").on('click', function() {
            $.Dialog({
                overlay: true,
                shadow: true,
                flat: true,
                title: 'jsreport - Quick Start Tutorial',
                padding: 10,
                content: '',
                onShow: function(_dialog) {
                    var content = _dialog.children('.content');
                    content.html('<iframe width="853" height="480" src="//www.youtube.com/embed/L7MZqwDCxP8" frameborder="0" allowfullscreen></iframe><p class="modal">This video is very basic quick start into reporting software <strong>jsreport</strong>.</p>');
                }
            });
        });
    })(jQuery);