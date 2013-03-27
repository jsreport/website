using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Hosting;
using Amba.ImagePowerTools.Models;
using Orchard;
using Orchard.Environment.Configuration;
using Orchard.Logging;
using Orchard.Media.Models;
using Orchard.Media.Services;
using Amba.ImagePowerTools.Extensions;

namespace Amba.ImagePowerTools.Services
{
    public interface IMediaFileSystemService : IDependency
    {
        IEnumerable<MediaFile> FindFiles(string mediaPath, string pattern);
        string GetMediaFolderRoot();
        string GetServerPath(string path);
        bool SaveFile(HttpPostedFileBase file, string folder);
        string GetContentItemUploadFolder(int id, string fieldName);
        void DeleteNotUsedFiles(string folder, IEnumerable<SelectedImage> usedImages);
        IEnumerable<string> GetFolderFiles(string uploadFolder);
    }

    public class MediaFileSystemService : IMediaFileSystemService
    {
        private readonly IMediaService _mediaService;
        private readonly ShellSettings _shellSettings;
        private readonly string _mediaServerPath;
        public ILogger Logger { get; set; }

        public MediaFileSystemService(IMediaService mediaService, ShellSettings shellSettings)
        {
            _mediaService = mediaService;
            _shellSettings = shellSettings;
            var mediaPath = GetServerPath("Media");
            _mediaServerPath = Path.Combine(mediaPath, _shellSettings.Name);
            Logger = NullLogger.Instance;
        }

        public void DeleteNotUsedFiles(string folder, IEnumerable<SelectedImage> usedImages)
        {
            var files = GetFolderFiles(folder);
            foreach (var filePath in files)
            {
                try
                {
                    if (!usedImages.Any(x => x.FilePath == filePath))
                    {
                        var serverPath = GetServerPath(filePath);
                        File.Delete(serverPath);
                    }
                }
                catch(Exception e)
                {
                    Logger.Error("DeleteNotUsedFiles: cannot process file " + filePath, e);
                }
            }
        }

        public string GetServerPath(string path)
        {
            path = path.RegexRemove(@"^~/").TrimStart('/');
            return HostingEnvironment.IsHosted
                                ? HostingEnvironment.MapPath("~/" + path) ?? ""
                                : Path.Combine(AppDomain.CurrentDomain.BaseDirectory, path);
        }

        public string GetMediaFolderRoot()
        {
            return "/Media/" + _shellSettings.Name;
        }

        public bool SaveFile(HttpPostedFileBase file, string folder)
        {
            try
            {
                var fileName = Path.GetFileName(file.FileName);
                var serverFolder = GetServerPath(folder);
                if (!Directory.Exists(serverFolder))
                {
                    Directory.CreateDirectory(serverFolder);
                }
                var path = Path.Combine(serverFolder, fileName);
                file.SaveAs(path);
            }
            catch
            {
                return false;
            }
            return true;
        }

        public string GetContentItemUploadFolder(int id, string fieldName)
        {
            return GetMediaFolderRoot() + Consts.ContentItemUploadFolderPrefix + id + "_" + fieldName;
        }

        public IEnumerable<string> GetFolderFiles(string uploadFolder)
        {
            var serverPath = GetServerPath(uploadFolder);
            if (!Directory.Exists(serverPath))
                return new List<string>();
            var mediaServerLength = GetServerPath("").Length;
            return Directory.GetFiles(serverPath)
                .Select(x => x.Substring(mediaServerLength - 1).Replace('\\', '/'))
                .ToList();
        }

        public IEnumerable<MediaFile> FindFiles(string mediaPath, string pattern)
        {
            var searchFolder = Path.Combine(_mediaServerPath, mediaPath);
            var files = Directory.GetFiles(searchFolder, pattern, SearchOption.AllDirectories)
                .Take(100)
                .AsParallel()
                .Select(x => CreateMediaFile(x))
                .ToList();
            return files;
        }

        

        private MediaFile CreateMediaFile(string serverFilePath)
        {
            var fileInfo = new FileInfo(serverFilePath);
            var relativePath = serverFilePath.Substring(_mediaServerPath.Length).Replace("\\", "/").Trim('/', '\\');
            relativePath = relativePath.Substring(0, relativePath.Length - fileInfo.Name.Length);
            var mediaFile = new MediaFile
            {
                Name = fileInfo.Name,
                Type = fileInfo.Extension,
                FolderName = relativePath,
                Size = fileInfo.Length,
                MediaPath = _mediaService.GetMediaPublicUrl(relativePath, fileInfo.Name)
            };
            return mediaFile;
        }
    }
}