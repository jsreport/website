namespace Disqus.Comments
{
    using Orchard.UI.Resources;

    public class ResourceManifest : IResourceManifestProvider
    {
        public void BuildManifests(ResourceManifestBuilder builder)
        {
            var manifest = builder.Add();
            manifest.DefineStyle("DisqusModule").SetUrl("disqus-module.css");
        }
    }
}
