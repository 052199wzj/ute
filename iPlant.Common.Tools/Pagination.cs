namespace iPlant.Common.Tools
{
    public class Pagination
    {
        private Pagination()
        {
            Sort = "ID"; // 默认按Id排序
            SortType = " desc ";
            PageIndex = 1;
            PageSize = 10;
        }

        private Pagination(int wPageSize)
        {
            Sort = "ID"; // 默认按Id排序
            SortType = " desc ";
            PageIndex = 1;
            if (wPageSize <= 0)
                wPageSize = 10;
            PageSize = wPageSize;
        }

        static Pagination()
        {

            MaxPageSize = StringUtils.parseInt(GlobalConstant.GlobalConfiguration.GetValue("MaxPageSize"));

            if (MaxPageSize < 100)
                MaxPageSize = 500;
        }

        private static int MaxPageSize = 100;

        public static Pagination Create(int wPageIndex, int wPageSize, params string[] args)
        {
            if (wPageSize <= 0)
                wPageSize = MaxPageSize;
            Pagination wResult = new Pagination();
            if (wPageIndex <= 0)
                wPageIndex = 1;
            wResult.PageIndex = wPageIndex;
            wResult.PageSize = wPageSize;
            if (args == null)
                return wResult;
            if (args.Length > 0 && !string.IsNullOrWhiteSpace(args[0]))
                wResult.Sort = args[0];
            if (args.Length > 1 && !string.IsNullOrWhiteSpace(args[1]))
                wResult.SortType = args[1];

            if (args.Length > 2 && !string.IsNullOrWhiteSpace(args[2]))
                wResult.PageFuzzy =StringUtils.parseInt(args[2]);
            return wResult;
        }

        private static Pagination mDefault = new Pagination();
        public static Pagination Default
        {
            get
            {
                return mDefault;
            }
        }

        private static Pagination mMaxSize = new Pagination(int.MaxValue);
        public static Pagination MaxSize
        {
            get
            {
                return mMaxSize;
            }
        }



        /// <summary>
        /// 每页行数
        /// </summary>
        public int PageSize { get; set; }
        /// <summary>
        /// 当前页
        /// </summary>
        public int PageIndex { get; set; }
        /// <summary>
        /// 排序列
        /// </summary>
        public string Sort { get; set; }
        /// <summary>
        /// 排序类型
        /// </summary>
        public string SortType { get; set; }
        /// <summary>
        /// 总记录数
        /// </summary>
        public int TotalCount { get; set; }

        /// <summary>
        /// 模糊查询
        /// </summary>
        public int PageFuzzy { get; set; }
        /// <summary>
        /// 总页数
        /// </summary>
        public int TotalPage
        {
            get
            {
                if (TotalCount > 0)
                {
                    return TotalCount % this.PageSize == 0 ? TotalCount / this.PageSize : TotalCount / this.PageSize + 1;
                }
                else
                {
                    return 0;
                }
            }
        }
    }
}
