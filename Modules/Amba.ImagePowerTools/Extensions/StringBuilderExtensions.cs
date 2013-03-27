using System.Text;

namespace Amba.ImagePowerTools.Extensions
{
    internal static class StringBuilderExtensions
	{
		public static StringBuilder AppendLineFormat(this StringBuilder builder, string format, params object[] args)
		{
			builder.AppendFormat(format, args);
			builder.AppendLine();
			return builder;
		}
	}
}
