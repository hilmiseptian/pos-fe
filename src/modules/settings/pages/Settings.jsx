import { Utensils, Zap } from 'lucide-react';
import { useSettings, POS_MODES } from '../context';
import { alertSuccess } from '@/shared/utils/alert';

const OPTIONS = [
  {
    value: POS_MODES.DINE_IN,
    label: 'Dine In',
    description:
      'Show order list & table selection before entering the order page.',
    icon: Utensils,
  },
  {
    value: POS_MODES.QUICK_SERVICE,
    label: 'Quick Service',
    description: 'Skip order list — go straight to the product/order page.',
    icon: Zap,
  },
];

export default function Settings() {
  const { posMode, setPosMode } = useSettings();

  function handleSelect(mode) {
    if (mode === posMode) return;
    setPosMode(mode);
    alertSuccess('POS Mode updated');
  }

  return (
    <div className="max-w-2xl mx-auto py-8 bg-base-200 px-6 mt-4 mb-4 rounded-box shadow">
      <h2 className="text-2xl font-bold text-center mb-1">Settings</h2>
      <p className="text-sm opacity-60 text-center mb-6">POS Mode</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {OPTIONS.map(({ value, label, description, icon: Icon }) => (
          <label
            key={value}
            className={`flex flex-col gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all
              ${posMode === value ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-primary/40'}`}>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="pos_mode"
                className="radio radio-primary radio-sm"
                checked={posMode === value}
                onChange={() => handleSelect(value)}
              />
              <Icon
                size={16}
                className={posMode === value ? 'text-primary' : 'opacity-50'}
              />
              <span className="font-semibold">{label}</span>
            </div>
            <p className="text-xs opacity-60">{description}</p>
          </label>
        ))}
      </div>
    </div>
  );
}
