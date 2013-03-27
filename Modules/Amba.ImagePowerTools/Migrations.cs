using System;
using Amba.ImagePowerTools.Models;
using Orchard.Data.Migration;

namespace Amba.ImagePowerTools
{
    public class Migrations : DataMigrationImpl
    {
        public int Create()
        {
            SchemaBuilder.CreateTable(typeof(ImagePowerToolsSettingsRecord).Name,
                table => table
                    .Column<int>("Id", c => c.PrimaryKey().Identity())
                    .Column<int>("MaxCacheSizeMB")
                    .Column<int>("MaxCacheAgeDays")
                    .Column<bool>("EnableFrontendResizeAction")
                    .Column<int>("MaxImageWidth")
                    .Column<int>("MaxImageHeight")
                );
            return 1;
        }

        public int UpdateFrom1()
        {
            SchemaBuilder.AlterTable(typeof(ImagePowerToolsSettingsRecord).Name, 
                table => table
                   .AddColumn<DateTime>("DeleteOldLastJobRun"));
            return 2;
        }

        public int UpdateFrom2()
        {
            SchemaBuilder.AlterTable(typeof(ImagePowerToolsSettingsRecord).Name, 
                table => table
                   .AddColumn<bool>("EnableContentItemFolderCleanup", x => x.WithDefault(true)));
            return 3;
        }
    }
}