using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using DSP.Utils;

namespace DSP.Reading.Content
{
    public sealed class FileContentProvider : IFileContentProvider
    {
        private readonly BinaryReader _reader;
        private bool _disposed;

        public FileContentProvider(string fileName)
        {
            Throw.IfNullOrEmpty(fileName, nameof(fileName));
            _reader = new BinaryReader(File.OpenRead(fileName), Encoding.ASCII);
        }

        public FileMetadata ReadMetadata()
        {
            this.VerifyDisposed();

            _reader.BaseStream.Seek(0, SeekOrigin.Begin);
            var fileMetadata = FileMetadata.Builder()
                .WithSignature(_reader.ReadChars(FileMetadata.SignatureSize))
                .WithChannelNumber(_reader.ReadInt32())
                .WithChannelSize(_reader.ReadInt32())
                .WithSpectrumLineNumber(_reader.ReadInt32())
                .WithCutoffFrequency(_reader.ReadInt32())
                .WithFrequencyDefinition(_reader.ReadSingle())
                .WithDataBlockReceiveTime(_reader.ReadSingle())
                .WithTotalReceiveTime(_reader.ReadInt32())
                .WithDataBlockNumber(_reader.ReadInt32())
                .WithDataSize(_reader.ReadInt32())
                .WithReceivedBlocksNumber(_reader.ReadInt32())
                .WithMaxValue(_reader.ReadSingle())
                .WithMinValue(_reader.ReadSingle())
                .AsMetadata();

            return fileMetadata;
        }

        public IEnumerable<float> ReadContent()
        {
            this.VerifyDisposed();

            var dataPoints = new List<float>();
            _reader.BaseStream.Seek(FileMetadata.Size, SeekOrigin.Begin);
            while (_reader.PeekChar() != -1)
            {
                dataPoints.Add(_reader.ReadSingle());
            }

            return dataPoints;
        } 

        private void VerifyDisposed()
        {
            if (_disposed)
            {
                throw new ObjectDisposedException("The object has already been disposed.");
            }
        }

        public void Dispose()
        {
            this.Dispose(true);
        }

        private void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    _reader.Dispose();
                    _disposed = true;
                }
            }
        }
    }
}
