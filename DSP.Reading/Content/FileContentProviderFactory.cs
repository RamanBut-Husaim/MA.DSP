using DSP.Utils;

namespace DSP.Reading.Content
{
    public sealed class FileContentProviderFactory : IFileContentProviderFactory
    {
        public IFileContentProvider Create(string fileName)
        {
            Throw.IfNullOrEmpty(fileName, nameof(fileName));
            return new FileContentProvider(fileName);
        }
    }
}
