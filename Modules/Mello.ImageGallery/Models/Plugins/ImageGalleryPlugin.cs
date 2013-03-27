namespace Mello.ImageGallery.Models.Plugins {
    public abstract class ImageGalleryPlugin {
        public abstract string ToString(string cssSelector);

        public virtual string AdditionalHrefMarkup(string imageGalleryName) {
            return string.Empty;
        }

        public virtual string ImageGalleryTemplateName {
            get { return "Parts/ImageGallery"; }
        }
    }
}