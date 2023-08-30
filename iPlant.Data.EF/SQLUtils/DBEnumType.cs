using System.ComponentModel;

namespace iPlant.Data.EF
{
    public enum DBEnumType
    {
        [Description("Default")]
        Default = 0,
        [Description("Mysql")]
        MySQL,
        [Description("SQLServer")]
        SQLServer,
        [Description("Oracle")]
        Oracle,
        [Description("Access")]
        Access
    }
}
