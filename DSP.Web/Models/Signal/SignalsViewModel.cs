using System.Collections.Generic;

namespace DSP.Web.Models.Signal
{
    public sealed class SignalsViewModel
    {
        public SignalsViewModel()
        {
            this.Signals = new List<SignalViewModel>();
            this.Errors = new List<ErrorModel>();
        }

        public IList<SignalViewModel> Signals { get; private set; }

        public IList<ErrorModel> Errors { get; private set; }
    }
}
