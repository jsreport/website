namespace Disqus.Comments.Handlers
{
    using Models;
    using Orchard.ContentManagement.Handlers;
    using Orchard.Data;

    public class DisqusPostMappingPartHandler : ContentHandler
    {
        public DisqusPostMappingPartHandler(IRepository<DisqusPostMappingRecord> repository)
        {
            Filters.Add(StorageFilter.For(repository));
        }
    }
}