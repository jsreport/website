using System.Linq;
using System.Web.Mvc;
using FeaturedItemSlider.Models;
using Orchard.ContentManagement;
using Orchard.DisplayManagement;
using Orchard.UI.Admin;

namespace FeaturedItemSlider.Controllers {

    [ValidateInput(false), Admin]
    public class AdminController : Controller {
        private readonly IContentManager _contentManager;

        public AdminController(IContentManager contentManager, IShapeFactory shapeFactory) {
            _contentManager = contentManager;
            Shape = shapeFactory;
        }

        dynamic Shape { get; set; }

        public ActionResult Items(string groupName) {
            var list = Shape.List();

            var featuredItemsQuery = _contentManager.Query<FeaturedItemPart, FeaturedItemPartRecord>("FeaturedItem").OrderBy(fi => fi.SlideOrder);
            if (!string.IsNullOrWhiteSpace(groupName)) {
                featuredItemsQuery.Where(fi => fi.GroupName == groupName);
            }
            var featuredItems = featuredItemsQuery.List();
            list.AddRange(featuredItems.Select(fi => _contentManager.BuildDisplay(fi, "SummaryAdmin")));

            dynamic viewModel = Shape.ViewModel();
            viewModel.ContentItems(list);
            viewModel.NumberOfItems(featuredItems.Count());
            
            return View(viewModel);
        }

        public ActionResult Groups() {
            var list = Shape.List();

            var groups = _contentManager.Query<FeaturedItemGroupPart, FeaturedItemGroupPartRecord>("FeaturedItemGroup").List();
            list.AddRange(groups.Select(g => _contentManager.BuildDisplay(g, "SummaryAdmin")));
            
            dynamic viewModel = Shape.ViewModel();
            viewModel.ContentItems(list);
            viewModel.NumberOfGroups(groups.Count());

            return View(viewModel);
        }
    }
}