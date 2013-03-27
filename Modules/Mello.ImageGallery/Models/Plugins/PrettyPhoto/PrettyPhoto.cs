namespace Mello.ImageGallery.Models.Plugins.PrettyPhoto {
    public class PrettyPhoto : ImageGalleryPlugin {
        private readonly PrettyPhotoSettings _prettyPhotoSettings;

        public PrettyPhoto(PrettyPhotoSettings prettyPhotoSettings) {
            _prettyPhotoSettings = prettyPhotoSettings;
        }

        public override string ToString(string cssSelector) {
            return string.Format("$('{0}').prettyPhoto({1});", cssSelector, _prettyPhotoSettings);
        }


        public override string AdditionalHrefMarkup(string imageGalleryName) {
          return string.Format("rel='prettyPhoto[{0}]'", imageGalleryName); 
        }
    }
}