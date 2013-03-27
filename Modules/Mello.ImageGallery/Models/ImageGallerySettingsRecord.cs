using System.Collections.Generic;

namespace Mello.ImageGallery.Models {
    public class ImageGallerySettingsRecord {
        public virtual int Id { get; set; }

        public virtual string ImageGalleryName { get; set; }

        public virtual int ThumbnailWidth { get; set; }

        public virtual int ThumbnailHeight { get; set; }

        public virtual bool KeepAspectRatio { get; set; }

        public virtual IList<ImageGalleryImageSettingsRecord> ImageSettings { get; set; }
    }
}