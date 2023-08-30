using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public class CGSField
    {
        public int ID { get;set; } =0;
        //表格ID
        public int TableID { get; set; } =0;
        //字段名称
        public String FieldName { get; set; } ="";
        //字段含义
        public String FieldText { get; set; } ="";
        //是否显示
        public int IsVisiable { get; set; } =0;
        //字段顺序
        public int FieldOrder { get; set; } =0;
        //字段最小宽度 单位为px
        public int FieldWidth { get; set; } =0;



        public CGSField()
        {
            // TODO Auto-generated constructor stub
            this.ID = 0;
            this.TableID = 0;
            this.FieldName = "";
            this.FieldOrder = -1;
            this.FieldText = "";
            this.IsVisiable = 1;
            this.FieldWidth = 20;
        }
    }
}
