using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using NPOI.HSSF.UserModel;
using NPOI.HSSF.Util;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;

namespace iPlant.Common.Tools
{
    /// <summary>
    /// 高并发使用 常连接默认5个
    /// </summary>
    public class ExcelSheetTool
    {
        private static ExcelSheetTool _Instance;
        public static ExcelSheetTool Instance
        {
            get
            {
                if (_Instance == null)
                    _Instance = new ExcelSheetTool();
                return _Instance;
            }
        }

        private Helper mHelper;

        private ExcelSheetTool()
        {
            mHelper = new Helper();
        }

        /// <summary>
        /// 内置的写入表头  可以自己写
        /// </summary>
        /// <param name="wISheet"></param>
        /// <param name="wTableTitle">表头</param>
        /// <param name="wOrderColumnList"></param>
        /// <param name="wColumnStartIndex"></param>
        /// <param name="wHelper"></param>
        public void SetHeadToSheet(Dictionary<ExcelStyle, ICellStyle> wICellStyleDic, ISheet wISheet, String wTableTitle, List<String> wOrderColumnList, int wColumnStartIndex)
        {

            IRow wHead = wISheet.CreateRow(0);
            wHead.Height = 20 * 30;



            IRow wIRowCloumn = wISheet.CreateRow(1);
            wIRowCloumn.Height = 20 * 25;

            for (int n = 0; n < wOrderColumnList.Count; n++)
            {
                wISheet.SetColumnWidth(n + wColumnStartIndex, 30 * 256);
                wIRowCloumn.CreateCell(n + wColumnStartIndex).SetCellValue(wOrderColumnList[n]);
                wIRowCloumn.GetCell(n + wColumnStartIndex).CellStyle = wICellStyleDic[ExcelStyle.Column];
            }

            int wHeadCloumnSpan = wOrderColumnList.Count;

            if (wHeadCloumnSpan >= 1)
                wISheet.AddMergedRegion(new NPOI.SS.Util.CellRangeAddress(0, 0, 0, wHeadCloumnSpan - 1));///设置表头跨行

            for (int n = 0; n < wHeadCloumnSpan; n++)
            {
                wHead.CreateCell(n).CellStyle = wICellStyleDic[ExcelStyle.Head];
            }
            wHead.GetCell(0).SetCellValue(wTableTitle);//写表头                                                                                            

        }


        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T"></typeparam> 
        /// <param name="wTList"></param>
        /// <param name="wISheet"></param>
        /// <param name="wOrderPropList"></param>
        /// <param name="wRowStartIndex">数据行的起始下标 不算表头</param>
        /// <param name="wColumnStartIndex">数据列的起始下标 不算表头</param>
        /// <param name="wHelper"></param>
        public void SetListToSheet(Dictionary<ExcelStyle, ICellStyle> wICellStyleDic, List<Dictionary<String, Object>> wTList, ISheet wISheet, List<String> wOrderPropList, int wRowStartIndex, int wColumnStartIndex)
        {

            for (int m = 0; m < wTList.Count(); m++)//写数据
            {
                IRow wDataIRow = null;
                wDataIRow = wISheet.GetRow(m + wRowStartIndex);

                if (wDataIRow != null)
                {
                    if (wColumnStartIndex == 0)
                        wISheet.RemoveRow(wDataIRow);
                }


                wDataIRow = wISheet.CreateRow(m + wRowStartIndex);
                wDataIRow.Height = 20 * 20;

                for (int n = 0; n < wOrderPropList.Count(); n++)
                {
                    //object wValue = wTList[m].ContainsKey(wOrderPropList[n]) ? wTList[m][wOrderPropList[n]] : "";
                    object wValue = "";
                    if (wTList[m].ContainsKey(wOrderPropList[n]))
                    {
                        if (wOrderPropList[n] == "ID")
                        {
                            wValue = m + 1;
                        }
                        else
                        {
                            wValue = wTList[m][wOrderPropList[n]];
                        }
                    }

                    wDataIRow.CreateCell(n + wColumnStartIndex).SetCellValue(mHelper.ExchangeDataToExcel(wValue));
                    wDataIRow.GetCell(n + wColumnStartIndex).CellStyle = wICellStyleDic[ExcelStyle.Data];

                }

            }
        }


        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T"></typeparam> 
        /// <param name="wTList"></param>
        /// <param name="wISheet"></param>
        /// <param name="wOrderPropList"></param>
        /// <param name="wRowStartIndex">数据行的起始下标 不算表头</param>
        /// <param name="wColumnStartIndex">数据列的起始下标 不算表头</param>
        /// <param name="wHelper"></param>
        public void SetListToSheet<T>(Dictionary<ExcelStyle, ICellStyle> wICellStyleDic, List<T> wTList, ISheet wISheet, List<String> wOrderPropList, int wRowStartIndex, int wColumnStartIndex)
        {

            for (int m = 0; m < wTList.Count(); m++)//写数据
            {
                IRow wDataIRow = null;
                wDataIRow = wISheet.GetRow(m + wRowStartIndex);

                if (wDataIRow != null)
                {
                    if (wColumnStartIndex == 0)
                        wISheet.RemoveRow(wDataIRow);
                }

                wDataIRow = wISheet.CreateRow(m + wRowStartIndex);
                wDataIRow.Height = 20 * 20;


                PropertyInfo wPropertyInfo = null;

                FieldInfo wFieldInfo = null;
                for (int n = 0; n < wOrderPropList.Count(); n++)
                {
                    wPropertyInfo = typeof(T).GetProperty(wOrderPropList[n]);
                    wFieldInfo = typeof(T).GetField(wOrderPropList[n]);
                    if (wPropertyInfo != null)
                    {
                        wDataIRow.CreateCell(n + wColumnStartIndex).SetCellValue(mHelper.ExchangeDataToExcel(wPropertyInfo.GetValue(wTList[m])));
                        wDataIRow.GetCell(n + wColumnStartIndex).CellStyle = wICellStyleDic[ExcelStyle.Data];
                    }
                    else if (wFieldInfo != null)
                    {

                        wDataIRow.CreateCell(n + wColumnStartIndex).SetCellValue(mHelper.ExchangeDataToExcel(wFieldInfo.GetValue(wTList[m])));
                        wDataIRow.GetCell(n + wColumnStartIndex).CellStyle = wICellStyleDic[ExcelStyle.Data];
                    }

                }



            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T"></typeparam> 
        /// <param name="wTList"></param>
        /// <param name="wISheet"></param>
        /// <param name="wOrderPropList"></param>
        /// <param name="wRowStartIndex">数据行的起始下标 不算表头</param>
        /// <param name="wColumnStartIndex">数据列的起始下标 不算表头</param>
        /// <param name="wHelper"></param>
        public void SetListToSheet(Dictionary<ExcelStyle, ICellStyle> wICellStyleDic, Type wType, System.Collections.IEnumerable wDataSource, ISheet wISheet, List<String> wOrderPropList, int wRowStartIndex, int wColumnStartIndex)
        {
            int m = 0;
            foreach (Object wDataItem in wDataSource)
            {
                IRow wDataIRow = null;
                wDataIRow = wISheet.GetRow(m + wRowStartIndex);

                if (wDataIRow != null)
                {
                    if (wColumnStartIndex == 0)
                        wISheet.RemoveRow(wDataIRow);
                }

                wDataIRow = wISheet.CreateRow(m + wRowStartIndex);
                wDataIRow.Height = 20 * 20;


                PropertyInfo wPropertyInfo = null;

                FieldInfo wFieldInfo = null;
                for (int n = 0; n < wOrderPropList.Count(); n++)
                {
                    wPropertyInfo = wType.GetProperty(wOrderPropList[n]);
                    wFieldInfo = wType.GetField(wOrderPropList[n]);
                    if (wPropertyInfo != null)
                    {
                        wDataIRow.CreateCell(n + wColumnStartIndex).SetCellValue(mHelper.ExchangeDataToExcel(wPropertyInfo.GetValue(wDataItem)));
                        wDataIRow.GetCell(n + wColumnStartIndex).CellStyle = wICellStyleDic[ExcelStyle.Data];
                    }
                    else if (wFieldInfo != null)
                    {

                        wDataIRow.CreateCell(n + wColumnStartIndex).SetCellValue(mHelper.ExchangeDataToExcel(wFieldInfo.GetValue(wDataItem)));
                        wDataIRow.GetCell(n + wColumnStartIndex).CellStyle = wICellStyleDic[ExcelStyle.Data];
                    }

                }

                m++;
            }


        }
        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="wISheet"></param> 
        /// <param name="wOrderPropList">写入的字段顺序</param>
        /// <param name="wRowStartIndex">数据行的起始下标 不算表头</param>
        /// <param name="wColumnStartIndex">数据列的起始下标 不算表头</param>
        /// <param name="wHelper"></param>
        /// <returns></returns>
        public List<T> GetListToSheet<T>(ISheet wISheet, int wRowStartIndex, List<String> wOrderPropList, int wColumnStartIndex)
        {
            List<T> wTList = new List<T>();

            int wRowCount = wISheet.LastRowNum + 1;//总行数
            if (wRowCount < wRowStartIndex)
                return wTList;

            List<PropertyInfo> wPropertyInfolist = new List<PropertyInfo>(typeof(T).GetProperties());

            for (int m = wRowStartIndex; m < wRowCount; m++)
            {
                IRow wIRow = wISheet.GetRow(wRowStartIndex);

                T wT = System.Activator.CreateInstance<T>();
                for (int n = 0; n < wOrderPropList.Count(); n++)
                {

                    string wValue = wIRow.GetCell(n + wColumnStartIndex).StringCellValue;
                    PropertyInfo wPropertyInfo = wPropertyInfolist.Find(p => p.Name == wOrderPropList[n]);

                    if (wPropertyInfo != null)
                        wPropertyInfo.SetValue(wT, mHelper.ExchangeDataToData<T>(wPropertyInfo, wValue), null);
                }
                wTList.Add(wT);
            }
            return wTList;
        }
        public List<ISheet> ImportExcel(string wFileFullPath, ref IWorkbook wIWorkbook)
        {
            List<ISheet> wISheetList = new List<ISheet>();
            wIWorkbook = null;


            if (!File.Exists(wFileFullPath))
                return null;
            using (FileStream wFileStream = File.OpenRead(wFileFullPath))
            {
                // 2007版本  
                if (wFileFullPath.IndexOf(".xlsx") > 0)
                    wIWorkbook = new XSSFWorkbook(wFileStream);
                // 2003版本  
                else if (wFileFullPath.IndexOf(".xls") > 0)
                    wIWorkbook = new HSSFWorkbook(wFileStream);
                if (wIWorkbook == null)
                    throw new System.Exception("文件类型不正确");

                for (int i = 0; i < wIWorkbook.NumberOfSheets; i++)
                {
                    ISheet wISheet = wIWorkbook.GetSheetAt(i);

                    if (wISheet == null)
                        continue;
                    wISheetList.Add(wISheet);
                }
            }
            return wISheetList;
        }
        public Dictionary<String, ISheet> ImportExcelD(string wFileFullPath, ref IWorkbook wIWorkbook)
        {
            Dictionary<String, ISheet> wISheetList = new Dictionary<String, ISheet>();
            wIWorkbook = null;


            if (!File.Exists(wFileFullPath))
                return null;
            using (FileStream wFileStream = File.OpenRead(wFileFullPath))
            {
                // 2007版本  
                if (wFileFullPath.IndexOf(".xlsx") > 0)
                    wIWorkbook = new XSSFWorkbook(wFileStream);
                // 2003版本  
                else if (wFileFullPath.IndexOf(".xls") > 0)
                    wIWorkbook = new HSSFWorkbook(wFileStream);
                if (wIWorkbook == null)
                    throw new System.Exception("文件类型不正确");

                for (int i = 0; i < wIWorkbook.NumberOfSheets; i++)
                {
                    ISheet wISheet = wIWorkbook.GetSheetAt(i);

                    if (wISheet == null)
                        continue;
                    wISheetList.Add(wISheet.SheetName, wISheet);
                }
                wFileStream.Close();
            }
            return wISheetList;
        }
        public Dictionary<String, ISheet> CreatSheetList(IWorkbook wIWorkbook, List<String> wSheetNameList)
        {
            Dictionary<String, ISheet> wISheetList = new Dictionary<string, ISheet>();

            foreach (String wSheetName in wSheetNameList)
            {
                ISheet wISheet = wIWorkbook.CreateSheet(wSheetName);


                wISheetList.Add(wSheetName, wISheet);
            }
            return wISheetList;
        }
        public void ExportExcel(IWorkbook wIWorkbook, string wFileFullName)
        {
            using (FileStream stm = File.OpenWrite(wFileFullName))//写入到文件
            {
                wIWorkbook.Write(stm);
                stm.Close();
            }
        }

        public ICellStyle GetCellstyle(IWorkbook wIWorkbook, ExcelStyle wExcelStyle)
        {

            ICellStyle wICellStyle = wIWorkbook.CreateCellStyle();
            wICellStyle.Alignment = NPOI.SS.UserModel.HorizontalAlignment.Center;
            wICellStyle.VerticalAlignment = NPOI.SS.UserModel.VerticalAlignment.Center;

            wICellStyle.WrapText = true;
            IFont wIFont = wIWorkbook.CreateFont();
            #region 样式区别
            switch (wExcelStyle)
            {
                case ExcelStyle.Head:
                    wIFont.FontName = "宋体";  //字体
                    wIFont.Color = HSSFColor.Black.Index;
                    wIFont.IsItalic = true;
                    wIFont.IsBold = true;
                    wIFont.FontHeight = 16;
                    wIFont.FontHeightInPoints = 16;



                    wICellStyle.LeftBorderColor = HSSFColor.Grey80Percent.Index;
                    wICellStyle.RightBorderColor = HSSFColor.Grey80Percent.Index;//边框颜色
                    wICellStyle.BottomBorderColor = HSSFColor.Grey80Percent.Index;
                    wICellStyle.TopBorderColor = HSSFColor.Grey80Percent.Index;//边框颜色

                    wICellStyle.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thick;
                    wICellStyle.BorderLeft = NPOI.SS.UserModel.BorderStyle.Thick;
                    wICellStyle.BorderRight = NPOI.SS.UserModel.BorderStyle.Thick;
                    wICellStyle.BorderTop = NPOI.SS.UserModel.BorderStyle.Thick;//边框

                    // wICellStyle.FillBackgroundColor = HSSFColor.Black.Index;//背景色
                    wICellStyle.FillForegroundColor = HSSFColor.Black.Index;//前景色
                    break;
                case ExcelStyle.Column:
                    wIFont.FontName = "宋体";  //字体
                    wIFont.Color = HSSFColor.Black.Index;
                    //    wIFont.IsItalic = true;//下划线  
                    wIFont.IsBold = true;
                    wIFont.FontHeight = 14;
                    wIFont.FontHeightInPoints = 14;

                    wICellStyle.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thin;
                    wICellStyle.BorderLeft = NPOI.SS.UserModel.BorderStyle.Thin;
                    wICellStyle.BorderRight = NPOI.SS.UserModel.BorderStyle.Thin;

                    wICellStyle.LeftBorderColor = HSSFColor.Grey80Percent.Index;
                    wICellStyle.RightBorderColor = HSSFColor.Grey80Percent.Index;//边框颜色
                    wICellStyle.BottomBorderColor = HSSFColor.Grey80Percent.Index;


                    // wICellStyle.FillBackgroundColor = HSSFColor.Black.Index;//背景色
                    wICellStyle.FillForegroundColor = HSSFColor.Black.Index;//前景色
                    break;
                case ExcelStyle.Data:
                    wIFont.FontName = "宋体";  //字体
                    wIFont.Color = HSSFColor.Black.Index;
                    //   wIFont.IsItalic = true;//下划线  
                    wIFont.IsBold = false;
                    wIFont.FontHeight = 12;
                    wIFont.FontHeightInPoints = 12;

                    wICellStyle.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thin;
                    wICellStyle.BorderLeft = NPOI.SS.UserModel.BorderStyle.Thin;
                    wICellStyle.BorderRight = NPOI.SS.UserModel.BorderStyle.Thin;

                    wICellStyle.LeftBorderColor = HSSFColor.Grey80Percent.Index;
                    wICellStyle.RightBorderColor = HSSFColor.Grey80Percent.Index;//边框颜色
                    wICellStyle.BottomBorderColor = HSSFColor.Grey80Percent.Index;

                    // wICellStyle.FillBackgroundColor = HSSFColor.Black.Index;//背景色
                    wICellStyle.FillForegroundColor = HSSFColor.Black.Index;//前景色
                    break;
                default:
                    break;
            }
            #endregion
            wICellStyle.SetFont(wIFont);

            return wICellStyle;
        }

        public Dictionary<ExcelStyle, ICellStyle> CreateAllCellstyle(IWorkbook wIWorkbook)
        {
            Dictionary<ExcelStyle, ICellStyle> wResult = new Dictionary<ExcelStyle, ICellStyle>();
            foreach (ExcelStyle wExcelStyle in Enum.GetValues<ExcelStyle>())
            {
                wResult.Add(wExcelStyle, this.GetCellstyle(wIWorkbook, wExcelStyle));
            }
            return wResult;
        }


        public IWorkbook CreatExcel2003()
        {
            IWorkbook wIWorkbook = new HSSFWorkbook();
            return wIWorkbook;
        }
        public IWorkbook CreatExcel2007()
        {
            IWorkbook wIWorkbook = new XSSFWorkbook();
            return wIWorkbook;
        }

    }

    public enum ExcelStyle : short
    {
        Head = 0,
        Column = 1,
        Data = 2,
    }
}