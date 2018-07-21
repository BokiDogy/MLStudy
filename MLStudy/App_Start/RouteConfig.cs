using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace MLStudy
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                           name: "Default",
                           url: "Home/{controller}/{action}/{id}",
                           defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional },
                           namespaces: new[] { "MLStudy.Controllers" }
                       );

            routes.MapRoute(
                "ArrivalCars",
                "MLStudy/{controller}/{action}/{id}/{*catchall}",
                 new { controller = "Home", action = "Index", id = UrlParameter.Optional },
                 new[] { "MLStudy.Controllers.MLStudyProject" }
            );
        }
    }
}
