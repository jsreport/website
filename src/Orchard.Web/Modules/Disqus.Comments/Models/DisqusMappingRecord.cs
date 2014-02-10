namespace Disqus.Comments.Models
{
    public class DisqusMappingRecord
    {
        public virtual int Id { get; set; }

        public virtual string ThreadId { get; set; }      

        public virtual int ContentId { get; set; }
    }
}