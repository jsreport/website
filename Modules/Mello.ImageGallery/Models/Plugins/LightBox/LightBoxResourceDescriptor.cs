namespace Mello.ImageGallery.Models.Plugins.LightBox {
    public class LightBoxResourceDescriptor : PluginResourceDescriptor {
        public LightBoxResourceDescriptor() {
            AddScript("Scripts/jquery.lightbox-0.5.min.js");
            AddStyle("Styles/jquery.lightbox-0.5.css");
        }

        public override string PluginName {
            get { return "LightBox"; }
        }
    }
}