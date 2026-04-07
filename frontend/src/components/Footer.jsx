const Footer = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-gradient-to-r from-sky-100 via-white to-cyan-100">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-center md:flex-row md:text-left">
        <div>
          <h3 className="text-lg font-bold text-slate-900">E-Com Store</h3>
          <p className="text-sm text-slate-600">
            Built for smooth shopping and powerful admin management.
          </p>
        </div>

        <div className="flex flex-col items-center gap-1 text-sm text-slate-500 md:items-end">
          <p>Secure orders, product reviews, and delivery tracking.</p>
          <p className="font-medium text-slate-700">
            © 2026 E-Com Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
