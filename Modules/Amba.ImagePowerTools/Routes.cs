using System.Collections.Generic;
using System.Web.Mvc;
using System.Web.Routing;
using Orchard.Mvc.Routes;

namespace Amba.ImagePowerTools
{
    public class Routes : IRouteProvider
    {
        public void GetRoutes(ICollection<RouteDescriptor> routes)
        {
            foreach (var routeDescriptor in GetRoutes())
            {
                routes.Add(routeDescriptor);
            }
        }

        public IEnumerable<RouteDescriptor> GetRoutes()
        {
            var routes = new List<RouteDescriptor>();
            var resizeRoute = new Route(
                "ipt/resize/{*url}",
                new RouteValueDictionary
                    {
                        {"area", "Amba.ImagePowerTools"},
                        {"controller", "ImageResizer"},
                        {"action", "ResizedImage"}
                    },
                new RouteValueDictionary(),
                new RouteValueDictionary {{"area", "Amba.ImagePowerTools"}},
                new MvcRouteHandler());

            routes.Add(new RouteDescriptor
                {
                    Priority = 1,
                    Route = resizeRoute
                });
            routes.Add(new RouteDescriptor
            {
                Priority = 1,
                Route = new Route(
                "ipt/upload",
                new RouteValueDictionary
                    {
                        {"area", "Amba.ImagePowerTools"},
                        {"controller", "Upload"},
                        {"action", "Index"}
                    },
                new RouteValueDictionary(),
                new RouteValueDictionary {{"area", "Amba.ImagePowerTools"}},
                new MvcRouteHandler())
            });
            return routes;
        }
    }
}