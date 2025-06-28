

document.addEventListener("DOMContentLoaded", function () {
  // Mostrar/ocultar preguntas individuales
  document.querySelectorAll(".toggle-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const target = document.querySelector(targetId);
      if (target) {
        target.style.display = target.style.display === "none" ? "block" : "none";
      }
    });
  });

  // Botones siguiente por sección
  document.querySelectorAll(".next-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const nextTarget = this.getAttribute("data-next");
      const percent = parseInt(this.getAttribute("data-percent"));
      const question = this.getAttribute("data-question");

      const progressBar = document.getElementById("progressBar");
      const currentQuestion = document.getElementById("currentQuestion");

      if (progressBar && currentQuestion) {
        progressBar.style.width = percent + "%";
        progressBar.textContent = percent + "%";
        currentQuestion.textContent = "Pregunta " + question;
      }

      const nextSection = document.querySelector(nextTarget);
      if (nextSection) {
        nextSection.classList.add("show");

        const parent = this.closest(".accordion-collapse");
        if (parent) {
          parent.classList.remove("show");
        }
      }
    });
  });

  // Login con un solo campo
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const codigo = document.getElementById("codigo").value.trim();
      if (!codigo) {
        alert("Por favor ingresa tu código");
        return;
      }

      // Aquí puedes poner tu lógica con Firebase, Firestore o redirección
      alert("Código ingresado: " + codigo);
      // window.location.href = "inicio.html";
    });
  }
});

function validarSeccion(seccionId) {
  const section = document.getElementById(`section-${seccionId}`);
  const preguntas = section.querySelectorAll('.accordion-item');

  for (let i = 0; i < preguntas.length; i++) {
    const pregunta = preguntas[i];

    // Verifica si hay radios (puede haber en buttons o dentro de tablas tbody)
    const radios = pregunta.querySelectorAll('input[type="radio"]');
    if (radios.length === 0) continue;

    // Agrupar radios por 'name'
    const radioNames = [...new Set([...radios].map(r => r.name))];

    for (const name of radioNames) {
      const inputs = pregunta.querySelectorAll(`input[name="${name}"]`);
      const checked = [...inputs].some(input => input.checked);

      if (!checked) {
        let preguntaTexto = "";

        // Buscar primero si está en <td> (subpregunta dentro de tabla)
        const inputEjemplo = inputs[0];
        const fila = inputEjemplo.closest('tr');
        if (fila) {
          const celdaTexto = fila.querySelector('td[class*="sticky-col"], td:first-child');
          if (celdaTexto) {
            preguntaTexto = celdaTexto.textContent.trim();
          }
        }

        // Si no hay celda (es pregunta principal), buscar en botón
        if (!preguntaTexto) {
          const btn = pregunta.querySelector('.accordion-button');
          if (btn) {
            preguntaTexto = btn.textContent.trim();
          }
        }

        // Mostrar alerta con la pregunta faltante
Swal.fire({
  icon: 'warning',
  title: 'Pregunta incompleta',
  text: `Falta marcar una opción en: "${preguntaTexto}"`,
  confirmButtonText: 'Entendido'
}).then(() => {
  const colapsable = pregunta.querySelector('.accordion-collapse');
  if (colapsable && !colapsable.classList.contains('show')) {
    const collapseInstance = new bootstrap.Collapse(colapsable, { toggle: true });
  }

  // Esperar un poco antes de hacer scroll, para que el navegador termine su comportamiento por defecto
  setTimeout(() => {
    pregunta.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 300); // Puedes ajustar el tiempo si es necesario
});


        return false; // detener validación aquí
      }
    }
  }

  return true; // todo validado correctamente
}


const imagenesPorSeccion = {
  1: "/project/assets/img/img1.jpg",
  2: "/project/assets/img/img2.jpg",
  3: "/project/assets/img/img3.jpg",
  4: "/project/assets/img/img4.jpg",
  5: "/project/assets/img/img5.jpg"
};

// FUNCION PARA CAMBIAR DE SECCION Y IMAGEN EN LA CABEZERA 
function cambiarSeccion(seccion, porcentaje, preguntaInicio) {
  document.querySelectorAll('.question-section').forEach(div => div.classList.add('d-none'));
  document.getElementById(`section-${seccion}`).classList.remove('d-none');
  //document.getElementById('progressBar').style.width = `${porcentaje}%`;
  //document.getElementById('progressBar').innerText = `${porcentaje}%`;
 // document.getElementById('currentQuestion').innerText = `Seccion ${preguntaInicio}`;
const progressBar = document.getElementById('progressBar');
const currentQuestion = document.getElementById('currentQuestion');

if (progressBar) {
  progressBar.style.width = `${porcentaje}%`;
  progressBar.innerText = `${porcentaje}%`;
}

if (currentQuestion) {
  currentQuestion.innerText = `Sección ${preguntaInicio}`;
}
 // 👉 Cambiar imagen
  const headerImage = document.getElementById("headerImage");
  //console.log("Sección:", seccion);
 //console.log("Imagen encontrada:", headerImage);
  //console.log("Ruta a usar:", imagenesPorSeccion[seccion]);

  if (headerImage && imagenesPorSeccion[seccion]) {
    headerImage.src = imagenesPorSeccion[seccion];
  }
}



document.addEventListener("DOMContentLoaded", function () {
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");

  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", function () {
      Swal.fire({
        title: '¿Cerrar sesión?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cerrar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          // Aquí puedes cerrar sesión o redirigir
          window.location.href = "login.html"; // o tu ruta deseada
        }
      });
    });
  }
});

function finalizarCuestionario() {
  if (validarSeccion(5)) {
    const modal = new bootstrap.Modal(document.getElementById('finalModal'));
    modal.show();
  }
}

////S para vincular visualmente el progreso circular Como ya usas progressBar.style.width = "X%", no necesitas cambiarlo. Solo añade este pedacito para leer ese valor visualmente:
const barra = document.getElementById('progressBar');
const circulo = document.getElementById("circularVisual");
const texto = document.getElementById('circularText');

const observer = new MutationObserver(() => {
  const porcentaje = parseInt(barra.style.width);
  if (porcentaje >= 100) {
    circulo.style.background = `conic-gradient(#198754 ${porcentaje}%, #dee2e6 ${porcentaje}%)`;
 document.getElementById("circularText").textContent = `${porcentaje}%`;
  }else{
circulo.style.background = `conic-gradient(#0d6efd ${porcentaje}%, #dee2e6 ${porcentaje}%)`;

 document.getElementById("circularText").textContent = `${porcentaje}%`;
  }

});

observer.observe(barra, { attributes: true, attributeFilter: ['style'] });

///Cuando cambies de sección y actualices el texto, agrega esta línea para disparar la animación:
const currentQuestion = document.getElementById('currentQuestion');
currentQuestion.classList.remove('animate'); // reiniciar animación
void currentQuestion.offsetWidth; // truco para reiniciarla
currentQuestion.classList.add('animate');

