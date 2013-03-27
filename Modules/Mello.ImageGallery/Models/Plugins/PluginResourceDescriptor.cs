using System.Collections.Generic;
using System.Web;
using Mello.ImageGallery.Utils;
using Orchard.UI.Resources;

namespace Mello.ImageGallery.Models.Plugins {
    public abstract class PluginResourceDescriptor {
        private const string PluginResourceBasePath = "~/Modules/Mello.ImageGallery/Content/Plugins/";

        public string PluginResourcePath {
            get { return VirtualPathUtility.Combine(VirtualPathUtility.ToAbsolute(PluginResourceBasePath), PluginName); }            
        }

        public abstract string PluginName { get; }

        private IList<string> _scripts = new List<string>();

        public IList<string> Scripts {
            get { return _scripts; }
            set { _scripts = value; }
        }

        private IList<LinkEntry> _styles = new List<LinkEntry>();

        public IList<LinkEntry> Styles {
            get { return _styles; }
            set { _styles = value; }
        }

        public void AddScript(string scriptPath) {
            Scripts.Add(JavaScriptHelper.AddScriptTag(string.Concat(PluginResourcePath, "/",  scriptPath)));
        }

        public void AddStyle(string styleSheetPath) {
            Styles.Add(LinkHelper.BuildStyleLink(string.Concat(PluginResourcePath, "/", styleSheetPath)));
        }
    }
}