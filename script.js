// Variable global para almacenar los productos
let productos = [];

// Elementos del DOM
const calculateBtn = document.getElementById('calculateBtn');
const resultadosDiv = document.getElementById('resultados');
const errorDiv = document.getElementById('errorMessage');
const productosContainer = document.getElementById('productosContainer');
const boquillaResultados = document.getElementById('boquillaResultados');

// Cargar productos desde JSON
async function cargarProductos() {
    try {
        const response = await fetch('productos.json');
        if (!response.ok) {
            throw new Error('No se pudo cargar la base de productos');
        }
        const data = await response.json();
        productos = data.productos;
        mostrarProductosDisponibles();
    } catch (error) {
        console.error('Error:', error);
        mostrarError(`Error al cargar productos: ${error.message}`);
    }
}

// Mostrar productos disponibles


// Función para calcular sacos de cemento (CORREGIDA)
function calcularSacosCemento(tamanoStr, metros) {
    const dimensiones = tamanoStr.match(/\d+(\.\d+)?/g);
    if (!dimensiones || dimensiones.length < 2) return 0;

    const ancho = parseFloat(dimensiones[0]);
    const alto = parseFloat(dimensiones[1]);

    let rendimientoCemento;

    if (ancho > 60 || alto > 60) {
        rendimientoCemento = 1.5;  // 1 saco rinde para 1.5 m²
    } else if (ancho === 60 && alto === 60) {
        rendimientoCemento = 2;    // 1 saco rinde para 2 m²
    } else {
        rendimientoCemento = 3;    // 1 saco rinde para 3 m²
    }

    return Math.ceil(metros / rendimientoCemento);
}

// Función para mostrar mensajes de error
function mostrarError(mensaje) {
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle me-2"></i>${mensaje}`;
    errorDiv.style.display = "block";
    resultadosDiv.style.display = "none";
    boquillaResultados.style.display = "none";
}

// Función principal para mostrar resultados (CORREGIDA)
function mostrarResultados() {
    const sku = document.getElementById("sku").value.trim();
    const metrosInput = document.getElementById("metros").value.trim();
    const metros = parseFloat(metrosInput);
    const superficie = document.getElementById('superficie').value;
    const separacion = document.querySelector('input[name="separacion"]:checked');
    const separacionValor = separacion ? parseFloat(separacion.value) : null;

    // Resetear mensajes
    resultadosDiv.style.display = "none";
    errorDiv.style.display = "none";
    errorDiv.innerHTML = "";
    boquillaResultados.style.display = "none";

    // Validación CORREGIDA
    if (!superficie) {
        mostrarError("Selecciona una superficie");
        return;
    }

    if (!separacion) {
        mostrarError("Selecciona una separación entre piezas");
        return;
    }

    if (!sku) {
        mostrarError("Debes ingresar un SKU válido");
        return;
    }

    if (!metrosInput || isNaN(metros) || metros <= 0) {
        mostrarError("Ingresa metros cuadrados válidos (mayores a cero)");
        return;
    }

    // Validación adicional para bañeras
    if (superficie === 'bañera' && (separacionValor === 5 || separacionValor === 6)) {
        mostrarError("Para bañeras, las separaciones de 5mm y 6mm no están disponibles");
        return;
    }

    // Buscar producto
    const producto = productos.find(p => p.sku === sku);

    if (!producto) {
        mostrarError(`SKU ${sku} no encontrado en nuestra base de datos`);
        return;
    }

    // Cálculos CORREGIDOS
    const cajasNecesarias = Math.ceil(metros / producto.rendimiento);
    const sacosCemento = calcularSacosCemento(producto.tamaño, metros);

    const dimensiones = producto.tamaño.match(/\d+(\.\d+)?/g);
    const ancho = dimensiones ? parseFloat(dimensiones[0]) : 0;
    const alto = dimensiones ? parseFloat(dimensiones[1]) : 0;

    let tipoCemento = "";
    if (ancho > 60 || alto > 60) {
        tipoCemento = "Formato grande: 1 saco rinde para 1.5 m²";
    } else if (ancho === 60 && alto === 60) {
        tipoCemento = "Rapido: 1 saco rinde para 2 m²";
    } else {
        tipoCemento = "Rapido: 1 saco rinde para 3 m²";
    }

    // Mostrar resultados detallados
    resultadosDiv.innerHTML = `
        <div class="product-header">
            <h3 class="product-name">${producto.nombre}</h3>
            <div class="color-box" style="background-color:${producto.color}"></div>
        </div>

        <div class="product-info">
            <div class="info-grid">
                <div class="info-item">
                    <strong>SKU</strong>
                    <span>${sku}</span>
                </div>
                <div class="info-item">
                    <strong>Tamaño</strong>
                    <span>${producto.tamaño}</span>
                </div>
                <div class="info-item">
                    <strong>Rendimiento</strong>
                    <span>${producto.rendimiento} m²/caja</span>
                </div>
            </div>
        </div>

        <div class="calculations">
            <div class="calculation-item">
                <span>Metros requeridos:</span>
                <span><strong>${metros} m²</strong></span>
            </div>
            <div class="calculation-item">
                <span>Cajas necesarias:</span>
                <span><strong>${cajasNecesarias}</strong></span>
            </div>
            <div class="calculation-item">
                <span>Tipo de cemento:</span>
                <span>${tipoCemento}</span>
            </div>
            <div class="calculation-item">
                <span>Sacos de cemento:</span>
                <span><strong>${sacosCemento}</strong></span>
            </div>
        </div>

        ${producto.imagen ? `<img src="${producto.imagen}" alt="${producto.nombre}" class="product-image">` : ''}
    `;

    resultadosDiv.style.display = "block";

    // Lógica para boquillas CORREGIDA
    if (superficie === 'bañera') {
        // Para bañeras siempre usar boquilla sin arena
        const sacosBoquilla = Math.ceil(metros / 14);
        document.getElementById('tipoBoquilla').textContent = "Boquilla sin arena";
        document.getElementById('sacosBoquilla').textContent = sacosBoquilla;
        document.getElementById('calculoBoquilla').textContent = `1 saco rinde para 14 m² (${metros} m² / 14 = ${sacosBoquilla} sacos)`;
        boquillaResultados.style.display = "block";
    } else {
        if (separacionValor <= 3) {
            // Separaciones pequeñas: boquilla sin arena
            const sacosBoquilla = Math.ceil(metros / 14);
            document.getElementById('tipoBoquilla').textContent = "Boquilla sin arena";
            document.getElementById('sacosBoquilla').textContent = sacosBoquilla;
            document.getElementById('calculoBoquilla').textContent = `1 saco rinde para 14 m² (${metros} m² / 14 = ${sacosBoquilla} sacos)`;
            boquillaResultados.style.display = "block";
        } else if (separacionValor >= 5) {
            // Separaciones grandes: boquilla con arena
            const sacosBoquilla = Math.ceil(metros / 14);
            document.getElementById('tipoBoquilla').textContent = "Boquilla con arena";
            document.getElementById('sacosBoquilla').textContent = sacosBoquilla;
            document.getElementById('calculoBoquilla').textContent = `1 saco rinde para 14 m² (${metros} m² / 14 = ${sacosBoquilla} sacos)`;
            boquillaResultados.style.display = "block";
        }
    }

    // Desplazarse suavemente a los resultados
    resultadosDiv.scrollIntoView({ behavior: 'smooth' });
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();

    // Asignar evento al botón de cálculo
    calculateBtn.addEventListener('click', mostrarResultados);

    // Permitir calcular con la tecla Enter
    document.getElementById('metros').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            mostrarResultados();
        }
    });

    // Código para el recomendador de boquillas
    const superficieSelect = document.getElementById('superficie');
    const sep5Radio = document.getElementById('sep5');
    const sep6Radio = document.getElementById('sep6');
    const boquillaWarning = document.getElementById('boquillaWarning');

    function updateBoquillaOptions() {
        const superficie = superficieSelect.value;

        if (superficie === 'bañera') {
            // Deshabilitar las opciones de 5mm y 6mm
            sep5Radio.disabled = true;
            sep6Radio.disabled = true;
            boquillaWarning.style.display = 'flex';

            // Si están seleccionadas, deseleccionar
            if (sep5Radio.checked || sep6Radio.checked) {
                document.querySelector('input[name="separacion"][value="1.2"]').checked = true;
            }
        } else {
            // Habilitar las opciones
            sep5Radio.disabled = false;
            sep6Radio.disabled = false;
            boquillaWarning.style.display = 'none';
        }
    }

    superficieSelect.addEventListener('change', updateBoquillaOptions);

    // Inicializar las opciones
    updateBoquillaOptions();

    // PWA Installation Logic
    const installPrompt = document.getElementById('installPrompt');
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
        // Previene que el mini-infobar aparezca en móviles
        e.preventDefault();
        // Guarda el evento para que se pueda activar más tarde
        deferredPrompt = e;
        // Muestra el botón de instalación
        installPrompt.style.display = 'flex';

        installPrompt.addEventListener('click', async () => {
            // Oculta el botón de instalación
            installPrompt.style.display = 'none';
            // Muestra el prompt de instalación
            deferredPrompt.prompt();
            // Espera a que el usuario responda al prompt
            const { outcome } = await deferredPrompt.userChoice;
            // Opcionalmente, envía analíticos del resultado
            console.log(`User response to the install prompt: ${outcome}`);
            // Ya no necesitamos el prompt, limpiamos la variable
            deferredPrompt = null;
        });
    });

    window.addEventListener('appinstalled', () => {
        // Oculta el botón de instalación
        installPrompt.style.display = 'none';
        // Limpia el prompt guardado
        deferredPrompt = null;
        console.log('PWA was installed');
    });

    // Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(registration => {
                    console.log('ServiceWorker registered: ', registration);
                })
                .catch(error => {
                    console.log('ServiceWorker registration failed: ', error);
                });
        });
    }
});

