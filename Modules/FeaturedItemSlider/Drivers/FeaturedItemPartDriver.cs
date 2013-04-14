using System.Linq;
using FeaturedItemSlider.Models;
using Orchard.ContentManagement;
using Orchard.ContentManagement.Drivers;
using Orchard.ContentManagement.Handlers;

namespace FeaturedItemSlider.Drivers {
    public class FeaturedItemPartDriver : ContentPartDriver<FeaturedItemPart> {
        private readonly IContentManager _contentManager;

        public FeaturedItemPartDriver(IContentManager contentManager) {
            _contentManager = contentManager;
        }

        protected override DriverResult Display(FeaturedItemPart part, string displayType, dynamic shapeHelper) {
            var group = _contentManager.Query<FeaturedItemGroupPart, FeaturedItemGroupPartRecord>("FeaturedItemGroup")
                .Where(g => g.Name == part.GroupName).List().SingleOrDefault();

            return ContentShape("Parts_FeaturedItem_SummaryAdmin",
                () => shapeHelper.Parts_FeaturedItem_SummaryAdmin(ContentPart: part, ContentItem: part.ContentItem, Group: group));
        }

        protected override DriverResult Editor(FeaturedItemPart part, dynamic shapeHelper) {
            var groups = _contentManager.Query<FeaturedItemGroupPart, FeaturedItemGroupPartRecord>("FeaturedItemGroup").List();

            var viewModel = new FeaturedItemEditViewModel {FeaturedItem = part, Groups = groups.ToList() };
            return ContentShape("Parts_FeaturedItem_Edit",
                () => shapeHelper.EditorTemplate(TemplateName: "Parts.FeaturedItem.Edit", Model: viewModel));
        }

        protected override DriverResult Editor(FeaturedItemPart part, IUpdateModel updater, dynamic shapeHelper) {
            updater.TryUpdateModel(part, "FeaturedItem", null, null);
            return Editor(part, shapeHelper);
        }

        protected override void Importing(FeaturedItemPart part, ImportContentContext context) {
            part.Headline = context.Attribute(part.PartDefinition.Name, "Headline");
            part.SubHeadline = context.Attribute(part.PartDefinition.Name, "SubHeadline");
            part.LinkUrl = context.Attribute(part.PartDefinition.Name, "LinkUrl");
            part.LinkText = context.Attribute(part.PartDefinition.Name, "LinkText");
            part.GroupName = context.Attribute(part.PartDefinition.Name, "GroupName");
            
            string slideOrder = context.Attribute(part.PartDefinition.Name, "SlideOrder");
            int slideOrderNumber;
            if (slideOrder != null && int.TryParse(slideOrder, out slideOrderNumber)) {
                part.SlideOrder = slideOrderNumber;
            }

            string separateLink = context.Attribute(part.PartDefinition.Name, "SeparateLink");
            bool separateLinkValue;
            if (separateLink != null && bool.TryParse(separateLink, out separateLinkValue)) {
                part.SeparateLink = separateLinkValue;
            }
        }

        protected override void Exporting(FeaturedItemPart part, ExportContentContext context) {
            context.Element(part.PartDefinition.Name).SetAttributeValue("Headline", part.Headline);
            context.Element(part.PartDefinition.Name).SetAttributeValue("SubHeadline", part.SubHeadline);
            context.Element(part.PartDefinition.Name).SetAttributeValue("LinkUrl", part.LinkUrl);
            context.Element(part.PartDefinition.Name).SetAttributeValue("SeparateLink", part.SeparateLink);
            context.Element(part.PartDefinition.Name).SetAttributeValue("LinkText", part.LinkText);
            context.Element(part.PartDefinition.Name).SetAttributeValue("GroupName", part.GroupName);
            context.Element(part.PartDefinition.Name).SetAttributeValue("SlideOrder", part.SlideOrder);
        }
    }
}