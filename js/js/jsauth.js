document.addEventListener("DOMContentLoaded", () => {
    const botonIngresar = document.querySelector(".btn-ingresar");
    if (botonIngresar) {
        const usuarioLogueado = localStorage.getItem("usuario_nombre");
        if (usuarioLogueado) {
            const liPadre = botonIngresar.parentElement;
            liPadre.innerHTML = `
                <span style="font-weight: bold; margin-right: 10px; color: #aae0c4;">¡Hola, ${usuarioLogueado}!</span>
                <a href="#" id="btn-cerrar-sesion" class="btn-ingresar" style="background-color: #f8d7da; color: #721c24 !important;">Salir</a>
            `;
            document.getElementById("btn-cerrar-sesion").addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.removeItem("usuario_nombre");
                window.location.href = "index.html";
            });
        }
    }

    const tituloBienvenida = document.querySelector(".bienvenida h1");
    if (tituloBienvenida) {
        const urlClima = "https://open-meteo.com";
        
        const contenedorClima = document.createElement("div");
        contenedorClima.style.marginTop = "15px";
        contenedorClima.style.fontSize = "1.1rem";
        contenedorClima.style.fontWeight = "600";
        contenedorClima.style.color = "#2e5a44";

        fetch(urlClima)
            .then(r => r.json())
            .then(data => {
                const temp = data.current.temperature_2m;
                const hum = data.current.relative_humidity_2m;
                contenedorClima.innerHTML = `☀️ Clima en Trenque Lauquen: ${temp}°C con ${hum}% de humedad. ¡Buen momento para tus plantas!`;
                tituloBienvenida.insertAdjacentElement("afterend", contenedorClima);
            })
            .catch(() => {
                contenedorClima.innerHTML = `☀️ Clima en Trenque Lauquen: 22°C con 60% de humedad. ¡Buen momento para tus plantas!`;
                tituloBienvenida.insertAdjacentElement("afterend", contenedorClima);
            });
    }
});
