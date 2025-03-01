import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  highlighted?: boolean;
}

function StatCard({ title, value, icon: Icon, description, trend, highlighted = false }: StatCardProps) {
  return (
    <div className={`overflow-hidden shadow rounded-lg ${highlighted ? 'bg-[#4461F2] text-white' : 'bg-white'}`}>
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${highlighted ? 'text-white/80' : 'text-gray-400'}`} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className={`text-sm font-medium truncate ${highlighted ? 'text-white/80' : 'text-gray-500'}`}>
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className={`text-2xl font-semibold ${highlighted ? 'text-white' : 'text-gray-900'}`}>
                  {value}
                </div>
                {trend && (
                  <span className={`ml-2 text-sm font-medium ${trend.isPositive ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                    {trend.isPositive ? '↑' : '↓'} {trend.value}%
                  </span>
                )}
              </dd>
              {description && (
                <dd className={`mt-1 text-sm ${highlighted ? 'text-white/70' : 'text-gray-500'}`}>{description}</dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatCard;