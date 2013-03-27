using System;
using System.Collections.Generic;
using System.Drawing.Imaging;
using System.Linq;
using ImageResizer.Configuration;
using ImageResizer.Plugins;
using ImageResizer.Resizing;

namespace Amba.ImagePowerTools.ImageResizerFilters
{
    public class GrayscaleFilter : BuilderExtension, IPlugin, IQuerystringPlugin
    {
        public static string FilterKey = "tograyscale";

        public IPlugin Install(Config c)
        {
            c.Plugins.add_plugin(this);
            return this;
        }

        public bool Uninstall(Config c)
        {
            c.Plugins.remove_plugin(this);
            return true;
        }

        public IEnumerable<string> GetSupportedQuerystringKeys()
        {
            return new [] { FilterKey };
        }

        protected override RequestedAction PostCreateImageAttributes(ImageState s)
        {
            if (s.copyAttibutes == null) 
                return RequestedAction.None;

            if (!s.settings.WasOneSpecified(GetSupportedQuerystringKeys().ToArray())) 
                return RequestedAction.None;

            s.copyAttibutes.SetColorMatrix(new ColorMatrix(Grayscale()));
            return RequestedAction.None;
        }

        static float[][] Grayscale()
        {
            return new[]
                {
                    new float[] {.3f, .3f, .3f, 0, 0},
                    new float[] {.59f, .59f, .59f, 0, 0},
                    new float[] {.11f, .11f, .11f, 0, 0},
                    new float[] {0, 0, 0, 1, 0},
                    new float[] {0, 0, 0, 0, 1}
                };
        }
    }
}