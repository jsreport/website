using System.ComponentModel.DataAnnotations;

namespace Mello.ImageGallery.ViewModels {
    public class CreateGalleryViewModel {
        [Required]
        public string GalleryName { get; set; }
    }
}