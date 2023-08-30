using System;
using System.Collections.Generic;
using System.Text;

namespace iPlant.FMS.Models
{
    public class ELGCatalog
    {
        /**
             * 目录ID
             */
        public int CatalogID { get; set; } = 0;

        /**
         * 目录或文件名称
         */
        public String CatalogName { get; set; } = "";

        /**
         * 是否是目录
         */
        public Boolean IsCatalog { get; set; } = true;

        /**
         * 文件路径
         */
        public String FilePath { get; set; } = "";

        public DateTime UpdateTime { get; set; } = new DateTime(2000, 1, 1);


        public long Length { get; set; } = 0;

        /**
         * 目录的子项集合
         */
        public List<ELGCatalog> SubCatalogList { get; set; } = new List<ELGCatalog>();


    }
}
