
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.Common.Tools
{
    public class ReflectionTool
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(ReflectionTool));
        #region 单实例
        private ReflectionTool() { }
        private static ReflectionTool _Instance;

        public static ReflectionTool Instance
        {
            get
            {
                if (_Instance == null)
                    _Instance = new ReflectionTool();
                return ReflectionTool._Instance;
            }
        }
        #endregion

        public PropertyInfo[] GetPropertyInfos(Type wType)
        {
            PropertyInfo[] wPropertyInfos = null;
            try
            {
                wPropertyInfos = wType.GetProperties(BindingFlags.Public | BindingFlags.Instance);
            }
            catch (Exception ex)
            {
                logger.Error( System.Reflection.MethodBase.GetCurrentMethod().Name , ex);
            }
            return wPropertyInfos;
        }

        /// <summary>
        /// 实体属性反射
        /// </summary>
        /// <typeparam name="S">赋值对象</typeparam>
        /// <typeparam name="T">被赋值对象</typeparam>
        public void AutoMapping<S, T>(S s, T t)
        {
            try
            {
                PropertyInfo[] wPropertyInfos = GetPropertyInfos(s.GetType());
                Type wType = t.GetType();
                foreach (PropertyInfo wPropertyInfo in wPropertyInfos)
                {
                    PropertyInfo wTargetPropertyInfo = wType.GetProperty(wPropertyInfo.Name);
                    object wValue = wPropertyInfo.GetValue(s, null);
                    if (wTargetPropertyInfo != null && wValue != null)
                        wTargetPropertyInfo.SetValue(t, wValue, null);
                }
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
        }
    }
}
