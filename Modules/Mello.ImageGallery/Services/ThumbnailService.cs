using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using Orchard.FileSystems.Media;
using Orchard.Media.Services;
using Mello.ImageGallery.Models;

namespace Mello.ImageGallery.Services {
    public class ThumbnailService : IThumbnailService {
        private const string ThumbnailFolder = "Thumbnails";

        private readonly ImageFormat _thumbnailImageFormat = ImageFormat.Jpeg;
        private readonly IMediaService _mediaService;
        private readonly IStorageProvider _storageProvider;

        public ThumbnailService(IMediaService mediaService, IStorageProvider storageProvider) {
            _storageProvider = storageProvider;
            _mediaService = mediaService;
        }

        protected string GetThumbnailFolder(string mediaPath) {
            // Creates a thumbnail folder if doesn't exists
            if (!_mediaService.GetMediaFolders(mediaPath).Select(o => o.Name).Contains(ThumbnailFolder)) {
                _mediaService.CreateFolder(mediaPath, ThumbnailFolder);
            }

            return _storageProvider.Combine(mediaPath, ThumbnailFolder);
        }

        /// <summary>
        /// Creates an images thumbnail.
        /// </summary>
        /// <param name="image">The image full path on the media storage.</param>
        /// <param name="thumbnailFolderPath">The media path to thumbnails folder.</param>
        /// <param name="imageName">The image name.</param>
        /// <param name="thumbnailWidth">The thumbnail width in pixels.</param>
        /// <param name="thumbnailHeight">The thumbnail height in pixels.</param>
        /// <param name="keepAspectRatio">Indicates whether to keep the original image aspect ratio</param>
        /// <returns>The thumbnail file media path.</returns>
        protected Thumbnail CreateThumbnail(string image, string thumbnailFolderPath, string imageName, int thumbnailWidth,
                                         int thumbnailHeight, bool keepAspectRatio) {
            if (thumbnailWidth <= 0) {
                throw new ArgumentException("Thumbnail width must be greater than zero", "thumbnailWidth");
            }

            if (thumbnailHeight <= 0) {
                throw new ArgumentException("Thumbnail height must be greater than zero", "thumbnailHeight");
            }

            string thumbnailFilePath = _storageProvider.Combine(thumbnailFolderPath, imageName);

            IStorageFile imageFile = _storageProvider.GetFile(image);
            using (Stream imageStream = imageFile.OpenRead()) {
                using (Image drawingImage = Image.FromStream(imageStream))
                {
                    bool shouldCreateImage = true;

                    // Verify if the image already have a Thumbnail                    
                    var thumbnailName = _mediaService.GetMediaFiles(thumbnailFolderPath)
                                        .Select(o => o.Name).SingleOrDefault(o => o == imageName);

                    if(thumbnailName != null) {
                        // Verify if the existing thumbnail has the correct size
                        IStorageFile thumbnailFile = _storageProvider.GetFile(thumbnailFilePath);
                        using (Stream thumnailFileStream = thumbnailFile.OpenRead()) {
                            using (Image thumbnailImage = Image.FromStream(thumnailFileStream)) {
                                if (ImageHasCorrectThumbnail(drawingImage, thumbnailImage, thumbnailWidth, thumbnailHeight, keepAspectRatio))
                                {
                                    shouldCreateImage = false;
                                    thumbnailWidth = thumbnailImage.Width;
                                    thumbnailHeight = thumbnailImage.Height;
                                }
                            }
                        }
                    }

                    if (shouldCreateImage) {
                        using (Image thumbDrawing = CreateThumbnail(drawingImage, thumbnailWidth, thumbnailHeight,keepAspectRatio)) {
                            if (_storageProvider.ListFiles(thumbnailFolderPath).Select(o => o.GetName()).Contains(imageName)) {
                                _storageProvider.DeleteFile(thumbnailFilePath);
                            }

                            IStorageFile thumbFile = _storageProvider.CreateFile(thumbnailFilePath);
                            using (Stream thumbStream = thumbFile.OpenWrite())
                            {
                                thumbDrawing.Save(thumbStream, _thumbnailImageFormat);
                                thumbnailWidth = thumbDrawing.Width;
                                thumbnailHeight = thumbDrawing.Height;
                            }
                        }
                    }
                }
            }

            string thumbnailPublicUrl = _mediaService.GetPublicUrl(thumbnailFilePath);
            return new Thumbnail {PublicUrl = thumbnailPublicUrl, Width = thumbnailWidth, Height = thumbnailHeight};
        }

        protected Image CreateThumbnail(Image originalImage, int thumbnailWidth, int thumbnailHeight, bool keepAspectRatio) {
            if (thumbnailWidth <= 0) {
                throw new ArgumentException("Thumbnail width must be greater than zero", "thumbnailWidth");
            }

            if (thumbnailHeight <= 0) {
                throw new ArgumentException("Thumbnail height must be greater than zero", "thumbnailHeight");
            }

            int newWidth; int newHeight;
            GetThumbnailSize(originalImage, thumbnailWidth, thumbnailHeight, keepAspectRatio, out newWidth, out newHeight);

            Bitmap newImage = new Bitmap(originalImage, newWidth, newHeight);

            Graphics g = Graphics.FromImage(newImage);
            g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality; 
            g.PixelOffsetMode = System.Drawing.Drawing2D.PixelOffsetMode.HighQuality;
            g.CompositingQuality = System.Drawing.Drawing2D.CompositingQuality.HighQuality;
            g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBilinear;

            g.DrawImage(originalImage, 0, 0, newImage.Width, newImage.Height);

            return newImage;
        }

        protected void GetThumbnailSize(Image originalImage, int thumbnailWidth, int thumbnailHeight, bool keepAspectRatio, out int newWidth, out int newHeight)
        {
            newWidth = thumbnailWidth;
            newHeight = thumbnailHeight;

            if (keepAspectRatio) {
                if (originalImage.Width > originalImage.Height)
                {
                    newWidth = thumbnailWidth;
                    float widthPer = (float)thumbnailWidth / originalImage.Width;
                    newHeight = Convert.ToInt32(originalImage.Height * widthPer);
                }
                else
                {
                    newHeight = thumbnailHeight;
                    float heightPer = (float)thumbnailHeight / originalImage.Height;
                    newWidth = Convert.ToInt32(originalImage.Width * heightPer);
                }
            }
        }

        private bool ImageHasCorrectThumbnail(Image originalImage, Image thumbnailImage, int thumbnailWidth, int thumbnailHeight, bool keepAspectRatio)
        {
          if (thumbnailImage == null)
            return false;
          int newWidth; int newHeight;
          GetThumbnailSize(originalImage, thumbnailWidth, thumbnailHeight, keepAspectRatio, out newWidth, out newHeight);

          return thumbnailImage.Width == newWidth && thumbnailImage.Height == newHeight;
        }

        /// <summary>
        /// Gets a thumbnail for an image.
        /// </summary>
        /// <param name="image">The image full path on the media storage.</param>
        /// <param name="thumbnailWidth">The thumbnail width in pixels.</param>
        /// <param name="thumbnailHeight">The thumbnail height in pixels.</param>
        /// <param name="keepAspectRatio">Indicates whether to keep the original image aspect ratio</param>
        /// <returns>The thumbnail full path on the media storage.</returns>
        public Thumbnail GetThumbnail(string image, int thumbnailWidth, int thumbnailHeight, bool keepAspectRatio) {
            if(image == null)  
              throw new ArgumentNullException("image");

            string imageName = Path.GetFileName(image);
            string mediaPath = image.Substring(0, image.Length - imageName.Length - 1);
            string thumbnailFolderPath = GetThumbnailFolder(mediaPath);

            return CreateThumbnail(image, thumbnailFolderPath, imageName, thumbnailWidth, thumbnailHeight, keepAspectRatio);
        }        
    }
}