export const Footer = () => {
  return (
    <footer className="border-t border-obsidian-border bg-obsidian-surface">
      <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-obsidian-text-dim leading-relaxed">
        &copy; {new Date().getFullYear()} React Base. Built with Vite + React 18 + Redux Toolkit + Tailwind.
      </div>
    </footer>
  );
};
