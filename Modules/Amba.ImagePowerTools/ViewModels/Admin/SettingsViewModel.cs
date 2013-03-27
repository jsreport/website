using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using Amba.ImagePowerTools.Models;

namespace Amba.ImagePowerTools.ViewModels.Admin
{
    public class SettingsViewModel
    {
        public SettingsViewModel(){}

        public SettingsViewModel(ImagePowerToolsSettingsRecord settingsRecord)
        {
            EnableFrontendResizeAction = settingsRecord.EnableFrontendResizeAction;
            MaxImageWidth = settingsRecord.MaxImageWidth;
            MaxImageHeight = settingsRecord.MaxImageHeight;
            EnableContentItemFolderCleanup = settingsRecord.EnableContentItemFolderCleanup;
        }

        [Required]
        public bool EnableFrontendResizeAction { get; set; }
        
        [Required]
        [DisplayName("Maximal Image Width")]
        public int MaxImageWidth { get; set; }
        [Required]
        [DisplayName("Maximal Image Height")]
        public int MaxImageHeight { get; set; }

        [Required]
        public bool EnableContentItemFolderCleanup { get; set; }
    }
}