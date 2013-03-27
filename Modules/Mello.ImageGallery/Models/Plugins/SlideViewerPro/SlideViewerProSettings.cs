using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace Mello.ImageGallery.Models.Plugins.SlideViewerPro
{
  public class SlideViewerProSettings {
    public override string ToString() {
      StringBuilder stringBuilder = new StringBuilder("{");
      stringBuilder.AppendLine(string.Concat("autoslide : true ,"));
      stringBuilder.AppendLine(string.Concat("typo: true ,"));
      stringBuilder.AppendLine(string.Concat("thumbsPercentReduction: 20 ,"));
      stringBuilder.AppendLine(string.Concat("thumbs: 3 ,"));
      stringBuilder.AppendLine(string.Concat("galBorderWidth: 0 ,"));          
      stringBuilder.AppendLine(string.Concat("buttonsWidth: 40 ,"));        
      stringBuilder.AppendLine(string.Concat("thumbsVis: false "));
      stringBuilder.AppendLine("}");
      

      return stringBuilder.ToString();
    }
  }
}