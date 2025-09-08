const whatsappNumber = '51959502168'; // Reemplaza con tu número real de WhatsApp

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

    // Validación rápida
    if (!data.nombre || !data.correo || !data.telefono) {
      mensajeBox.innerHTML = `<div class="alert alert-warning">Todos los campos son obligatorios.</div>`;
      return;
    }

    try {
      // 1. Guardar datos en la base de datos
      const res = await fetch(`${BASE_URL}/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (!res.ok) {
        mensajeBox.innerHTML = `<div class="alert alert-danger">❌ ${result.error || 'Error al guardar los datos.'}</div>`;
        return;
      }

      // 2. Redirigir a WhatsApp con mensaje
      const mensaje = `Hola, soy ${data.nombre}. Estoy interesado en una propiedad. Teléfono: ${data.telefono}. Mensaje: ${data.mensaje || 'Sin mensaje adicional.'}`;
      const encoded = encodeURIComponent(mensaje);
      const link = `https://wa.me/${whatsappNumber}?text=${encoded}`;

      form.reset();
      mensajeBox.innerHTML = `<div class="alert alert-success">✅ Datos enviados. Redirigiendo a WhatsApp...</div>`;

      setTimeout(() => {
        window.open(link, '_blank');
        chatBox.classList.remove('open');
        mensajeBox.innerHTML = '';
      }, 1500);

    } catch (err) {
      console.error(err);
      mensajeBox.innerHTML = `<div class="alert alert-danger">❌ Error al conectar con el servidor.</div>`;
    }
  });
});

