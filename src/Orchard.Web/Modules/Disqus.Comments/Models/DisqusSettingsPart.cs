namespace Disqus.Comments.Models
{
    using System;
    using Orchard.ContentManagement;

    public class DisqusSettingsPart : ContentPart<DisqusSettingsRecord>
    {
        public string ShortName
        {
            get { return Record.ShortName;  }
            set { Record.ShortName = value;  }
        }

        public string SecretKey
        {
            get { return Record.SecretKey; }
            set { Record.SecretKey = value; }
        }

        public bool SyncComments
        {
            get { return Record.SyncComments;  }
            set { Record.SyncComments = value;  }
        }

        public int SyncInterval
        {
            get { return Record.SyncInterval;  }
            set { Record.SyncInterval = value; }
        }
        
        public DateTime? LastSync
        {
            get { return Record.LastSync;  }
            set { Record.LastSync = value; }
        }
    }
}