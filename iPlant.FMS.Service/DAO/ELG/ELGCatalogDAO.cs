using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{

    class ELGCatalogDAO : BaseDAO
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(ELGCatalogDAO));


        public ELGCatalogDAO()
        {
            // TODO Auto-generated constructor stub
        }

        private static ELGCatalogDAO Instance;

        public static ELGCatalogDAO getInstance()
        {
            if (Instance == null)
                Instance = new ELGCatalogDAO();
            return Instance;
        }

        

        private static String ErrorLogConfigPath =  GlobalConstant.GlobalConfiguration.GetValue("Service.ErrorLog.PathFile");

        private static String ErrorLogPath =  GlobalConstant.GlobalConfiguration.GetValue("Service.ErrorLog.Path");

        private static List<String> LogPathList = new List<String>();

        private List<String> GetPathList()
        {
            List<String> wResult = new List<String>();
            try
            {


                if (!File.Exists(ErrorLogConfigPath))
                {
                    return wResult;
                }

                wResult = XMLTool.ReadXml<List<String>>(ErrorLogConfigPath);

                if (wResult != null && wResult.Count > 0)
                {
                    LogPathList = CloneTool.CloneArray<String>(wResult);
                }
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public void AddLogPath(BMSEmployee wLoginUser, String wPath)
        {
            try
            {
                LogPathList.Add(wPath);

                XMLTool.SaveXml(ErrorLogConfigPath, LogPathList);
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

        /**
         * 获取服务所在的本机的错误日志目录
         * 
         * @return
         */
        public List<ELGCatalog> SelectList(BMSEmployee wLoginUser)
        {
            List<ELGCatalog> wResult = new List<ELGCatalog>();
            try
            {
                List<String> wCatalogList = GetPathList();

                if (wCatalogList == null || wCatalogList.Count <= 0)
                {
                    wCatalogList = StringUtils
                            .splitList(ErrorLogPath, ";");
                }
                if (wCatalogList == null || wCatalogList.Count <= 0)
                    return wResult;
                // 批量遍历删除
                foreach (String wItem in wCatalogList)
                {
                    ELGCatalog wCoreLogList = GetELGCatalogList(wLoginUser, wItem, 1);
                    if (wCoreLogList != null && wCoreLogList.CatalogID > 0)
                        wResult.Add(wCoreLogList);
                }
                // 将树形的目录展开
                List<ELGCatalog> wCollapseList = CollapseTreeList(wLoginUser, wResult);
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public List<String> ShowLogFile(BMSEmployee wLoginUser, String wPath)
        {
            List<String> wResult = new List<String>();
            try
            {
                if (!File.Exists(wPath))
                    return wResult;

                wResult = File.ReadAllLines(wPath).ToList();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        /**
         * 展开树形的目录
         * 
         * @param wResult
         */
        private List<ELGCatalog> CollapseTreeList(BMSEmployee wLoginUser, List<ELGCatalog> wELGCatalogList)
        {
            List<ELGCatalog> wResult = new List<ELGCatalog>();
            try
            {
                if (wELGCatalogList == null || wELGCatalogList.Count <= 0)
                    return wResult;

                foreach (ELGCatalog wItem in wELGCatalogList)
                {
                    if (!wItem.IsCatalog)
                        wResult.Add(wItem);
                    else
                    {
                        ELGCatalog wELGCatalog = new ELGCatalog();
                        wELGCatalog.CatalogID = wItem.CatalogID;
                        wELGCatalog.CatalogName = wItem.CatalogName;
                        wELGCatalog.FilePath = wItem.FilePath;
                        wELGCatalog.IsCatalog = wItem.IsCatalog;
                        wResult.Add(wELGCatalog);
                        wResult.AddRange(CollapseTreeList(wLoginUser, wItem.SubCatalogList));
                    }
                }
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        /**
         * 根据文件目录获取所有的文件以及文件夹
         * 
         * @param wCatalog_MESCore
         * @return
         */
        private ELGCatalog GetELGCatalogList(BMSEmployee wLoginUser, String wCatalog, int wFlag)
        {
            ELGCatalog wFather = new ELGCatalog();
            try
            {
                if (!Directory.Exists(wCatalog))
                    return wFather;

                DirectoryInfo wDirectoryInfo = new DirectoryInfo(wCatalog);

                ELGCatalog wSubCatalog = null;

                wFather.UpdateTime = wDirectoryInfo.LastWriteTime;
                wFather.CatalogID = wFlag++;
                wFather.CatalogName = wDirectoryInfo.Name;
                wFather.IsCatalog = true;
                wFather.FilePath = wDirectoryInfo.FullName;
                wFather.Length = 0;
                foreach (DirectoryInfo wDirectory in wDirectoryInfo.GetDirectories())
                {
                    wSubCatalog = GetELGCatalogList(wLoginUser, wDirectory.FullName, wFlag);
                    wFather.SubCatalogList.Add(wSubCatalog);
                    wFather.Length += wSubCatalog.Length;
                }

                foreach (FileInfo wFileInfo in wDirectoryInfo.GetFiles())
                {
                    wSubCatalog = new ELGCatalog();

                    wSubCatalog.UpdateTime = wFileInfo.LastWriteTime;
                    wSubCatalog.Length = wFileInfo.Length;
                    wSubCatalog.IsCatalog = false;
                    wSubCatalog.CatalogID = wFlag++;
                    wSubCatalog.CatalogName = wFileInfo.Name;
                    wSubCatalog.FilePath = wFileInfo.FullName;

                    wFather.SubCatalogList.Add(wSubCatalog);
                    wFather.Length += wSubCatalog.Length;
                }
                wFather.SubCatalogList.Sort((o1, o2) =>
                {
                    if (o2.IsCatalog == o1.IsCatalog)
                    {
                        return (o2.UpdateTime.CompareTo(o1.UpdateTime));
                    }
                    else if (o2.IsCatalog)
                    {
                        return 1;
                    }
                    else {
                        return -1;
                    } 

                });
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wFather;
        }





        /**
         * 根据ID删除日志文件
         * 
         * @param wID
         */
        public Boolean DeleteByPath(BMSEmployee wLoginUser, String wPath)
        {
            Boolean wResult = true;
            try
            {



                if (!File.Exists(wPath))
                    return false;
                File.Delete(wPath);
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }

        /**
         * 删除文件集合
         * 
         * @param wIDList
         * @return
         */
        public String DeleteList(BMSEmployee wLoginUser, List<String> wPathList)
        {
            String wResult = "";
            try
            {
                if (wPathList == null || wPathList.Count <= 0)
                    return wResult;
                List<ELGCatalog> wList = new List<ELGCatalog>();
                foreach (String wPath in wPathList)
                {
                    this.DeleteByPath(wLoginUser, wPath);
                }

            }
            catch (Exception e)
            {
                wResult = e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }
    }
}
