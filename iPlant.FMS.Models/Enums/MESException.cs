using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public class MESException
    {
        private static readonly List<MESException> _values = new List<MESException>();
        public static List<MESException> values
        {
            get
            {
                return _values.ToArray().ToList();
            }
        }
        /// <summary> 
        /// Default
        /// </summary>
        public static MESException Default { get; } = new MESException(0, "");
        /// <summary>
        /// 逻辑错误
        /// </summary>
        public static MESException Logic { get; } = new MESException(1, "逻辑错误");
        /// <summary>
        /// 数据库错误
        /// </summary>
        public static MESException DBInstance { get; } = new MESException(2, "数据库错误");
        /// <summary>
        /// SQL语法错误
        /// </summary>
        public static MESException DBSQL { get; } = new MESException(3, "SQL语法错误");
        /// <summary>
        /// 参数错误
        /// </summary>
        public static MESException Parameter { get; } = new MESException(4, "参数错误");

        /// <summary>
        /// 系统异常
        /// </summary>
        public static MESException Exception { get; } = new MESException(5, "系统异常");
        /// <summary>
        /// 无授权
        /// </summary>
        public static MESException UnPower { get; } = new MESException(6, "无授权");
        /// <summary>
        /// 文件异常
        /// </summary>
        public static MESException File { get; } = new MESException(7, "文件异常");

        /// <summary>
        /// 数据不存在
        /// </summary>
        public static MESException NotFound { get; } = new MESException(8, "数据不存在");

        /// <summary>
        /// 数据已被锁定或使用
        /// </summary>
        public static MESException DataLock { get; } = new MESException(9, "数据已被锁定或使用");

        /// <summary>
        /// 数据无效
        /// </summary>
        public static MESException DataInvalid { get; } = new MESException(10, "数据无效");

        /// <summary>
        /// 数据重复
        /// </summary>

        public static MESException Duplication { get; } = new MESException(11, "数据重复");

        /// <summary>
        /// 用户名或密码错误
        /// </summary>
        public static MESException UserValidationFailed { get; } = new MESException(12, "用户名或密码错误");

        private readonly int value;
        private readonly String label;

        private MESException(int value, String label)
        {
            this.value = value;
            this.label = label;

            MESException._values.Add(this);
        }



        /**
         * 通过 value 的数值获取枚举实例
         *
         * @param val
         * @return
         */
        public static MESException getEnumType(int val)
        {
            foreach (MESException type in MESException.values)
            {
                if (type.getValue() == val)
                {
                    return type;
                }
            }
            return Default;
        }

        public int getValue()
        {
            return value;
        }

        public int Value
        {
            get
            {
                return value;
            }
        }

        public String getLabel()
        {
            return label;
        }

        public String Label
        {
            get
            {
                return label;
            }
        }
    }
}
