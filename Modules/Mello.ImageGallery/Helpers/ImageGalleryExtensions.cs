using System.Collections.Generic;
using System.Web;
using System.Web.Mvc;
using Mello.ImageGallery.Models;
using Mello.ImageGallery.Models.Plugins;
using Orchard.Mvc.Html;

namespace Mello.ImageGallery.Helpers {
    public static class ImageGalleryExtensions {
        public static MvcHtmlString ImageGalleryScript(this HtmlHelper helper, string cssSelector, ImageGalleryPlugin imageGalleryPlugin) {
            return MvcHtmlString.Create(imageGalleryPlugin.ToString(cssSelector));
        }

        public static MvcHtmlString ImageGalleryAdditionalAttributes(this HtmlHelper helper, ImageGalleryPlugin imageGalleryPlugin, string imageGalleryName) {
            return MvcHtmlString.Create(imageGalleryPlugin.AdditionalHrefMarkup(imageGalleryName));
        }

        public static HtmlString Image(this HtmlHelper helper, ImageGalleryImage image) {
            if (image == null || image.Thumbnail == null)
                return new HtmlString(string.Empty);

            IDictionary<string, object> attributes = new Dictionary<string, object>();

            if (image.Thumbnail.Width > 0)
                attributes["width"] = image.Thumbnail.Width;
            if (image.Thumbnail.Height > 0)
                attributes["height"] = image.Thumbnail.Height;
            if (!string.IsNullOrWhiteSpace(image.Title))
                attributes["title"] = image.Title;
            
            return helper.Image(image.Thumbnail.PublicUrl, image.Caption, attributes);
        }

        public static HtmlString ImageWithThumbnailSize(this HtmlHelper helper, ImageGalleryImage image) {
            if (image == null || image.Thumbnail == null || image.Thumbnail.Width <= 0 || image.Thumbnail.Height <= 0)
                return new HtmlString(string.Empty);            

            IDictionary<string, object> attributes = new Dictionary<string, object>();
            attributes["width"] = image.Thumbnail.Width;
            attributes["height"] = image.Thumbnail.Height;
            if (!string.IsNullOrWhiteSpace(image.Title))
                attributes["title"] = image.Title;

            return helper.Image(image.PublicUrl, image.Caption, attributes);
        }
    }
}