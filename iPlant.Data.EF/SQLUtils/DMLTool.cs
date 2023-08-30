using log4net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace iPlant.Data.EF
{
    public class DMLTool
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMLTool));

        private const String SqlTextPrimary = "\n  USE [{0}] \n GO \n SET ANSI_NULLS ON \n GO \n SET QUOTED_IDENTIFIER ON \n GO \n  SET ANSI_PADDING ON \n GO \n   " +
          " IF OBJECT_ID(N'{1}', N'U') IS  NOT  NULL \n BEGIN \n   DROP TABLE {2} \n END \n GO \n  CREATE TABLE {3} ( \n {4} \n   CONSTRAINT [PK_{5}] PRIMARY KEY CLUSTERED   \n   (  \n  [{6}] ASC  \n    ) " +
          "WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]   \n ) ON [PRIMARY] \n GO \n SET ANSI_PADDING OFF  \n GO \n  ";

        private const String SqlText = "\n  USE [{0}] \n GO \n SET ANSI_NULLS ON \n GO \n SET QUOTED_IDENTIFIER ON \n GO \n  SET ANSI_PADDING ON \n GO \n   " +
           " IF OBJECT_ID(N'{1}', N'U') IS  NOT  NULL  \n BEGIN \n   DROP TABLE {2}  \n END \n GO \n  \n   CREATE TABLE  {3} ( \n {4} \n  ) " +
           "ON [PRIMARY] \n GO \n SET ANSI_PADDING OFF  \n GO  \n ";

        private const String SqlProcedure = "\n  USE [{0}] \n GO \n if exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[{1}]') and OBJECTPROPERTY(id, N'IsProcedure') = 1) \n drop procedure [dbo].[{1}]  \n GO \n " +
        " SET ANSI_NULLS ON   \n GO \n   SET QUOTED_IDENTIFIER ON \n GO \n  Create PROCEDURE [dbo].[{1}]( \n {2})\n AS \n BEGIN \n declare  @t_error  int; \n set @t_error =0;\n  BEGIN transaction; \n  " +
        " begin try \n {3} \n  end try \n  begin catch \n set @t_error=1; \n end catch \n if @t_error = 1  \n begin \n rollback; \n " +
        "set @Result = 'ERROR'; \n end  \n else \n  begin \n  commit; \n  set @Result = ''; \n  end \n END \n GO \n ";

        private const String SqlIDENTITYON = "SET IDENTITY_INSERT [{0}] ON; \n";

        private const String SqlIDENTITYOFF = "SET IDENTITY_INSERT [{0}] OFF; \n";

        public static String ChangeToSqlServer(String wMySqlString, out bool wSuccess)
        {
            String wResult = "";
            wSuccess = true;
            try
            {
                Regex.CacheSize = Int32.MaxValue;

                Regex wRegex = new Regex(@"SELECT\s+LAST_INSERT_ID\(\)(\s+as\s+ID)?\s*\;", RegexOptions.IgnoreCase);

                if (wRegex.IsMatch(wMySqlString)) 
                {
                    wMySqlString = wRegex.Replace(wMySqlString, "");

                    wRegex = new Regex(@"\)\s*VALUES\s*\(", RegexOptions.IgnoreCase);
                    wMySqlString = wRegex.Replace(wMySqlString, ") output inserted.* \n VALUES (");
                }
              

                wMySqlString = wMySqlString.Replace("now()", "GETDATE()");

                if (Regex.IsMatch(wMySqlString, @"\s*SELECT\s+", RegexOptions.IgnoreCase))
                {
                    wRegex = new Regex(@"\s+limit\s+(?<Num>\d+)\s*\,?(?<Num2>\d*)", RegexOptions.IgnoreCase);
                    if (wRegex.IsMatch(wMySqlString))
                    {
                        wMySqlString = wRegex.Replace(wMySqlString, "");
                        wRegex = new Regex(@"\s*SELECT\s+", RegexOptions.IgnoreCase);

                        wRegex.Replace(wMySqlString, match => String.Format(" SELECT Top ({0}) ", match.Groups["Num"].Value));
                    }
                }

                wRegex = new Regex(@"\`(?<Column>[a-zA-Z]+[a-zA-Z0-9_]+)\`", RegexOptions.IgnoreCase);
                wMySqlString = wRegex.Replace(wMySqlString, match =>
                {
                    return String.Format("[{0}]", match.Groups["Column"].Value);
                });

                wRegex = new Regex(@"str_to_date\(\s*(?<STR>[\']{1,2}2010\-01\-01[\']{1,2})\s*\,\s*[\']{1,2}\%Y\-\%m\-\%d\s*\%H[\']{1,2}\)", RegexOptions.IgnoreCase);
                wMySqlString = wRegex.Replace(wMySqlString, match => String.Format("cast({0} as datetime)", match.Groups["STR"].Value));
                  
                wResult = wMySqlString;
            }
            catch (Exception ex)
            { 
                Console.WriteLine(ex.ToString());
                logger.Error("ChangeToSqlServer", ex);
            }
            return wResult;
        }

        public static String ChangeToSqlServer(String wMySqlString)
        {
            bool wSuccess = false;
            String wResult = ChangeToSqlServer(wMySqlString, out wSuccess);

            if (wSuccess)
                return wResult;
            else
                return wMySqlString;
        }


        public static List<String> ChangeToSqlServerCreateTable(String wDataBaseName, String wMySqlString, bool wIsOwnData, out bool wSuccess)
        {
            List<String> wResult = new List<string>();
            wSuccess = true;
            try
            {
                Regex.CacheSize = Int32.MaxValue;

                Regex wRegex = new Regex(@"CREATE\s+TABLE\s*\`?(?<TableName>[a-zA-Z]+[a-zA-Z0-9_]+)\`?\s*\(", RegexOptions.IgnoreCase);

                MatchCollection wMatchCollection = wRegex.Matches(wMySqlString);

                String wSpl = "";
                String wTableName = "";
                List<String> wColumnList = new List<string>();
                String wMySqlText = "";
                int wIndexPRIMARY = 0;

                bool wHasAI = false;
                String wPRIMARYString = "";
                foreach (Match wCreateMatch in wMatchCollection)
                {
                    wSpl = "";
                    wPRIMARYString = "";
                    if (wMySqlString.IndexOf("CREATE TABLE", wCreateMatch.Index + wCreateMatch.Length) > wCreateMatch.Index)
                    {
                        wSpl = wMySqlString.Substring(wCreateMatch.Index, wMySqlString.IndexOf("CREATE TABLE", wCreateMatch.Index + wCreateMatch.Length) - wCreateMatch.Index);
                    }
                    else
                    {
                        wSpl = wMySqlString.Substring(wCreateMatch.Index);
                    }

                    if (!Regex.IsMatch(wSpl, @"\)\s*ENGINE"))
                        continue;

                    wTableName = wCreateMatch.Groups["TableName"].Value;

                    wColumnList = new List<string>();

                    #region Create
                    wMySqlText = wSpl.Substring(0, wSpl.IndexOf(") ENGINE"));

                    wRegex = new Regex(@"\`(?<Column>[a-zA-Z]+[a-zA-Z0-9_]+)\`\s+(?<Type>[a-zA-Z]+(\(\d+\))?)\s+NOT\s+NULL\s+AUTO_INCREMENT", RegexOptions.IgnoreCase);

                    wHasAI = false;

                    wMySqlText = wRegex.Replace(wMySqlText, match =>
                    {
                        wHasAI = true;
                        wPRIMARYString = match.Groups["Column"].Value;
                        return String.Format("`{0}` {1} NOT  NULL IDENTITY(1,1)", wPRIMARYString, match.Groups["Type"].Value);

                    });

                    if (String.IsNullOrWhiteSpace(wPRIMARYString))
                    {

                        wRegex = new Regex(@"\s+PRIMARY\s+KEY\s*\(\s*\`(?<Column>[a-zA-Z]+[a-zA-Z0-9_\`\,]+)\`\s*\)\s+", RegexOptions.IgnoreCase);
                        wMySqlText = wRegex.Replace(wMySqlText, match =>
                        {
                            wPRIMARYString = match.Groups["Column"].Value;
                            return match.Value;
                        });
                        wPRIMARYString = wPRIMARYString.Replace("`,`", "],[");
                    }

                    wMySqlText = Regex.Replace(wMySqlText, @"varchar\((?<Num>\d+)\)", match =>
                    {
                        int wNum = Convert.ToInt32(match.Groups["Num"].Value);
                        if (wNum > 4000)
                            return "ntext";
                        else
                            return String.Format("nvarchar({0})", wNum);
                    });

                    wMySqlText = wMySqlText.Replace("double", "float");

                    wMySqlText = wMySqlText.Replace("float", "real");

                    wMySqlText = wMySqlText.Replace("longtext", "ntext");

                    wMySqlText = Regex.Replace(wMySqlText, @"int\(\d+\)", "int");

                    wMySqlText = Regex.Replace(wMySqlText, @"datetime\(\d+\)", "datetime");

                    wMySqlText = Regex.Replace(wMySqlText, @"bit\(\d+\)", "bit");

                    wMySqlText = Regex.Replace(wMySqlText, @"b\'\d+\'", "'0'");

                    wMySqlText = Regex.Replace(wMySqlText, @"COMMENT\s+\'[^\']*\'", "");

                    wMySqlText = wMySqlText.Substring(wMySqlText.IndexOf("(") + 1).Trim();

                    wIndexPRIMARY = wMySqlText.IndexOf("PRIMARY");

                    if (wIndexPRIMARY > 0)
                    {
                        wMySqlText = wMySqlText.Substring(0, wIndexPRIMARY);
                    }
                    wMySqlText = wMySqlText.Trim();


                    wRegex = new Regex(@"\`(?<Column>[a-zA-Z]+[a-zA-Z0-9_]+)\`", RegexOptions.IgnoreCase);
                    wMySqlText = wRegex.Replace(wMySqlText, match =>
                    {
                        wColumnList.Add(match.Groups["Column"].Value);
                        return String.Format("[{0}]", match.Groups["Column"].Value);
                    });


                    if (wIndexPRIMARY > 0)
                    {
                        wMySqlText = String.Format(SqlTextPrimary, wDataBaseName, wTableName, wTableName, wTableName, wMySqlText, wTableName, wPRIMARYString);
                    }
                    else
                    {
                        wMySqlText = String.Format(SqlText, wDataBaseName, wTableName, wTableName, wTableName, wMySqlText);
                    }

                    wResult.Add(wMySqlText);
                    #endregion


                    #region Data   自带不支持含有主键数据导入 除非主动修改sql 指定列名

                    if (!wIsOwnData && wIndexPRIMARY > 0)
                        continue;
                    if (wSpl.IndexOf("INSERT INTO") >= 0 && wSpl.IndexOf("UNLOCK TABLES") > wSpl.IndexOf("INSERT INTO"))
                    {
                        wMySqlText = wSpl.Substring(wSpl.IndexOf("INSERT INTO"), wSpl.IndexOf("UNLOCK TABLES") - wSpl.IndexOf("INSERT INTO"));

                        wRegex = new Regex(@"INSERT\s+INTO\s+\`(?<TableName>[a-zA-Z]+[a-zA-Z0-9_]+)\`\s+VALUES\s+\(", RegexOptions.IgnoreCase);

                        List<String> wInsertStringList = new List<string>();

                        MatchCollection wMatchCollectionTemp = wRegex.Matches(wMySqlText);
                        for (int i = 0; i < wMatchCollectionTemp.Count; i++)
                        {
                            String wInsertString = "";
                            if (i == wMatchCollectionTemp.Count - 1)
                            {
                                wInsertString = wMySqlText.Substring(wMatchCollectionTemp[i].Index + wMatchCollectionTemp[i].Length,
                                     wMySqlText.Length - wMatchCollectionTemp[i].Index - wMatchCollectionTemp[i].Length);
                            }
                            else
                            {
                                wInsertString = wMySqlText.Substring(wMatchCollectionTemp[i].Index + wMatchCollectionTemp[i].Length,
                                    wMatchCollectionTemp[i + 1].Index - wMatchCollectionTemp[i].Index - wMatchCollectionTemp[i].Length);
                            }

                            wInsertStringList.AddRange(InsertStringChangeToLimit800(wInsertString, wMatchCollectionTemp[i].Value));

                        }
                        if (wInsertStringList.Count < 1)
                            continue;

                        wMySqlText = String.Join("\n", wInsertStringList);

                        wMySqlText = wRegex.Replace(wMySqlText, match =>
                        {

                            if (match.Groups["TableName"].Value != wTableName)
                                return String.Format("INSERT INTO {0} VALUES (", match.Groups["TableName"].Value);
                            else
                                return String.Format("INSERT INTO {0} ( [{1}] ) VALUES (", match.Groups["TableName"].Value, String.Join("],[", wColumnList));
                        });

                        wRegex = new Regex(@"\`(?<Column>[a-zA-Z]+[a-zA-Z0-9_]+)\`", RegexOptions.IgnoreCase);

                        wMySqlText = wRegex.Replace(wMySqlText, match => String.Format("[{0}]", match.Groups["Column"].Value));

                        if (wHasAI)
                        {
                            wResult.Add(String.Format(SqlIDENTITYON, wTableName));
                            wResult.Add(wMySqlText);
                            wResult.Add(String.Format(SqlIDENTITYOFF, wTableName));
                        }
                        else
                        {
                            wResult.Add(wMySqlText);
                        }

                    }
                    #endregion

                }
                // GC.Collect();
            }
            catch (Exception ex)
            {
                wSuccess = false;
                Console.WriteLine(ex.ToString());
                wResult.Clear();
            }
            return wResult;
        }

        private static List<String> InsertStringChangeToLimit800(String wInsertString, String wInsertPreffix)
        {
            List<String> wResult = new List<string>();
            try
            {
                wInsertString = wInsertString.Replace("''", "1");

                wInsertString = Regex.Replace(wInsertString, @"(?<Prev>[^\\])\\\'(?<Suf>\s*[^\,])",
                    match => String.Format("{0}''{1}", match.Groups["Prev"].Value, match.Groups["Suf"].Value));

                wInsertString = wInsertString.Replace("0001-01-01 08:00:00", "2000-01-01 00:00:00");
                wInsertString = wInsertString.Replace("0001-01-01 00:00:00", "2000-01-01 00:00:00");

                wInsertString = wInsertString.Replace(@",'\0',", ",'0',");

                //sqlserver中双引号无需转义
                wInsertString = wInsertString.Replace("\\\"", "\"");

                List<String> wInsertValueList = wInsertString.Split(new String[] { "),(" }, StringSplitOptions.RemoveEmptyEntries).ToList();

                if (wInsertValueList.Count < 1)
                    return wResult;

                wInsertValueList[wInsertValueList.Count - 1] = wInsertValueList[wInsertValueList.Count - 1].Substring(0, wInsertValueList[wInsertValueList.Count - 1].IndexOf(");"));

                for (int i = 0; i < wInsertValueList.Count; i += 800)
                {
                    List<String> wLimitInserValueList = wInsertValueList.GetRange(i, (wInsertValueList.Count > i + 800) ? 800 : wInsertValueList.Count - i);

                    wResult.Add(String.Format("{0} {1});", wInsertPreffix, String.Join("),(", wLimitInserValueList)));
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                wResult.Clear();
            }

            return wResult;
        }

        public static List<String> ChangeToSqlServerCreateProcedure(String wDataBaseName, String wOldDataBaseName, String wMySqlString, out bool wSuccess)
        {
            List<String> wResult = new List<string>();
            wSuccess = true;
            try
            {
                Regex.CacheSize = Int32.MaxValue;
                Regex wRegex = new Regex(@"CREATE\s+DEFINER\s*\=", RegexOptions.IgnoreCase);

                MatchCollection wMatchCollection = wMatchCollection = wRegex.Matches(wMySqlString);

                String wSpl = "";
                String wMySqlText = "";
                String wProcedureName = "";
                Dictionary<String, String> wParamList = new Dictionary<string, string>();
                List<String> wParamsStringList = new List<string>();
                String wParamsString = "";
                List<String> wParmsItemStringList = new List<string>();

                String wInsetString = "";
                int wIndexDD = 0;

                foreach (Match wProMatch in wMatchCollection)
                {
                    wSpl = "";
                    if (wMySqlString.IndexOf("END ;;\nDELIMITER ;", wProMatch.Index + wProMatch.Length) > wProMatch.Index)
                    {
                        wSpl = wMySqlString.Substring(wProMatch.Index, wMySqlString.IndexOf("END ;;\nDELIMITER ;", wProMatch.Index + wProMatch.Length) - wProMatch.Index);
                    }
                    else
                    {
                        continue;
                    }

                    #region 存储过程
                    //if (wSpl.IndexOf("END ;;\nDELIMITER ;") < 0)
                    //    continue;

                    if (wSpl.IndexOf("PROCEDURE") < 0)
                        continue;

                    if (wSpl.IndexOf("declare t_error int default 0;") < 0)
                        continue;

                    if (wSpl.IndexOf("if t_error = 1") < 0)
                        continue;


                    wMySqlText = wSpl.Substring(wSpl.IndexOf("PROCEDURE"), wSpl.IndexOf("if t_error = 1") - wSpl.IndexOf("PROCEDURE"));

                    wMySqlText = wMySqlText.Replace("varchar", "nvarchar");

                    wMySqlText = wMySqlText.Replace("double", "float");

                    wMySqlText = wMySqlText.Replace("longtext", "ntext");

                    wMySqlText = wMySqlText.Replace("bool", "bit");

                    wMySqlText = wMySqlText.Replace("long", "bigint");

                    wMySqlText = wMySqlText.Replace("float", "real");

                    wMySqlText = Regex.Replace(wMySqlText, @"int\(\d+\)", "int", RegexOptions.IgnoreCase);

                    wMySqlText = Regex.Replace(wMySqlText, @"datetime\(\d+\)", "datetime", RegexOptions.IgnoreCase);

                    wMySqlText = Regex.Replace(wMySqlText, @"bit\(\d+\)", "bit", RegexOptions.IgnoreCase);

                    wMySqlText = Regex.Replace(wMySqlText, @"b\'\d+\'", "'0'", RegexOptions.IgnoreCase);


                    wProcedureName = wMySqlText.Substring(wMySqlText.IndexOf("PROCEDURE") + "PROCEDURE".Length, wMySqlText.IndexOf("(") - (wMySqlText.IndexOf("PROCEDURE") + "PROCEDURE".Length)).Replace("`", "").Trim();

                    wParamList.Clear();

                    wParamsString = wMySqlText.Substring(wMySqlText.IndexOf("(") + 1, wMySqlText.IndexOf("BEGIN") - wMySqlText.IndexOf("(") - 1).Trim();

                    wParamsString = wParamsString.Substring(0, wParamsString.LastIndexOf(")"));

                    #region 存储过程参数处理
                    wParamsStringList.Clear();

                    wParmsItemStringList.Clear();
                    foreach (String wParamsItemString in wParamsString.Split(new String[] { "," }, StringSplitOptions.RemoveEmptyEntries))
                    {
                        wParmsItemStringList = wParamsItemString.Trim().Split(new String[] { " ", "\n", "\r" }, StringSplitOptions.RemoveEmptyEntries).ToList();
                        if (wParmsItemStringList.Count < 3)
                            continue;

                        if (wParmsItemStringList[0] == "--")
                            continue;

                        if (wParmsItemStringList[0] == "out")
                        {
                            wParamsStringList.Add(String.Format("@{0} {1} output", wParmsItemStringList[1], wParmsItemStringList[2]));
                        }
                        else
                        {
                            wParamsStringList.Add(String.Format("@{0} {1}", wParmsItemStringList[1], wParmsItemStringList[2]));
                            wParamList.Add(wParmsItemStringList[1], wParmsItemStringList[2]);
                        }

                    }

                    wParamsString = String.Join(",\n", wParamsStringList);
                    #endregion

                    wMySqlText = wMySqlText.Substring(wMySqlText.IndexOf("start transaction;") + "start transaction;".Length);

                    #region 存储过程中数据库名称参杂处理
                    wMySqlText = Regex.Replace(wMySqlText, @"\`(?<DataBaseName>[a-zA-Z]+[a-zA-Z0-9_]+)\`\.\`(?<TableName>[a-zA-Z]+[a-zA-Z0-9_]+)\`", match =>
                    {
                        if (wOldDataBaseName.Equals(match.Groups["DataBaseName"].Value))
                            return String.Format("[dbo].[{0}]", match.Groups["TableName"].Value);
                        else
                            return String.Format("[{0}].[{1}]", match.Groups["DataBaseName"].Value, match.Groups["TableName"].Value);
                    }, RegexOptions.IgnoreCase);
                    #endregion

                    wRegex = new Regex(@"SELECT\s+(?<Body>[\s\S]*)\s+Limit\s*(?<Num1>[0-9a-zA-Z_@]+)\s*\,?\s*(?<Num2>[0-9a-zA-Z_@]*)", RegexOptions.IgnoreCase);
                    wMySqlText = wRegex.Replace(wMySqlText, match => String.Format("SELECT TOP ({0}) {1}", match.Groups["Num1"].Value, match.Groups["Body"].Value));

                    wMySqlText = wMySqlText.Replace("now()", "GETDATE()");
                    wRegex = new Regex(@"PREPARE stmt from \@sql\;(\s+)EXECUTE stmt\;", RegexOptions.IgnoreCase);
                    if (wRegex.IsMatch(wMySqlText))
                    {
                        wMySqlText = wMySqlText.Insert(0, "declare @sql nvarchar(4000); \n");
                    }
                    wMySqlText = wRegex.Replace(wMySqlText, "EXECUTE (@sql);");

                    #region 存储过程中Set @parameter 添加定义
                    wRegex = new Regex(@"SET\s+\@(?<Param>[A-Za-z_]+[A-Za-z0-9_]+)\s*\=\s*\@?(?<Param2>[A-Za-z_]+[A-Za-z0-9_]+)", RegexOptions.IgnoreCase);
                    wMatchCollection = wMatchCollection = wRegex.Matches(wMySqlText);
                    wIndexDD = 0;
                    foreach (Match wMatch in wMatchCollection)
                    {
                        if (Regex.IsMatch(wMySqlText.Substring(0, wMatch.Index + wIndexDD), @"declare\s+\@" + wMatch.Groups["Param"].Value + @"\s+(?<Type>[a-zA-Z]+(\(\d+\))?)\s+", RegexOptions.IgnoreCase))
                            continue;

                        if (wMatch.Groups["Param2"].Value.Equals("false", StringComparison.InvariantCultureIgnoreCase) || wMatch.Groups["Param2"].Value.Equals("true", StringComparison.InvariantCultureIgnoreCase))
                        {

                            wInsetString = String.Format("declare @{0} int ; \n", wMatch.Groups["Param"].Value);

                            wMySqlText = wMySqlText.Insert(wMatch.Index + wIndexDD, wInsetString);

                            wIndexDD += wInsetString.Length;

                            continue;
                        }

                        if (!wParamList.ContainsKey(wMatch.Groups["Param2"].Value))
                            continue;

                        wInsetString = String.Format("declare @{0} {1} ; \n", wMatch.Groups["Param"].Value, wParamList[wMatch.Groups["Param2"].Value]);

                        wMySqlText = wMySqlText.Insert(wMatch.Index + wIndexDD, wInsetString);

                        wIndexDD += wInsetString.Length;
                    }

                    wRegex = new Regex("SET\\s+\\@(?<Param>[A-Za-z_]+[A-Za-z0-9_]+)\\s*\\=\\s*[\'\"]{2}\\s*\\;", RegexOptions.IgnoreCase);

                    wMatchCollection = wMatchCollection = wRegex.Matches(wMySqlText);
                    wIndexDD = 0;
                    foreach (Match wMatch in wMatchCollection)
                    {
                        if (Regex.IsMatch(wMySqlText.Substring(0, wMatch.Index + wIndexDD), @"declare\s+\@" + wMatch.Groups["Param"].Value, RegexOptions.IgnoreCase))
                            continue;

                        wInsetString = String.Format("declare @{0} nvarchar(2048);  \n", wMatch.Groups["Param"].Value);

                        wMySqlText = wMySqlText.Insert(wMatch.Index + wIndexDD, wInsetString);

                        wIndexDD += wInsetString.Length;
                    }

                    // wMySqlText = wRegex.Replace(wMySqlText, match => String.Format("declare @{0} nvarchar(2048) ; \n {1}", match.Groups["Param"].Value, match.Value));


                    wRegex = new Regex("SET\\s+\\@(?<Param>[A-Za-z_]+[A-Za-z0-9_]+)\\s*\\=\\s*\\d+\\s*\\;", RegexOptions.IgnoreCase);

                    wMatchCollection = wMatchCollection = wRegex.Matches(wMySqlText);
                    wIndexDD = 0;
                    foreach (Match wMatch in wMatchCollection)
                    {
                        if (Regex.IsMatch(wMySqlText.Substring(0, wMatch.Index + wIndexDD), @"declare\s+\@" + wMatch.Groups["Param"].Value, RegexOptions.IgnoreCase))
                            continue;

                        wInsetString = String.Format("declare @{0} int;  \n", wMatch.Groups["Param"].Value);

                        wMySqlText = wMySqlText.Insert(wMatch.Index + wIndexDD, wInsetString);

                        wIndexDD += wInsetString.Length;
                    }

                    wRegex = new Regex("SET\\s+\\@(?<Param>[A-Za-z_]+[A-Za-z0-9_]+)\\s*\\=", RegexOptions.IgnoreCase);

                    wMatchCollection = wMatchCollection = wRegex.Matches(wMySqlText);
                    wIndexDD = 0;
                    foreach (Match wMatch in wMatchCollection)
                    {
                        if (Regex.IsMatch(wMySqlText.Substring(0, wMatch.Index + wIndexDD), @"declare\s+\@" + wMatch.Groups["Param"].Value, RegexOptions.IgnoreCase))
                            continue;

                        wInsetString = String.Format("declare @{0} int;  \n", wMatch.Groups["Param"].Value);


                        wMySqlText = wMySqlText.Insert(wMatch.Index + wIndexDD, wInsetString);

                        wIndexDD += wInsetString.Length;
                    }

                    wRegex = new Regex("[\\s\\=\\;\\,\\'\\\"]+false[\\s\\=\\;\\,\\'\\\"]+", RegexOptions.IgnoreCase);


                    wRegex = new Regex("(?<StartWith>[\\s\\=\\;\\,\\'\\\"]+)(?<Bool>(false|true))(?<EndWith>[\\s\\=\\;\\,\\'\\\"]+)", RegexOptions.IgnoreCase);

                    wMySqlText = wRegex.Replace(wMySqlText, match => String.Format("{0}{1}{2}",
                        match.Groups["StartWith"].Value, Boolean.Parse(match.Groups["Bool"].Value) ? 1 : 0, match.Groups["EndWith"].Value));

                    #endregion

                    #region 替换@参数加_前缀
                    wRegex = new Regex(@"\@(?<Param>[A-Za-z_]+[A-Za-z0-9_]+)", RegexOptions.IgnoreCase);
                    wMySqlText = wRegex.Replace(wMySqlText, match => String.Format("@_{0}", match.Groups["Param"].Value));

                    #endregion

                    #region 替换所有参数加@符号

                    foreach (String wParam in wParamList.Keys)
                    {
                        wRegex = new Regex(@"(?<Start>[^A-Za-z0-9_\`\@]{1})" + wParam + @"(?<End>[^A-Za-z0-9_\`\@]{1})", RegexOptions.IgnoreCase);
                        wMySqlText = wRegex.Replace(wMySqlText, match => String.Format("{0}@{1}{2}", match.Groups["Start"], wParam, match.Groups["End"]));
                    }
                    #endregion

                    #region 替换所有`符号
                    wRegex = new Regex(@"\`(?<Column>[a-zA-Z_]+[a-zA-Z0-9_]+)\`", RegexOptions.IgnoreCase);
                    wMySqlText = wRegex.Replace(wMySqlText, match => String.Format("[{0}]", match.Groups["Column"].Value));

                    #endregion
                    #region 替换所有`符号
                    wRegex = new Regex(@"\)\s*THEN\s+", RegexOptions.IgnoreCase);
                    wMySqlText = wRegex.Replace(wMySqlText, ") Begin \n");

                    wRegex = new Regex(@"\s+ELSE\s+", RegexOptions.IgnoreCase);
                    wMySqlText = wRegex.Replace(wMySqlText, "\n END \n ELSE \n Begin \n");


                    wRegex = new Regex(@"\s+ELSEIF\s*\(", RegexOptions.IgnoreCase);
                    wMySqlText = wRegex.Replace(wMySqlText, "\n END \n ELSE  IF (\n ");

                    wRegex = new Regex(@"\s*END\s+IF\s*\;", RegexOptions.IgnoreCase);
                    wMySqlText = wRegex.Replace(wMySqlText, "\n END; ");


                    wRegex = new Regex(@"SELECT\s+LAST_INSERT_ID\(\)(\s+as\s+ID)?\s*\;", RegexOptions.IgnoreCase);
                    wMySqlText = wRegex.Replace(wMySqlText, "");

                    wRegex = new Regex(@"\)\s*VALUES\s*\(", RegexOptions.IgnoreCase);
                    wMySqlText = wRegex.Replace(wMySqlText, ") output inserted.*  \nVALUES (");


                    wRegex = new Regex("\"(?<empty>\\s*)\"", RegexOptions.IgnoreCase);
                    wMySqlText = wRegex.Replace(wMySqlText, match => String.Format("'{0}'", match.Groups["empty"].Value));

                    wMySqlText = wMySqlText.Replace("\"\"", "''");

                    wRegex = new Regex("\"(?<Param>[0-9-]+)\"", RegexOptions.IgnoreCase);
                    wMySqlText = wRegex.Replace(wMySqlText, match => String.Format("''{0}''", match.Groups["Param"].Value));



                    wRegex = new Regex("\"", RegexOptions.IgnoreCase);
                    wMySqlText = wRegex.Replace(wMySqlText, "''");


                    wMySqlText = wMySqlText.Replace("concat(date_format(LAST_DAY(GETDATE()),'%Y-%m-'),'01')", "dateadd(dd,-day(getdate())+1,getdate())");
                    wMySqlText = wMySqlText.Replace("LAST_DAY(GETDATE())", "dateadd(ms,-3,DATEADD(mm, DATEDIFF(m,0,getdate())+1, 0))");


                    wMySqlText = wMySqlText.Replace("date_format(GETDATE(),'%Y-%m-')", "convert(char(8),getdate(),20)");

                    wMySqlText = wMySqlText.Replace("date_format(GETDATE(),'-%Y-%m-')", "'-'+ convert(char(8),getdate(),20)");

                    wMySqlText = wMySqlText.Replace("lpad( ", " RIGHT('00000'+CONVERT(VARCHAR(50),");


                    wRegex = new Regex(@"\,\s*5\,\'0\'\)\s+\)\;", RegexOptions.IgnoreCase);

                    wMySqlText = wRegex.Replace(wMySqlText, "),5));");

                    wRegex = new Regex(@"\'\s*\,\!(?<Body>\@[a-zA-Z_]+[a-zA-Z_0-9]+)\s*\,\s*\'", RegexOptions.IgnoreCase);

                    wMySqlText = wRegex.Replace(wMySqlText, match => String.Format("',{0},'==0 ", match.Groups["Body"].Value));

                    #endregion

                    wRegex = new Regex(@"\,\s*\'\'\'\s*\=\s*\'\'\s*or", RegexOptions.IgnoreCase);
                    wMySqlText = wRegex.Replace(wMySqlText, ", ''' = '''' or");

                    wRegex = new Regex(@"(?<Prev>[A-Za-z0-9]+\s*)\<\=\s*\'\'2010\-01\-01\'\'\s*or", RegexOptions.IgnoreCase);
                    wMySqlText = wRegex.Replace(wMySqlText, match => String.Format("{0}<= '2010-01-01' or", match.Groups["Prev"].Value));
                     
                    wRegex = new Regex(@"str_to_date\(\s*(?<STR>[\']{1,2}2010\-01\-01[\']{1,2})\s*\,\s*[\']{1,2}\%Y\-\%m\-\%d\s*\%H[\']{1,2}\)", RegexOptions.IgnoreCase);
                    wMySqlText = wRegex.Replace(wMySqlText, match => String.Format("cast({0} as datetime)", match.Groups["STR"].Value));
                     
                    wResult.Add(String.Format(SqlProcedure, wDataBaseName, wProcedureName, wParamsString, wMySqlText));

                    #endregion
                }
            }
            catch (Exception ex)
            {
                wSuccess = false;
                Console.WriteLine(ex.ToString());
                wResult.Clear();
            }

            return wResult;
        }

    }
}
