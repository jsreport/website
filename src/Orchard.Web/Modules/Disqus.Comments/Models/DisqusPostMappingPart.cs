namespace Disqus.Comments.Models
{
    using Orchard.ContentManagement;

    public class DisqusPostMappingPart : ContentPart<DisqusPostMappingRecord>
    {
        public string PostId
        {
            get { return Record.PostId; }
            set { Record.PostId = value; }
        }
    }
}