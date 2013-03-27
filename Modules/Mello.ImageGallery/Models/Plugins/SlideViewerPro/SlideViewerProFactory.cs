using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Mello.ImageGallery.Models.Plugins.SlideViewerPro
{
  public class SlideViewerProFactory : PluginFactory {
    public override ImageGalleryPlugin Plugin {
      get { return new SlideViewerPro(new SlideViewerProSettings()); }
    }

    public override PluginResourceDescriptor PluginResourceDescriptor {
      get { return new SlideViewerProResourceDescriptor(); }
    }
  }
}