using Newtonsoft.Json;

namespace Amba.ImagePowerTools.Extensions
{
    internal static class JsonExtensions
    {
        public static string ToJson<T>(this T obj)
        {
            return JsonConvert.SerializeObject(obj);
        }

        public static T FromJson<T>(this string json)
            where T : new()
        {
            return JsonConvert.DeserializeObject<T>(json);
        }
    }
}
