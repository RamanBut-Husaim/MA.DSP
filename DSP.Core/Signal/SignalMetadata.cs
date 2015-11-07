namespace DSP.Core.Signal
{
    public sealed class SignalMetadata
    {
        private SignalMetadata()
        {
        }

        public string Signature { get; private set; }

        public int ChannelNumber { get; private set; }

        public int ChannelSize { get; private set; }

        public int SpectrumLineNumber { get; private set; }

        public int CutoffFrequency { get; private set; }

        public float FrequencyDefinition { get; private set; }

        public float DataBlockReceiveTime { get; private set; }

        public int TotalReceiveTime { get; private set; }

        public int DataBlockNumber { get; private set; }

        public int DataSize { get; private set; }

        public int ReceivedBlocksNumber { get; private set; }

        public float MaxValue { get; private set; }

        public float MinValue { get; private set; }

        public static SignalMetadata Create(
            string signature,
            int channelNumber,
            int channelSize,
            int spectrumLineNumber,
            int cutoffFrequency,
            float frequencyDefinition,
            float dataBlockReceiveTime,
            int totalReceiveTime,
            int dataBlockNumber,
            int dataSize,
            int receivedBlocksNumber,
            float maxValue,
            float minValue)
        {
            return new SignalMetadata
            {
                Signature = signature,
                ChannelNumber = channelNumber,
                ChannelSize = channelSize,
                SpectrumLineNumber = spectrumLineNumber,
                CutoffFrequency = cutoffFrequency,
                FrequencyDefinition = frequencyDefinition,
                DataBlockReceiveTime = dataBlockReceiveTime,
                TotalReceiveTime = totalReceiveTime,
                DataBlockNumber = dataBlockNumber,
                DataSize = dataSize,
                ReceivedBlocksNumber = receivedBlocksNumber,
                MaxValue = maxValue,
                MinValue = minValue
            };
        }
    }
}
