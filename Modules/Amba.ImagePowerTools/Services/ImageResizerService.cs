using System;
using System.Linq;
using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using Amba.ImagePowerTools.ImageResizerFilters;
using ImageResizer;
using ImageResizer.Configuration;
using Orchard;
using Amba.ImagePowerTools.Extensions;
using Orchard.Logging;

namespace Amba.ImagePowerTools.Services
{
    public interface IImageResizerService : IDependency
    {
        string GetCleanFileExtension(string url);
        bool IsSupportedNonImage(string fileName);
        bool IsImage(string fileName);

        string ResizeImage(string url, int width = 0, int height = 0, int maxWidth = 0, int maxHeight = 0,
                           int quality = 0, string settings = "");

        string ResizeImage(string url, string settings);
        void ClearCache();
        void CacheStatistics(out long fileCount, out long totalSize);
        void DeleteExpiredCache();
    }

    public class ImageResizerService : IImageResizerService
    {
        public ILogger Logger { get; set; }
        private readonly IPowerToolsSettingsService _settingsService;
        private readonly IMediaFileSystemService _mediaFileSystemService;

        public ImageResizerService(IPowerToolsSettingsService settingsService,
                                   IMediaFileSystemService mediaFileSystemService)
        {
            _mediaFileSystemService = mediaFileSystemService;
            _settingsService = settingsService;
            Logger = NullLogger.Instance;
            EnsureCacheFolder();
        }

        public bool IsSupportedNonImage(string fileName)
        {
            return fileName.IsMatch(@"\.swf$");
        }

        public bool IsImage(string fileName)
        {
            var ext = Path.GetExtension(fileName);
            if (ext != null)
            {
                var extension = ext.Trim('.').ToLower();
                return ImageBuilder.Current.GetSupportedFileExtensions().Any(x => x.ToLower() == extension);
            }
            return false;
        }

        private string CreateMd5Hash(string input)
        {
            MD5 md5 = MD5.Create();
            byte[] inputBytes = Encoding.ASCII.GetBytes(input);
            byte[] hashBytes = md5.ComputeHash(inputBytes);
            var sb = new StringBuilder();
            for (int i = 0; i < hashBytes.Length; i++)
            {
                sb.Append(hashBytes[i].ToString("X2"));
            }
            return sb.ToString();
        }

        public string ResizeImage(
            string url, int width = 0, int height = 0, int maxWidth = 0, int maxHeight = 0,
            int quality = 0,
            string settings = "")
        {
            var resizeSettings = new ResizeSettings(settings);
            if (quality != 0)
                resizeSettings.Quality = quality;
            if (width > 0)
                resizeSettings.Width = width;
            if (height > 0)
                resizeSettings.Height = height;
            if (maxHeight > 0)
                resizeSettings.MaxHeight = maxHeight;
            if (maxWidth > 0)
                resizeSettings.MaxWidth = maxWidth;
            return
                Task.Factory.StartNew(() => GetResizedUrl(url, resizeSettings)).Result;
        }

        public string ResizeImage(string url, string settings)
        {
            return Task.Factory.StartNew(() => GetResizedUrl(url, new ResizeSettings(settings))).Result;
        }

        private bool IsResizeSettingsValid(ResizeSettings settings)
        {
            if (_settingsService == null)
                return true;
            return
                settings.Width < _settingsService.Settings.MaxImageWidth &&
                settings.MaxWidth < _settingsService.Settings.MaxImageWidth &&
                settings.Height < _settingsService.Settings.MaxImageHeight &&
                settings.MaxHeight < _settingsService.Settings.MaxImageHeight;
        }

        private string GetResizedUrl(string url, ResizeSettings settings)
        {
            try
            {
                if (settings.WasOneSpecified(GrayscaleFilter.FilterKey))
                {
                    Config.Current.Plugins.GetOrInstall<GrayscaleFilter>();
                }

                if (!url.StartsWith("/"))
                {
                    url = "/" + url;
                }

                if (!IsResizeSettingsValid(settings))
                {
                    return "";
                }

                var imageServerPath = _mediaFileSystemService.GetServerPath(url);
                if (!File.Exists(imageServerPath))
                {
                    return "";
                }

                imageServerPath = FilterUnsupportedFiles(imageServerPath);
                if (string.IsNullOrWhiteSpace(imageServerPath))
                    return "";

                var cachedImagePath = GetImageCachePath(url, settings);
                string cachedImageServerPath = _mediaFileSystemService.GetServerPath(cachedImagePath);

                if (!File.Exists(cachedImageServerPath))
                {
                    WriteResizedImage(cachedImageServerPath, imageServerPath, settings);
                }
                else
                {
                    var cacheFileInfo = new FileInfo(cachedImageServerPath);
                    var imageFileInfo = new FileInfo(imageServerPath);
                    if (cacheFileInfo.LastWriteTimeUtc < imageFileInfo.LastWriteTimeUtc)
                    {
                        WriteResizedImage(cachedImageServerPath, imageServerPath, settings);
                    }
                }
                return cachedImagePath;
            }
            catch
            {
                return string.Empty;
            }
        }

        private string FilterUnsupportedFiles(string imageServerPath)
        {
            string ext = GetCleanFileExtension(imageServerPath);
            if (!ImageBuilder.Current.GetSupportedFileExtensions().Contains(ext))
            {
                var alternativeUrl = _mediaFileSystemService.GetServerPath(Consts.ModuleContentFolder + ext + ".png");
                if (File.Exists(alternativeUrl))
                {
                    imageServerPath = alternativeUrl;
                }
                else
                {
                    return _mediaFileSystemService.GetServerPath(Consts.ModuleContentFolder + "file.png");
                }
            }
            return imageServerPath;
        }

        private static void WriteResizedImage(string cachedImageServerPath, string imageServerPath,
                                              ResizeSettings settings)
        {
            for (int i = 0; i < 10; i++)
            {
                try
                {
                    WriteResizedFile(cachedImageServerPath, imageServerPath, settings);
                    break;
                }
                catch
                {
                    Thread.Sleep(100);
                }
            }
        }

        private static void WriteResizedFile(string cachedImageServerPath, string imageServerPath,
                                             ResizeSettings settings)
        {
            string cachedImageDir = Path.GetDirectoryName(cachedImageServerPath);
            if (!string.IsNullOrWhiteSpace(cachedImageDir) && !Directory.Exists(cachedImageServerPath))
            {
                Directory.CreateDirectory(cachedImageDir);
            }
            ImageBuilder.Current.Build(imageServerPath, cachedImageServerPath, settings);
        }

        public string GetImageCachePath(string url, ResizeSettings settings)
        {
            string imageDir = Path.GetDirectoryName(url);
            if (imageDir == null)
            {
                imageDir = string.Empty;
            }
            string hasedProperties = CreateMd5Hash(settings.ToString());
            string cachedFileName = string.Format("{0}/{1}-{2}.{3}",
                                                  GetFolderHash(imageDir),
                                                  Path.GetFileNameWithoutExtension(url),
                                                  hasedProperties,
                                                  GetCleanFileExtension(url));
            string cachedImagePath = string.Concat(Consts.CacheFolderPath, "/", cachedFileName.TrimStart('/', '\\'));
            return cachedImagePath;
        }

        private string GetFolderHash(string imageDir)
        {
            return imageDir
                .Trim('/', '\\', ' ')
                .Replace('\\', '/')
                .RegexRemove("^Media");
        }

        public string GetCleanFileExtension(string url)
        {
            var extension = Path.GetExtension(url);
            if (extension != null)
            {
                return extension.Replace(".", "").ToLower();
            }
            return string.Empty;
        }

        public void DeleteExpiredCache()
        {
            var mediaFolder = _mediaFileSystemService.GetServerPath("/Media");
            var cacheFolder = _mediaFileSystemService.GetServerPath(Consts.CacheFolderPath);
            var cacheMediaFolders = Directory
                .GetDirectories(cacheFolder, "*", SearchOption.AllDirectories)
                .OrderBy(x => x.Length);

            var fileNameRegex = new Regex(@"^(.+)-[^-]+\.(\w+)$", RegexOptions.Compiled);
            foreach (var cacheMediaFolder in cacheMediaFolders)
            {
                if (cacheMediaFolder.Length < cacheFolder.Length)
                    continue;
                var relativePath = cacheMediaFolder
                    .Substring(cacheFolder.Length)
                    .Trim('/', '\\');
                var mediaPath = Path.Combine(mediaFolder, relativePath);
                if (!Directory.Exists(mediaPath))
                {
                    try
                    {
                        Directory.Delete(cacheMediaFolder, true);
                    }
                    catch (Exception e)
                    {
                        Logger.Error(e, "Cannot delete folder " + cacheMediaFolder);
                    }
                }
                else
                {
                    var mediaFiles = new HashSet<string>(
                        Directory.GetFiles(mediaPath)
                                 .Select(x => x.ToLower())
                                 .Distinct()
                                 .ToList());
                    var cachedFiles = Directory.GetFiles(cacheMediaFolder).Select(x => x.ToLower()).ToList();
                    foreach (var cachedFilePath in cachedFiles)
                    {
                        var cachedfileName = Path.GetFileName(cachedFilePath);
                        if (string.IsNullOrWhiteSpace(cachedfileName))
                            continue;
                        var fileNameMatch = fileNameRegex.Match(cachedfileName);
                        if (!fileNameMatch.Success)
                            continue;
                        var fileToCheck = fileNameMatch.Groups[1].Value + "." + fileNameMatch.Groups[2].Value;
                        fileToCheck = Path.Combine(mediaPath, fileToCheck).ToLower();
                        if (!mediaFiles.Contains(fileToCheck))
                        {
                            try
                            {
                                File.Delete(cachedFilePath);
                            }
                            catch (Exception e)
                            {
                                Logger.Error(e, e.Message + " Cannot delete file " + cachedFilePath);
                            }
                        }
                    }
                }
            }
        }

        public void ClearCache()
        {
            var cacheDir = new DirectoryInfo(_mediaFileSystemService.GetServerPath(Consts.CacheFolderPath));
            foreach (var file in cacheDir.GetFiles())
            {
                file.Delete();
            }
            foreach (var dir in cacheDir.GetDirectories())
            {
                dir.Delete(true);
            }
        }


        private void EnsureCacheFolder()
        {
            var serverPath = _mediaFileSystemService.GetServerPath(Consts.CacheFolderPath);
            if (!Directory.Exists(serverPath))
            {
                Directory.CreateDirectory(serverPath);
            }
        }

        public void CacheStatistics(out long fileCount, out long totalSize)
        {
            var serverPath = _mediaFileSystemService.GetServerPath(Consts.CacheFolderPath);
            var cacheDir = new DirectoryInfo(serverPath);
            var allFiles = cacheDir.GetFiles("*.*", SearchOption.AllDirectories);
            fileCount = allFiles.Count();
            if (fileCount == 0)
                totalSize = 0;
            else
                totalSize = allFiles.Sum(x => x.Length);
        }
    }
}