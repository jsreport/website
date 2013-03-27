using System.Web.Mvc;
using Amba.ImagePowerTools.Services;
using ImageResizer.Configuration;
using Orchard.Mvc.Extensions;
using Orchard.Themes;
using Amba.ImagePowerTools.Extensions;

namespace Amba.ImagePowerTools.Controllers
{
    [HandleError]
    [Themed(false)]
    public class ImageResizerController : Controller
    {
        private readonly IImageResizerService _imageResizerService;
        private readonly IPowerToolsSettingsService _settingsService; 

        public ImageResizerController(
            IImageResizerService imageResizerService,
            IPowerToolsSettingsService settingsService)
        {
            _imageResizerService = imageResizerService;
            _settingsService = settingsService;
        }

        public ActionResult Test()
        {
            return Content(Config.Current.GetDiagnosticsPage());
        }

        public ActionResult ResizedImage(
            string url, 
            string defaultImage = "/modules/Amba.ImagePowerTools/content/image_not_found.jpg")
        {
            if (!_settingsService.Settings.EnableFrontendResizeAction && !User.Identity.IsAuthenticated)
                return HttpNotFound();

            var retValImageUrl = _imageResizerService.ResizeImage(url, Request.Url.Query);
            if (string.IsNullOrWhiteSpace(retValImageUrl))
            {
                retValImageUrl = _imageResizerService.ResizeImage(defaultImage, Request.Url.Query);  
            }
            if (string.IsNullOrWhiteSpace(retValImageUrl))
            {
                return HttpNotFound();
            }
            return this.RedirectLocal(retValImageUrl.ToAbsoluteUrl());
        }
    }
}