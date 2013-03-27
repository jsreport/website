using System;

namespace Amba.ImagePowerTools.Models
{
    public class ImagePowerToolsSettingsRecord
    {
        public virtual int Id { get; set; }
        public virtual int MaxCacheSizeMB { get; set; }
        public virtual int MaxCacheAgeDays { get; set; }
        public virtual bool EnableFrontendResizeAction { get; set; }
        public virtual int MaxImageWidth { get; set; }
        public virtual int MaxImageHeight { get; set; }
        public virtual DateTime? DeleteOldLastJobRun { get; set; }
        public virtual bool EnableContentItemFolderCleanup { get; set; }
    }
}