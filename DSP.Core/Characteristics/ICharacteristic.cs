namespace DSP.Core.Characteristics
{
    public interface ICharacteristic<out TResult> : ICharacteristicBase
    {
        TResult Calculate(int startPoint, int endPoint);
    }
}
