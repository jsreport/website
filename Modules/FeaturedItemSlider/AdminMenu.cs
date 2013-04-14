using Orchard.ContentManagement;
using Orchard.Localization;
using Orchard.UI.Navigation;
using FeaturedItemSlider.Models;

namespace FeaturedItemSlider {
    public class AdminMenu : INavigationProvider {
        private readonly IContentManager _contentManager;

        public Localizer T { get; set; }

        public string MenuName { get { return "admin"; } }

        public AdminMenu(IContentManager contentManager) {
            _contentManager = contentManager;
        }

        public void GetNavigation(NavigationBuilder builder) {
            builder.Add(T("Featured Items"), "2.5", BuildMenu);
        }

        private void BuildMenu(NavigationItemBuilder menu) {
            menu.Add(T("New Feature Group"), "1.01",
                     item =>
                     item.Action("Create", "Admin", new { area = "Contents", id = "FeaturedItemGroup" }));

            if (FeaturedItemGroupExists()) {
                menu.Add(T("Manage Feature Groups"), "1.1",
                         item =>
                         item.Action("Groups", "Admin", new { area = "FeaturedItemSlider" }));

                menu.Add(T("New Feature"), "1.2",
                         item =>
                         item.Action("Create", "Admin", new { area = "Contents", id = "FeaturedItem" }));
            }

            if (FeaturedItemExists()) {
                menu.Add(T("Manage Features"), "1.3",
                         item =>
                         item.Action("Items", "Admin", new { area = "FeaturedItemSlider" }));
            }
        }

        private bool FeaturedItemExists() {
            return _contentManager.Query<FeaturedItemPart, FeaturedItemPartRecord>("FeaturedItem").Count() > 0;
        }

        private bool FeaturedItemGroupExists() {
            return _contentManager.Query<FeaturedItemGroupPart, FeaturedItemGroupPartRecord>("FeaturedItemGroup").Count() > 0;
        }
    }
}