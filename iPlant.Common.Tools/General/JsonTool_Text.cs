using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Unicode;
using System.Threading.Tasks;

namespace iPlant.Common.Tools
{
    public class JsonTool_Text
    {


        private static JsonSerializerOptions mJsonSerializerOptions = null;

        static JsonTool_Text()
        {
            mJsonSerializerOptions = new JsonSerializerOptions();
            mJsonSerializerOptions.PropertyNamingPolicy = null;
            mJsonSerializerOptions.Encoder = JavaScriptEncoder.Create(UnicodeRanges.All);

            mJsonSerializerOptions.Converters.Add(new DateTimeConverterUsingDateTimeParse());
            mJsonSerializerOptions.Converters.Add(new DateTimeConverterUsingDateTimeOffsetParse());
        }

        public static String ObjectToJson<T>(T wJsonObject)
        {

            return JsonSerializer.Serialize<T>(wJsonObject, mJsonSerializerOptions);
        }

        public static String ObjectToJson(Object wJsonObject, Type type)
        {
            return JsonSerializer.Serialize(wJsonObject, type, mJsonSerializerOptions);
        }

        public static String ObjectToJson(Object wJsonObject)
        {
            return JsonSerializer.Serialize(wJsonObject, mJsonSerializerOptions);
        }

        public static T JsonToObject<T>(string wStrJson)
        {

            return JsonSerializer.Deserialize<T>(wStrJson, mJsonSerializerOptions);
        }


        public static object JsonToObject(string wStrJson, Type type)
        {

            return JsonSerializer.Deserialize(wStrJson, type, mJsonSerializerOptions);
        }


    }
}
