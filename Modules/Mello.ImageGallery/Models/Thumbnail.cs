using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Mello.ImageGallery.Models
{
    public class Thumbnail {
        public string PublicUrl { get; set; }

        public int Width { get; set; }

        public int Height { get; set; }
    }
}