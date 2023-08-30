using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.Unicode;
using System.Threading.Tasks;

namespace iPlant.Common.Tools
{
    public class JsonTool
    {


        private static DateTimeOffsetConverter mDateTimeOffsetConverter = new DateTimeOffsetConverter();
        private static DateTimeConverter mDateTimeConverter = new DateTimeConverter();
        static JsonTool()
        {
        }

        public static String ObjectToJson<T>(T wJsonObject)
        {


            return JsonConvert.SerializeObject(wJsonObject, mDateTimeOffsetConverter, mDateTimeConverter);
        }

        public static String ObjectToJson(Object wJsonObject, Type type)
        {
            return JsonConvert.SerializeObject(wJsonObject, mDateTimeOffsetConverter, mDateTimeConverter);
        }

        public static String ObjectToJson(Object wJsonObject)
        {
            return JsonConvert.SerializeObject(wJsonObject, mDateTimeOffsetConverter, mDateTimeConverter);
        }

        public static T JsonToObject<T>(string wStrJson)
        {

            return JsonConvert.DeserializeObject<T>(wStrJson, mDateTimeOffsetConverter, mDateTimeConverter);
        }


        public static object JsonToObject(string wStrJson, Type type)
        {

            return JsonConvert.DeserializeObject(wStrJson, type, mDateTimeOffsetConverter, mDateTimeConverter);
        }


    }

    public class DateTimeOffsetConverter : JsonConverter<DateTimeOffset>
    {


        public override DateTimeOffset ReadJson(JsonReader reader, Type objectType, DateTimeOffset existingValue, bool hasExistingValue, JsonSerializer serializer)
        {
            if (hasExistingValue)
            {
                return StringUtils.parseDate(reader.Value); ;
            }
            else
            {
                return new DateTime(2000, 1, 1);
            }
        }



        public override void WriteJson(JsonWriter writer, DateTimeOffset value, JsonSerializer serializer)
        {

            writer.WriteValue(value.ToString("yyyy-MM-dd HH:mm:ss"));
        }
    }
    public class DateTimeConverter : JsonConverter<DateTime>
    {

        public override DateTime ReadJson(JsonReader reader, Type objectType, DateTime existingValue, bool hasExistingValue, JsonSerializer serializer)
        {
            if (hasExistingValue)
            {
                return StringUtils.parseDate(reader.Value);
            }
            else
            {
                return new DateTime(2000, 1, 1);
            }
        }


        public override void WriteJson(JsonWriter writer, DateTime value, JsonSerializer serializer)
        {

            writer.WriteValue(value.ToString("yyyy-MM-dd HH:mm:ss"));
        }
    }
}
