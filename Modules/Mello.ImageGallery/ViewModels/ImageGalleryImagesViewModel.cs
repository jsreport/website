using System.Collections.Generic;
using Mello.ImageGallery.Models;

namespace Mello.ImageGallery.ViewModels {
    public class ImageGalleryImagesViewModel {
        public IEnumerable<ImageGalleryImage> Images { get; set; }

        public string ImageGalleryName { get; set; }
    }
}