using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Amba.ImagePowerTools.Extensions
{
    public static class IntExtension
    {
        public static bool IsLessThen(this int value, params int[] otherNumbers)
        {
            return otherNumbers.All(number => number <= value);
        }
    }
}