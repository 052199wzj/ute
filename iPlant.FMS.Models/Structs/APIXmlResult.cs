using iPlant.Common.Tools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace iPlant.FMS.Models
{
    /// <summary>
    /// 用于WEBService 返回
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <typeparam name="T1"></typeparam>
    
    public class APIXmlResult<T, T1> 
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(APIXmlResult<T, T1>));


        private static object mMyLock = new object();

        #region ErrorCode
        /// <summary>
        /// 错误信息类型汇总
        /// </summary>
        private static Dictionary<int, string> mErrorDic = new Dictionary<int, string>();
        #endregion

        #region 初始化
        private static void InitializeErrorMessageList()
        {
            try
            {
                mErrorDic.Add(9999, "服务器繁忙,请稍后再试!");
                mErrorDic.Add(9998, "您还没有登录!");
                mErrorDic.Add(9997, "已有账号登录,请将已登录账号退出或关闭浏览器后再试!");
                mErrorDic.Add(9996, "添加失败!");
                mErrorDic.Add(9995, "配置参数不合法!");
                mErrorDic.Add(9994, "您没有权限!");
                mErrorDic.Add(1001, "请输入账号!");
                mErrorDic.Add(1002, "请输入密码");
                mErrorDic.Add(1003, "当前权限等级不够，无法操作");
                mErrorDic.Add(1004, "密码不合法");
                mErrorDic.Add(1005, "账号或密码错误");
                mErrorDic.Add(1006, "密码修改失败");
                mErrorDic.Add(1007, "无效账号");
                mErrorDic.Add(1008, "账号删除失败");
                mErrorDic.Add(1009, "无法删除登录账号");
                mErrorDic.Add(1010, "账号信息更新失败");
                mErrorDic.Add(2001, "请输入账号");
                mErrorDic.Add(2002, "请输入密码");
                mErrorDic.Add(2003, "请选择管理权限");
                mErrorDic.Add(2004, "账号添加失败");
                mErrorDic.Add(2005, "该账号已经存在");
                mErrorDic.Add(2006, "账号信息更新失败");
                mErrorDic.Add(2007, "账号信息查询失败");
                mErrorDic.Add(4047, "该帐号已在别处登录，3秒后将自动退出");
                mErrorDic.Add(5001, "请输入服务名称");
                mErrorDic.Add(5002, "请输入版本号");
                mErrorDic.Add(5003, "服务删除失败");
                mErrorDic.Add(6001, "请输入IP地址");
                mErrorDic.Add(6002, "请输入密码");
                mErrorDic.Add(6003, "Conserver删除失败");
                mErrorDic.Add(7001, "请给架构起个可爱的名字");
                mErrorDic.Add(7002, "请选择架构类型");
                mErrorDic.Add(7003, "架构删除失败，请重试");
                mErrorDic.Add(7004, "架构启用失败");
                mErrorDic.Add(7005, "架构停用失败");
                mErrorDic.Add(7006, "同时只能启用一个架构，如要启用该架构请先停止其他在用架构");
                mErrorDic.Add(7007, "请先停止再进行删除操作");
                mErrorDic.Add(8008, "请添加服务器");
                mErrorDic.Add(8010, "监控出错");
                mErrorDic.Add(9001, "组删除失败");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
               logger.Error(
                    
                    System.Reflection.MethodBase.GetCurrentMethod().Name ,ex);
            }
        }
        #endregion

        public APIXmlResult()
        {
            ResultCode = 1000;
            ReturnObject = new APIXmlReturnObject<T, T1>();
        }
        public APIXmlResult(APIResult wAPIResult)
        {
            ResultCode = wAPIResult.resultCode;
            ReturnObject = new APIXmlReturnObject<T, T1>();
            ReturnObject.setAPIXmlReturnObject(wAPIResult.returnObject);
        }

        public void setAPIXmlResult(APIResult wAPIResult)
        {
            ResultCode = wAPIResult.resultCode;
            ReturnObject.setAPIXmlReturnObject(wAPIResult.returnObject);
        }

        public void setAPIXmlResult(int wCode,String wMsg)
        {
            ResultCode = wCode;
            ReturnObject.Msg= wMsg;
        }
        public void setAPIXmlResult(int wCode, String wMsg,List<T> wList,T1 wInfo)
        {
            ResultCode = wCode;
            ReturnObject.Msg = wMsg;
            ReturnObject.List = wList;
            ReturnObject.Info = wInfo;
        } 

        
        public int ResultCode { get; set; }
        public APIXmlReturnObject<T, T1> ReturnObject { get; set; }




        public T1 Info()
        {
            try
            {
                return ReturnObject.Info;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
               logger.Error( 
                   System.Reflection.MethodBase.GetCurrentMethod().Name ,ex);
            }

            return default;

        }

        public List<T> List()
        {
            try
            {  
                return ReturnObject.List;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
               logger.Error( 
                   System.Reflection.MethodBase.GetCurrentMethod().Name ,ex);
            }
            return new List<T>();
        }

        public String getMsg()
        {
            try
            { 
                String wMsg = ReturnObject.Msg;

                if (String.IsNullOrWhiteSpace(wMsg))
                {
                    lock (mMyLock)
                    {
                        if (mErrorDic.Count <= 0)
                            InitializeErrorMessageList();
                    }

                    if (mErrorDic.ContainsKey(this.ResultCode))
                    {
                        wMsg = mErrorDic[this.ResultCode];
                    }
                }

                return wMsg;

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
               logger.Error( 
                   System.Reflection.MethodBase.GetCurrentMethod().Name ,ex);
            }
            return "";
        }

        public void setMsg(String wMsg)
        {
            try
            {

                ReturnObject.Msg = wMsg;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
               logger.Error( 
                   System.Reflection.MethodBase.GetCurrentMethod().Name ,ex);
            }
        }
  
        public void CheckMsg()
        {
            if (this.ResultCode != 1000)
            {
                throw new Exception(this.getMsg());
            }
        }
    }


    public class APIXmlResult<T>: APIXmlResult<T,T>
    {

        public APIXmlResult():base()
        {
            
        }
        public APIXmlResult(APIResult wAPIResult) : base(wAPIResult)
        { 
        }

    }

    
    public class APIXmlReturnObject<T,T1>
    {

        
        public String Msg { get; set; }
        
        public List<T> List { get; set; }
        
        public T1 Info { get; set; }

        public APIXmlReturnObject(Dictionary<String, Object> wDictionary)
        { 

            if (wDictionary == null || wDictionary.Count() < 1)
                return;

            if (wDictionary.ContainsKey("msg"))
            {
                this.Msg = StringUtils.parseString(wDictionary["msg"]);
            }
            if (wDictionary.ContainsKey("list"))
            {
                this.List = (List<T>)wDictionary["list"];
            }
            if (wDictionary.ContainsKey("info"))
            {
                this.Info = (T1)wDictionary["info"];
            }
              
        }

        public void  setAPIXmlReturnObject(Dictionary<String, Object> wDictionary)
        {

            if (wDictionary == null || wDictionary.Count() < 1)
                return;

            if (wDictionary.ContainsKey("msg"))
            {
                this.Msg = StringUtils.parseString(wDictionary["msg"]);
            }
            if (wDictionary.ContainsKey("list"))
            {
                this.List = CloneTool.CloneArray<T>( wDictionary["list"]);
            }
            if (wDictionary.ContainsKey("info"))
            {
                this.Info = CloneTool.Clone<T1>(wDictionary["info"]); 
            }

        }


        public APIXmlReturnObject() 
        {
            List = new List<T>();
            Msg = "";
            Info = default;
        }

    }
}
