(function () {
  const MOBILE_BREAKPOINT = 768;
  const themeStorageKey = 'buffbook-theme';
  const root = document.documentElement;
  const body = document.body;
  const themeToggle = document.querySelector('.theme-toggle');
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
      themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
    }
  };

  let storedTheme = null;
  try {
    storedTheme = localStorage.getItem(themeStorageKey);
  } catch (error) {
    console.warn('Failed to read theme from localStorage, using system preference:', error);
    storedTheme = null;
  }

  if (storedTheme === 'dark' || storedTheme === 'light') {
    applyTheme(storedTheme);
  } else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      try {
        localStorage.setItem(themeStorageKey, nextTheme);
      } catch (error) {
        console.warn('Failed to save theme preference to localStorage, theme will not persist:', error);
      }
    });
  }

  const setSidebarOpen = (isOpen) => {
    body.classList.toggle('sidebar-open', isOpen);
    if (mobileNavToggle) {
      mobileNavToggle.setAttribute('aria-expanded', String(isOpen));
    }
  };

  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', function () {
      setSidebarOpen(!body.classList.contains('sidebar-open'));
    });
  }

  document.addEventListener('click', function (event) {
    if (!body.classList.contains('sidebar-open')) return;
    if (event.target.closest('.sidebar') || event.target.closest('.mobile-nav-toggle')) return;
    setSidebarOpen(false);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && body.classList.contains('sidebar-open')) {
      setSidebarOpen(false);
    }
  });

  document.querySelectorAll('.sidebar a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= MOBILE_BREAKPOINT) {
        setSidebarOpen(false);
      }
    });
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > MOBILE_BREAKPOINT) {
      setSidebarOpen(false);
    }
  });
})();
