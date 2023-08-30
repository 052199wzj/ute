using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.Common.Tools
{
    public class EnumTool
    {

        /// <summary>
        /// 得到枚举的中文注释
        /// </summary>
        /// <param name="e"></param>
        /// <returns></returns>
        public static string GetEnumDesc<T>(String wEnum) where T : Enum
        {
            string wResult = "未知";
            try
            {
                T wT = (T)Enum.Parse(typeof(T), wEnum);

                MemberInfo[] wMemberInfoArray = wT.GetType().GetMember(Enum.GetName(typeof(T), wT));
                if (wMemberInfoArray == null || wMemberInfoArray.Length < 1)
                    return wResult;

                DescriptionAttribute[] wAttrs = wMemberInfoArray[0].GetCustomAttributes(typeof(DescriptionAttribute), false) as DescriptionAttribute[];

                if (wAttrs.Length > 0)
                {
                    wResult = wAttrs[0].Description;
                }

            }
            catch (Exception)
            {
                return wResult;
            }
            return wResult;
        }
        public static string GetEnumDesc<T>(T wT) where T : Enum
        {
            string wResult = "未知";
            try
            {
                MemberInfo[] wMemberInfoArray = wT.GetType().GetMember(Enum.GetName(typeof(T), wT));
                if (wMemberInfoArray == null || wMemberInfoArray.Length < 1)
                    return wResult;

                DescriptionAttribute[] wAttrs = wMemberInfoArray[0].GetCustomAttributes(typeof(DescriptionAttribute), false) as DescriptionAttribute[];

                if (wAttrs.Length > 0)
                {
                    wResult = wAttrs[0].Description;
                }

            }
            catch (Exception)
            {
                return wResult;
            }
            return wResult;
        }

        public static string GetEnumDesc<T>(int wValue) where T : Enum
        {
            string wResult = "未知";
            try
            {

                T wT = (T)Enum.ToObject(typeof(T), wValue);
                MemberInfo[] wMemberInfoArray = typeof(T).GetMember(Enum.GetName(typeof(T), wT));
                if (wMemberInfoArray == null || wMemberInfoArray.Length < 1)
                    return wResult;

                DescriptionAttribute[] wAttrs = wMemberInfoArray[0].GetCustomAttributes(typeof(DescriptionAttribute), false) as DescriptionAttribute[];

                if (wAttrs.Length > 0)
                {
                    wResult = wAttrs[0].Description;
                }

            }
            catch (Exception)
            {
                return wResult;
            }
            return wResult;
        }

        public static string GetEnumDesc(Type wType, string wEnumStr)
        {
            try
            {
                FieldInfo wEnumInfo = wType.GetField(wEnumStr);
                DescriptionAttribute[] EnumAttributes = (DescriptionAttribute[])wEnumInfo.
                    GetCustomAttributes(typeof(DescriptionAttribute), false);
                if (EnumAttributes.Length > 0)
                {
                    return EnumAttributes[0].Description;
                }
            }
            catch (Exception ex)
            {
                throw new Exception("EnumTool:" + System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }

            return wEnumStr;
        }
        public static Dictionary<T, String> ToDic<T>() where T : Enum
        {
            Dictionary<T, String> wList = new Dictionary<T, String>();
            try
            {
                MemberInfo[] wMemberInfos = typeof(T).GetMembers();
                foreach (MemberInfo wMemberInfo in wMemberInfos)
                {
                    DescriptionAttribute[] wAttrs = wMemberInfo.GetCustomAttributes(typeof(DescriptionAttribute), false) as DescriptionAttribute[];

                    if (wAttrs == null || wAttrs.Length < 1)
                        continue;
                    T wT;
                    try
                    {
                        wT = (T)Enum.Parse(typeof(T), wMemberInfo.Name);
                    }
                    catch (Exception)
                    {
                        continue;
                    }

                    if (wT == null || wList.ContainsKey(wT))
                        continue;
                    wList.Add(wT, wAttrs[0].Description);
                }

            }
            catch (Exception ex)
            {
                throw new Exception("EnumTool:" + System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wList;
        }


        public static List<T> ToList<T>() where T : Enum
        {
            List<T> wList = new List<T>();
            try
            {
                MemberInfo[] wMemberInfos = typeof(T).GetMembers();
                foreach (MemberInfo wMemberInfo in wMemberInfos)
                {
                    try
                    {
                        T wT = (T)Enum.Parse(typeof(T), wMemberInfo.Name);

                        if (wT == null || wList.Contains(wT))
                            continue;
                        wList.Add(wT);
                    }
                    catch (Exception)
                    {
                        continue;
                    }

                }

            }
            catch (Exception ex)
            {
                throw new Exception("EnumTool:" + System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wList;
        }


        /// <summary>
        /// 根据特定枚举字符串获取该枚举上的描述文字
        /// </summary>
        /// <param name="wEnumType">枚举类型</param>
        /// <param name="wEnumString">特定枚举字符串</param>
        /// <returns></returns>
        public string GetDescription(Type wEnumType, string wEnumString)
        {
            try
            {
                MemberInfo[] wMemberInfos = wEnumType.GetMember(wEnumString);
                if (wMemberInfos.Length > 0)
                {
                    //获取描述特性
                    DescriptionAttribute[] wDescriptionAttributes = wMemberInfos[0].GetCustomAttributes(typeof(DescriptionAttribute), false) as DescriptionAttribute[];
                    if (wDescriptionAttributes != null && wDescriptionAttributes.Length > 0)
                    {
                        return wDescriptionAttributes[0].Description;
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("EnumTool:" + System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return null;
        }
    }

    public static class EnumExtension{
        public static String GetDesc(this Enum wEnum) {
            if (wEnum == null)
                return "";
            return EnumTool.GetEnumDesc(wEnum); 
        }
    }
}
