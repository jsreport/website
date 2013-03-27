using System.Collections.Generic;
using System.Web;

namespace Mello.ImageGallery.ViewModels {
    public class ImageAddViewModel {
        public string ImageGalleryName { get; set; }

        public IEnumerable<HttpPostedFileBase> ImageFiles { get; set; }

        public IEnumerable<string> AllowedFiles { get; set; }
    }
}