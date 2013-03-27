using System;
using Amba.ImagePowerTools.Services;
using Orchard.Logging;
using Orchard.Tasks;

namespace Amba.ImagePowerTools.Tasks
{
    public class CacheCleanupTask : IBackgroundTask
    {
        private static bool _wasStarted = false;
        private static readonly object _syncRoot = new object();
        private static DateTime _lastRun = new DateTime(2010, 10, 10);

        private const int CleanPeriodInMinutes = 30;
        private readonly IPowerToolsSettingsService _settingsService;
        private readonly IImageResizerService _imageResizerService;

        public ILogger Logger { get; set; }

        public CacheCleanupTask(IPowerToolsSettingsService settingsService, IImageResizerService imageResizerService)
        {
            Logger = NullLogger.Instance;
            _settingsService = settingsService;
            _imageResizerService = imageResizerService;
        }

        public void Sweep()
        {
            if (_wasStarted)
                return; 
            lock (_syncRoot)
            {
                if (_lastRun > DateTime.Now.AddMinutes(CleanPeriodInMinutes * -1))
                {
                    return;
                }
                _wasStarted = true;
                try
                {
                    _imageResizerService.DeleteExpiredCache();
                    _lastRun = DateTime.Now;
                    _settingsService.Settings.DeleteOldLastJobRun = _lastRun;
                    _settingsService.SaveSettings();
                }
                catch(Exception e)
                {
                     Logger.Error(e, "Amba.ImagePowerTools Cache cleanup task failed");   
                }
                finally
                {
                    _wasStarted = false;
                }
            }
        }
    }
}