using System.Collections.Generic;

namespace FeaturedItemSlider.Models {
    public class FeaturedItemEditViewModel {
        public FeaturedItemPart FeaturedItem { get; set; }
        public List<FeaturedItemGroupPart> Groups { get; set; }
    }
}