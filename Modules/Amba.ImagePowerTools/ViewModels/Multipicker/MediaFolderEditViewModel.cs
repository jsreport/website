using System.Collections.Generic;
using System.Web;
using Amba.ImagePowerTools.ViewModels.Admin;
using Orchard.Media.Models;
using Amba.ImagePowerTools.Extensions;

namespace Amba.ImagePowerTools.ViewModels.Multipicker
{
    public class MediaFolderEditViewModel
    {
        public string SearchFilter { get; set; }
        public string FolderName { get; set; }
        public string MediaPath { get; set; }
        public IEnumerable<MediaFolder> MediaFolders { get; set; }
        public IEnumerable<ImageFileViewModel> MediaFiles { get; set; }
        public string PublicPath { get; set; }

        public IEnumerable<BreadcrumbViewModel> BreadCrumbs { get; set; }

        public string GetPickerUrl(string folderMediaPath)
        {
            var result = string.Format(
                "/Amba.ImagePowerTools/Multipicker/Index".ToAbsoluteUrl() +  "?scope={0}&mediaPath={1}",
                Scope,
                HttpUtility.HtmlEncode(folderMediaPath));
            return result;
        }

        public string Scope { get; set; }

        public bool IsFolderNotExists { get; set; }
    }

    public class ImageFileViewModel
    {
        public MediaFile MediaFile { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public bool IsImage { get; set; }
        public string Extension { get; set; }
    }
}