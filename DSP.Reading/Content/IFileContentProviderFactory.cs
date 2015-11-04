namespace DSP.Reading.Content
{
    public interface IFileContentProviderFactory
    {
        IFileContentProvider Create(string fileName);
    }
}
