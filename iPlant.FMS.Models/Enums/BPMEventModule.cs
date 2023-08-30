using System.ComponentModel;

namespace iPlant.FMS.Models
{
    public enum BPMEventModule : int {
        [Description("默认")] 
        Default = 0,
        [Description("产线点检")]
        DeviceDJ = 4001,
        [Description("质量首巡检")]
        QTXJ = 2003,
        [Description("设备维护")]
        DeviceBY = 4002,
        [Description("设备维修")]
        DeviceWX= 4003,
        [Description("生产异常")]
        SCCall = 1012


        
    }

    public static class EnumCustomerExtension {

        public static int GetFunctionID(this BPMEventModule wBPMEventModule) {

            int wFunctionID = 0;
            switch (wBPMEventModule)
            {
                case BPMEventModule.Default:
                    wFunctionID = 0;
                    break;
                case BPMEventModule.DeviceDJ:
                    wFunctionID = 0;
                    break;
                case BPMEventModule.QTXJ:
                    wFunctionID = 0;
                    break;
                case BPMEventModule.DeviceBY:
                    wFunctionID = 403202;
                    break;
                case BPMEventModule.DeviceWX:
                    wFunctionID = 404002;
                    break;
                case BPMEventModule.SCCall:
                    wFunctionID = 809003;
                    break;
                default:
                    break;
            }
            return wFunctionID;
        }

        public static BPMEventModule GetEventModule(this IPTTypes wIPTType)
        {
            BPMEventModule wBPMEventModule = BPMEventModule.Default;
            switch (wIPTType)
            {
                case IPTTypes.Default:
                   
                    break;
                case IPTTypes.Patrol:
                    wBPMEventModule = BPMEventModule.QTXJ;
                    break;
                case IPTTypes.PointCheck:
                    wBPMEventModule = BPMEventModule.DeviceDJ;
                    break;
                case IPTTypes.Maintain:
                    wBPMEventModule = BPMEventModule.DeviceBY;
                    break;
                case IPTTypes.Repair:
                    wBPMEventModule = BPMEventModule.DeviceWX;
                    break;
                case IPTTypes.Exception:
                    break;
                default:
                    break;
            }
            return wBPMEventModule;
        }
    }
}
