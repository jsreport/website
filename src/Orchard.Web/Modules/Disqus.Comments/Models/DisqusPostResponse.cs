namespace Disqus.Comments.Models
{
    using System.Collections.Generic;

    public class DisqusPostResponse
    {
        public int Code { get; set; }

        public List<DisqusPost> Response { get; set; }
    }
}