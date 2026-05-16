export default function StatCard({ value, label, icon: Icon }) {
  return (
    <div className="bg-white rounded-card p-6 text-center border border-vvva-sand shadow-sm hover:shadow-md hover:border-vvva-orange/30 transition-all duration-200">
      {Icon && (
        <div className="w-10 h-10 bg-vvva-orange/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <Icon size={20} className="text-vvva-orange" />
        </div>
      )}
      <p className="font-playfair font-bold text-3xl text-vvva-orange mb-1">{value}</p>
      <p className="text-sm text-gray-500 font-inter">{label}</p>
    </div>
  );
}
