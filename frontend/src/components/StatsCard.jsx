function StatsCard({ title, value, subtitle, color = "blue" }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    yellow: "bg-yellow-100 text-yellow-800",
  };

  return (
    <div className={`p-4 rounded-lg ${colorClasses[color]}`}>
      <h3 className="text-2xl font-bold">{value}</h3>
      <p className="text-sm font-medium">{title}</p>
      {subtitle && <p className="text-xs mt-1 opacity-75">{subtitle}</p>}
    </div>
  );
}

export default StatsCard;
