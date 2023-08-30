

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web;

namespace iPlant.FMS.WEB
{
    public class GlobalExceptionFilter : IExceptionFilter, IAsyncExceptionFilter
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(GlobalExceptionFilter));
        public void OnException(ExceptionContext context)
        {
            logger.Error(context.Exception);


            var wMessage = context.Exception.GetOriginalException().Message;
            if (string.IsNullOrEmpty(wMessage))
            {
                wMessage = "抱歉，系统错误，请联系管理员！";
            }
            context.Result = new JsonResult(new Dictionary<string, object>{
                { BaseController.RESULT_KEY, RetCode.SERVER_CODE_ERR},
                {
                    BaseController.RESULT_RETURN, new Dictionary<string,object>{
                    { BaseController.RESULT_MSG, wMessage }, 
                    { BaseController.DATA_LIST, null },
                    { BaseController.DATA_INFO, null }
                  } 
                }
            });
            context.ExceptionHandled = true;

        }

        public Task OnExceptionAsync(ExceptionContext context)
        {
            OnException(context);
            return Task.CompletedTask;
        }
    }
}
