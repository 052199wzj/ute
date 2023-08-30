using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace iPlant.Common.Tools
{
    public class WriterHelper
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(WriterHelper));
        #region 单实例
        private static WriterHelper _Instance;

        public static WriterHelper Instance
        {
            get
            {
                if (_Instance == null)
                    _Instance = new WriterHelper();
                return WriterHelper._Instance;
            }

        }
        private WriterHelper() { }

        #endregion
        private  LockHelper mLockHelper = new LockHelper();
        public  bool WriteMessage(String wPath, string wMessage,out String wFaultCode)
        {
            bool  wResult = false;
            wFaultCode = "";
            DateTime wNow = DateTime.Now;
            try
            {
                lock (mLockHelper)
                {
                     wPath = StringUtils.CombinePath(wPath, wNow.Year + "", wNow.Month + "");
                    if (!Directory.Exists(wPath))
                        Directory.CreateDirectory(wPath);

                    wPath= StringUtils.CombinePath(wPath, wNow.Day + ".txt");
                    if (!File.Exists(wPath))
                        File.Create(wPath);

                    File.AppendAllLines(wPath, new string[] { wMessage });
                }
               
                
                wResult = true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                logger.Error( System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                wFaultCode = ex.ToString();
            }
            return wResult;
        }

    }
  
}