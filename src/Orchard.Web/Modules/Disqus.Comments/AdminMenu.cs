namespace Disqus.Comments
{
    using Orchard.Comments;
    using Orchard.Localization;
    using Orchard.UI.Navigation;

    public class AdminMenu : INavigationProvider
    {
        public Localizer T { get; set; }

        public string MenuName { get { return "admin"; } }

        public void GetNavigation(NavigationBuilder builder)
        {
            builder.Add(
                this.T("Disqus"), 
                "2.75",
                menu => menu.Add(this.T("Manage"), "0", item => item.Action("Index", "Admin", new { area = "Disqus.Comments" }).Permission(Permissions.ManageComments))
                            .Add(this.T("Settings"), item => item.Action("Settings", "Admin", new { area = "Disqus.Comments" }).Permission(Permissions.ManageComments)));
        }
    }
}
