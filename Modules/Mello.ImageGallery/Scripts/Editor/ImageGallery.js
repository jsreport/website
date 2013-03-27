$(document).ready(function () {
    $('#DisplayImageGallery').change(function () {
        $('#imageGalleryProperties').toggle($('#DisplayImageGallery').val());
    });
});