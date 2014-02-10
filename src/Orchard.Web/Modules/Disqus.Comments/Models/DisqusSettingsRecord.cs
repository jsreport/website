namespace Disqus.Comments.Models
{
    using System;
    using Orchard.ContentManagement.Records;

    public class DisqusSettingsRecord : ContentPartRecord
    {
        public virtual string ShortName { get; set; }

        public virtual string SecretKey { get; set; }

        public virtual bool SyncComments { get; set; }

        public virtual int SyncInterval { get; set; }

        public virtual DateTime? LastSync { get; set; }
    }
}