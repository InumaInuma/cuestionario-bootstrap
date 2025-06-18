document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.next-btn');
  const progressBar = document.getElementById('progressBar');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const nextId = btn.getAttribute('data-next');
      const percent = btn.getAttribute('data-percent');

      // Oculta todas las secciones
      document.querySelectorAll('.accordion-collapse').forEach(c => c.classList.remove('show'));

      // Muestra la siguiente
      document.querySelector(nextId)?.classList.add('show');

      // Actualiza barra de progreso
      progressBar.style.width = percent + '%';
      progressBar.textContent = percent + '%';
    });
  });
});
