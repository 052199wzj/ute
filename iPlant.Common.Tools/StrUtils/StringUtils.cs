using log4net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;

namespace iPlant.Common.Tools
{
    public class StringUtils
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(StringUtils));

        public static String Format(String wTemp, params Object[] value)
        {

            return String.Format(wTemp, value);
        }


        public static int parseInt(Object value, int defaultValue = 0)
        {
            int wResult = defaultValue;
            if (value != null)
            {
                try
                {
                    if (value is Boolean)
                    {
                        return ((Boolean)value) ? 1 : 0;
                    }
                    else if (value is Int32)
                    {
                        return (Int32)value;
                    }
                    else if (value is String)
                    {

                        if (Boolean.TrueString.Equals(value.ToString(), StringComparison.CurrentCultureIgnoreCase))
                            return 1;
                        Int32.TryParse(value.ToString(), out wResult);
                        return wResult;
                    }
                    else
                    {
                        Int32.TryParse(value.ToString(), out wResult);
                        return wResult;
                    }
                }
                catch (Exception ex)
                {
                    logger.ErrorFormat("parseInt   value{0} Error:{1} ", value, ex.Message);
                }
            }
            return wResult;
        }


        public static String CombinePath(params String[] value)
        {
            String wResult = "";
            if (value == null || value.Length <= 0)
                return wResult;

            StringBuilder wStringBuilder = new StringBuilder();
            bool wStartRemove = false;
            for (int i = 0; i < value.Length; i++)
            {
                if (value[i] == null || value[i].Trim().Length <= 0)
                    continue;
                value[i] = value[i].Trim();
                wStartRemove = false;

                if (value[i].StartsWith("/") || value[i].StartsWith(@"\"))
                {
                    value[i] = value[i].Substring(1);
                    wStartRemove = true;
                }
                if (value[i].StartsWith("//") || value[i].StartsWith(@"\\"))
                {
                    value[i] = value[i].Substring(2);
                    wStartRemove = true;
                }
                if (i == 0 && wStartRemove)
                {
                    value[i] = "/" + value[i];
                }

                wStartRemove = false;

                if (value[i].EndsWith("/") || value[i].EndsWith(@"\"))
                {
                    value[i] = value[i].Substring(0, value[i].Length - 1);
                    wStartRemove = true;
                }
                if (value[i].EndsWith("//") || value[i].EndsWith(@"\\"))
                {
                    value[i] = value[i].Substring(0, value[i].Length - 2);
                    wStartRemove = true;
                }



                if (i != value.Length - 1)
                {
                    value[i] += "/";
                }
                else if (i == value.Length - 1 && wStartRemove)
                {
                    value[i] += "/";
                }

                wStringBuilder.Append(value[i]);
            }
            wResult = wStringBuilder.ToString();
            return wResult;
        }

        public static float parseFloat(Object value)
        {
            float wResult = 0;
            if (value != null)
            {
                try
                {
                    if (value is Single)
                    {
                        return (Single)value;
                    }
                    else if (value is String)
                    {
                        wResult = Convert.ToSingle(value);
                        return wResult;
                    }
                    else
                    {
                        wResult = Convert.ToSingle(value.ToString());
                        return wResult;
                    }
                }
                catch (Exception ex)
                {
                    logger.Error("parseFloat", ex);
                }
            }
            return wResult;
        }

        public static long parseLong(Object value)
        {
            long wResult = 0L;
            if (value != null)
            {
                try
                {
                    if (value is Int64)
                    {
                        return (Int64)value;
                    }
                    if (value is Int32)
                    {
                        return (Int32)value;
                    }
                    if (value is Int16)
                    {
                        return (Int32)value;
                    }
                    if (value is String)
                    {
                        wResult = Convert.ToInt64(value);
                        return wResult;
                    }
                    if (value is DateTime)
                    {
                        return Convert.ToInt64(((DateTime)value - new DateTime(1970, 1, 1)).TotalMilliseconds);
                    }
                    wResult = Convert.ToInt64(value.ToString());
                }
                catch (Exception ex)
                {
                    logger.Error("parseLong", ex);
                }
            }
            return wResult;
        }

        public static Double parseDouble(Object value)
        {
            Double wResult = 0;
            if (value != null)
            {
                try
                {
                    if (value is Double)
                    {
                        return (Double)value;
                    }
                    if (value is Decimal)
                    {
                        return (Double)Decimal.Parse(value.ToString());
                    }
                    if (value is Int32)
                    {
                        return (Double)((Int32)value);
                    }
                    else if (value is String)
                    {

                        wResult = Double.Parse(value.ToString());
                        return wResult;
                    }
                    else
                    {

                        wResult = Double.Parse(value.ToString());
                        return wResult;
                    }
                }
                catch (Exception ex)
                {
                    logger.ErrorFormat("parseDouble   value{0} Error:{1} ", value, ex.Message);
                }
            }
            return wResult;
        }

        public static String parseString(Object value)
        {
            if (value != null && value != DBNull.Value)
            {
                return value.ToString();
            }
            return "";
        }


        public static List<T> parseListArgs<T>(params T[] value)
        {
            List<T> wResult = new List<T>();
            if (value != null)
            {

                try
                {
                    foreach (T t in value)
                    {
                        if (t == null)
                            continue;

                        if ((t is String) && isEmpty(t.ToString()))
                        {
                            continue;
                        }
                        wResult.Add(t);
                    }
                }
                catch (Exception)
                {
                    return wResult;
                }

            }
            return wResult;
        }

        public static List<T> parseList<T>(Object value)
        {
            if (value != null)
            {
                try
                {
                    value = CloneTool.Clone<List<T>>(value);
                }
                catch (Exception)
                {
                    return null;
                }
            }
            return null;
        }


        public static List<T> parseList<T>(T[] value)
        {
            List<T> wResult = new List<T>();
            if (value != null)
            {
                try
                {
                    foreach (T t in value)
                    {
                        if (t == null)
                            continue;

                        if ((t is String) && isEmpty(t.ToString()))
                        {
                            continue;
                        }
                        wResult.Add(t);
                    }

                }
                catch (Exception)
                {
                    return wResult;
                }

            }
            return wResult;
        }


        public static Boolean parseBoolean(Object value)
        {
            bool wResult = false;
            if (value != null)
            {

                wResult = "1" == value.ToString();

                if (wResult)
                    return wResult;

                Boolean.TryParse(value.ToString(), out wResult);

            }
            return wResult;
        }

        public static Boolean parseBoolean(Object value, out bool wResult)
        {
            wResult = false;
            if (value != null)
            {

                wResult = "1" == value.ToString();

                if (wResult)
                    return wResult;

                wResult = "0" == value.ToString();
                if (wResult)
                    return !wResult;

                return Boolean.TryParse(value.ToString(), out wResult);

            }
            return false;
        }

        public static Boolean isNumeric(String wValue)
        {
            if (isEmpty(wValue))
                return false;

            return Double.TryParse(wValue, out _);
        }
        public static Boolean isEmpty(Object str)
        {
            return String.IsNullOrWhiteSpace(StringUtils.parseString(str));
        }

        public static Boolean isNotEmpty(Object str)
        {
            return !StringUtils.isEmpty(str);
        }

        public static String trim(String str)
        {
            return str?.Trim();
        }

        public static String JsonDateCutLong(String wJson)
        {

            // @"\\/Date\((\d+)(\+?)(\d+)\)\\/"
            String wRegexString = "\"\\\\/Date\\((\\d+)(\\+?)(\\d+)\\)\\\\/\"";

            wJson = System.Text.RegularExpressions.Regex.Replace(wJson, wRegexString, match =>
            {
                return match.Groups[1].Value;
            });
            return wJson;
        }

        public static String JsonDateCutString(String wJson)
        {

            wJson = System.Text.RegularExpressions.Regex.Replace(wJson, @"\\/Date\((\d+)(\+?)(\d+)\)\\/", match =>
            {
                DateTime wDt = new DateTime();
                wDt.AddMilliseconds(Convert.ToInt64(match.Groups[1].Value));

                return wDt.ToString("yyyy-MM-dd HH:mm:ss");
            });
            return wJson;
        }


        public static DateTime FormatDateTime(DateTime value, String format)
        {

            return parseDate(value.ToString(format), format);
        }
        public static String DateTimeFormat(DateTime value, String format)
        {
            return value.ToString(format);
        }




        public static DateTime parseDate(object value)
        {

            DateTime wResult = new DateTime(1970, 1, 1);
            try
            {

                if (value == null || StringUtils.isEmpty(value.ToString()))
                {
                    return wResult;
                }
                if ((value is String) && value.ToString().Length >= 4)
                {
                    value = value.ToString().Trim();
                    Regex.CacheSize = Int32.MaxValue;
                    Regex wRegex = new Regex("\\d{4}([\\-\\/])\\d{1,2}([\\-\\/])\\d{1,2}([T\\s])\\d{1,2}:\\d{1,2}:\\d{1,2}\\.\\d{3}", RegexOptions.IgnoreCase);

                    Match wMatcher = wRegex.Match(value.ToString());

                    if (wMatcher.Success)
                    {
                        wResult = parseDate(wMatcher.Groups[0].Value, StringUtils.Format("yyyy{0}MM{1}dd{2}HH:mm:ss.fff", wMatcher.Groups[1],
                                wMatcher.Groups[2], wMatcher.Groups[3]));
                        return wResult;
                    }
                    wRegex = new Regex("\\d{4}([\\-\\/])\\d{1,2}([\\-\\/])\\d{1,2}([T\\s])\\d{1,2}:\\d{1,2}:\\d{1,2}", RegexOptions.IgnoreCase);

                    wMatcher = wRegex.Match(value.ToString());

                    if (wMatcher.Success)
                    {
                        wResult = parseDate(wMatcher.Groups[0].Value, StringUtils.Format("yyyy{0}MM{1}dd{2}HH:mm:ss", wMatcher.Groups[1],
                                wMatcher.Groups[2], wMatcher.Groups[3]));
                        return wResult;
                    }

                    wRegex = new Regex("\\d{4}([\\/\\-\\\\])\\d{1,2}([\\/\\-\\\\])\\d{1,2}([T\\s])\\d{1,2}:\\d{1,2}", RegexOptions.IgnoreCase);

                    wMatcher = wRegex.Match(value.ToString());
                    if (wMatcher.Success)
                    {
                        wResult = parseDate(wMatcher.Groups[0].Value, StringUtils.Format("yyyy{0}MM{1}dd{2}HH:mm", wMatcher.Groups[1],
                                wMatcher.Groups[2], wMatcher.Groups[3]));
                        return wResult;
                    }

                    wRegex = new Regex("\\d{4}([\\-\\/])\\d{1,2}([\\-\\/])\\d{1,2}", RegexOptions.IgnoreCase);

                    wMatcher = wRegex.Match(value.ToString());

                    if (wMatcher.Success)
                    {
                        wResult = parseDate(wMatcher.Groups[0].Value,
                                StringUtils.Format("yyyy{0}MM{1}dd", wMatcher.Groups[1], wMatcher.Groups[2]));
                        return wResult;
                    }
                    wRegex = new Regex("\\d{1,2}:\\d{1,2}:\\d{1,2}", RegexOptions.IgnoreCase);

                    wMatcher = wRegex.Match(value.ToString());

                    if (wMatcher.Success)
                    {
                        wResult = parseDate(wMatcher.Groups[0].Value, "HH:mm:ss");
                        return wResult;
                    }

                }
                else if (value is DateTime)
                {
                    wResult = (DateTime)value;
                }
                else
                {
                    wResult = parseDate(value, "yyyy-MM-dd HH:mm:ss");
                }

            }
            catch (Exception e)
            {
                logger.Error("parseDate", e);
            }

            return wResult;
        }

        public static String RepleaceRegx(String value, String wPat)
        {
            Regex.CacheSize = Int32.MaxValue;
            Regex wRegex = new Regex(wPat, RegexOptions.IgnoreCase);

            if (wRegex.IsMatch(value))
            {
                value = wRegex.Replace(value, match =>
               {
                   return StringUtils.parseDate(match.Groups[1]).ToString("yyyy-MM-dd HH:mm:ss");
               });
            }

            return value;
        }

        public static DateTime parseDate(Object value, String wFormat)
        {

            DateTime wResult = new DateTime(1970, 1, 1);

            if (value is long)
            {
                wResult.AddMilliseconds((long)value);
            }
            else if (value is Int32)
            {
                wResult.AddMilliseconds((Int32)value);
            }
            else if (value is String)
            {
                try
                {
                    wResult = DateTime.ParseExact((String)value, wFormat, System.Globalization.CultureInfo.CurrentCulture);

                    if (wFormat.Contains("T"))
                    {
                        wResult = wResult.Add(TimeZoneInfo.Local.GetUtcOffset(DateTime.Now));
                    }
                }
                catch (Exception ex)
                {
                    logger.Error(String.Format("parseDate Format:{0} value{1} ", wFormat, (String)value), ex);
                }
            }
            else if (value is DateTime)
            {
                wResult = (DateTime)value;
            }


            return wResult;
        }
        public static List<Decimal> parseNumberList(String[] wStringArray)
        {
            List<Decimal> wResult = new List<decimal>();
            if (wStringArray == null || wStringArray.Length < 1)
                return wResult;
            foreach (String wString in wStringArray)
            {
                if (Decimal.TryParse(wString, out decimal wDecimalTemp))
                    wResult.Add(wDecimalTemp);
            }

            return wResult;
        }

        #region ParsNumberList

        public static List<int> parseIntList(String[] wStringArray)
        {
            List<int> wResult = new List<int>();
            if (wStringArray == null || wStringArray.Length < 1)
                return wResult;
            int wDecimalTemp = 0;
            foreach (String wString in wStringArray)
            {
                if (int.TryParse(wString, out wDecimalTemp))
                    wResult.Add(wDecimalTemp);
            }

            return wResult;
        }
        public static List<int> parseIntList(String wString, String wDelim)
        {

            return parseIntList(split(wString, wDelim));
        }

        public static List<int> parseIntList(Object wString, String wDelim)
        {

            return parseIntList(split(parseString(wString), wDelim));
        }

        public static String[] split(String wString, String wDelim)
        {
            if (wString == null)
                return new String[0];
            return wString.Split(new String[] { wDelim }, StringSplitOptions.RemoveEmptyEntries).ToArray();
        }

        public static List<String> splitList(String wString, String wDelim)
        {
            if (wString == null)
                return new List<string>();
            return wString.Split(new String[] { wDelim }, StringSplitOptions.RemoveEmptyEntries).ToList();
        }

        public static List<String> splitList(String wString, params String[] wDelim)
        {
            if (wString == null)
                return new List<string>();
            return wString.Split(wDelim, StringSplitOptions.RemoveEmptyEntries).ToList();
        }

        public static List<String> splitList(Object wString, String wDelim)
        {
            if (wString == null)
                return new List<string>();

            return wString.ToString().Split(new String[] { wDelim }, StringSplitOptions.RemoveEmptyEntries).ToList();
        }


        public static List<UInt32> parseUInt32List(String[] wStringArray)
        {
            List<UInt32> wResult = new List<UInt32>();
            if (wStringArray == null || wStringArray.Length < 1)
                return wResult;
            foreach (String wString in wStringArray)
            {
                if (UInt32.TryParse(wString, out uint wDecimalTemp))
                    wResult.Add(wDecimalTemp);
            }

            return wResult;
        }
        public static List<UInt16> parseUInt16List(String[] wStringArray)
        {
            List<UInt16> wResult = new List<UInt16>();
            if (wStringArray == null || wStringArray.Length < 1)
                return wResult;
            foreach (String wString in wStringArray)
            {
                if (UInt16.TryParse(wString, out ushort wDecimalTemp))
                    wResult.Add(wDecimalTemp);
            }

            return wResult;
        }
        public static List<Int16> parseInt16List(String[] wStringArray)
        {
            List<Int16> wResult = new List<Int16>();
            if (wStringArray == null || wStringArray.Length < 1)
                return wResult;
            foreach (String wString in wStringArray)
            {
                if (Int16.TryParse(wString, out short wDecimalTemp))
                    wResult.Add(wDecimalTemp);
            }

            return wResult;
        }
        public static List<Byte> parseByteList(String[] wStringArray)
        {
            List<Byte> wResult = new List<Byte>();
            if (wStringArray == null || wStringArray.Length < 1)
                return wResult;
            foreach (String wString in wStringArray)
            {
                if (Byte.TryParse(wString, out byte wDecimalTemp))
                    wResult.Add(wDecimalTemp);
            }

            return wResult;
        }
        public static List<SByte> parseSByteList(String[] wStringArray)
        {
            List<SByte> wResult = new List<SByte>();
            if (wStringArray == null || wStringArray.Length < 1)
                return wResult;
            SByte wDecimalTemp = 0;
            foreach (String wString in wStringArray)
            {
                if (SByte.TryParse(wString, out wDecimalTemp))
                    wResult.Add(wDecimalTemp);
            }

            return wResult;
        }
        public static List<UInt64> parseUInt64List(String[] wStringArray)
        {
            List<UInt64> wResult = new List<UInt64>();
            if (wStringArray == null || wStringArray.Length < 1)
                return wResult;
            UInt64 wDecimalTemp = 0;
            foreach (String wString in wStringArray)
            {
                if (UInt64.TryParse(wString, out wDecimalTemp))
                    wResult.Add(wDecimalTemp);
            }

            return wResult;
        }
        public static List<Int64> parseInt64List(String[] wStringArray)
        {
            List<Int64> wResult = new List<Int64>();
            if (wStringArray == null || wStringArray.Length < 1)
                return wResult;
            Int64 wDecimalTemp = 0;
            foreach (String wString in wStringArray)
            {
                if (Int64.TryParse(wString, out wDecimalTemp))
                    wResult.Add(wDecimalTemp);
            }

            return wResult;
        }
        public static List<Single> parseSingleList(String[] wStringArray)
        {
            List<Single> wResult = new List<Single>();
            if (wStringArray == null || wStringArray.Length < 1)
                return wResult;
            Single wDecimalTemp = 0;
            foreach (String wString in wStringArray)
            {
                if (Single.TryParse(wString, out wDecimalTemp))
                    wResult.Add(wDecimalTemp);
            }

            return wResult;
        }
        public static List<Double> parseDoubleList(String[] wStringArray)
        {
            List<Double> wResult = new List<Double>();
            if (wStringArray == null || wStringArray.Length < 1)
                return wResult;
            Double wDecimalTemp = 0;
            foreach (String wString in wStringArray)
            {
                if (Double.TryParse(wString, out wDecimalTemp))
                    wResult.Add(wDecimalTemp);
            }

            return wResult;
        }
        #endregion


        public static String parseName(List<Int32> wKeys, Dictionary<Int32, String> wSource)
        {

            if (wKeys == null || wSource == null)
                return "";
            List<String> wResult = new List<string>();
            foreach (Int32 wKey in wKeys)
            {
                if (wSource.ContainsKey(wKey) && StringUtils.isNotEmpty(wSource[wKey]))
                    wResult.Add(wSource[wKey]);
            }
            return StringUtils.Join(",", wResult);
        }
        public static String parseName(Int32 wKey, Dictionary<Int32, String> wSource)
        {
            if (wSource == null)
                return "";
            if (wSource.ContainsKey(wKey) && StringUtils.isNotEmpty(wSource[wKey]))
                return wSource[wKey];

            return "";
        }

        public static List<Int32> parseIntList(List<String> wKeys, Dictionary<String, Int32> wSource)
        {
            List<Int32> wResult = new List<Int32>();
            if (wKeys == null || wSource == null)
                return wResult;

            foreach (String wKey in wKeys)
            {
                if (wSource.ContainsKey(wKey) && wSource[wKey] > 0)
                    wResult.Add(wSource[wKey]);
            }
            return wResult;
        }
        public static List<Int32> parseIntList(String wKeys, Dictionary<String, Int32> wSource)
        {
            if (wSource == null || StringUtils.isEmpty(wKeys))
                return new List<Int32>();


            return StringUtils.parseIntList(StringUtils.splitList(wKeys, ","), wSource);
        }


        #region 新增

        public static List<DateTime> parseDateList(String[] wStringArray)
        {
            List<DateTime> wResult = new List<DateTime>();
            if (wStringArray == null || wStringArray.Length < 1)
                return wResult;

            foreach (String wString in wStringArray)
            {
                wResult.Add(parseDate(wString));
            }

            return wResult;
        }

        public static UInt32 parseUInt(Object value, UInt32 defauleValue = 0u)
        {
            UInt32 wResult = defauleValue;
            if (value != null)
            {
                try
                {
                    if (value is Boolean)
                    {
                        return ((Boolean)value) ? 1u : 0u;
                    }
                    else if (value is UInt32)
                    {
                        return (UInt32)value;
                    }
                    else if (value is String)
                    {

                        if (Boolean.TrueString.Equals(value.ToString(), StringComparison.CurrentCultureIgnoreCase))
                            return 1;
                        UInt32.TryParse(value.ToString(), out wResult);
                        return wResult;
                    }
                    else
                    {
                        UInt32.TryParse(value.ToString(), out wResult);
                        return wResult;
                    }
                }
                catch (Exception ex)
                {
                    logger.Error("parseUInt", ex);
                }
            }
            return wResult;
        }

        public static Byte parseByte(Object value)
        {
            Byte wResult = 0;
            if (value != null)
            {
                try
                {
                    if (value is Byte)
                    {
                        return (Byte)value;
                    }
                    else if (value is String)
                    {

                        wResult = Convert.ToByte(value);
                        return wResult;
                    }
                    else
                    {
                        wResult = Convert.ToByte(value);
                        return wResult;
                    }
                }
                catch (Exception ex)
                {
                    logger.Error("parseByte", ex);
                }
            }
            return wResult;
        }

        public static SByte parseSByte(Object value)
        {
            SByte wResult = 0;
            if (value != null)
            {
                try
                {
                    if (value is SByte)
                    {
                        return (SByte)value;
                    }
                    else if (value is String)
                    {
                        wResult = Convert.ToSByte(value);
                        return wResult;
                    }
                    else
                    {
                        wResult = Convert.ToSByte(value);
                        return wResult;
                    }
                }
                catch (Exception ex)
                {
                    logger.Error("parseSByte", ex);
                }
            }
            return wResult;
        }

        public static ulong parseULong(Object value)
        {
            ulong wResult = 0L;
            if (value != null)
            {
                try
                {
                    if (value is UInt64)
                    {
                        return (UInt64)value;
                    }
                    if (value is UInt32)
                    {
                        return (UInt64)value;
                    }
                    if (value is UInt16)
                    {
                        return (UInt64)value;
                    }
                    if (value is String)
                    {
                        wResult = Convert.ToUInt64(value);

                        return wResult;
                    }
                    if (value is DateTime)
                    {
                        return Convert.ToUInt64(((DateTime)value - new DateTime(1970, 1, 1)).TotalMilliseconds);
                    }
                    wResult = Convert.ToUInt64(value);
                }
                catch (Exception ex)
                {
                    logger.Error("parseULong", ex);
                }

            }
            return wResult;
        }
        #endregion

        //
        // 摘要:
        //     串联集合的成员，其中在每个成员之间使用指定的分隔符。
        //
        // 参数:
        //   separator:
        //     要用作分隔符的字符串。只有在 values 具有多个元素时，separator 才包括在返回的字符串中。
        //
        //   values:
        //     一个包含要串联的对象的集合。
        //
        // 类型参数:
        //   T:
        //     values 成员的类型。
        //
        // 返回结果:
        //     一个由 values 的成员组成的字符串，这些成员以 separator 字符串分隔。 如果 values 没有成员，则该方法返回 System.String.Empty。
        //
        // 异常:
        //   T@System.ArgumentNullException:
        //     values 为 null。

        public static String Join<T>(String separator, IEnumerable<T> values)
        {
            return String.Join(separator, values);
        }
        //
        // 摘要:
        //     串联对象数组的各个元素，其中在每个元素之间使用指定的分隔符。
        //
        // 参数:
        //   separator:
        //     要用作分隔符的字符串。 只有在 separator 具有多个元素时，values 才包括在返回的字符串中。
        //
        //   values:
        //     一个数组，其中包含要连接的元素。
        //
        // 返回结果:
        //     一个由 values 的元素组成的字符串，这些元素以 separator 字符串分隔。 如果 values 为空数组，该方法将返回 System.String.Empty。
        //
        // 异常:
        //   T@System.ArgumentNullException:
        //     values 为 null。

        public static String Join(String separator, params object[] values)
        {
            return String.Join(separator, values);
        }
        //
        // 摘要:
        //     串联字符串数组的所有元素，其中在每个元素之间使用指定的分隔符。
        //
        // 参数:
        //   separator:
        //     要用作分隔符的字符串。 只有在 separator 具有多个元素时，value 才包括在返回的字符串中。
        //
        //   value:
        //     一个数组，其中包含要连接的元素。
        //
        // 返回结果:
        //     一个由 value 中的元素组成的字符串，这些元素以 separator 字符串分隔。 如果 value 为空数组，该方法将返回 System.String.Empty。
        //
        // 异常:
        //   T@System.ArgumentNullException:
        //     value 为 null。
        public static String Join(String separator, params String[] value)
        {
            return String.Join(separator, value);
        }
        //
        // 摘要:
        //     串联字符串数组的指定元素，其中在每个元素之间使用指定的分隔符。
        //
        // 参数:
        //   separator:
        //     要用作分隔符的字符串。 只有在 separator 具有多个元素时，value 才包括在返回的字符串中。
        //
        //   value:
        //     一个数组，其中包含要连接的元素。
        //
        //   startIndex:
        //     value 中要使用的第一个元素。
        //
        //   count:
        //     要使用的 value 的元素数。
        //
        // 返回结果:
        //     由 value 中的字符串组成的字符串，这些字符串以 separator 字符串分隔。 - 或 - 如果 System.String.Empty 为零，count
        //     没有元素，或 value 以及 separator 的全部元素均为 value，则为 System.String.Empty。
        //
        // 异常:
        //   T@System.ArgumentNullException:
        //     value 为 null。
        //
        //   T@System.ArgumentOutOfRangeException:
        //     startIndex 或 count 小于 0。 - 或 - startIndex 加上 count 大于 value 中的元素数。
        //
        //   T@System.OutOfMemoryException:
        //     内存不足。

        public static String Join(String separator, String[] value, int startIndex, int count)
        {
            return String.Join(separator, value, startIndex, count);
        }
        //
        // 摘要:
        //     串联类型为 System.Collections.Generic.IEnumerable`1 的 System.String 构造集合的成员，其中在每个成员之间使用指定的分隔符。
        //
        // 参数:
        //   separator:
        //     要用作分隔符的字符串。只有在 values 具有多个元素时，separator 才包括在返回的字符串中。
        //
        //   values:
        //     一个包含要串联的字符串的集合。
        //
        // 返回结果:
        //     一个由 values 的成员组成的字符串，这些成员以 separator 字符串分隔。 如果 values 没有成员，则该方法返回 System.String.Empty。
        //
        // 异常:
        //   T@System.ArgumentNullException:
        //     values 为 null。 
        public static String Join(String separator, IEnumerable<String> values)
        {
            return String.Join(separator, values);
        }


    }
}