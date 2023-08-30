using System;

using System.Text.Json;
using System.Text.Json.Serialization;

namespace iPlant.Common.Tools
{
    public class DateTimeConverterUsingDateTimeOffsetParse : JsonConverter<DateTimeOffset>
    {
        public override DateTimeOffset Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return StringUtils.parseDate(reader.GetString());
        }

        public override void Write(Utf8JsonWriter writer, DateTimeOffset value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToString("yyyy-MM-dd HH:mm:ss"));
        }
    }
}
