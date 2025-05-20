interface StatCardProps {
  title: string;
  value: number;
  className?: string;
  valueClassName?: string;
}

export function StatCard({ title, value, className = "", valueClassName = "" }: StatCardProps) {
  return (
    <div className={`bg-white p-6 rounded-lg border shadow-sm ${className}`}>
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className={`text-2xl font-bold mt-2 ${valueClassName}`}>{value}</p>
    </div>
  );
} 