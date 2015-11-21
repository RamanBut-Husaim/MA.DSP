namespace DSP.Reading.Content
{
    public interface IFileParserFactory
    {
        IFileParser Create(string fileName);
    }
}
