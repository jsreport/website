using Orchard.UI.Resources;

namespace Mello.ImageGallery.Utils {
    public class LinkHelper {
        public static LinkEntry BuildStyleLink(string file) {
            return new LinkEntry
                   {
                       Href = file,
                       Rel = "stylesheet",
                       Type = "text/css"
                   };
        }
    }
}