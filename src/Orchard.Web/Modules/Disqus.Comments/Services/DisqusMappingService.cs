//namespace Disqus.Comments.Services
//{
//    using System.Linq;
//    using Models;
//    using Orchard;
//    using Orchard.Comments.Models;
//    using Orchard.Comments.Services;
//    using Orchard.ContentManagement;
//    using Orchard.Core.Routable.Models;
//    using Orchard.Data;

//    public class DisqusMappingService : IDisqusMappingService
//    {
//        private readonly IOrchardServices services;
//        private readonly IRepository<DisqusMappingRecord> threadMappingRepository;
//        private readonly ICommentService commentService;
//        private readonly IRepository<DisqusPostMappingRecord> postMappingRepository;

//        public DisqusMappingService(
//                                    IOrchardServices services,
//                                    ICommentService commentService,
//                                    IRepository<DisqusMappingRecord> threadMappingRepository,
//                                    IRepository<DisqusPostMappingRecord> postMappingRepository)
//        {
//            this.services = services;
//            this.threadMappingRepository = threadMappingRepository;
//            this.postMappingRepository = postMappingRepository;
//            this.commentService = commentService;
//        }

//        public bool MapThreadIdToContentId(string threadId, int contentId, string validSlug)
//        {
//            var success = false;
//            var result = this.threadMappingRepository.Fetch(t => t.ThreadId == threadId);

//            if (result.Count() == 0)
//            {
//                var contentItem = this.services.ContentManager.Get(contentId);
//                if (contentItem != null)
//                {
//                    string slug = null;
//                    if (contentItem.Has(typeof(RoutePart)))
//                    {
//                        var route = contentItem.Get<RoutePart>();
//                        slug = route.Slug;
//                    }

//                    if (slug == validSlug)
//                    {
//                        this.threadMappingRepository.Create(new DisqusMappingRecord { ThreadId = threadId, ContentId = contentId });
//                        this.threadMappingRepository.Flush();
//                        success = true;
//                    }
//                }
//            }
//            else
//            {
//                if (result.FirstOrDefault().ContentId == contentId)
//                    success = true;
//            }

//            return success;
//        }

//        public int GetContentIdForThreadId(string threadId)
//        {
//            var result = this.threadMappingRepository.Fetch(cm => cm.ThreadId == threadId).FirstOrDefault();

//            if (result == null)
//                return -1;
//            else
//                return result.ContentId;
//        }

//        public bool CreateCommentFromPost(int contentId, DisqusPost post)
//        {
//            var posts = this.services.ContentManager.Query<DisqusPostMappingPart, DisqusPostMappingRecord>().Where(p => p.PostId == post.Id);
//            var success = false;

//            if (posts.Count() == 0)
//            {
//                var ctx = new CreateCommentContext()
//                {
//                    Author = post.Author.Name,
//                    CommentText = post.Message,
//                    CommentedOn = contentId,
//                    Email = post.Author.Email,
//                    SiteName = post.Author.Url,
//                };

//                var commentPart = this.commentService.CreateComment(ctx, false);

//                commentPart.Record.CommentDateUtc = post.CreatedAt;
//                commentPart.Record.Status = CommentStatus.Approved;

//                this.postMappingRepository.Create(new DisqusPostMappingRecord { PostId = post.Id, ContentItemRecord = commentPart.ContentItem.Record });
//                success = true;
//            }

//            return success;

//            return true;
//        }
//    }
//}