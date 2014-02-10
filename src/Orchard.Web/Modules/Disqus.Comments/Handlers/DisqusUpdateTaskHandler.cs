//namespace Disqus.Comments.Handlers
//{
//    using System;
//    using System.Linq;
//    using Models;
//    using Orchard;
//    using Orchard.ContentManagement;
//    using Orchard.Logging;
//    using Orchard.Tasks.Scheduling;
//    using Services;

//    public class DisqusUpdateTaskHandler : IScheduledTaskHandler
//    {
//        private const string TaskType = "DisqusUpdate";
//        private readonly IScheduledTaskManager taskManager;
//        private readonly IDisqusCommentUpdateService updateService;
//        private readonly IOrchardServices orchardServices;

//        public DisqusUpdateTaskHandler(
//                                        IOrchardServices orchardServices,
//                                        IScheduledTaskManager taskManager,
//                                        IDisqusCommentUpdateService updateService)
//        {
//            this.Logger = NullLogger.Instance;
//            this.taskManager = taskManager;
//            this.updateService = updateService;
//            this.orchardServices = orchardServices;

//            try
//            {
//                var settings = this.orchardServices.WorkContext.CurrentSite.As<DisqusSettingsPart>();
//                if (settings.SyncComments)
//                    this.ScheduleNextTask(settings.SyncInterval);
//            }
//            catch (Exception e)
//            {
//                this.Logger.Error(e, e.Message);
//            }
//        }

//        public ILogger Logger { get; set; }

//        public void Process(ScheduledTaskContext context)
//        {
//            var settings = this.orchardServices.WorkContext.CurrentSite.As<DisqusSettingsPart>();

//            if (!settings.SyncComments)
//                return;

//            if (context.Task.TaskType == TaskType)
//            {
//                try
//                {
//                    this.updateService.UpdateCommentsFromDisqus();
//                }
//                catch (Exception e)
//                {
//                    this.Logger.Error(e, e.Message);
//                }

//                this.ScheduleNextTask(settings.SyncInterval);
//            }
//        }

//        private void ScheduleNextTask(int interval)
//        {
//            if (interval > 0)
//            {
//                var tasks = this.taskManager.GetTasks(TaskType);
//                if (tasks == null || tasks.Count() == 0)
//                    this.taskManager.CreateTask(TaskType, DateTime.UtcNow.AddMinutes(interval), null);
//            }
//        }
//    }
//}