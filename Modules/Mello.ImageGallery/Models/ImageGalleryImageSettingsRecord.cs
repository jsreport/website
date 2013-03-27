namespace Mello.ImageGallery.Models {
    public class ImageGalleryImageSettingsRecord {
        public virtual int Id { get; set; }

        public virtual string Name { get; set; }

        public virtual string Caption { get; set; }

        public virtual string Title { get; set; }

        public virtual int Position { get; set; }
    }
}