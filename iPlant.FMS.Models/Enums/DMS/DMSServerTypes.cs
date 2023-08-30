using System.ComponentModel;

namespace iPlant.FMS.Models
{
    public enum DMSServerTypes : int
    {
        [Description("默认")]
        Default = 0,
        [Description("OPC")]
        OPC = 1,
        [Description("Tcp")]
        Tcp = 2,
        [Description("Fanuc")]
        Fanuc = 3,
        [Description("Mitsubishi")]
        Mitsubishi = 4
    }
}
