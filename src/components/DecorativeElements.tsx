export function DecorativeElements() {
  return (
    <>
      {/* Decorative blurred elements */}
      <div className="absolute bottom-0 left-10 w-64 h-64 bg-gradient-to-br from-orange-400/20 to-pink-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-10 w-64 h-64 bg-gradient-to-bl from-purple-400/20 to-blue-400/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl" />
      
      {/* Animated flower-like decorative shapes */}
      <div className="absolute bottom-20 left-20 opacity-30">
        <div className="w-32 h-32 blur-md">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-60" />
          <div className="absolute inset-4 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full" />
        </div>
      </div>
      
      <div className="absolute bottom-32 right-32 opacity-20">
        <div className="w-24 h-24 blur-md">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-60" />
          <div className="absolute inset-3 bg-gradient-to-br from-amber-300 to-orange-400 rounded-full" />
        </div>
      </div>
    </>
  );
}
