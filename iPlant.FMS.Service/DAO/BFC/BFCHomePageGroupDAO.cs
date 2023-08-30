using iPlant.Common.Tools;
using iPlant.Data.EF;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    class BFCHomePageGroupDAO : BaseDAO
    {


        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(BFCHomePageGroupDAO));

        private static BFCHomePageGroupDAO Instance;

        public List<BFCHomePageGroup> SelectAll(BMSEmployee wLoginUser, int wType, int wGrad, OutResult<Int32> wErrorCode)
        {
            List<BFCHomePageGroup> wResult = new List<BFCHomePageGroup>();
            try
            {
                 

                String wSQL = StringUtils.Format("SELECT * FROM {0}.mbs_menu_group WHERE 1=1 and (@wGrad <= 0 or @wGrad=Grad)  and (@wType <= 0 or @wType=Type );",
                        MESDBSource.Basic.getDBName());
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>
                {
                    { "wType", wType },
                    { "wGrad", wGrad }
                };
                wSQL = this.DMLChange(wSQL);

                wResult = this.QueryForList<BFCHomePageGroup>(wSQL, wParamMap);



            }
            catch (Exception e)
            {
                logger.Error("SelectAll", e);
            }
            return wResult;
        }

        public int Update(BMSEmployee wLoginUser, BFCHomePageGroup wBFCHomePageGroup, OutResult<Int32> wErrorCode)
        {
            int wResult = 0;
            try
            {

                /// \"\s*\+[\s ]*\"
                /// \`([A-Za-z0-9_]+)\`
                /// \<\{([A-Za-z0-9_]+)\:[^\}]+\}\>
                  
                wBFCHomePageGroup.EditorID = wLoginUser.ID;

                String wSQL = "";
                Dictionary<String, Object> wParams = CloneTool.Clone<Dictionary<String, Object>>(wBFCHomePageGroup);
                if (wBFCHomePageGroup.ID <= 0)
                {
                    wBFCHomePageGroup.CreatorID = wLoginUser.ID;
                    //wSQL = StringUtils.Format(
                    //        "INSERT INTO {0}.mbs_menu_group(Name,Icon,IconColor,Icon_S,Type,Active,CreateTime,EditTime,CreatorID,EditorID,OrderNum,Grad,RoleID,GroupID)"
                    //                + "VALUES(@Name,@Icon,@IconColor,@Icon_S,@Type,@Active,@CreateTime,@EditTime,@CreatorID,@EditorID,@OrderNum,@Grad,@RoleID,@GroupID);",
                    //                MESDBSource.Basic.getDBName());
                    wSQL = StringUtils.Format(
                         "INSERT INTO {0}.mbs_menu_group(Name,Icon,IconColor,Icon_S,Type,Active,CreateTime,EditTime,CreatorID,EditorID,OrderNum,Grad,RoleID,GroupID)"
                                 + "VALUES(@Name,@Icon,@IconColor,@Icon_S,@Type,@Active,now(),now(),@CreatorID,@EditorID,@OrderNum,@Grad,@RoleID,@GroupID);",
                                 MESDBSource.Basic.getDBName());

                    wBFCHomePageGroup.ID = (int)base.mDBPool.insert(wSQL, wParams); 
                }
                else
                {
                    wSQL = StringUtils.Format(
                            "UPDATE  {0}.mbs_menu_group SET  Name = @Name,  Icon = @Icon, IconColor = @IconColor,Icon_S =@Icon_S, Type = @Type,RoleID=@RoleID, GroupID=@GroupID ,"
                                    + "Active = @Active,  CreateTime = @CreateTime,  EditTime = @EditTime,  "
                                    + "CreatorID = @CreatorID,  EditorID = @EditorID ,OrderNum=@OrderNum,Grad=@Grad  WHERE ID = @ID; ",
                                    MESDBSource.Basic.getDBName());

                    base.mDBPool.update(wSQL, wParams);
                  
                }
                wResult = wBFCHomePageGroup.ID;
                 
            }
            catch (Exception e)
            {
                logger.Error("Update", e);
            }
            return wResult;
        }

        private BFCHomePageGroupDAO():base()
        {
            
        }

        public static BFCHomePageGroupDAO getInstance()
        {
            if (Instance == null)
                Instance = new BFCHomePageGroupDAO();
            return Instance;
        }

    }
}
