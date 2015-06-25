(function($) {
    $(function() {
        $("#createFlatWindow").on('click', function() {
            $.Dialog({
                overlay: true,
                shadow: true,
                flat: true,
                title: 'jsreport - Deep Dive',
                padding: 10,
                content: '',
                onShow: function(_dialog) {
                    var content = _dialog.children('.content');
                    content.html('<iframe width="853" height="480" src="//www.youtube.com/embed/fhOQ0HPjK6s" frameborder="0" allowfullscreen></iframe><p class="modal"></p>');
                }
            });
        });

        function toggle(content) {
            var backSide = $(content).next(".tile-content-back");
            if (backSide.length === 1) {
                $(content).toggle();
                backSide.toggle();

                if (backSide.next(".tile-status").length === 1)
                    backSide.next(".tile-status").toggle();
            }
        }

        $(".tile-content").each(function (i, content) {
            setTimeout(function () {
                toggle(content);
                setInterval(function () {
                    toggle(content);
                }, 6000);
            }, Math.random() * 14000);
        });
    });
})(jQuery);