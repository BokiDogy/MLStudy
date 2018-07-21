using MLCompute;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MLStudy.Controllers.MLStudyProject
{
    public class TestController : Controller
    {
        private MLtest mt=new MLtest();
        // GET: Test
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult ShowMLResult(string dataPath)
        {
            JsonResult json = Json(mt.ShowMLResult());
            json.JsonRequestBehavior = JsonRequestBehavior.AllowGet;
            return json;
        }
    }
}