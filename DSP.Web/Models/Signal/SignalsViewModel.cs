﻿using System.Collections.Generic;

namespace DSP.Web.Models.Signal
{
    public sealed class SignalsViewModel
    {
        public SignalsViewModel()
        {
            this.Signals = new List<SignalViewModel>();
        }

        public IList<SignalViewModel> Signals { get; private set; }
    }
}
