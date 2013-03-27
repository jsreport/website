using System.Collections.Generic;
using System.Globalization;
using Orchard.ContentManagement;
using Orchard.ContentManagement.MetaData;
using Orchard.ContentManagement.MetaData.Builders;
using Orchard.ContentManagement.MetaData.Models;
using Orchard.ContentManagement.ViewModels;

namespace Amba.ImagePowerTools.Settings
{
    public class ImageMultiPickerFieldEditorEvents : ContentDefinitionEditorEventsBase
    {
        public override IEnumerable<TemplateViewModel> PartFieldEditor(ContentPartFieldDefinition definition)
        {
            if (definition.FieldDefinition.Name == "ImageMultiPickerField")
            {
                var model = definition.Settings.GetModel<ImageMultiPickerFieldSettings>();
                yield return DefinitionTemplate(model);
            }
        }

        public override IEnumerable<TemplateViewModel> PartFieldEditorUpdate(ContentPartFieldDefinitionBuilder builder,                                                                 IUpdateModel updateModel)
        {
            if (builder.FieldType != "ImageMultiPickerField")
            {
                yield break;
            }

            var model = new ImageMultiPickerFieldSettings();
            if (updateModel.TryUpdateModel(model, "ImageMultiPickerFieldSettings", null, null))
            {
                builder.WithSetting("ImageMultiPickerFieldSettings.Hint", model.Hint);
                builder.WithSetting("ImageMultiPickerFieldSettings.CustomFields", model.CustomFields);
                builder.WithSetting("ImageMultiPickerFieldSettings.PreviewWidth",
                                    model.PreviewWidth.ToString(CultureInfo.InvariantCulture));
            }

            yield return DefinitionTemplate(model);
        }
    }
}