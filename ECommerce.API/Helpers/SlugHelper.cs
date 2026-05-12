using System.Text.RegularExpressions;

namespace ECommerce.API.Helpers
{
    public static class SlugHelper
    {
        public static string Slugify(string text)
        {
            if (string.IsNullOrWhiteSpace(text)) return "";

            text = text.ToLower().Trim();
            text = text.Replace("ş", "s")
                       .Replace("ğ", "g")
                       .Replace("ü", "u")
                       .Replace("ö", "o")
                       .Replace("ı", "i")
                       .Replace("ç", "c")
                       .Replace("İ", "i")
                       .Replace("Ş", "s")
                       .Replace("Ğ", "g")
                       .Replace("Ü", "u")
                       .Replace("Ö", "o")
                       .Replace("Ç", "c");

            text = Regex.Replace(text, @"[^a-z0-9\s-]", "");
            text = Regex.Replace(text, @"\s+", "-");
            text = Regex.Replace(text, @"-+", "-");
            text = text.Trim('-');

            return text;
        }
    }
}