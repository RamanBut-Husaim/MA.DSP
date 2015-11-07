using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using DSP.Utils;

namespace DSP.Core.Signal
{
    public sealed class SignalData
    {
        public SignalData(SignalMetadata signalMetadata, IEnumerable<float> values)
        {
            Throw.IfNull(signalMetadata, nameof(signalMetadata));
            Throw.IfNull(values, nameof(values));

            this.Metadata = signalMetadata;
            this.Values = new ReadOnlyCollection<double>(this.CopyToDouble(values.ToList()));
        }

        public SignalMetadata Metadata { get; }

        public IReadOnlyList<double> Values { get; }

        private IList<double> CopyToDouble(IList<float> values)
        {
            var result = new List<double>(values.Count);

            for (int i = 0; i < values.Count; ++i)
            {
                result[i] = values[i];
            }

            return result;
        } 
    }
}
