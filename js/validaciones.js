document.addEventListener("DOMContentLoaded", () => {
    const errorBox = document.querySelector(".mensaje-error-box");
    if (errorBox) errorBox.style.display = "none";

    function mostrarMensaje(texto, esExito = false) {
        if (!errorBox) return;
        errorBox.style.display = "block";
        errorBox.innerHTML = `<p>${texto}</p>`;
        if (esExito) {
            errorBox.style.backgroundColor = "#e8f0ec";
            errorBox.style.color = "#2e5a44";
            errorBox.style.borderLeft = "5px solid #aae0c4";
        } else {
            errorBox.style.backgroundColor = "#f8d7da";
            errorBox.style.color = "#721c24";
            errorBox.style.borderLeft = "5px solid #f5c6cb";
        }
    }

    const formContacto = document.querySelector(".formulario-contenedor form");
    const esContacto = window.location.pathname.includes("contacto.html");
    if (formContacto && esContacto) {
        formContacto.addEventListener("submit", (e) => {
            e.preventDefault();
            const nombre = document.getElementById("nombre").value.trim();
            const email = document.getElementById("email").value.trim();
            const mensaje = document.getElementById("mensaje").value.trim();

            if (nombre === "" || email === "" || mensaje === "") {
                mostrarMensaje("Todos los campos con asterisco o requeridos son obligatorios.");
                return;
            }
            mostrarMensaje("¡Formulario enviado con éxito! Nos contactaremos pronto.", true);
            formContacto.reset();
        });
    }

    const esLogin = window.location.pathname.includes("login.html");
    if (formContacto && esLogin) {
        formContacto.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            if (email === "" || password === "") {
                mostrarMensaje("Por favor, completa tu correo y contraseña.");
                return;
            }
            localStorage.setItem("usuario_nombre", "Alí");
            window.location.href = "listado.html";
        });
    }

    const esRegistro = window.location.pathname.includes("registro.html") || window.location.pathname.includes("registris.html");
    if (formContacto && esRegistro) {
        formContacto.addEventListener("submit", (e) => {
            e.preventDefault();
            const pass1 = document.getElementById("password").value;
            const pass2 = document.getElementById("confirm-password").value;
            const terminos = document.getElementById("terminos").checked;

            if (pass1 !== pass2) {
                mostrarMensaje("Las contraseñas no coinciden. Por favor verificalas.");
                return;
            }
            if (!terminos) {
                mostrarMensaje("Debes aceptar los términos y condiciones del vivero.");
                return;
            }
            mostrarMensaje("¡Cuenta creada con éxito! Ya podés ingresar.", true);
            formContacto.reset();
        });
    }
});

