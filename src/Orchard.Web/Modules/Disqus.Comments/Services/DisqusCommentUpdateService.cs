//namespace Disqus.Comments.Services
//{
//    using System;
//    using System.Collections.Generic;
//    using System.IO;
//    using System.Linq;
//    using System.Net;
//    using System.Web.Helpers;
//    using Models;
//    using Orchard;
//    using Orchard.Comments.Services;
//    using Orchard.ContentManagement;
//    using Orchard.Logging;

//    public class DisqusCommentUpdateService : IDisqusCommentUpdateService
//    {
//        private const string DisqusListPostsUrl = "http://disqus.com/api/3.0/forums/listPosts.json?forum={0}&order=asc&limit={1}&related=thread&api_secret={2}";

//        private readonly IOrchardServices orchardServices;
//        private readonly IDisqusMappingService commentMappingService;
//        private ICommentService commentService;

//        public DisqusCommentUpdateService(
//                                            IOrchardServices services,
//                                            IDisqusMappingService commentMappingService,
//                                            ICommentService commentService)
//        {
//            this.orchardServices = services;
//            this.commentMappingService = commentMappingService;
//            this.commentService = commentService;
//            this.Logger = NullLogger.Instance;
//        }

//        public ILogger Logger { get; set; }
        
//        public int UpdateCommentsFromDisqus()
//        {
//            var settings = this.orchardServices.WorkContext.CurrentSite.As<DisqusSettingsPart>();

//            var lastsync = settings.LastSync;
//            var postCount = 5;
//            var totalAdded = 0;

//            // loop through until disqus does not return 100 posts
//            while (postCount >= 5)
//            {
//                var posts = this.GetPosts(settings.ShortName, settings.SecretKey, 5, lastsync);
//                postCount = posts.Count();
//                foreach (var post in posts)
//                {
//                    int contentId = -1;
//                    var success = false;

//                    var thread = post.Thread;
//                    foreach (string id in thread.Identifiers)
//                    {
//                        var parts = id.Split(' ');
//                        if (parts.Length == 2 && int.TryParse(parts[0], out contentId))
//                        {
//                            success = this.commentMappingService.MapThreadIdToContentId(thread.Id, contentId, parts[1]);
//                            if (success)
//                                break;
//                        }
//                    }

//                    if (success)
//                    {
//                        if (this.commentMappingService.CreateCommentFromPost(contentId, post))
//                            totalAdded += 1;
//                    }

//                    lastsync = post.CreatedAt;
//                }
//            }

//            settings.LastSync = lastsync;

//            this.Logger.Information(string.Format("Added {0} comments from Disqus.", totalAdded));

//            return totalAdded;
//        }

//        public List<DisqusPost> GetPosts(string shortname, string secretKey, int limit, DateTime? lastsync)
//        {
//            try
//            {
//                var url = string.Format(DisqusListPostsUrl, shortname, limit, secretKey);
//                if (lastsync.HasValue)
//                    url = string.Concat(url, "&since=", lastsync.Value.ToString("s"));

//                var result = GetResponse(url);

//                var postResponse = Json.Decode<DisqusPostResponse>(result);
//                return postResponse.Response;
//            }
//            catch (WebException e)
//            {
//                var response = new StreamReader(e.Response.GetResponseStream());

//                this.Logger.Error("Could not retrieve posts from Disqus.");
//                this.Logger.Error(response.ReadToEnd());

//                throw;
//            }
//        }

//        private static string GetResponse(string url)
//        {
//            var request = WebRequest.Create(url);
//            var response = request.GetResponse();
//            var stream = new StreamReader(response.GetResponseStream());
//            return stream.ReadToEnd();
//        }

//        private static long ToUnixTimestamp(System.DateTime dt)
//        {
//            var unixRef = new DateTime(1970, 1, 1, 0, 0, 0);
//            return (dt.Ticks - unixRef.Ticks) / 10000000;
//        }
//    }
//}