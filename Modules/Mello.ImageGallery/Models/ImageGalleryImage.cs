using System;

namespace Mello.ImageGallery.Models {
    public class ImageGalleryImage {
        public string Name { get; set; }

        public string Caption { get; set; }

        public long Size { get; set; }

        public string User { get; set; }

        public DateTime LastUpdated { get; set; }

        public string PublicUrl { get; set; }

        public Thumbnail Thumbnail { get; set; }

        public string Title { get; set; }

        public int Position { get; set; }        
    }
}