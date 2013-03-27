
$(document).ready(function () {
    $('#images tbody').sortable({ update: Update }).disableSelection();
});

function Update(event, ui) {
    var images = new Array();

    $(".name").each(function () {

        images.push(this.innerText);
    });

    var ajaxData = ({ __RequestVerificationToken: $('[name=__RequestVerificationToken]').attr('value'), 
        images: images, imageGalleryName : $('#imageGalleryName').val() });    

    $.ajax({
        type: 'POST',
        data: ajaxData,
        url: 'Reorder',
        traditional: true
    });
}

