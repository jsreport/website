using System;
using System.Collections.Generic;

namespace Mello.ImageGallery.Models {
    public class ImageGallery {
        public ImageGallery() {
            Images = new List<ImageGalleryImage>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string MediaPath { get; set; }
        public string User { get; set; }
        public long Size { get; set; }
        public DateTime LastUpdated { get; set; }

        public int ThumbnailHeight { get; set; }
        public int ThumbnailWidth { get; set; }
        public bool KeepAspectRatio { get; set; }

        public IEnumerable<ImageGalleryImage> Images { get; set; }
    }
}