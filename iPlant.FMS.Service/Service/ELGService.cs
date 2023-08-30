using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    public interface ELGService
    {
        /**
	 * 获取日志目录集合
	 * 
	 * @return
	 */
        ServiceResult<List<ELGCatalog>> ELG_QueryCataLogList(BMSEmployee wLoginUser);


        /**
         * 删除日志文件
         * 
         * @param wID
         */
        ServiceResult<Boolean> ELG_DeleteLogFile(BMSEmployee wLoginUser, String wPath);

        /**
    * 删除日志文件
    * 
    * @param wID
    */
        ServiceResult<List<String>> ELG_ShowLogFile(BMSEmployee wLoginUser, String wPath);

        /**
         * 删除文件集合
         * 
         * @param wIDList
         * @return
         */
        ServiceResult<String> ELG_DeleteLogFileList(BMSEmployee wLoginUser, List<String> wPathList);

    }
}
