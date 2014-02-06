using Orchard.ContentManagement.Records;

namespace FeaturedItemSlider.Models {
    public class FeaturedItemPartRecord : ContentPartRecord {
        public virtual string Headline { get; set; }
        public virtual string SubHeadline { get; set; }
        public virtual string LinkUrl { get; set; }
        public virtual bool SeparateLink { get; set; }
        public virtual string LinkText { get; set; }
        public virtual string GroupName { get; set; }
        public virtual int SlideOrder { get; set; }
    }
}