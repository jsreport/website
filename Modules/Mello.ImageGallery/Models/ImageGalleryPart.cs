using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Mello.ImageGallery.ViewModels;
using Orchard.ContentManagement;

namespace Mello.ImageGallery.Models {
    public class ImageGalleryPart : ContentPart<ImageGalleryRecord> {

        /// <summary>
        /// Indicates if the image gallery should be displayed.
        /// </summary>
        public bool DisplayImageGallery {
            get { return Record.DisplayImageGallery.HasValue ? Record.DisplayImageGallery.Value : true; }
            set { Record.DisplayImageGallery = value; }
        }

        /// <summary>
        /// Image gallery name.
        /// </summary>
        public virtual string ImageGalleryName {
            get { return Record.ImageGalleryName; }
            set { Record.ImageGalleryName = value; }
        }

        /// <summary>
        /// Indicates if there is any image gallery available.
        /// </summary>
        public bool HasAvailableGalleries {
            get { return AvailableGalleries != null && AvailableGalleries.Count() > 0; }
        }

        /// <summary>
        /// The selected gallery to be used.
        /// </summary>
        public string SelectedGallery { get; set; } // used on editor

        /// <summary>
        /// Galleries available to be selected.
        /// </summary>
        public IEnumerable<SelectListItem> AvailableGalleries { get; set; } // used on editor

        /// <summary>
        /// Presentation plugin selected.
        /// </summary>
        public Plugins.Plugin SelectedPlugin {
            get { return (Plugins.Plugin) Record.SelectedPlugin; }
            set { Record.SelectedPlugin = (byte) value; }
        }

        /// <summary>
        /// Presentation plugins available to be selected.
        /// </summary>
        public IEnumerable<SelectListItem> AvailablePlugins { get; set; } // used on editor

        /// <summary>
        /// Image gallery to be displayed.
        /// </summary>
        public virtual ImageGalleryViewModel ViewModel { get; set; } // used on display
    }
}