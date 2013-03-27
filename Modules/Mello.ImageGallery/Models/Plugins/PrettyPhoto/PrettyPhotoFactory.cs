
namespace Mello.ImageGallery.Models.Plugins.PrettyPhoto {
    public class PrettyPhotoFactory : PluginFactory {
        public PrettyPhotoFactory() {
            _plugin = new PrettyPhoto(new PrettyPhotoSettings());
            _pluginResourceDescriptor = new PrettyPhotoResourceDescriptor();
        }

        private readonly ImageGalleryPlugin _plugin;

        private readonly PluginResourceDescriptor _pluginResourceDescriptor;

        public override ImageGalleryPlugin Plugin {
            get { return _plugin; }
        }

        public override PluginResourceDescriptor PluginResourceDescriptor {
            get { return _pluginResourceDescriptor; }
        }
    }
}