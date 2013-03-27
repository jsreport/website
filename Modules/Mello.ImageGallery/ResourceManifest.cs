using Orchard.UI.Resources;

namespace Mello.ImageGallery {
    public class ResourceManifest : IResourceManifestProvider {
        public void BuildManifests(ResourceManifestBuilder builder) {
            builder.Add().DefineStyle("ImageGalleryAdmin").SetUrl("image-gallery-admin.css");
            builder.Add().DefineStyle("ImageGallery").SetUrl("image-gallery.css");

            builder.Add().DefineScript("jQueryMultiFile").SetDependencies("jquery").SetUrl("jquery.MultiFile.pack.js");
            builder.Add().DefineScript("jQueryUISortable").SetDependencies("jquery").SetUrl("sortable-interaction-jquery-ui-1.8.10.custom.min.js");            
        }
    }
}