using iPlant.Common.Tools; 
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting; 
using System; 

namespace iPlant.FMS.WEB
{
    public class Program
    {
        public static void Main(string[] args)
        { 
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();

                }).UseLog4Net(GlobalConstant.LogRepositoryName);
    }
}
