using System;
using System.Reflection;
using System.Text;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Http;
using iPlant.Common.Tools;

namespace iPlant.FMS.WEB
{
    public class GlobalContext
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(GlobalContext));


        public static String ContentRootPath = "";

        public static String WebRootPath = "";

        public static int DeviceMonitorEnable
        { 
            get
            {
                return StringUtils.parseInt(GlobalConstant.GlobalConfiguration.GetValue("Service.Monitor"));
            }
        }
        public static int ProcessRecordType
        {
            get
            {
                return StringUtils.parseInt(GlobalConstant.GlobalConfiguration.GetValue("Service.ProcessRecordType"));
            }
        }
        /// <summary>
        /// All registered service and class instance container. Which are used for dependency injection.
        /// </summary>
        public static IServiceCollection Services { get; set; }

        /// <summary>
        /// Configured service provider.
        /// </summary>
        public static IServiceProvider ServiceProvider { get; set; }


        private static IConfiguration _Configuration;

        public static IConfiguration Configuration
        {
            get { return _Configuration; }
            set
            {
                _Configuration = value;

                GlobalConstant.GlobalConfiguration = _Configuration;
            }
        }

        public static IWebHostEnvironment HostingEnvironment { get; set; }


        public static string GetVersion()
        {
            Version version = Assembly.GetEntryAssembly().GetName().Version;
            return version.Major + "." + version.Minor;
        }

        /// <summary>
        /// 程序启动时，记录目录
        /// </summary>
        /// <param name="env"></param>
        public static void LogWhenStart(IWebHostEnvironment env)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("程序启动");
            sb.Append(" |ContentRootPath:" + env.ContentRootPath);
            sb.Append(" |WebRootPath:" + env.WebRootPath);
            sb.Append(" |IsDevelopment:" + env.IsDevelopment());
            logger.Debug(sb.ToString());
        }

        /// <summary>
        /// 设置cache control
        /// </summary>
        /// <param name="context"></param>
        public static void SetCacheControl(StaticFileResponseContext context)
        {
            int second = 365 * 24 * 60 * 60;
            context.Context.Response.Headers.Add("Cache-Control", new[] { "public,max-age=" + second });
            context.Context.Response.Headers.Add("Expires", new[] { DateTime.UtcNow.AddYears(1).ToString("R") }); // Format RFC1123
        }
    }
}
