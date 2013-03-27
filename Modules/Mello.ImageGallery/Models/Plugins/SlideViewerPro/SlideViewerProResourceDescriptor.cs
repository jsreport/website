using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Mello.ImageGallery.Models.Plugins.SlideViewerPro
{
  public class SlideViewerProResourceDescriptor : PluginResourceDescriptor
  {
    public SlideViewerProResourceDescriptor() {
      AddScript("Scripts/jquery.timers-1.2.js");
      AddScript("Scripts/jquery.slideViewerPro.1.0.js");      
      AddStyle("Styles/svwp_style.css");
    }

    public override string PluginName {
      get { return "SlideViewerPro"; }
    }
  }
}