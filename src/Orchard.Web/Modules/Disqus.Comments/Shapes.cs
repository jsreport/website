using Orchard.Autoroute.Models;

namespace Disqus.Comments
{
    using System;
    using Models;
    using Orchard;
    using Orchard.ContentManagement;
    //using Orchard.Core.Routable.Models;
    using Orchard.DisplayManagement.Descriptors;

    public class DisqusShapes : IShapeTableProvider
    {
        private readonly IOrchardServices orchardServices;

        public DisqusShapes(IOrchardServices services)
        {
            this.orchardServices = services;
        }

        public void Discover(ShapeTableBuilder builder)
        {
            builder.Describe("Parts_ListOfComments")
                .OnDisplaying(shapeDisplayingContext =>
                {
                    var settings = this.orchardServices.WorkContext.CurrentSite.As<DisqusSettingsPart>();
                    shapeDisplayingContext.Shape.DisqusSettings = settings;
                    shapeDisplayingContext.Shape.DisqusUniqueId = GetUniqueIdentifier(shapeDisplayingContext.Shape.ContentPart.ContentItem);
                    shapeDisplayingContext.ShapeMetadata.Wrappers.Add("CommentsWrapper");
                });

            builder.Describe("Parts_Comments_Count")
                .OnDisplaying(shapeDisplayingContext =>
                {
                    var settings = this.orchardServices.WorkContext.CurrentSite.As<DisqusSettingsPart>();
                    shapeDisplayingContext.Shape.DisqusSettings = settings;
                    shapeDisplayingContext.Shape.DisqusUniqueId = GetUniqueIdentifier(shapeDisplayingContext.Shape.ContentPart.ContentItem);
                    shapeDisplayingContext.ShapeMetadata.Wrappers.Add("CountWrapper");
                });

            builder.Describe("Parts_Blogs_BlogPost_List")
                .OnDisplaying(shapeDisplayingContext =>
                {
                    var settings = this.orchardServices.WorkContext.CurrentSite.As<DisqusSettingsPart>();
                    shapeDisplayingContext.Shape.DisqusSettings = settings;
                    shapeDisplayingContext.ShapeMetadata.Wrappers.Add("ListWrapper");
                });
        }

        public string GetUniqueIdentifier(ContentItem item)
        {
            string slug = null;
            if (item.Has<AutoroutePart>())
            {
                var route = item.Get<AutoroutePart>();
                slug = route.Path;
            }

            return string.Format("{0} {1}", item.Id, slug);
        }
    }
}