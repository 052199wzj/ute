using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace iPlant.Common.Tools
{
    public class XMLTool
    {

        public static T ReadXml<T>(string wPath)
        {
            try
            {
                XmlSerializer xmls = new XmlSerializer(typeof(T));
                FileStream wFileStream = new FileStream(wPath, FileMode.Open, FileAccess.Read);
                T wT = (T)xmls.Deserialize(wFileStream);
                wFileStream.Close();
                return wT;
            }
            catch (Exception)
            {
                return default(T);
            }
        }

        public static void SaveXml<T>(string wPath, T wT)
        {
            XmlSerializer xmls = new XmlSerializer(typeof(T));
            FileStream wFileStream = new FileStream(wPath, FileMode.Create, FileAccess.ReadWrite);
            xmls.Serialize(wFileStream, wT);
            wFileStream.Close();
        }
    }
}
