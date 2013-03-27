using Amba.ImagePowerTools.Services;
using Orchard.Commands;

namespace Amba.ImagePowerTools.Commands
{
    public class Go2SeeCommands : DefaultOrchardCommandHandler
    {
        private readonly IPowerToolsSettingsService _settingsService;
        private readonly IMediaFileSystemService _mediaFileSystemService;
        private readonly IImageResizerService _imageResizerService;

        public Go2SeeCommands(
            IPowerToolsSettingsService settingsService,
            IMediaFileSystemService mediaFileSystemService,
            IImageResizerService imageResizerService)
        {
            _imageResizerService = imageResizerService;
            _mediaFileSystemService = mediaFileSystemService;
            _settingsService = settingsService;
        }

        [CommandHelp("Deletes cache for deleted images")]
        [CommandName("amba.ipt deleteold")]
        public void CacheDeleteOld() 
        {
            _imageResizerService.DeleteExpiredCache();
        }

        [CommandHelp("Deletes all files from cache")]
        [CommandName("amba.ipt clearcache")]
        public void ClearCache()
        {
            _imageResizerService.ClearCache();
        }
    }
}