namespace Disqus.Comments.Handlers
{
    using Models;
    using Orchard.ContentManagement.Handlers;
    using Orchard.Data;

    public class DisqusSettingsPartHandler : ContentHandler
    {
        public DisqusSettingsPartHandler(IRepository<DisqusSettingsRecord> repository)
        {
            Filters.Add(new ActivatingFilter<DisqusSettingsPart>("Site"));
            Filters.Add(StorageFilter.For(repository));
        }
    }
}