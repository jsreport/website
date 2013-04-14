using FeaturedItemSlider.Models;
using Orchard.ContentManagement.Handlers;
using Orchard.Data;

namespace FeaturedItemSlider.Handlers {
    public class FeaturedItemSliderWidgetPartHandler : ContentHandler {
        public FeaturedItemSliderWidgetPartHandler(IRepository<FeaturedItemSliderWidgetPartRecord> repository) {
            Filters.Add(StorageFilter.For(repository));
        }
    }
}