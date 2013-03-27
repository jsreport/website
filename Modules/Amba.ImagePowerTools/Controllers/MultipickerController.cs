using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Amba.ImagePowerTools.Services;
using Amba.ImagePowerTools.ViewModels.Admin;
using Amba.ImagePowerTools.ViewModels.Multipicker;
using Orchard;
using Orchard.Localization;
using Orchard.Media;
using Orchard.Media.Models;
using Orchard.Media.Services;
using Orchard.Themes;
using Orchard.UI.Admin;

namespace Amba.ImagePowerTools.Controllers
{
    [Themed(false)]
    [Admin]
    public class MultipickerController : Controller
    {
        private readonly IMediaService _mediaService;
        private readonly IImageResizerService _resizerService;
        private readonly ISwfService _swfService;
        private readonly IMediaFileSystemService _mediaFileSystemService;

        public IOrchardServices Services { get; set; }

        public MultipickerController(
            IMediaFileSystemService mediaFileSystemService,
            IOrchardServices services, 
            ISwfService swfService, 
            IMediaService mediaService, 
            IImageResizerService resizerService)
        {
            Services = services;
            _swfService = swfService;
            _mediaService = mediaService;
            _resizerService = resizerService;
            _mediaFileSystemService = mediaFileSystemService;
            T = NullLocalizer.Instance;
        }

        public Localizer T { get; set; }

        private bool IsFolderExists(string mediaPath)
        {
            if (string.IsNullOrWhiteSpace(mediaPath))
                return true;
            var publicUrl = _mediaService.GetPublicUrl(
                Path.Combine(_mediaFileSystemService.GetMediaFolderRoot(), mediaPath)
                );
             
            var serverPath = Server.MapPath("~" + publicUrl);
            return Directory.Exists(serverPath);
        }

        public ActionResult Search(string mediaPath, string scope, string search)
        {
            if (string.IsNullOrWhiteSpace(mediaPath))
                mediaPath = string.Empty;
            mediaPath = mediaPath.Trim();

            if (!IsFolderExists(mediaPath))
            {
                var emptyModel = new MediaFolderEditViewModel
                    {
                        IsFolderNotExists = true
                    };
                return View("Index", emptyModel);
            }

            var searchFilter = ("*" + search + "*").Replace("**", "*");
            var files = _mediaFileSystemService.FindFiles(mediaPath, searchFilter)
                .Select(x => CreateFileViewModel(x));

            var model = new MediaFolderEditViewModel
            {
                MediaFiles = files,
                MediaFolders = new List<MediaFolder>(),
                MediaPath = mediaPath,
                Scope = scope,
                BreadCrumbs = CreateBreadCrumbs(mediaPath),
                SearchFilter = search
            };
            ViewData["Service"] = _mediaService;

            return View("Index", model);
        }

        const string MediaPathCookieKey = "AmbaImageMuliPicker.MediaPath";

        public ActionResult Index(string mediaPath, string scope)
        {
            if (mediaPath == ":last")
            {
                var httpCookie = Request.Cookies[MediaPathCookieKey];
                if (httpCookie != null)
                {
                    mediaPath = httpCookie.Value;
                    if (!IsFolderExists(mediaPath))
                    {
                        mediaPath = string.Empty;
                    }
                }
                else
                {
                    mediaPath = string.Empty;
                }
            }
            if (string.IsNullOrWhiteSpace(mediaPath))
                mediaPath = string.Empty;
            mediaPath = mediaPath.Trim();

            if (!string.IsNullOrWhiteSpace(mediaPath))
            {
                Response.Cookies.Add(new HttpCookie(MediaPathCookieKey, mediaPath){Expires = DateTime.Now.AddMonths(1)});
            }

            if (!IsFolderExists(mediaPath))
            {
                var emptyModel = new MediaFolderEditViewModel
                    {
                        IsFolderNotExists = true
                    };
                return View(emptyModel);
            }
            var mediaFolders = _mediaService.GetMediaFolders(mediaPath)
                .OrderBy(x => x.Name)
                .ToList();
            var mediaFiles = _mediaService.GetMediaFiles(mediaPath)
                .Where(x => _resizerService.IsImage(x.Name) || _resizerService.IsSupportedNonImage(x.Name))
                .AsParallel()
                .Select(x => CreateFileViewModel(x))
                .OrderBy(x => x.MediaFile.Name)
                .ToList();
            var model = new MediaFolderEditViewModel
                {
                    MediaFiles = mediaFiles, 
                    MediaFolders = mediaFolders, 
                    MediaPath = mediaPath,
                    Scope = scope,
                    BreadCrumbs = CreateBreadCrumbs(mediaPath)
                };
            ViewData["Service"] = _mediaService;
            return View(model);
        }

        private IEnumerable<BreadcrumbViewModel> CreateBreadCrumbs(string mediaPath)
        {
            var paths = mediaPath.Split('/', '\\');
            var result = new List<BreadcrumbViewModel>();
            for (int i = 0; i < paths.Count(); i++)
            {
                string path = "";
                for (int j = 0; j <= i; j++)
                {
                    path += (j != 0 ? "/" : "") + paths[j];
                }
                result.Add(new BreadcrumbViewModel {FolderName = paths[i], MediaPath = path});
            }
            return result;
        }

        private ImageFileViewModel CreateFileViewModel(MediaFile file)
        {
            var result = new ImageFileViewModel
                {
                    MediaFile = file
                };
            var serverPath = Server.MapPath("~/" + file.MediaPath);
            result.IsImage = _resizerService.IsImage(serverPath);
            result.Extension = Path.GetExtension(serverPath);
            if (!string.IsNullOrWhiteSpace(result.Extension))
                result.Extension = result.Extension.Trim('.').ToLower();

            try
            {
                SetFileSizes(serverPath, result);
            }
            catch 
            {
            }
            
            return result;
        }

        private void SetFileSizes(string serverPath, ImageFileViewModel result)
        {
            if (result.IsImage)
            {
                var size = ImageHeader.GetDimensions(serverPath);
                result.Width = size.Width;
                result.Height = size.Height;
            }
            else if (result.Extension == "swf")
            {
                int width, height;
                _swfService.GetSwfFileDimensions(serverPath, out width, out height);
                result.Width = width;
                result.Height = height;
            }
        }

        [HttpPost]
        public JsonResult CreateFolder(string path, string folderName)
        {
            if (!Services.Authorizer.Authorize(Permissions.ManageMedia))
            {
                return Json(new {Success = false, Message = T("Couldn't create media folder").ToString()});
            }

            try
            {
                _mediaService.CreateFolder(HttpUtility.UrlDecode(path), folderName);
                return Json(new {Success = true, Message = ""});
            }
            catch (Exception exception)
            {
                return
                    Json(new {Success = false, Message = T("Creating Folder failed: {0}", exception.Message).ToString()});
            }
        }
    }
}