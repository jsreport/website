using FeaturedItemSlider.Models;
using Orchard.ContentManagement;
using Orchard.ContentManagement.Handlers;
using Orchard.Data;

namespace FeaturedItemSlider.Handlers {
    public class FeaturedItemPartHandler : ContentHandler {
        public FeaturedItemPartHandler(IRepository<FeaturedItemPartRecord> repository) {
            Filters.Add(StorageFilter.For(repository));
        }

        protected override void GetItemMetadata(GetContentItemMetadataContext context) {
            var featuredItemPart = context.ContentItem.As<FeaturedItemPart>();
            if (featuredItemPart != null) {
                context.Metadata.DisplayText = featuredItemPart.Headline;
            }
        }
    }
}