using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Mvc;

namespace MLStudy.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public JsonResult GetAllCtrollerActionNames()
        {
            var allCtrollerActionNames = this.GetAllTypeInfo();
            JsonResult json = Json(allCtrollerActionNames);
            json.JsonRequestBehavior = JsonRequestBehavior.AllowGet;
            return json;
        }

        //1.获取某一个程序集下所有的类<br>　　  
        private List<Type> GetSubClasses<T>()
        {
            return Assembly.GetCallingAssembly().GetTypes().Where(
                type => type.IsSubclassOf(typeof(T))).ToList();
        }
        //2.获取Controller下的action



        private List<MethodInfo> GetSubMethods(Type t)
        {
            return t.GetMethods().Where(m => ((m.ReturnType == typeof(JsonResult)) || (m.ReturnType == typeof(ActionResult))) && (m.IsPublic == true)).ToList();
        }
        //3.遍历得到所有Contrller和Actions

        public Dictionary<string, Dictionary<string, Dictionary<string, List<string>>>> GetAllTypeInfo()
        {
            Dictionary<string, Dictionary<string, Dictionary<string, List<string>>>> result = new Dictionary<string, Dictionary<string, Dictionary<string, List<string>>>>();
            Dictionary<string, List<Type>> allFileFolders = GetSubClasses<Controller>().
                Where(q => q.Namespace.Contains("Project") && (q.Namespace.LastIndexOf(".") != q.Namespace.IndexOf("."))).
                ToList<Type>().
                GroupBy(q => q.Namespace.ToLower().Substring(q.Namespace.LastIndexOf(".") + 1, q.Namespace.LastIndexOf("Project") - (q.Namespace.LastIndexOf(".") + 1))).
                //截取命名空间中“Controllers.”和“Project”这间的字符串，即路由定义的名称
                ToDictionary(q => q.Key, q => q.ToList());
            foreach (var ff in allFileFolders)
            {
                Dictionary<string, Dictionary<string, List<string>>> controllers = new Dictionary<string, Dictionary<string, List<string>>>();
                ff.Value.ForEach(t =>
                {
                    Dictionary<string, List<string>> methods = new Dictionary<string, List<string>>();
                    List<MethodInfo> mfCollection = GetSubMethods(t);
                    mfCollection.ForEach(m =>
                    {
                        List<string> paras = new List<string>();
                        m.GetParameters().ToList().ForEach(p =>
                        {
                            paras.Add(p.Name);
                        });
                        methods.Add(m.Name, paras);
                    });
                    controllers.Add(t.Name.Substring(0, t.Name.IndexOf("Controller")), methods);
                });
                result.Add(ff.Key, controllers);
            }
            return result;
        }
    }
}