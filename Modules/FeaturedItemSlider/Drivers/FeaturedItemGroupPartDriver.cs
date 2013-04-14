using System;
using FeaturedItemSlider.Models;
using Orchard.ContentManagement;
using Orchard.ContentManagement.Drivers;
using Orchard.ContentManagement.Handlers;

namespace FeaturedItemSlider.Drivers {
    public class FeaturedItemGroupPartDriver : ContentPartDriver<FeaturedItemGroupPart>{
        private readonly IContentManager _contentManager;

        public FeaturedItemGroupPartDriver(IContentManager contentManager) {
            _contentManager = contentManager;
        }

        protected override DriverResult Display(FeaturedItemGroupPart part, string displayType, dynamic shapeHelper) {
            var numberOfItemsInGroup = _contentManager.Query<FeaturedItemPart, FeaturedItemPartRecord>("FeaturedItem")
                .Where(fi => fi.GroupName == part.Name).Count();

            return ContentShape("Parts_FeaturedItemGroup_SummaryAdmin",
                () => shapeHelper.Parts_FeaturedItemGroup_SummaryAdmin(ContentPart: part, NumberOfItems: numberOfItemsInGroup));
        }

        protected override DriverResult Editor(FeaturedItemGroupPart part, dynamic shapeHelper) {
            return ContentShape("Parts_FeaturedItemGroup_Edit",
                () => shapeHelper.EditorTemplate(TemplateName: "Parts.FeaturedItemGroup.Edit", Model: part));
        }

        protected override DriverResult Editor(FeaturedItemGroupPart part, IUpdateModel updater, dynamic shapeHelper) {
            updater.TryUpdateModel(part, "", null, null);
            return Editor(part, shapeHelper);
        }

        protected override void Importing(FeaturedItemGroupPart part, ImportContentContext context) {
            part.Name = context.Attribute(part.PartDefinition.Name, "Name");
            part.BackgroundColor = context.Attribute(part.PartDefinition.Name, "BackgroundColor");
            part.ForegroundColor = context.Attribute(part.PartDefinition.Name, "ForegroundColor");
            part.TransitionEffect = context.Attribute(part.PartDefinition.Name, "TransitionEffect");
            
            part.IncludeImages = GetBoolValue(part, context, "IncludeImages");
            part.GroupWidth = GetIntegerValue(part, context, "GroupWidth");
            part.GroupHeight = GetIntegerValue(part, context, "GroupHeight");
            part.ImageWidth = GetIntegerValue(part, context, "ImageWidth");
            part.ImageHeight = GetIntegerValue(part, context, "ImageHeight");
            part.SlideSpeed = GetIntegerValue(part, context, "SlideSpeed");
            part.SlidePause = GetIntegerValue(part, context, "SlidePause");
            part.ShowPager = GetBoolValue(part, context, "ShowPager");
            part.ShowSlideNumbers = GetBoolValue(part, context, "ShowSlideNumbers");
        }

        private int GetIntegerValue(FeaturedItemGroupPart part, ImportContentContext context, string attributeName) {
            int attributeNumber = 0;
            string attributeValue = context.Attribute(part.PartDefinition.Name, attributeName);

            if (attributeValue != null) {
                int.TryParse(attributeValue, out attributeNumber);
            }
            return attributeNumber;
        }

        private bool GetBoolValue(FeaturedItemGroupPart part, ImportContentContext context, string attributeName) {
            bool attributeBool = false;
            string attributeValue = context.Attribute(part.PartDefinition.Name, attributeName);

            if (attributeValue != null)
            {
                bool.TryParse(attributeValue, out attributeBool);
            }
            return attributeBool;
        }

        protected override void Exporting(FeaturedItemGroupPart part, ExportContentContext context) {
            context.Element(part.PartDefinition.Name).SetAttributeValue("Name", part.Name);
            context.Element(part.PartDefinition.Name).SetAttributeValue("BackgroundColor", part.BackgroundColor);
            context.Element(part.PartDefinition.Name).SetAttributeValue("ForegroundColor", part.ForegroundColor);
            context.Element(part.PartDefinition.Name).SetAttributeValue("TransitionEffect", part.TransitionEffect);
            context.Element(part.PartDefinition.Name).SetAttributeValue("IncludeImages", part.IncludeImages);
            context.Element(part.PartDefinition.Name).SetAttributeValue("GroupWidth", part.GroupWidth);
            context.Element(part.PartDefinition.Name).SetAttributeValue("GroupHeight", part.GroupHeight);
            context.Element(part.PartDefinition.Name).SetAttributeValue("ImageWidth", part.ImageWidth);
            context.Element(part.PartDefinition.Name).SetAttributeValue("ImageHeight", part.ImageHeight);
            context.Element(part.PartDefinition.Name).SetAttributeValue("SlideSpeed", part.SlideSpeed);
            context.Element(part.PartDefinition.Name).SetAttributeValue("SlidePause", part.SlidePause);
            context.Element(part.PartDefinition.Name).SetAttributeValue("ShowPager", part.ShowPager);
            context.Element(part.PartDefinition.Name).SetAttributeValue("ShowSlideNumbers", part.ShowSlideNumbers);
        }
    }
}