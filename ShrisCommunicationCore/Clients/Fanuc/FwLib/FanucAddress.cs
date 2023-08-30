using System;

namespace ShrisCommunicationCore
{
    public class FanucAddress
    {

        public short kind { get; set; } = 0;


        public short Index { get; set; } = -1;
        public String kindText
        {
            get
            {
                if (FanucExtension.pmcAddress == null || FanucExtension.pmcAddress.Count <= 0)
                    return "";

                foreach (string item in FanucExtension.pmcAddress.Keys)
                {
                    if (FanucExtension.pmcAddress[item] != kind)
                    {
                        continue;
                    }
                    return item;
                }

                return "";
            }
        }
        public short type { get; set; } = 0;

        public String typeText
        {
            get
            {
                switch (type)
                {
                    case 0:
                        return "B";

                    case 1:
                        return "W";

                    case 2:
                        return "D";

                }
                return "";

            }
        }

        public ushort start { get; set; } = 0;
        public ushort end
        {
            get
            {
                if (type == 0)
                {
                    return (ushort)(start + lengthS);
                }
                else
                {
                    return (ushort)(start + lengthS * type * 2);
                }

            }
        }

        public ushort lengthS { get; set; } = 1;

        public ushort length
        {
            get
            {
                switch (type)
                {
                    case 0:
                        return (ushort)(8 + (lengthS + 1));

                    case 1:
                        return (ushort)(8 + (lengthS + 1) * 2);

                    case 2:
                        return (ushort)(8 + (lengthS + 1) * 4);

                }
                return 0;
            }
        }
    }
}
