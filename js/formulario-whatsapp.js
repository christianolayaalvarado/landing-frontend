const whatsappNumber = '51959502168'; // Reemplaza con tu número real

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('whatsapp-toggle');
  const chatBox = document.getElementById('whatsapp-chat');
  const form = document.getElementById('whatsapp-form');
  const mensajeBox = document.getElementById('whatsapp-mensaje');

  // Mostrar / ocultar caja de WhatsApp
  toggleBtn.addEventListener('click', () => {
    chatBox.classList.toggle('open');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));

    // Validación simple
    if (!data.nombre || !data.correo || !data.telefono) {
      mensajeBox.innerHTML = `<div class="alert alert-warning">⚠️ Todos los campos son obligatorios.</div>`;
      return;
    }

    // Mostrar spinner
    mensajeBox.innerHTML = `<div class="spinner"></div>`;

    try {
      // 1. Guardar en la base de datos
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

      // 2. Mostrar aviso visual de redirección
      mostrarAvisoRedireccion();

      // 3. Preparar mensaje para WhatsApp
      const mensaje = `Hola, soy ${data.nombre}. Estoy interesado en una propiedad. Teléfono: ${data.telefono}. Mensaje: ${data.mensaje || 'Sin mensaje adicional.'}`;
      const encoded = encodeURIComponent(mensaje);
      const link = `https://wa.me/${whatsappNumber}?text=${encoded}`;

      // 4. Limpiar formulario y redirigir
      form.reset();
      mensajeBox.innerHTML = '';
      setTimeout(() => {
        window.open(link, '_blank');
        ocultarAvisoRedireccion();
        chatBox.classList.remove('open');
      }, 2500); // tiempo del spinner

    } catch (err) {
      console.error(err);
      mensajeBox.innerHTML = `<div class="alert alert-danger">❌ Error al conectar con el servidor.</div>`;
    }
  });

  function mostrarAvisoRedireccion() {
    let aviso = document.getElementById('aviso-redireccion');
    if (!aviso) {
      aviso = document.createElement('div');
      aviso.id = 'aviso-redireccion';
      aviso.classList.add('visible');
      aviso.innerHTML = `
        <div class="contenido-aviso">
          <div>Redirigiendo a WhatsApp...</div>
          <div class="spinner"></div>
        </div>
      `;
      document.body.appendChild(aviso);
    } else {
      aviso.classList.add('visible');
    }
  }

  function ocultarAvisoRedireccion() {
    const aviso = document.getElementById('aviso-redireccion');
    if (aviso) {
      aviso.classList.remove('visible');
    }
  }
});
