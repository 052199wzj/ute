using System.Text;
using System.Data.Common;

namespace iPlant.Data.EF.Extension
{
    public static class DatabasePageExtension
    {
        public static StringBuilder SqlPageSql(string strSql, DBEnumType wDBType, string sort, bool isAsc, int pageSize, int pageIndex)
        {
            StringBuilder sb = null;
            switch (wDBType)
            {
                case DBEnumType.Default:
                    
                    break;
                case DBEnumType.MySQL:
                    sb = SqlPageMySql(strSql, sort, isAsc, pageSize, pageIndex);
                    break;
                case DBEnumType.SQLServer:
                    sb = SqlPageSqlServer(strSql, sort, isAsc, pageSize, pageIndex);
                    break;
                case DBEnumType.Oracle:
                    break;
                case DBEnumType.Access:
                    break;
                default:
                    break;
            }
            return sb;
        }

        public static StringBuilder SqlPageSql(string strSql, DBEnumType wDBType, string sort, string sortType, int pageSize, int pageIndex)
        {
            StringBuilder sb = null;

            if (string.IsNullOrWhiteSpace(sortType))
                sortType = "desc";

            bool isAsc = sortType.Equals("ASC",System.StringComparison.CurrentCultureIgnoreCase);

            switch (wDBType)
            {
                case DBEnumType.Default:

                    break;
                case DBEnumType.MySQL:
                    sb = SqlPageMySql(strSql, sort, isAsc, pageSize, pageIndex);
                    break;
                case DBEnumType.SQLServer:
                    sb = SqlPageSqlServer(strSql, sort, isAsc, pageSize, pageIndex);
                    break;
                case DBEnumType.Oracle:
                    break;
                case DBEnumType.Access:
                    break;
                default:
                    break;
            }
            return sb;
        }

        private static StringBuilder SqlPageSqlServer(string strSql,   string sort, bool isAsc, int pageSize, int pageIndex)
        {
            StringBuilder sb = new StringBuilder();
            if (pageIndex <= 0)
            {
                pageIndex = 1;
            }
            int num = (pageIndex-1 ) * pageSize;
            int num1 = (pageIndex) * pageSize;
            string OrderBy = "";

            if (!string.IsNullOrEmpty(sort))
            {
                if (sort.ToUpper().IndexOf("ASC") + sort.ToUpper().IndexOf("DESC") > 0)
                {
                    OrderBy = " ORDER BY " + sort;
                }
                else
                {
                    OrderBy = " ORDER BY " + sort + " " + (isAsc ? "ASC" : "DESC");
                }
            }
            else
            {
                OrderBy = "ORDERE BY (SELECT 0)";
            }
            sb.Append("SELECT * FROM (SELECT ROW_NUMBER() Over (" + OrderBy + ")");
            sb.Append(" AS ROWNUM, * From (" + strSql + ") t ) AS N WHERE ROWNUM > " + num + " AND ROWNUM <= " + num1 + "");
            return sb;
        }

        private static StringBuilder SqlPageMySql(string strSql,    string sort, bool isAsc, int pageSize, int pageIndex)
        {
            StringBuilder sb = new StringBuilder();
            if (pageIndex <= 0)
            {
                pageIndex = 1;
            }
             
            string OrderBy = "";

            if (!string.IsNullOrEmpty(sort))
            {
                if (sort.ToUpper().IndexOf("ASC") + sort.ToUpper().IndexOf("DESC") > 0)
                {
                    OrderBy = " ORDER BY " + sort;
                }
                else
                {
                    OrderBy = " ORDER BY " + sort + " " + (isAsc ? "ASC" : "DESC");
                }
            }
             
            sb.Append(strSql + OrderBy + " limit " + ((pageIndex-1)* pageSize) + ","+ pageSize ); 
            return sb;
        }

        
    }
}
