using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    public class ServiceInstance
    {
        public static BFCService mBFCService = BFCServiceImpl.getInstance();
        public static BMSService mBMSService = BMSServiceImpl.getInstance();
        public static CFGService mCFGService = CFGServiceImpl.getInstance();
        public static ELGService mELGService = ELGServiceImpl.getInstance();
        public static FMCService mFMCService = FMCServiceImpl.getInstance();
        public static DMSService mDMSService = DMSServiceImpl.getInstance();
        public static OMSService mOMSService = OMSServiceImpl.getInstance();
        public static MSSService mMSSService = MSSServiceImpl.getInstance();
        public static QMSService mQMSService = QMSServiceImpl.getInstance();
        public static WMSService mWMSService = WMSServiceImpl.getInstance();
        public static FPCService mFPCService = FPCServiceImpl.getInstance();
        public static IPTService mIPTService = IPTServiceImpl.getInstance();
    }
}
