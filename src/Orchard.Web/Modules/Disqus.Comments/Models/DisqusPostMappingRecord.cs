namespace Disqus.Comments.Models
{
    using Orchard.ContentManagement.Records;

    public class DisqusPostMappingRecord : ContentPartRecord
    {
        public virtual string PostId { get; set; }
    }
}