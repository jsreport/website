
namespace Mello.ImageGallery.Models.Plugins.PrettyPhoto {
    public class PrettyPhotoResourceDescriptor : PluginResourceDescriptor {
        public PrettyPhotoResourceDescriptor() {
            AddStyle("css/prettyPhoto.css");
            AddScript("js/jquery.prettyPhoto.js");
        }

        public override string PluginName {
            get { return "PrettyPhoto"; }
        }
    }
}