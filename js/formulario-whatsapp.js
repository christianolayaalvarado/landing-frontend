const whatsappNumber = '51959502168'; // Reemplaza con tu número real

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('whatsapp-toggle');
  const chatBox = document.getElementById('whatsapp-chat');
  const form = document.getElementById('whatsapp-form');
  const mensajeBox = document.getElementById('whatsapp-mensaje');

  toggleBtn.addEventListener('click', () => {
    chatBox.classList.toggle('open');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));

    if (!data.nombre || !data.correo || !data.telefono) {
      mensajeBox.innerHTML = `
        <div class="alert alert-warning">Todos los campos son obligatorios.</div>
      `;
      return;
    }

    try {
      // Mostrar mensaje de cargando...
      mensajeBox.innerHTML = `
        <div class="alert alert-info d-flex align-items-center">
          <div class="spinner-border text-success me-2" role="status"></div>
          <strong>Guardando información y redirigiendo a WhatsApp...</strong>
        </div>
      `;

      const res = await fetch(`${BASE_URL}/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (!res.ok) {
        mensajeBox.innerHTML = `
          <div class="alert alert-danger">❌ ${result.error || 'Error al guardar los datos.'}</div>
        `;
        return;
      }

      // Redirigir a WhatsApp después de confirmar
      const mensaje = `Hola, soy ${data.nombre}. Estoy interesado en una propiedad. Teléfono: ${data.telefono}. Mensaje: ${data.mensaje || 'Sin mensaje adicional.'}`;
      const encoded = encodeURIComponent(mensaje);
      const link = `https://wa.me/${whatsappNumber}?text=${encoded}`;

      form.reset();

      setTimeout(() => {
        window.open(link, '_blank');
        chatBox.classList.remove('open');
        mensajeBox.innerHTML = '';
      }, 2000);

    } catch (err) {
      console.error(err);
      mensajeBox.innerHTML = `
        <div class="alert alert-danger">❌ Error al conectar con el servidor.</div>
      `;
    }
  });
});
