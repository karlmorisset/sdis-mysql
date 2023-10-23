const params = new URLSearchParams(document.location.search);

if (params.has('email')) {
  const emailInput = document.querySelector('.form__element#email');
  emailInput.value = params.get('email');
}

const form = document.querySelector('.form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  try {
    // Soumission du formulaire
    const res = await fetch('/auth/login', {
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

        errorPlaceholder.classList.remove('visible');

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
      // Redirection vers la page des matches
      location.assign('/matches');
    }
  } catch (error) {
    console.warn(error);
  }
});
