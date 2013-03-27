namespace Amba.ImagePowerTools.Services
{
    /// <summary>
    /// http://imageresizing.net/
    /// Makes sure we don't have to reference the resizing library in the views when using the html helper
    /// </summary>
    public class ResizeSettingType
    {
        public enum StretchMode
        {
            // Summary:
            //     Maintains aspect ratio. Default.
            Proportionally = 0,
            //
            // Summary:
            //     Skews image to fit the new aspect ratio defined by 'width' and 'height'
            Fill = 1,
        }

        public enum ScaleMode
        {
            // Summary:
            //     The default. Only downsamples images - never enlarges. If an image is smaller
            //     than 'width' and 'height', the image coordinates are used instead.
            DownscaleOnly = 0,
            //
            // Summary:
            //     Only upscales (zooms) images - never downsamples except to meet web.config
            //     restrictions. If an image is larger than 'width' and 'height', the image
            //     coordinates are used instead.
            UpscaleOnly = 1,
            //
            // Summary:
            //     Upscales and downscales images according to 'width' and 'height', within
            //     web.config restrictions.
            Both = 2,
            //
            // Summary:
            //     When the image is smaller than the requested size, padding is added instead
            //     of stretching the image
            UpscaleCanvas = 3,
        }

        public enum CropMode
        {
            // Summary:
            //     Default. No cropping - uses letterboxing if strecth=proportionally and both
            //     width and height are specified.
            None = 0,
            //
            // Summary:
            //     Minimally crops to preserve aspect ratio if stretch=proportionally.
            Auto = 1,
            //
            // Summary:
            //     Crops using the custom crop rectangle. Letterboxes if stretch=proportionally
            //     and both widht and height are specified.
            Custom = 2,
        }
    }
}