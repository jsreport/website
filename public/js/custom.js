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

        function getUrlVars()
        {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for(var i = 0; i < hashes.length; i++)
            {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        }     

        $("#docsVersionSelect").change(function () {
            var version = $(this).val()                     
            if (version === 'latest') {
                window.location = window.location.pathname
            } else {
                window.location = window.location + '?version=' + version
            }            
        })

        if (window.location.pathname.indexOf('/learn') > -1) {
            var version = getUrlVars().version         
            $('a').each(function () {
                var href = $(this).attr('href')            
                if (href && href.indexOf('/learn') > -1) {
                    var newHref = href.split('?')[0] + (version ? ('?version=' + version) : '')                 
                    $(this).attr('href', newHref)
                }
            })

            $('img').each(function () {
                var src = $(this).attr('src')            
                if (src && src.indexOf('/learn') > -1) {
                    var newSrc = src.split('?')[0] + (version ? ('?version=' + version) : '')                 
                    $(this).attr('src', newSrc)
                }
            })
        }

        function scrollToc() {
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
            $(".toc").css("padding-top", Math.max(120 - scrollTop, 0) + "px")
        }

        $(window).scroll($.debounce(10, scrollToc))
        scrollToc()
    });
})(jQuery);