export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col items-center text-center gap-3">
        <h3 className="text-2xl font-bold text-rose-500">Markify</h3>
        <p className="text-gray-400 text-sm max-w-md">
          Your multi-vendor marketplace — quality products, trusted sellers, all in one place.
        </p>

        <div className="flex gap-6 mt-2 text-sm text-gray-400">
          <span className="hover:text-rose-400 transition cursor-pointer">About</span>
          <span className="hover:text-rose-400 transition cursor-pointer">Contact</span>
          <span className="hover:text-rose-400 transition cursor-pointer">Privacy Policy</span>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          © {new Date().getFullYear()} Markify. Built with MERN Stack.
        </p>
      </div>
    </footer>
  );
}