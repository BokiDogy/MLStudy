using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace MLCompute
{
    public static class CSharpHelper
    {
        //匿名对象操作类中的属性
        private const BindingFlags FieldFlags = BindingFlags.NonPublic | BindingFlags.Instance;
        private const BindingFlags PropFlags = BindingFlags.Public | BindingFlags.Instance;
        private static readonly string[] BackingFieldFormats = { "<{0}>i__Field", "<{0}>" };
        private static ConcurrentDictionary<Type, IDictionary<string, Action<object, object>>> _map =
            new ConcurrentDictionary<Type, IDictionary<string, Action<object, object>>>();







        /// <summary>
        /// 生成随机字符串16位
        /// </summary>
        /// <returns></returns>
        public static string GenerateId()
        {
            long i = 1;
            foreach (byte b in Guid.NewGuid().ToByteArray())
            {
                i *= ((int)b + 1);
            }
            return string.Format("{0:x}", i - DateTime.Now.Ticks);
        }
        /// <summary>
        /// 向匿名对象添加属性
        /// </summary>
        /// <param name="target">目标对象</param>
        /// <param name="temp">添加的属性和值,Dictionary(string, object)类型</param>
        /// <returns></returns>
        public static object AddAttrToAnonymousObject(object target, Dictionary<string, object> temp)
        {
            //dynamic newobj= (System.Dynamic.ExpandoObject) target;
            foreach (KeyValuePair<string, object> item in temp)
            {
                ((IDictionary<string, object>)target).Add(item.Key, item.Value);
            }
            return target;
        }

        /// <summary>
        /// 获取匿名对象属性值
        /// </summary>
        /// <param name="target"></param>
        /// <param name="propertyname"></param>
        /// <returns></returns>
        public static object GetValueFromAnonymousObject(object target, string propertyname)
        {
            return target.GetType().GetProperty(propertyname).GetValue(target);
        }

        /// <summary>
        /// 匿名对象的Set属性方法
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="TProperty"></typeparam>
        /// <param name="instance"></param>
        /// <param name="propExpression"></param>
        /// <param name="newValue"></param>
        /// <returns></returns>
        public static T Set<T, TProperty>(
     this T instance,
     Expression<Func<T, TProperty>> propExpression,
     TProperty newValue) where T : class
        {
            GetSetterFor(propExpression)(instance, newValue);
            return instance;
        }

        private static Action<object, object> GetSetterFor<T, TProperty>(Expression<Func<T, TProperty>> propExpression)
        {
            var memberExpression = propExpression.Body as MemberExpression;
            if (memberExpression == null || memberExpression.Member.MemberType != MemberTypes.Property)
                throw new InvalidOperationException("Only property expressions are supported");
            Action<object, object> setter = null;
            GetPropMap<T>().TryGetValue(memberExpression.Member.Name, out setter);
            if (setter == null)
                throw new InvalidOperationException("No setter found");
            return setter;
        }

        private static IDictionary<string, Action<object, object>> GetPropMap<T>()
        {
            return _map.GetOrAdd(typeof(T), x => BuildPropMap<T>());
        }

        private static IDictionary<string, Action<object, object>> BuildPropMap<T>()
        {
            var typeMap = new Dictionary<string, Action<object, object>>();
            var fields = typeof(T).GetFields(FieldFlags);
            foreach (var pi in typeof(T).GetProperties(PropFlags))
            {
                var backingFieldNames = BackingFieldFormats.Select(x => string.Format(x, pi.Name)).ToList();
                var fi = fields.FirstOrDefault(f => backingFieldNames.Contains(f.Name) && f.FieldType == pi.PropertyType);
                if (fi == null)
                    throw new NotSupportedException(string.Format("No backing field found for property {0}.", pi.Name));
                typeMap.Add(pi.Name, (inst, val) => fi.SetValue(inst, val));
            }
            return typeMap;
        }


        /// <summary>
        /// 向匿名对象添加属性
        /// </summary>
        /// <param name="obj"></param>
        /// <param name="name"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static IDictionary<string, object> AddProperty(this object obj, string name, object value)
        {
            var dictionary = obj.ToDictionary();
            dictionary.Add(name, value);
            return dictionary;
        }

        // helper
        private static IDictionary<string, object> ToDictionary(this object obj)
        {
            IDictionary<string, object> result = new Dictionary<string, object>();
            PropertyDescriptorCollection properties = TypeDescriptor.GetProperties(obj);
            foreach (PropertyDescriptor property in properties)
            {
                result.Add(property.Name, property.GetValue(obj));
            }
            return result;
        }



        public static string RunExe(string exePath)
        {
            System.Diagnostics.Process p = new System.Diagnostics.Process();
            p.StartInfo = new System.Diagnostics.ProcessStartInfo();
            p.StartInfo.FileName = "mlTest.exe";
            p.StartInfo.Arguments = exePath + " " + "run";//"C0解释器.exe"的相对路径  空格分隔各个参数 这里有两个参数。
            p.StartInfo.WindowStyle = System.Diagnostics.ProcessWindowStyle.Hidden;
            p.StartInfo.RedirectStandardOutput = true;
            p.StartInfo.UseShellExecute = false;
            p.StartInfo.CreateNoWindow = true;//让窗体不显示
            p.Start();
            System.IO.StreamReader reader = p.StandardOutput;//截取输出流
            string line = reader.ReadLine();//每次读取一行
            return p.StandardOutput.ReadToEnd();//获得的结果显示在listbox1中
        }

    }
}
