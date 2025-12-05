(function () {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const modalOverlay = document.getElementById('modalOverlay');
  const openModal = document.getElementById('openModal');
  const closeModal = document.getElementById('closeModal');
  const cancelModal = document.getElementById('cancelModal');
  const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  let lastFocused = null;

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    const isDark = theme === 'dark';
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.querySelector('span[aria-hidden="true"]').textContent = isDark ? '🌙' : '🌞';
    themeToggle.querySelector('span:last-child').textContent = isDark ? 'Mode sombre' : 'Mode clair';
  }

  themeToggle?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(current);
  });

  function trapFocus(container) {
    const focusables = Array.from(container.querySelectorAll(focusableSelector));
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    container.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  function openDialog() {
    lastFocused = document.activeElement;
    modalOverlay.classList.add('open');
    modalOverlay.removeAttribute('aria-hidden');
    const dialog = modalOverlay.querySelector('[role="dialog"]');
    trapFocus(dialog);
    const firstInput = dialog.querySelector('textarea, input, button');
    (firstInput || dialog).focus();
  }

  function closeDialog() {
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    lastFocused?.focus();
  }

  openModal?.addEventListener('click', openDialog);
  closeModal?.addEventListener('click', closeDialog);
  cancelModal?.addEventListener('click', closeDialog);
  modalOverlay?.addEventListener('click', (event) => {
    if (event.target === modalOverlay) closeDialog();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modalOverlay?.classList.contains('open')) {
      closeDialog();
    }
  });
})();
