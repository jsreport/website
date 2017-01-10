(function ($) {
    $(function () {
        $(".youtubeModal").on('click', function () {
            var button = $(this)
            $.Dialog({
                overlay: true,
                shadow: true,
                flat: true,
                title: button.attr('data-title'),
                padding: 10,
                content: '',
                onShow: function (_dialog) {
                    var content = _dialog.children('.content');
                    content.html('<iframe width="853" height="480" src="' + button.attr('data-youtube') + '" frameborder="0" allowfullscreen></iframe><p class="modal"></p>');
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

        function scrollToc() {
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
            $(".toc").css("padding-top", Math.max(120 - scrollTop, 0) + "px")
        }

        $(window).scroll($.debounce(10, scrollToc))
        scrollToc()
    });
})(jQuery);