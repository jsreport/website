using Orchard;
using Orchard.ContentManagement;
using Orchard.ContentManagement.Drivers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Amba.ImagePowerTools.Drivers
{
    public abstract class FieldDriverBase<TContentField> : ContentFieldDriver<TContentField>
        where TContentField : ContentField, new()
    {
        public IOrchardServices Services { get; set; }

        protected static string GetPrefix(ContentField field, ContentPart part)
        {
            return part.PartDefinition.Name + "." + field.Name;
        }

        protected string GetDifferentiator(TContentField field, ContentPart part)
        {
            return field.Name;
        }

        /*
        protected override string Prefix
        {
            get { return this.GetType().Name; }
        }
         */
    }
}