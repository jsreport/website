using System.Collections.Generic;
using System.Web.Mvc;
using System.Web.Routing;
using Orchard.Mvc.Routes;

namespace FeaturedItemSlider
{
    public class Routes : IRouteProvider
    {

        public void GetRoutes(ICollection<RouteDescriptor> routes)
        {
            foreach (var routeDescriptor in GetRoutes())
                routes.Add(routeDescriptor);
        }

        public IEnumerable<RouteDescriptor> GetRoutes()
        {
            const string areaName = "FeaturedItemSlider";
            var emptyConstraints = new RouteValueDictionary();
            var sliderRouteValueDictionary = new RouteValueDictionary { { "area", areaName } };
            var mvcRouteHandler = new MvcRouteHandler();

            return new[] {
                new RouteDescriptor {
                    Route = new Route(
                        "Admin/FeaturedItems/{groupName}",
                        new RouteValueDictionary {
                            {"area", areaName},
                            {"controller", "Admin"},
                            {"action", "Items"},
                            {"groupName", ""}
                        },
                        emptyConstraints, sliderRouteValueDictionary, mvcRouteHandler)
                },
                new RouteDescriptor {
                    Route = new Route(
                        "Admin/FeaturedItemGroups",
                        new RouteValueDictionary {
                            {"area", areaName},
                            {"controller", "Admin"},
                            {"action", "Groups"}
                        },
                        emptyConstraints, sliderRouteValueDictionary, mvcRouteHandler)
                }
            };
        }
    }
}