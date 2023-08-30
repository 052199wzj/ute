﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMS.Models
{
    public enum DMSDeviceStatusEnum : uint
    {

        TurnOn = 0b0000000000000001,
        Run = 0b0000000000000010,
        Stop = 0b0000000000000100,
        EmergencyStop = 0b0000000000001000,
        Alarm = 0b0000000000010000,
        Manual = 0b0000000000100000,
        Auto = 0b0000000001000000,
        Wait = 0b0000000010000000,
        Change = 0b0000000100000000,
        Undefine2 = 0b0000001000000000,
        Undefine3 = 0b0000010000000000,
        Undefine4 = 0b0000100000000000,
        Undefine5 = 0b0001000000000000,
        Undefine6 = 0b0010000000000000,
        Undefine7 = 0b0100000000000000,
        Undefine8 = 0b1000000000000000,
        Undefine9 = 0b10000000000000000,
        Undefine10 = 0b100000000000000000,
        Undefine11 = 0b1000000000000000000,
        Undefine12 = 0b10000000000000000000,

    }

    public class DMSDeviceStatusEnumTool
    {



        public List<UInt32> Values = new List<uint>();

        public Dictionary<String, UInt32> ValuesDic = new Dictionary<String, UInt32>();

        public int FullValue = 0;

        private DMSDeviceStatusEnumTool()
        {
            Values.Clear();
            ValuesDic.Clear();
            foreach (DMSDeviceStatusEnum wDMSDeviceStatusEnum in Enum.GetValues<DMSDeviceStatusEnum>())
            {
                Values.Add((uint)wDMSDeviceStatusEnum);
                ValuesDic.Add(Enum.GetName(wDMSDeviceStatusEnum), (uint)wDMSDeviceStatusEnum);
                FullValue |= (int)wDMSDeviceStatusEnum;
            } 
        }

        private static DMSDeviceStatusEnumTool _Instance = new DMSDeviceStatusEnumTool();
        public static DMSDeviceStatusEnumTool getInstance()
        {
            return _Instance;
        }


        public List<int> CompareStatus(int wOldStatus, int wNewStatus, out List<int> wlive, out List<int> wOver)
        {

            List<int> wResult = new List<int>();
            wlive = new List<int>();
            wOver = new List<int>();
            foreach (int item in Values)
            {
                if ((item & wOldStatus & wNewStatus) > 0)
                    wResult.Add(item);

                if ((item & wNewStatus) > 0 && (item & wOldStatus) <= 0)
                    wlive.Add(item);

                if ((item & wOldStatus) > 0 && (item & wNewStatus) <= 0)
                    wOver.Add(item);
            }

            //判断关机状态
            if (((wNewStatus & (int)DMSDeviceStatusEnum.TurnOn) <= 0)&&((wOldStatus & (int)DMSDeviceStatusEnum.TurnOn) <= 0)) {
                wResult.Add(0);
            }
            if (((wNewStatus & (int)DMSDeviceStatusEnum.TurnOn) <= 0) && ((wOldStatus & (int)DMSDeviceStatusEnum.TurnOn)> 0))
            {
                wlive.Add(0);
            }
            if (((wNewStatus & (int)DMSDeviceStatusEnum.TurnOn) > 0) && ((wOldStatus & (int)DMSDeviceStatusEnum.TurnOn) <= 0))
            {
                wOver.Add(0);
            }
             
            return wResult;
        }

        public int ListToStatus(ICollection<int> wStatusList)
        {
            int wResult = 0;
            if (wStatusList == null || wStatusList.Count <= 0)
                return wResult;

            foreach (int item in wStatusList)
            {
                wResult = wResult | item;
            }
            return wResult;
        }


    }
}
