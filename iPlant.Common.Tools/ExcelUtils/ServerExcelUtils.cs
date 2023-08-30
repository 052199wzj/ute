using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel; 
using NPOI.XSSF.UserModel; 
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq; 

namespace iPlant.Common.Tools
{

    public enum ExcelExtType
    {
        error,
        xls,
        xlsx,

    }
    public class ServerExcelUtils
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(ServerExcelUtils));
        private static ServerExcelUtils _Instance;

        public static ServerExcelUtils Instance
        {
            get
            {
                if (_Instance == null)
                    _Instance = new ServerExcelUtils();
                return _Instance;
            }
        }
        private ServerExcelUtils() { }

        /// <summary>
        /// 上传Excel导入
        /// </summary>
        /// <param name="file">上载文件对象</param>
        /// <param name="errorMsg">错误信息</param>
        /// <param name="sheetName">表名，默认取第一张</param>
        /// <returns></returns>
        public List<Dictionary<String, Object>> Import(Stream wStream ,String wFileName, out string errorMsg, string sheetName = "")
        {
            errorMsg = "";
            if (wStream == null || wStream.Length == 0)
            {
                errorMsg = "请选择要导入的Excel文件";
                return null;
            }
            ExcelExtType excelType = GetExcelFileType(wFileName);
            if (excelType == ExcelExtType.error)
            {
                errorMsg = "请选择正确的Excel文件";
                return null;
            }
            using (MemoryStream stream = new MemoryStream())
            {
                wStream.Position = 0;
                wStream.CopyTo(stream);
                List<Dictionary<String, Object>> dt = ImportExcel(stream, excelType, sheetName);
                if (dt == null)
                    errorMsg = "导入失败,请选择正确的Excel文件";
                return dt;
            }
        }

        private ExcelExtType GetExcelFileType(string wFileFullPath)
        {

            // 2007版本  
            if (wFileFullPath.IndexOf(".xlsx") > 0)
                return ExcelExtType.xlsx;
            // 2003版本  
            else if (wFileFullPath.IndexOf(".xls") > 0)
                return ExcelExtType.xls;

            return ExcelExtType.error;
        }

        /// <summary>
        /// 根据Excel格式读取Excel
        /// </summary>
        /// <param name="stream">文件流</param>
        /// <param name="type">Excel格式枚举类型，xls/xlsx</param>
        /// <param name="sheetName">表名，默认取第一张</param>
        /// <returns>DataTable</returns>
        private List<Dictionary<String, Object>> ImportExcel(Stream stream, ExcelExtType type, string sheetName)
        {
            List<Dictionary<String, Object>> dt = new List<Dictionary<String, Object>>();
            IWorkbook workbook;
            try
            {
                //xls使用HSSFWorkbook类实现，xlsx使用XSSFWorkbook类实现
                stream.Position = 0;
                switch (type)
                {
                    case ExcelExtType.xlsx:
                        workbook = new XSSFWorkbook(stream);
                        break;
                    default:
                        workbook = new HSSFWorkbook(stream);
                        break;
                }
                ISheet sheet = null;
                //获取工作表 默认取第一张
                if (string.IsNullOrWhiteSpace(sheetName))
                    sheet = workbook.GetSheetAt(0);
                else
                    sheet = workbook.GetSheet(sheetName);

                if (sheet == null)
                    return null;
                IEnumerator rows = sheet.GetRowEnumerator();
                //sheet.NumMergedRegions

                int wRowIndex = 1;
                #region 获取表头
                IRow headerRow = sheet.GetRow(0);
                for (int i = sheet.FirstRowNum; i < sheet.LastRowNum; i++)
                {
                    headerRow = sheet.GetRow(i);
                    if (headerRow.GetCell(0).IsMergedCell)
                    {
                        wRowIndex++;
                        continue;
                    }
                    break;
                }

                Dictionary<int, String> wRowStringList = new Dictionary<int, String>();


                int cellCount = headerRow.LastCellNum;
                for (int j = 0; j < cellCount; j++)
                {

                    ICell cell = headerRow.GetCell(j);
                    if (cell != null)
                    {
                        wRowStringList.Add(j, cell.ToString());
                    }
                    else
                    {
                        wRowStringList.Add(j, "");
                    }
                }

                #endregion
                #region 获取内容
                for (int i = (sheet.FirstRowNum + wRowIndex); i <= sheet.LastRowNum; i++)
                {
                    IRow row = sheet.GetRow(i);

                    Dictionary<String, Object> wRowObject = new Dictionary<string, Object>();


                    for (int j = row.FirstCellNum; j < cellCount; j++)
                    {
                        if (row.GetCell(j) != null)
                        {
                            //判断单元格是否为日期格式
                            switch (row.GetCell(j).CellType)
                            {
                                case CellType.Blank:
                                    wRowObject[wRowStringList[j]] = "";
                                    break;
                                case CellType.Boolean:
                                    wRowObject[wRowStringList[j]] = row.GetCell(j).BooleanCellValue;
                                    break;
                                case CellType.Error:
                                    wRowObject[wRowStringList[j]] = row.GetCell(j).ToString();
                                    break;
                                case CellType.Formula:
                                    wRowObject[wRowStringList[j]] = row.GetCell(j).ToString();
                                    break;
                                case CellType.Numeric:
                                    if (HSSFDateUtil.IsCellDateFormatted(row.GetCell(j)))
                                    {
                                        wRowObject[wRowStringList[j]] = row.GetCell(j).DateCellValue;
                                    }
                                    else
                                    {
                                        wRowObject[wRowStringList[j]] = row.GetCell(j).NumericCellValue;
                                    }
                                    break;
                                case CellType.String:
                                    wRowObject[wRowStringList[j]] = row.GetCell(j).StringCellValue;
                                    break;
                                case CellType.Unknown:
                                    wRowObject[wRowStringList[j]] = row.GetCell(j).ToString();
                                    break;

                                default:
                                    wRowObject[wRowStringList[j]] = row.GetCell(j).ToString();
                                    break;
                            }


                        }
                    }
                    dt.Add(wRowObject);
                }
                #endregion

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());logger.Error( System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                dt = null;
            }
            return dt;
        }
 

        public String Export(String wRootPath,String wPath, List<Dictionary<String, Object>> wInputList, Dictionary<String, String> wHeadTitle, string wTitle,
            String wFileName, out String errorMsg, List<String> wOrderList = null)
        {
            errorMsg = "";
            String wResult = "";
            wTitle = String.IsNullOrWhiteSpace(wTitle) ? "Sheet1" : wTitle;
            wOrderList = wOrderList == null ? wHeadTitle.Keys.ToList() : wOrderList;
            if (wHeadTitle == null || wHeadTitle.Count == 0)
            {
                errorMsg = "导出Excel文件输入数据为空！！";
                return null;
            }
            ExcelExtType excelType = GetExcelFileType(wFileName);
            if (excelType == ExcelExtType.error)
            {
                errorMsg = "请选择正确的Excel文件名";
                return null;
            }
            IWorkbook wIWorkbook = null;
            switch (excelType)
            {

                case ExcelExtType.xls:
                    wIWorkbook = ExcelSheetTool.Instance.CreatExcel2003( );
                    break;
                case ExcelExtType.xlsx:
                    wIWorkbook = ExcelSheetTool.Instance.CreatExcel2007();
                    break;
                default:
                    break;
            }
            Dictionary<ExcelStyle, ICellStyle> wICellStyleDic = ExcelSheetTool.Instance.CreateAllCellstyle(wIWorkbook);
            Dictionary<String, ISheet> wISheetList = ExcelSheetTool.Instance.CreatSheetList(wIWorkbook, new List<String>() { wTitle });

            List<String> wOrderColumnList = wOrderList.Select(p => wHeadTitle[p]).ToList();

            ExcelSheetTool.Instance.SetHeadToSheet(wICellStyleDic,wISheetList[wTitle], wTitle, wOrderColumnList, 0);

            ExcelSheetTool.Instance.SetListToSheet(wICellStyleDic,wInputList, wISheetList[wTitle], wOrderList, 2, 0);

            String wFileFullName = StringUtils.CombinePath(wRootPath, wPath);
            if (wPath.IndexOf('/') == 0)
                wFileFullName = StringUtils.CombinePath(wRootPath, wPath.Remove(0, 1));

            if (!Directory.Exists(wFileFullName))
                Directory.CreateDirectory(wFileFullName);

            ExcelSheetTool.Instance.ExportExcel(wIWorkbook, StringUtils.CombinePath(wFileFullName, wFileName));
            wFileFullName = StringUtils.CombinePath(wFileFullName, wFileName);
            using (FileStream stm = File.OpenWrite(wFileFullName))//写入到文件
            {
                wIWorkbook.Write(stm);
                stm.Close();
            }

            wResult = StringUtils.CombinePath(wPath, wFileName);
            return wResult;
        }



    }
}