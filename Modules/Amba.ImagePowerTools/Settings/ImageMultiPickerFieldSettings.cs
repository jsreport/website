using System.Collections.Generic;
using System.ComponentModel;
using Newtonsoft.Json;

namespace Amba.ImagePowerTools.Settings
{

    public class CustomFieldDefinition
    {
        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }
        [JsonProperty(PropertyName = "displayName")]
        public string DisplayName { get; set; }
        [JsonProperty(PropertyName = "type")]
        public string Type { get; set; }
    }

    public class ImageMultiPickerFieldSettings
    {
        public string Hint { get; set; }

        private string _customFields;

        public string CustomFields
        {
            get
            {
                if (string.IsNullOrWhiteSpace(_customFields))
                    _customFields = "[{name:'descr', displayName:'', type:'textarea'}]";
                return _customFields;
            }
            set { _customFields = value; }
        }

        public IEnumerable<CustomFieldDefinition> CustomFieldsList
        {
            get { return JsonConvert.DeserializeObject<List<CustomFieldDefinition>>(CustomFields); }
        }

        private int _previewWidth;

        [DisplayName("Width for image preview")]        
        public int PreviewWidth
        {
            get
            {
                if (_previewWidth < 1)
                    return 100;
                return _previewWidth;
            }
            set
            {
                _previewWidth = value;
            }
        }
    }
}