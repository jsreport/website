using System.Text;

namespace Mello.ImageGallery.Models.Plugins.PrettyPhoto {
    public class PrettyPhotoSettings {
        public override string ToString() {
            StringBuilder stringBuilder = new StringBuilder("{");
            stringBuilder.AppendLine(string.Concat("slideshow: ", "false", " ,"));
            stringBuilder.Append(string.Concat("autoplay_slideshow: ", "false", ""));
            stringBuilder.Append("}");

            return stringBuilder.ToString();
        }
    }
}