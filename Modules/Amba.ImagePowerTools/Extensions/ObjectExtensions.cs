using System;
using System.Collections.Generic;
using System.Linq;

namespace Amba.ImagePowerTools.Extensions
{
    internal static class ObjectExtensions
	{
        public static T IfNotNull<T>(this T obj, Action<T> action)
            where T : class
        {
            if (obj != null)
                action(obj);
            return obj;
        }

        public static IEnumerable<T> ForEach<T>(this IEnumerable<T> list, Action<T> action)
            where T : class
        {
            foreach (var item in list.ToList())
            {
                action(item);
            }
            return list;
        }
	}
}
