namespace Mello.ImageGallery.Models.Plugins.LightBox {
    public class LightBox : ImageGalleryPlugin {
        private readonly LightBoxSettings _settings;

        public LightBox(LightBoxSettings settings) {
            _settings = settings;
        }

        public override string ToString(string cssSelector) {
            return string.Format("$('{0}').lightBox({1});", cssSelector, _settings);
        }
    }
}