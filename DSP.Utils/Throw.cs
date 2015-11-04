using System;

namespace DSP.Utils
{
    public sealed class Throw
    {
        public static void IfNull<T>(T argument, string paramName) where T : class
        {
            if (argument == null)
            {
                throw new ArgumentNullException(paramName);
            }
        }

        public static void IfNullOrEmpty(string value, string paramName)
        {
            if (value.IsNullOrEmpty())
            {
                throw new ArgumentException("The value should not be empty!");
            }
        }
    }
}
