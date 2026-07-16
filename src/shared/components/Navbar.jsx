function Navbar() {
  return (
    <nav className="h-16 border-b flex items-center justify-between px-6">
      <h1 className="text-xl font-bold">TimeLedger</h1>

      <div className="flex items-center gap-4">
        <button>🔔</button>

        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
      </div>
    </nav>
  );
}

export default Navbar;