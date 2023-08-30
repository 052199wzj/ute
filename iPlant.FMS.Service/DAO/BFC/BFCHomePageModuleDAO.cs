using System;
using System.Collections.Generic;
using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using iPlant.Data.EF;

namespace iPlant.FMC.Service
{
    class BFCHomePageModuleDAO : BaseDAO
    {


        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(BFCHomePageModuleDAO));

        private static BFCHomePageModuleDAO Instance;

        public List<BFCHomePageModule> SelectAll(BMSEmployee wLoginUser, int wID, int wType, int wGrad, OutResult<Int32> wErrorCode)
        {
            List<BFCHomePageModule> wResult = new List<BFCHomePageModule>();
            try
            {
                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                String wSQL = StringUtils.Format(
                        "SELECT * FROM {0}.mbs_menu_item WHERE 1=1 and (@wType <= 0 or @wType=Type) and (@wGrad <= 0 or @wGrad=Grad)  and (@wID <= 0 or @wID=ID);",
                        wInstance);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>
                {
                    { "wType", wType },
                    { "wID", wID },
                    { "wGrad", wGrad }
                };
                wSQL = this.DMLChange(wSQL);

                wResult = this.QueryForList<BFCHomePageModule>(wSQL, wParamMap);

            }
            catch (Exception e)
            {

                logger.Error("SelectAll", e);
                wErrorCode.set(MESException.DBSQL.Value);

            }
            return wResult;
        }

        public BFCHomePageModule Select(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode)
        {
            BFCHomePageModule wResult = new BFCHomePageModule();
            try
            {
                if (wID <= 0)
                    return wResult;

                List<BFCHomePageModule> wBFCHomePageModuleList = SelectAll(wLoginUser,wID, 0, 0, wErrorCode);

                if (wBFCHomePageModuleList.Count == 1)
                {
                    wResult = wBFCHomePageModuleList[0];
                }

            }
            catch (Exception e)
            {
                logger.Error("Select", e);

            }
            return wResult;
        }

        public int Update(BMSEmployee wLoginUser, BFCHomePageModule wBFCHomePageModule, OutResult<Int32> wErrorCode)
        {
            int wResult = 0;
            try
            {

                /// \"\s*\+[\s ]*\"
                /// \`([A-Za-z0-9_]+)\`
                /// \<\{([A-Za-z0-9_]+)\:[^\}]+\}\>

                wErrorCode.set(0); 
	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                wBFCHomePageModule.EditorID = wLoginUser.ID; 

                String wSQL = "";
                Dictionary<String, Object> wParams = CloneTool.Clone<Dictionary<String, Object>>(wBFCHomePageModule);
                if (wBFCHomePageModule.ID <= 0)
                {
                    wBFCHomePageModule.CreatorID = wLoginUser.ID;
                    wSQL = StringUtils.Format(
                            "INSERT INTO {0}.mbs_menu_item(Name,GroupID,Icon,IconColor,Url,Type,Active,CreateTime,EditTime,CreatorID,EditorID,IsDefault,SecretKey,EventModule,OrderNum,Grad,RoleID) "
                                    + " VALUES (@Name,@GroupID,@Icon,@IconColor,@Url,@Type,@Active,now(),now(),@CreatorID,@EditorID,0,@SecretKey,@EventModule,@OrderNum,@Grad,@RoleID);",
                            wInstance);
                }
                else
                {
                    wSQL = StringUtils.Format(
                            "UPDATE  {0}.mbs_menu_item SET  Name = @Name, GroupID = @GroupID ,  Icon = @Icon, "
                                    + "IconColor=@IconColor,Url = @Url ,  Type = @Type,  SecretKey = @SecretKey,  "
                                    + "Active = @Active,  EditTime = now(), OrderNum= @OrderNum, Grad= @Grad, RoleID=@RoleID,"
                                    + "CreatorID = @CreatorID,  EditorID = @EditorID ,EventModule=@EventModule  WHERE ID = @ID; ",
                            wInstance);
                }
                wSQL = this.DMLChange(wSQL);


                if (wBFCHomePageModule.ID <= 0)
                {
                    wResult = (int)mDBPool.insert(wSQL, wParams);
                    wBFCHomePageModule.ID = wResult;
                }
                else
                {
                    mDBPool.update(wSQL, wParams);
                    wResult = wBFCHomePageModule.ID;
                }

            }
            catch (Exception e)
            {
                logger.Error("Update", e);
                wErrorCode.set(MESException.DBSQL.Value);

            }
            return wResult;
        }

        private BFCHomePageModuleDAO() : base()

        {
        }

        public static BFCHomePageModuleDAO getInstance()
        {
            if (Instance == null)
                Instance = new BFCHomePageModuleDAO();
            return Instance;
        }

    }
}
