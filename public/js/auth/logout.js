const formLogout = document.querySelector('form#logout');

if (formLogout) {
  formLogout.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
      await fetch('/auth/logout', {
        method: 'POST',
      });

      location.assign('/auth/login');
    } catch (error) {
      console.warn(error);
    }
  });
}
