using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public class CGSTable
    {
        public int ID { get; set; } = 0;

        public int CompanyID { get; set; } = 0;

        public int UserID { get; set; } = 0;

        //表格名称
        public String TableName { get; set; } = "";
        //对应表格显示条数
        public int Counts { get; set; } = 0;
        //模块名称
        public String ModleName { get; set; } = "";
        //CGField集合
        public List<CGSField> List { get; set; } =
        new List<CGSField>();


        public CGSTable()
        {
            // TODO Auto-generated constructor stub
            this.ID = 0;
            this.Counts = -1;
            this.CompanyID = 0;
            this.TableName = "";
            this.UserID = -1;
            this.ModleName = "";
            this.List = new List<CGSField>();
        }
    }
}
