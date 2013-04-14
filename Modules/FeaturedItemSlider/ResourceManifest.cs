using Orchard.UI.Resources;

namespace FeaturedItemSlider {
    public class ResourceManifest : IResourceManifestProvider {
        public void BuildManifests(ResourceManifestBuilder builder) {
            var manifest = builder.Add();
            manifest.DefineScript("jQuery_Cycle").SetUrl("jquery.cycle.all.js", "jquery.cycle.all.js").SetDependencies("jQuery");
            manifest.DefineScript("Slimbox").SetUrl("slimbox2.js", "slimbox2.js").SetDependencies("jQuery");
            manifest.DefineStyle("Slimbox").SetUrl("slimbox2.css");
            manifest.DefineStyle("FeaturedItems").SetUrl("FeaturedItems.css");
            manifest.DefineStyle("FeaturedItems_Background").SetUrl("FeaturedItems_BackgroundImages.css");
        }
    }
}