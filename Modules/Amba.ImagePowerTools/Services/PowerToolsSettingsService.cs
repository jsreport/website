using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Amba.ImagePowerTools.Models;
using Orchard;
using Orchard.Data;

namespace Amba.ImagePowerTools.Services
{
    public interface IPowerToolsSettingsService : IDependency
    {
        ImagePowerToolsSettingsRecord Settings { get; }
        void SaveSettings();
    }

    public class PowerToolsSettingsService : IPowerToolsSettingsService
    {
        private readonly IRepository<ImagePowerToolsSettingsRecord> _settingsRepo;
        private ImagePowerToolsSettingsRecord _settingsRecordCache;
        private static readonly object _settingsLock = new object();

        public PowerToolsSettingsService(IRepository<ImagePowerToolsSettingsRecord> settingsRepo)
        {
            _settingsRepo = settingsRepo;
        }

        public ImagePowerToolsSettingsRecord Settings
        {
            get
            {
                if (_settingsRecordCache == null)
                {
                    _settingsRecordCache = _settingsRepo.Table.FirstOrDefault();
                    if (_settingsRecordCache == null)
                    {
                        lock (_settingsLock)
                        {
                            if (_settingsRepo.Table.FirstOrDefault() == null)
                            {
                                var settings = GetDefaultSettings();
                                _settingsRepo.Update(settings);
                                _settingsRepo.Create(settings);
                                _settingsRecordCache = _settingsRepo.Table.FirstOrDefault();
                            }
                        }
                    }
                }
                return _settingsRecordCache;
            }    
        }

        public void SaveSettings()
        {
            _settingsRepo.Update(_settingsRecordCache);
        }

        private ImagePowerToolsSettingsRecord GetDefaultSettings()
        {
            var settings = new ImagePowerToolsSettingsRecord
                {
                    EnableFrontendResizeAction = false,
                    MaxCacheAgeDays = 30,
                    MaxCacheSizeMB = 512,
                    MaxImageHeight = 2000,
                    MaxImageWidth = 2000,
                    EnableContentItemFolderCleanup = true
                };
            return settings;
        }
    }
}