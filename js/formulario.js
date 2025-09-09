

document.addEventListener('DOMContentLoaded', () => {
  const formulario = document.getElementById('formulario');
  const mensajeContenedor = document.getElementById('mensaje');

  if (!formulario) return;

  formulario.addEventListener('submit', async function (e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(formulario));

    try {
      const res = await fetch(`${BASE_URL}/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        // Mostrar mensaje de éxito
        mensajeContenedor.innerHTML = `
          <div id="alerta" class="alert alert-success alert-dismissible fade show" role="alert">
            ✅ ${result.mensaje || '¡Gracias! Te contactaré pronto.'}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
          </div>
          <div class="text-center mt-3">
            <a href="index.html" class="btn btn-outline-primary">⬅ Volver al inicio</a>
          </div>
        `;

        formulario.reset(); // Limpiar campos
      } else {
        // Mostrar error
        mensajeContenedor.innerHTML = `
          <div id="alerta" class="alert alert-danger alert-dismissible fade show" role="alert">
            ❌ ${result.error || 'Ocurrió un error al enviar el formulario.'}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
          </div>
        `;
      }
    } catch (err) {
      mensajeContenedor.innerHTML = `
        <div id="alerta" class="alert alert-danger alert-dismissible fade show" role="alert">
          ❌ Error al conectar con el servidor. Intenta más tarde.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
      `;
      console.error('⚠️ Error:', err);
    }

    // Desvanecer después de 5 segundos
    setTimeout(() => {
      const alerta = document.getElementById('alerta');
      if (alerta) {
        alerta.classList.add('fade-out');
        setTimeout(() => {
          mensajeContenedor.innerHTML = '';
        }, 1000);
      }
    }, 5000);
  });
});
