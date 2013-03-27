using System.Text;

namespace Mello.ImageGallery.Models.Plugins.LightBox {
    public class LightBoxSettings {
        public LightBoxSettings(string pluginResourcePath) {
            ButtonCloseImage = pluginResourcePath + "/Images/lightbox-btn-close.gif";
            ButtonPreviousImage = pluginResourcePath + "/Images/lightbox-btn-prev.gif";
            ButtonNextImage = pluginResourcePath + "/Images/lightbox-btn-next.gif";
            LoadingIcon = pluginResourcePath + "/Images/lightbox-ico-loading.gif";
            ImageBlank = pluginResourcePath + "/Images/lightbox-blank.gif";
        }

        public string ButtonCloseImage { get; set; }

        public string ButtonPreviousImage { get; set; }

        public string ButtonNextImage { get; set; }

        public string LoadingIcon { get; set; }

        public string ImageBlank { get; set; }

        public override string ToString() {
            StringBuilder stringBuilder = new StringBuilder("{");
            stringBuilder.AppendLine(string.Concat("imageBlank : '", ImageBlank, "' ,"));
            stringBuilder.AppendLine(string.Concat("imageBtnClose: '", ButtonCloseImage, "' ,"));
            stringBuilder.AppendLine(string.Concat("imageBtnPrev: '", ButtonPreviousImage, "' ,"));
            stringBuilder.AppendLine(string.Concat("imageBtnNext: '", ButtonNextImage, "' ,"));
            stringBuilder.AppendLine(string.Concat("imageLoading: '", LoadingIcon, "'"));
            stringBuilder.AppendLine("}");


            return stringBuilder.ToString();
        }
    }
}