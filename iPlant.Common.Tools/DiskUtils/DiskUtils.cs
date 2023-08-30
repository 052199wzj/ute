using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;
using System.Diagnostics;
using System.Runtime.InteropServices;

namespace iPlant.Common.Tools
{
    public class DiskUtils
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DiskUtils));
        private static LockHelper mLockHelper = new LockHelper();
        private static DiskUtils _Instance = null;

        public static DiskUtils getInstance()
        {
            lock (mLockHelper)
            {
                if (_Instance == null)
                    _Instance = new DiskUtils();
                return _Instance;
            }
        }

        private DiskUtils()
        {
            try
            {
                mDiskList = StringUtils.splitList( GlobalConstant.GlobalConfiguration.GetValue("Service.DiskName"), ",");
                mPerformanceCounter = new PerformanceCounter("Processor", "% Processor Time", "_Total");

                mRamCounter = new PerformanceCounter("Memory", "Available MBytes");

            }
            catch (Exception ex)
            {
                logger.Error("DiskUtils", ex);
            }

        }

        private PerformanceCounter mPerformanceCounter;
        private PerformanceCounter mRamCounter;


        private List<String> mDiskList;


        private List<Dictionary<String, Object>> _DiskInfoList = new List<Dictionary<string, object>>();

        public List<Dictionary<String, Object>> DiskInfoList
        {
            get
            {
                if (_DiskInfoList == null)
                    _DiskInfoList = new List<Dictionary<string, object>>();
                for (int i = 0; i < mDiskList.Count; i++)
                {
                    if (_DiskInfoList.Count == i)
                    {
                        _DiskInfoList.Add(new Dictionary<string, object>());
                    }
                    _DiskInfoList[i]["DiskName"] = mDiskList[i];
                    _DiskInfoList[i]["HardDiskSpace"] = GetHardDiskSpace(mDiskList[i]);

                    _DiskInfoList[i]["HardDiskFreeSpace"] = GetHardDiskFreeSpace(mDiskList[i]);
                }

                return _DiskInfoList;
            }
        }


        public double GetHardDiskSpace(string str_HardDiskName)
        {
            double totalSize = 0.0;
            str_HardDiskName = str_HardDiskName + ":\\";
            System.IO.DriveInfo[] drives = System.IO.DriveInfo.GetDrives();
            foreach (System.IO.DriveInfo drive in drives)
            {
                if (drive.Name == str_HardDiskName)
                {
                    totalSize = drive.TotalSize * 1.0 / (1024 * 1024 * 1024);
                }
            }
            return totalSize;
        }


        /// 获取指定驱动器的剩余空间总大小(单位为B) 
        ///   
        ///  只需输入代表驱动器的字母即可  
        ///    
        public double GetHardDiskFreeSpace(string str_HardDiskName)
        {
            double freeSpace = 0.0;
            str_HardDiskName = str_HardDiskName + ":\\";
            System.IO.DriveInfo[] drives = System.IO.DriveInfo.GetDrives();
            foreach (System.IO.DriveInfo drive in drives)
            {
                if (drive.Name == str_HardDiskName)
                {
                    freeSpace = drive.TotalFreeSpace * 1.0 / (1024 * 1024 * 1024);
                }
            }
            return freeSpace;

        }


        public Dictionary<String, Object> GetComputerInfo()
        {

            Dictionary<String, Object> wResult = new Dictionary<string, object>();

            //  EnvironmentInfo.



            wResult.Add("OSFullName", RuntimeInformation.OSDescription);
            wResult.Add("OSVersion", RuntimeEnvironment.GetSystemVersion());
            wResult.Add("OSPlatform", RuntimeInformation.OSArchitecture);
            wResult.Add("ProcessorCount", Environment.ProcessorCount);
            try
            {
                wResult.Add("TotalPhysicalMemory", mRamCounter.NextValue());

                wResult.Add("TotalVirtualMemory", mRamCounter.NextValue());
                wResult.Add("AvailablePhysicalMemory", mRamCounter.NextValue());
                wResult.Add("AvailableVirtualMemory", mRamCounter.NextValue());

                wResult.Add("CPURate", mPerformanceCounter.NextValue());
            }
            catch (Exception ex)
            {
                logger.Error("GetComputerInfo", ex);
            }
            return wResult;

        }



    }
}
