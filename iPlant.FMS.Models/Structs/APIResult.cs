using iPlant.Common.Tools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public class APIResult
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(APIResult));

 

        #region ErrorCode
        /// <summary>
        /// 错误信息类型汇总
        /// </summary>
        private static Dictionary<int, string> mErrorDic = new Dictionary<int, string>();


        static APIResult()
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
        #endregion


        public APIResult()
        {
            resultCode = 1000;
            returnObject = new Dictionary<String, Object>();
        }

        public int resultCode { get; set; }
        public Dictionary<String, Object> returnObject { get; set; }




        public T Info<T>()
        {
            try
            {
                return CloneTool.Clone<T>(new APIReturnObject(returnObject).info);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                logger.Error(
                    System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }

            return default(T);

        }

        public List<T> List<T>()
        {
            try
            {
                APIReturnObject wAPIReturnObject = new APIReturnObject(returnObject);

                return CloneTool.Clone<List<T>>(wAPIReturnObject.list);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                logger.Error(
                    System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return new List<T>();
        }

        public String getMsg()
        {
            try
            {

                APIReturnObject wAPIReturnObject = new APIReturnObject(returnObject);

                String wMsg = wAPIReturnObject.msg;

                if (String.IsNullOrWhiteSpace(wMsg))
                {
                    if (mErrorDic.ContainsKey(this.resultCode))
                    {
                        wMsg = mErrorDic[this.resultCode];
                    }
                }

                return wMsg;

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                logger.Error(
                    System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return "";
        }

        public void setMsg(String wMsg)
        {
            try
            {
                APIReturnObject wAPIReturnObject = new APIReturnObject(returnObject);

                wAPIReturnObject.msg = wMsg;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                logger.Error(
                    System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
        }

        public T Custom<T>(String wKey)
        {
            try
            {
                APIReturnObject wAPIReturnObject = new APIReturnObject(returnObject);

                return CloneTool.Clone<T>(wAPIReturnObject[wKey]);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                logger.Error(
                    System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return default(T);

        }

        public List<T> CustomArray<T>(String wKey)
        {
            try
            {
                APIReturnObject wAPIReturnObject = new APIReturnObject(returnObject);

                return CloneTool.Clone<List<T>>(wAPIReturnObject[wKey]);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                logger.Error(
                    System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return new List<T>();

        }

        public APIReturnObject ReturnObejct()
        {
            return new APIReturnObject(returnObject);
        }

        public void CheckMsg()
        {
            if (this.resultCode != 1000)
            {
                throw new Exception(this.getMsg());
            }
        }
    }


    public class APIReturnObject : Dictionary<String, Object>
    {


        public String msg { get; set; }
        public Object list { get; set; }
        public Object info { get; set; }

        public APIReturnObject(Dictionary<String, Object> wDictionary) : base()
        {
            msg = "";
            list = new List<Object>();
            info = new Object();

            if (wDictionary == null || wDictionary.Count() < 1)
                return;

            if (wDictionary.ContainsKey("msg"))
            {
                this.msg = StringUtils.parseString(wDictionary["msg"]);
            }
            if (wDictionary.ContainsKey("list"))
            {
                this.list = wDictionary["list"];
            }
            if (wDictionary.ContainsKey("info"))
            {
                this.info = wDictionary["info"];
            }
            foreach (string wKey in wDictionary.Keys)
            {
                this[wKey] = wDictionary[wKey];
            }


        }



        public APIReturnObject() : base()
        {
            msg = "";
            list = new List<Object>();
            info = new Object();
        }

    }
}
