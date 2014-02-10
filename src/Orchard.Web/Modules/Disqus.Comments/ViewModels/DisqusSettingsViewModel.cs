namespace Disqus.Comments.ViewModels
{
    using System.ComponentModel.DataAnnotations;

    public class DisqusSettingsViewModel
    {
        [Display(Name = "Website shortname")]
        public string ShortName { get; set; }

        [Display(Name = "API secret key")]
        public string SecretKey { get; set; }

        [Display(Name = "Synchronize comments")]
        public bool SyncComments { get; set; }

        [Display(Name = "Synchronization interval (mins)")]
        public int SyncInterval { get; set; }
    }
}