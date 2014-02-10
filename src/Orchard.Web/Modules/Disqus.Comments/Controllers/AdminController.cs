namespace Disqus.Comments.Controllers
{
    using System;
    using System.Linq;
    using System.Web.Mvc;
    using Models;
    using Orchard;
    using Orchard.ContentManagement;
    using Orchard.Localization;
    using Orchard.Mvc.Extensions;
    using Orchard.Mvc.Html;
    using Orchard.UI.Notify;
    //using Services;
    using ViewModels;

    public class AdminController : Controller
    {
       // private readonly IDisqusCommentUpdateService commentUpdateService;
        private readonly IOrchardServices services;
        
        public AdminController(
                               IOrchardServices services/*,
                               IDisqusCommentUpdateService commentUpdateService*/)
        {
            this.services = services;
            //this.commentUpdateService = commentUpdateService;
            this.T = NullLocalizer.Instance;
        }

        public Localizer T { get; set; }

        public ActionResult Index()
        {
            var settings = this.services.WorkContext.CurrentSite.As<DisqusSettingsPart>();

            var viewModel = new DisqusSettingsViewModel
            {
                ShortName = settings.ShortName,
                SecretKey = settings.SecretKey,
                SyncComments = settings.SyncComments,
                SyncInterval = settings.SyncInterval
            };

            return View(viewModel);
        }

        public ActionResult Settings()
        {
            var settings = this.services.WorkContext.CurrentSite.As<DisqusSettingsPart>();

            var viewModel = new DisqusSettingsViewModel
            {
                ShortName = settings.ShortName,
                SecretKey = settings.SecretKey,
                SyncComments = settings.SyncComments,
                SyncInterval = settings.SyncInterval
            };

            return View(viewModel);
        }

        public ActionResult SaveSettings(string returnUrl)
        {
            var viewModel = new DisqusSettingsViewModel();
            TryUpdateModel(viewModel);

            if (ModelState.IsValid)
            {
                var settings = this.services.WorkContext.CurrentSite.As<DisqusSettingsPart>();

                settings.ShortName = viewModel.ShortName;
                settings.SecretKey = viewModel.SecretKey;
                settings.SyncComments = viewModel.SyncComments;
                settings.SyncInterval = viewModel.SyncInterval;

                this.services.Notifier.Information(this.T("Disqus settings saved"));
            }
            else
            {
                foreach (var error in ModelState.Values.SelectMany(m => m.Errors).Select(e => e.ErrorMessage))
                {
                    this.services.Notifier.Error(this.T(error));
                }
            }

            return this.RedirectLocal(returnUrl, "~/");
        }

        //public ActionResult SyncDisqus(string returnUrl)
        //{
        //    try
        //    {
        //        var totalAdded = this.commentUpdateService.UpdateCommentsFromDisqus();
        //        this.services.Notifier.Information(this.T.Plural("1 Disqus comment synchronized.", "{0} Disqus comments synchronized.", totalAdded));
        //    }
        //    catch (Exception)
        //    {
        //        this.services.Notifier.Error(this.T("Error synchronizing comments from Disqus."));
        //    }

        //    return this.RedirectLocal(returnUrl, "~/");
        //}    
    }
}