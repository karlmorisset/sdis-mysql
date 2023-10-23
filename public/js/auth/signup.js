const form = document.querySelector('.form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  try {
    // Soumission du formulaire
    const res = await fetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: form.email.value,
        password: form.password.value,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    // Récupération de la réponse
    const data = await res.json();

    // Gestion des erreurs de validation
    if (data.errors) {
      Object.keys(data.errors).forEach((field) => {
        const errorPlaceholder = document.querySelector(
          `.form__error.${field}`,
        );
        const fieldFormElement = document.querySelector(
          `.form__element#${field}`,
        );
        errorPlaceholder.textContent = data.errors[field];
        errorPlaceholder.classList.add('visible');

        fieldFormElement.addEventListener('focus', () => {
          errorPlaceholder.classList.remove('visible');
        });
      });
    } else if (data.user) {
      // Redirection vers la page login
      location.assign(`/auth/login?email=${data.user}`);
    }
  } catch (error) {
    console.warn(error);
  }
});
