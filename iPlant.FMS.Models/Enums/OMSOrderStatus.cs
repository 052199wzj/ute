using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public enum OMSOrderStatus : int
    {
        [Description("默认")]
        Default = 0, 
        [Description("已保存")]
        HasOrder = 1,
        [Description("已制定")]
        PlantOrder = 2,
        [Description("已下达")]
        WeekPlantOrder = 3,
        [Description("已开工")]
        ProductOrder = 4,
        [Description("已完工")]
        FinishOrder = 5,
        [Description("暂停中")]
        StopOrder = 6,
        [Description("已入库")]
        StockOrder = 7,
        [Description("已上传")]
        SendOrder = 8,
        [Description("已关闭")]
        CloseOrder = 9,
        [Description("已逾期")]  //非主状态
        OverOrder = 10
    }

    public enum OMSWorkpieceStatus : int
    {
        [Description("未加工")]
        Default = 0,
        [Description("加工中")]
        Start = 1,
        [Description("已完成")]
        Done = 2,
        [Description("已报废")]
        Scrap = 3, 
    }
}
