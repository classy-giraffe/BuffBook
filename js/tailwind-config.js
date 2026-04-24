window.tailwind = window.tailwind || {};
window.tailwind.config = {
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        border: 'hsl(var(--border))',
        muted: 'hsl(var(--muted))',
        accent: 'hsl(var(--accent))',
        primary: 'hsl(var(--primary))'
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(0, 0, 0, 0.35)'
      }
    }
  }
};
