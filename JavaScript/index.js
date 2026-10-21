function mes() {
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    let nombre = meses[new Date().getMonth()];
    document.getElementById("mes").textContent = nombre;
}

function dia() {
    let dia = new Date().getDate();
    document.getElementById("dia").textContent = dia;
}

function ano() {
    let ano = new Date().getFullYear();
    document.getElementById("ano").textContent = ano;
}

function imc(evento) {
    evento.preventDefault(); //el formulario recargue la página

    const peso = parseFloat(document.getElementById("peso").value);
    const estatura = parseFloat(document.getElementById("estatura").value) / 100; // cm -> m

    // Redondeo a 2 decimales para que encaje en los rangos de data-min/data-max
    const resultado = Math.round(peso / (estatura * estatura) * 100) / 100;
    document.getElementById("resultadoImc").textContent = `Tu IMC es ${resultado.toFixed(2)}`;

    marcarRango(evento.target, resultado);
}

// Resalta el <li> cuyo rango data-min/data-max contiene el valor y lo devuelve
function marcarRango(formulario, valor) {
    let activo;
    formulario.querySelectorAll("li").forEach(li => {
        const dentro = valor >= parseFloat(li.dataset.min) && valor <= parseFloat(li.dataset.max);
        li.classList.toggle("activo", dentro);
        if (dentro) activo = li;
    });
    return activo;
}

function fcm(evento) {
    evento.preventDefault();

    const edad = parseInt(document.getElementById("edad").value);
    const sexo = document.getElementById("sexoFcm").value;

    // Fórmula habitual: 220 - edad en hombres y 226 - edad en mujeres
    const maxima = (sexo === "mujer" ? 226 : 220) - edad;
    document.getElementById("resultadoFcm").textContent = `Tu FCM es ${maxima} ppm`;

    // Escribe en el <span> de cada zona su rango en pulsaciones por minuto
    evento.target.querySelectorAll("li").forEach(li => {
        const min = Math.round(maxima * parseFloat(li.dataset.min) / 100);
        const max = Math.round(maxima * parseFloat(li.dataset.max) / 100);
        li.querySelector("span").textContent = `: ${min}–${max} ppm`;
    });
}

function categoria(evento) {
    evento.preventDefault();

    const nacimiento = parseInt(document.getElementById("anoNacimiento").value);
    const sexo = document.getElementById("sexoCategoria").value;
    const salida = document.getElementById("resultadoCategoria");
    const edad = new Date().getFullYear() - nacimiento; // edad que cumple este año

    const li = marcarRango(evento.target, edad);
    if (li) {
        const nombre = li.textContent.split(" (")[0]; // "Alevín (11-12)" -> "Alevín"
        salida.textContent = `${edad} años: ${nombre} ${sexo === "mujer" ? "femenino" : "masculino"}`;
    } else {
        salida.textContent = `No hay categoría para nacidos en ${nacimiento}.`;
    }
}

function validarNombre() {
    let nombre = document.getElementById("nombre");

    if (nombre.value.trim().length < 3) {
        nombre.setCustomValidity("El nombre debe tener al menos 3 caracteres.");
    } else {
        nombre.setCustomValidity("");
    }

    return nombre.reportValidity();
}

function listaEventos() {
    const titulo = document.getElementById("titulo-eventos");
    if (!titulo) {
        return null;
    }

    let elemento = titulo.nextElementSibling;
    while (elemento && elemento.tagName !== "UL") {
        elemento = elemento.nextElementSibling;
    }
    return elemento;
}

function mostrarEventos() {
    const lista = listaEventos();
    if (!lista) {
        console.log("No se ha encontrado la lista de próximos eventos");
        return;
    }

    console.log(`Hay ${lista.children.length} próximos eventos:`);
    lista.querySelectorAll("li a").forEach(enlace => console.log(enlace.textContent));
}

function botonQuitar(){
    const boton = document.createElement("button");
    boton.textContent = "Quitar";
    boton.className = "btn-quitar-evento";
    return boton;
}

const NUEVO_EVENTO = "Copa provincial";

function anadirEvento(nombre) {
    const lista = listaEventos();
    if (!lista || !nombre || nombre.trim() === "") {
        return;
    }

    const enlace = document.createElement("a");
    enlace.href = "";
    enlace.textContent = nombre.trim();

    const li = document.createElement("li");
    li.append(enlace, " ", botonQuitar());
    lista.appendChild(li);
}

const DIAS_MANANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const DIAS_TARDE = [...DIAS_MANANA, "Sábado", "Domingo"];
const HORAS = [9, 11, 13, 15];

function franjasHorarias(horas) {
    return horas.slice(0, -1).map((h, i) => `${h}:00--${horas[i + 1]}:00`);
}

function crearCelda(tag, texto, clase) {
    const el = document.createElement(tag);
    el.textContent = texto;
    el.className = clase;
    return el;
}

function crearFila(tag, textos, clase) {
    const fila = document.createElement("tr");
    fila.append(...textos.map(t => crearCelda(tag, t, clase)));
    return fila;
}

function pintarHorario(contenedor, dias, horas, estado = "Abierto") {
    const tabla = document.createElement("table");

    const thead = document.createElement("thead");
    thead.appendChild(crearFila("th", ["Hora", ...dias], "titulocal"));

    const tbody = document.createElement("tbody");
    const filas = franjasHorarias(horas).map(franja =>
        crearFila("td", [franja, ...dias.map(() => estado)], "celdaHorario")
    );
    tbody.append(...filas);

    tabla.append(thead, tbody);
    contenedor.replaceChildren(tabla);
}    

function delegacionEventos () {
    const tituloEventos = document.getElementById("titulo-eventos");
    if (tituloEventos) {
        const listaEventos = tituloEventos.nextElementSibling;
        if (listaEventos && listaEventos.tagName === "UL") {
            //Un único listener para toda la lista.
            listaEventos.addEventListener("click", function (evento) {
                //Comprobamos si el elemento que ha recibido el click es el botón "Quitar"
                if (evento.target.matches(".btn-quitar-evento")) {
                    //Buscamos el <li> que contiene ese botón
                    const li = evento.target.closest("li");

                    //Si lo encontramos, lo eliminamos
                    if (li) {
                        li.remove();
                    }
                }
            });
        }
    }
}