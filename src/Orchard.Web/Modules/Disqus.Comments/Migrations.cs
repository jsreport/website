namespace Disqus.Comments
{
    using System.Data;
    using Models;
    using Orchard.ContentManagement.MetaData;
    using Orchard.Data.Migration;

    public class Migrations : DataMigrationImpl
    {
        public int Create()
        {
            SchemaBuilder.CreateTable(
                "DisqusMappingRecord", 
                table => table.Column("Id", DbType.Int32, column => column.PrimaryKey().Identity())
                              .Column("ThreadId", DbType.String)                              
                              .Column("ContentId", DbType.Int32));

            SchemaBuilder.CreateTable(
                "DisqusPostMappingRecord", 
                table => table.ContentPartRecord()
                              .Column("PostId", DbType.String));

            SchemaBuilder.CreateTable(
                "DisqusSettingsRecord", 
                table => table.ContentPartRecord()
                              .Column("ShortName", DbType.String)
                              .Column("SecretKey", DbType.String)
                              .Column("SyncComments", DbType.Boolean)
                              .Column("SyncInterval", DbType.Int32)
                              .Column("LastSync", DbType.DateTime));

            ContentDefinitionManager.AlterTypeDefinition("Comment", cfg => cfg.WithPart(typeof(DisqusPostMappingPart).Name));         

            return 1;
        }
    }
}