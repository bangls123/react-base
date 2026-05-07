export const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} React Base. Built with Vite + React 18 + Redux Toolkit + Tailwind.
      </div>
    </footer>
  );
};
