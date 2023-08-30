using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Encodings.Web;
using System.Text.Unicode;
using iPlant.Common.Tools;
using System.IO;
using Microsoft.Extensions.FileProviders;
using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using iPlant.FMC.Service;

namespace iPlant.FMS.WEB
{

    public class Startup
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger("test");

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvcCore().AddApiExplorer();

            services.AddMvc(options =>
            {
                options.EnableEndpointRouting = false;
                options.Filters.Add<GlobalExceptionFilter>();
                options.Filters.Add<iPlantFilter>();
                options.ModelMetadataDetailsProviders.Add(new ModelBindingMetadataProvider());
            }).AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.PropertyNamingPolicy = null;
                options.JsonSerializerOptions.Encoder = JavaScriptEncoder.Create(UnicodeRanges.All);
                options.JsonSerializerOptions.Converters.Add(new DateTimeConverterUsingDateTimeParse());
                options.JsonSerializerOptions.Converters.Add(new DateTimeConverterUsingDateTimeOffsetParse());

            });
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            services.Configure<KestrelServerOptions>(x => x.AllowSynchronousIO = true)
                .Configure<IISServerOptions>(x => x.AllowSynchronousIO = true);


            services.AddSingleton(HtmlEncoder.Create(UnicodeRanges.All));


            //services.AddDbContext

            services.AddMemoryCache();
            services.AddSession(o =>
            {
                o.IdleTimeout = TimeSpan.FromMinutes(30);
                o.Cookie.HttpOnly = true;
            });
            services.AddHttpContextAccessor();


            // GlobalContext.SystemConfig = Configuration.GetSection("SystemConfig").Get<SystemConfig>();
            GlobalContext.Services = services;


           // services.AddSwaggerGen(c => { c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" }); });

           
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            logger.Debug("Debug_test1");
            logger.Info("Info_test1");
            logger.Error("Error_test1");
            GlobalContext.Configuration = Configuration;

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/api/HomePage/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            //app.UseHttpsRedirection();
            app.UseStaticFiles();

            //È«²¿ÆôÓÃ  UseStaticFiles UseDefaultFiles UseDirectoryBrowser
            app.UseFileServer();

            app.UseRouting();


            app.UseSession();

            app.Use(next => context =>
            {
                context.Request.EnableBuffering();
                return next(context);
            });

            GlobalContext.WebRootPath = env.WebRootPath;
            GlobalContext.ContentRootPath = env.ContentRootPath;

            string resource = Path.Combine(env.ContentRootPath, "Resource");

            if (!Directory.Exists(resource))
            {
                Directory.CreateDirectory(resource);
            }
            app.UseStaticFiles(new StaticFileOptions
            {
                RequestPath = "/Resource",
                FileProvider = new PhysicalFileProvider(resource),
                OnPrepareResponse = GlobalContext.SetCacheControl
            });

            app.UseAuthorization();

            GlobalContext.ServiceProvider = app.ApplicationServices;

            app.UseMvc(routes =>
            {

                routes.MapRoute(
                name: "Default",
                template: "api/{controller=HomePage}/{action=Index}/{id?}");

                 

            }) ;



            DMSServiceImpl.getInstance().SetSqlMode();
            if (GlobalContext.DeviceMonitorEnable == 1)
                Communication.InitHelper.Instance.Init();


            //app.UseEndpoints(endpoints =>
            //{
            //    endpoints.MapControllerRoute(
            //        name: "default",
            //        pattern: "{controller}/{action}/{id?}",
            //        defaults: new { Controller = "HomePage", Action = "Index" });
            //    endpoints.MapControllerRoute(
            //       name: "area",
            //       pattern: "area/api/{controller}/{action}/{id?}",
            //       defaults: new { Controller = "HomePage", Action = "Index", area = "Management" });
            //});

        }
    }
}
