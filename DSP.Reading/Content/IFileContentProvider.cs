using System;
using System.Collections.Generic;

namespace DSP.Reading.Content
{
    public interface IFileContentProvider : IDisposable
    {
        FileMetadata ReadMetadata();

        IEnumerable<float> ReadContent();
    }
}
