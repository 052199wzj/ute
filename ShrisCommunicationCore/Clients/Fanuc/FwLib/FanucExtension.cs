using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ShrisCommunicationCore
{


    public static class FanucExtension
    {
        public static Dictionary<String, short> pmcAddress = new Dictionary<string, short>();


        public static Dictionary<String, short> pmcType = new Dictionary<string, short>();

        static FanucExtension()
        {
            pmcAddress.Add("G", 0);
            pmcAddress.Add("F", 1);
            pmcAddress.Add("Y", 2);
            pmcAddress.Add("X", 3);
            pmcAddress.Add("A", 4);
            pmcAddress.Add("R", 5);
            pmcAddress.Add("T", 6);
            pmcAddress.Add("K", 7);
            pmcAddress.Add("C", 8);
            pmcAddress.Add("D", 9);


            pmcType.Add("B", 0);
            pmcType.Add("W", 1);
            pmcType.Add("D", 2);
            pmcType.Add("BYTE", 0);
            pmcType.Add("WORD", 1);
            pmcType.Add("DWORD", 2);

        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="wAddress"> //G0005[D,10]  {1位地址码}{4位起始地址}[{数据类型},{长度}]</param>
        /// <returns></returns>
        public static FanucAddress FanucAddressObject(this String wAddress)
        {

            //G0005[D,10]  {1位地址码}{4位起始地址}[{数据类型},{长度}]
            if (wAddress == null)
                return null;
            FanucAddress wResult = new FanucAddress();

            string addressStr = wAddress.Substring(0, 1);


            wResult.kind = addressStr.ToUpper().FanucAddressKind();

            int wCharIndex = wAddress.IndexOf('[');

            if (wCharIndex <= 1)
                return wResult;

            addressStr = wAddress.Substring(1, wCharIndex-1);

            if (addressStr.IndexOf('.') > 0)
            {
                String wIndexStr = addressStr.Substring(addressStr.IndexOf('.') + 1);
                addressStr = addressStr.Substring(0, addressStr.IndexOf('.'));
                if (Int16.TryParse(wIndexStr, out short wIndex))
                    wResult.Index = wIndex;

            }

            UInt16 wTemp16 = 0;

            if (!UInt16.TryParse(addressStr, out wTemp16))
                return wResult;

            wResult.start = wTemp16;

            if (wAddress.Length <= wCharIndex + 1)
                return wResult;

            wAddress = wAddress.Substring(wCharIndex);

            wCharIndex = wAddress.IndexOf(',');

            if (wCharIndex <= 1)
                return wResult;

            addressStr = wAddress.Substring(1, wCharIndex - 1);

            wResult.type = addressStr.FanucAddressType();


            wAddress = wAddress.Substring(wCharIndex);
            wCharIndex = wAddress.IndexOf(']');
            if (wCharIndex <= 1)
                return wResult;

            addressStr = wAddress.Substring(1, wCharIndex - 1);

            if (!UInt16.TryParse(addressStr, out wTemp16))
                return wResult;

            if (wTemp16 <= 0)
                wTemp16 = 1;

            if (wTemp16 > 5)
                wTemp16 = 5;

            wResult.lengthS = wTemp16;


            return wResult;
        }



        public static short FanucAddressType(this String wAddress)
        {
            if (wAddress == null)
                return 0;

            if (!pmcType.ContainsKey(wAddress))
                return 0;

            return pmcType[wAddress];
        }

        public static short FanucAddressKind(this String wAddress)
        {
            if (wAddress == null)
                return 0;

            if (!pmcAddress.ContainsKey(wAddress))
                return 0;

            return pmcAddress[wAddress];
        }



        public static int[] FanucDataSetResult(this byte[] wData)
        {
            List<int> wResult = new List<int>();
            if (wData == null || wData.Length <= 0)
                return wResult.ToArray();

            foreach (var item in wData)
            {
                wResult.Add(item);
            }
            return wResult.ToArray();
        }

        public static int[] FanucDataSetResult(this short[] wData)
        {
            List<int> wResult = new List<int>();
            if (wData == null || wData.Length <= 0)
                return wResult.ToArray();

            foreach (var item in wData)
            {
                wResult.Add(item);
            }
            return wResult.ToArray();
        }

        public static byte[] FanucDataGetByteResult(this int[] wData, int wIsBitConverter = 0)
        {
            List<byte> wResult = new List<byte>();
            if (wData == null || wData.Length <= 0)
                return wResult.ToArray();

            foreach (var item in wData)
            {
                if (wIsBitConverter == 1)
                {
                    wResult.AddRange(BitConverter.GetBytes(item));
                }
                else
                {
                    wResult.Add(BitConverter.GetBytes(item)[0]);
                }

            }
            return wResult.ToArray();
        }
        public static short[] FanucDataGetShortResult(this int[] wData)
        {
            List<short> wResult = new List<short>();
            if (wData == null || wData.Length <= 0)
                return wResult.ToArray();

            foreach (var item in wData)
            {
                wResult.Add(((short)item));
            }
            return wResult.ToArray();
        }

        public static short[] FanucDataWriteShortResult(this byte[] wData)
        {
            List<short> wResult = new List<short>();
            if (wData == null || wData.Length <= 0)
                return wResult.ToArray();

            List<byte> wByteList = wData.ToList();
            if (wData.Length % 2 != 0)
            {
                wByteList.Add(0);
                wData = wByteList.ToArray();
            }

            for (int i = 0; i < wData.Length; i = i + 2)
            {
                wResult.Add(BitConverter.ToInt16(wData, i));
            }

            //if (wResult.Count > 5) {

            //    wResult.RemoveRange(5, wResult.Count - 5);
            //}
            if (wResult.Count < 5)
            {
                wResult.AddRange(new short[5 - wResult.Count]);
            }
            return wResult.ToArray();
        }
        public static int[] FanucDataWriteIntResult(this byte[] wData)
        {
            List<int> wResult = new List<int>();
            if (wData == null || wData.Length <= 0)
                return wResult.ToArray();

            List<byte> wByteList = wData.ToList();
            if (wData.Length % 2 != 0)
            {
                wByteList.Add(0);
                wData = wByteList.ToArray();
            }

            for (int i = 0; i < wData.Length; i = i + 2)
            {
                wResult.Add(BitConverter.ToInt32(wData, i));
            }

            //if (wResult.Count > 5) {

            //    wResult.RemoveRange(5, wResult.Count - 5);
            //}
            if (wResult.Count < 5)
            {
                wResult.AddRange(new int[5 - wResult.Count]);
            }
            return wResult.ToArray();
        }

        public static byte[] FanucDataWriteByteResult(this String wData)
        {
            byte[] wBytes = new byte[5];
            if (wData == null || wData.Length <= 0)
                return wBytes;

            byte[] buf = Encoding.ASCII.GetBytes(wData);

            if (buf.Length >= 5)
            {
                Array.Copy(buf, wBytes, 5);

            }
            else if (buf.Length < 5)
            {
                Array.Copy(buf, wBytes, buf.Length);

            }
            return wBytes;
        }
        public static byte[] FanucDataWriteByteResult(this String wData, Encoding wEncoding)
        {
            if (wEncoding == null)
                return wData.FanucDataWriteByteResult();
            byte[] wBytes = new byte[5];
            if (wData == null || wData.Length <= 0)
                return wBytes;

            byte[] buf = Encoding.ASCII.GetBytes(wData);

            if (buf.Length >= 5)
            {
                Array.Copy(buf, wBytes, 5);

            }
            else if (buf.Length < 5)
            {
                Array.Copy(buf, wBytes, buf.Length);

            }
            return wBytes;
        }

        public static short[] FanucDataWriteShortResult(this String wData)
        {
            List<short> wResult = new List<short>();
            if (wData == null || wData.Length <= 0)
                return wResult.ToArray();

            byte[] buf = Encoding.ASCII.GetBytes(wData);
            List<byte> wByteList = buf.ToList();

            if (buf.Length % 2 != 0)
            {
                wByteList.Add(0);
                buf = wByteList.ToArray();
            }

            for (int i = 0; i < buf.Length; i = i + 2)
            {
                wResult.Add(BitConverter.ToInt16(buf, i));
            }

            //if (wResult.Count > 5) {

            //    wResult.RemoveRange(5, wResult.Count - 5);
            //}
            if (wResult.Count < 5)
            {
                wResult.AddRange(new short[5 - wResult.Count]);
            }
            return wResult.ToArray();
        }
        public static short[] FanucDataWriteShortResult(this String wData, Encoding wEncoding)
        {
            if (wEncoding == null)
                return wData.FanucDataWriteShortResult();
            List<short> wResult = new List<short>();
            if (wData == null || wData.Length <= 0)
                return wResult.ToArray();

            byte[] buf = wEncoding.GetBytes(wData);
            List<byte> wByteList = buf.ToList();

            if (buf.Length % 2 != 0)
            {
                wByteList.Add(0);
                buf = wByteList.ToArray();
            }

            for (int i = 0; i < buf.Length; i = i + 2)
            {
                wResult.Add(BitConverter.ToInt16(buf, i));
            }

            //if (wResult.Count > 5)
            //{

            //    wResult.RemoveRange(5, wResult.Count - 5);
            //}
            if (wResult.Count < 5)
            {
                wResult.AddRange(new short[5 - wResult.Count]);
            }

            return wResult.ToArray();
        }

        public static int[] FanucDataWriteIntResult(this String wData)
        {
            List<int> wResult = new List<int>();
            if (wData == null || wData.Length <= 0)
                return wResult.ToArray();

            byte[] buf = Encoding.ASCII.GetBytes(wData);
            List<byte> wByteList = buf.ToList();

            while (wByteList.Count % 4 != 0)
            {
                wByteList.Add(0);
            }
            buf = wByteList.ToArray();

            for (int i = 0; i < buf.Length; i = i + 4)
            {
                wResult.Add(BitConverter.ToInt32(buf, i));
            }

            //if (wResult.Count > 5)
            //{

            //    wResult.RemoveRange(5, wResult.Count - 5);
            //}
            if (wResult.Count < 5)
            {
                wResult.AddRange(new int[5 - wResult.Count]);
            }

            return wResult.ToArray();
        }
        public static int[] FanucDataWriteIntResult(this String wData, Encoding wEncoding)
        {
            if (wEncoding == null)
                return wData.FanucDataWriteIntResult();
            List<int> wResult = new List<int>();
            if (wData == null || wData.Length <= 0)
                return wResult.ToArray();

            byte[] buf = wEncoding.GetBytes(wData);
            List<byte> wByteList = buf.ToList();

            while (wByteList.Count % 4 != 0)
            {
                wByteList.Add(0);
            }
            buf = wByteList.ToArray();

            for (int i = 0; i < buf.Length; i = i + 4)
            {
                wResult.Add(BitConverter.ToInt32(buf, i));
            }

            //if (wResult.Count > 5)
            //{

            //    wResult.RemoveRange(5, wResult.Count - 5);
            //}
            if (wResult.Count < 5)
            {
                wResult.AddRange(new int[5 - wResult.Count]);
            }
            return wResult.ToArray();
        }




        public static byte[] FanucDataGetByteResult(this int[] wData)
        {

            List<byte> wResult = new List<byte>();
            if (wData == null || wData.Length <= 0)
                return wResult.ToArray();

            foreach (var item in wData)
            {
                wResult.AddRange(BitConverter.GetBytes(item));
            }
            return wResult.ToArray();
        }



    }

    public enum FanucAddressTypes : short
    {
        Bool = 3,
        Byte = 0,
        Word = 1,
        Dword = 2
    }
}
