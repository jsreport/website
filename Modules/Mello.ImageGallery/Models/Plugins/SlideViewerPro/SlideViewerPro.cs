using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Mello.ImageGallery.Models.Plugins.SlideViewerPro
{
  public class SlideViewerPro : ImageGalleryPlugin {
      private readonly SlideViewerProSettings _settings;

      public SlideViewerPro(SlideViewerProSettings slideViewerProSettings) {
          _settings = slideViewerProSettings;
      }

      public override string ToString(string cssSelector) {
          return string.Format("$('{0}').slideViewerPro({1});", cssSelector, _settings);
      }

      public override string ImageGalleryTemplateName {
          get { return "Parts/Plugins/SlideViewerPro"; }
      }
  }
}