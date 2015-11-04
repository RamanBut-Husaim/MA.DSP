using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using DSP.Utils;

namespace DSP.Reading.Content
{
    public sealed class FileContentProvider : IFileContentProvider
    {
        private const int DefaultBufferSize = 1024;
        private readonly string _fileName;

        public FileContentProvider(string fileName)
        {
            Throw.IfNullOrEmpty(fileName, nameof(fileName));
            _fileName = fileName;
        }

        public async Task<FileParserResult> ReadEntireContentAsync()
        {
            byte[] content;
            int readBytes;
            using (var fileStream = new FileStream(_fileName, FileMode.Open, FileAccess.Read, FileShare.None, DefaultBufferSize, FileOptions.Asynchronous))
            {
                content = new byte[fileStream.Length];
                readBytes = await fileStream.ReadAsync(content, 0, content.Length);
            }

            using (var memoryStream = new MemoryStream(content, 0, readBytes, false))
            {
                return this.ReadEntireContentFromStream(memoryStream);
            }
        }

        private FileParserResult ReadEntireContentFromStream(Stream stream)
        {
            using (var binaryReader = new BinaryReader(stream, Encoding.ASCII))
            {
                FileMetadata metadata = this.ReadMetadataFromBinaryStream(binaryReader);
                IList<float> dataPoints = this.ReadDataPointsFromBinaryStream(binaryReader);
                return new FileParserResult(metadata, dataPoints);
            }
        }

        public FileMetadata ReadMetadata()
        {
            FileMetadata result;
            using (var fileStream = new FileStream(_fileName, FileMode.Open, FileAccess.Read, FileShare.None, DefaultBufferSize, FileOptions.None))
            {
                result = this.ReadMetadataFromStream(fileStream);
            }

            return result;
        }

        public async Task<FileMetadata> ReadMetadataAsync()
        {
            FileMetadata result;

            byte[] metadataContent = new byte[FileMetadata.Size];
            using (var fileStream = new FileStream(_fileName, FileMode.Open, FileAccess.Read, FileShare.None, DefaultBufferSize, FileOptions.Asynchronous))
            {
                await fileStream.ReadAsync(metadataContent, 0, FileMetadata.Size).ConfigureAwait(false);
            }

            using (var memoryStream = new MemoryStream(metadataContent, false))
            {
                result = this.ReadMetadataFromStream(memoryStream);
            }

            return result;
        }

        private FileMetadata ReadMetadataFromStream(Stream stream)
        {
            FileMetadata result;
            using (var binaryReader = new BinaryReader(stream, Encoding.ASCII))
            {
                result = this.ReadMetadataFromBinaryStream(binaryReader);
            }

            return result;
        }

        private FileMetadata ReadMetadataFromBinaryStream(BinaryReader binaryReader)
        {
            var result = FileMetadata.Builder()
                .WithSignature(binaryReader.ReadChars(FileMetadata.SignatureSize))
                .WithChannelNumber(binaryReader.ReadInt32())
                .WithChannelSize(binaryReader.ReadInt32())
                .WithSpectrumLineNumber(binaryReader.ReadInt32())
                .WithCutoffFrequency(binaryReader.ReadInt32())
                .WithFrequencyDefinition(binaryReader.ReadSingle())
                .WithDataBlockReceiveTime(binaryReader.ReadSingle())
                .WithTotalReceiveTime(binaryReader.ReadInt32())
                .WithDataBlockNumber(binaryReader.ReadInt32())
                .WithDataSize(binaryReader.ReadInt32())
                .WithReceivedBlocksNumber(binaryReader.ReadInt32())
                .WithMaxValue(binaryReader.ReadSingle())
                .WithMinValue(binaryReader.ReadSingle())
                .AsMetadata();

            return result;
        }

        public IEnumerable<float> ReadContent()
        {
            using (var fileStream = new FileStream(_fileName, FileMode.Open, FileAccess.Read, FileShare.None, DefaultBufferSize, FileOptions.None))
            {
                return this.ReadDataPointsFromStream(fileStream);
            }
        }

        public async Task<IEnumerable<float>> ReadContentAsync()
        {
            IList<float> dataPoints;

            byte[] fileContent;
            int readBytes;

            using (var fileStream = new FileStream(_fileName, FileMode.Open, FileAccess.Read, FileShare.None, DefaultBufferSize, FileOptions.Asynchronous))
            {
                fileContent = new byte[fileStream.Length - FileMetadata.SignatureSize];

                readBytes = await fileStream.ReadAsync(fileContent, FileMetadata.Size, fileContent.Length);
            }

            using (var memoryStream = new MemoryStream(fileContent, 0, readBytes, false))
            {
                dataPoints = this.ReadDataPointsFromStream(memoryStream);
            }

            return dataPoints;
        }

        private IList<float> ReadDataPointsFromStream(Stream stream)
        {
            IList<float> dataPoints;

            using (var binaryReader = new BinaryReader(stream, Encoding.ASCII))
            {
                dataPoints = this.ReadDataPointsFromBinaryStream(binaryReader);
            }

            return dataPoints;
        }

        private IList<float> ReadDataPointsFromBinaryStream(BinaryReader binaryReader)
        {
            var dataPoints = new List<float>();

            while (binaryReader.PeekChar() != -1)
            {
                dataPoints.Add(binaryReader.ReadSingle());
            }

            return dataPoints;
        } 
    }
}
