using MLCompute;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLConsoletest
{
    class Program
    {
        private static MLtest mt = new MLtest();
        static void Main(string[] args)
        {
            string result = mt.ShowMLResult();
           //string result =CSharpHelper.RunExe(@"F:\developerwang\dotnet\mlTest\mlTest\bin\Debug\mlTest.exe");
            Console.WriteLine(result);
            Console.ReadLine();
        }
    }
}
