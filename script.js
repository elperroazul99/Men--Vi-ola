/**
 * CONFIGURACIÓN DE GOOGLE SHEETS
 */
const SHEET_ID = '1tutxK1Yf1jyT7ww5RpeuILKBqhU4ibi1hxlaOr3gefk';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

/**
 * Carga los datos desde Google Sheets al iniciar
 */
async function cargarMenu() {
  try {
    const response = await fetch(SHEET_URL);
    const text = await response.text();
    const data = JSON.parse(text.substr(47).slice(0, -2));
    const filas = data.table.rows;

    const items = filas.map(fila => ({
      seccion: fila.c[0]?.v || '',
      categoria: fila.c[1]?.v || '',
      nombre: fila.c[2]?.v || '',
      precio: fila.c[3]?.v || ''
    }));

    // Renderizamos cada sección de la página
    renderizarHome(items);
    renderizarSeccion(items, 'seccion-bar');
    renderizarSeccion(items, 'seccion-cocina-principal');
    renderizarSeccion(items, 'seccion-cocina-ligera');
    renderizarSeccion(items, 'seccion-cocina-postres');

  } catch (error) {
    console.error("Error cargando el menú desde Google Sheets:", error);
  }
}

/**
 * Renderiza la sección de INICIO (Recomendación y Más Vendidos)
 */
function renderizarHome(items) {
  const contenedor = document.getElementById('seccion-home');
  if (!contenedor) return;

  const itemsHome = items.filter(i => i.seccion === 'seccion-home');
  const recomendacion = itemsHome.find(i => i.categoria === 'RECOMENDACIÓN');
  const masVendidos = itemsHome.filter(i => i.categoria === 'MÁS VENDIDOS');

  let html = '';
  
  if (recomendacion) {
    html += `
      <div class="oferta-dia">
        <span class="badge" style="background:#000; color:#ffa500; padding:2px 10px; border-radius:5px; font-size:0.8em;">RECOMENDACIÓN DEL DÍA</span>
        <div class="menu-item-especial">
          <p style="font-size:1.2em; margin:10px 0;">${recomendacion.nombre}</p>
          <span class="price" style="font-size:1.5em;">${recomendacion.precio}</span>
        </div>
      </div>`;
  }

  if (masVendidos.length > 0) {
    html += `<div class="menu-section"><h2 style="text-align: center;">🔥 LOS MÁS VENDIDOS</h2>`;
    masVendidos.forEach(item => {
      html += `
        <div class="menu-item">
          <p>${item.nombre}</p>
          <span class="price">${item.precio}</span>
        </div>`;
    });
    html += `</div>`;
  }
  
  contenedor.innerHTML = html;
}

/**
 * Renderiza las secciones generales (Bar, Platos, etc.)
 */
function renderizarSeccion(todosLosItems, idContenedor) {
  const contenedor = document.getElementById(idContenedor);
  if (!contenedor) return;

  const itemsSeccion = todosLosItems.filter(i => i.seccion === idContenedor);
  const categorias = [...new Set(itemsSeccion.map(i => i.categoria))];

  let html = '';
  
  // Nota especial para platos principales (como estaba en tu HTML original)
  if (idContenedor === 'seccion-cocina-principal') {
      html += `<div class="menu-section"><h2>Todos los platos prinsipales se acompañan con guarnicion de arróz, viandas y ensalada</h2></div>`;
  }

  categorias.forEach(cat => {
    html += `<div class="menu-section"><h2>${cat}</h2>`;
    itemsSeccion.filter(i => i.categoria === cat).forEach(item => {
      html += `
        <div class="menu-item">
          <p>${item.nombre}</p>
          <span class="price">${item.precio}</span>
        </div>`;
    });
    html += `</div>`;
  });
  
  contenedor.innerHTML = html;
}

/**
 * CONTROL DE NAVEGACIÓN (Tu código original mejorado)
 */
function mostrarSeccion(idSeccion) {
  const secciones = document.querySelectorAll('.menu-pagina');
  secciones.forEach(sec => sec.classList.remove('active'));

  const seleccionada = document.getElementById(idSeccion);
  if (seleccionada) seleccionada.classList.add('active');

  // Cambio de Fondo
  let urlFondo = "";
  switch (idSeccion) {
    case 'seccion-home': urlFondo = "url('fondo2.jpg')"; break;
    case 'seccion-bar': urlFondo = "url('fondo-bar.jpg')"; break;
    case 'seccion-cocina-principal': urlFondo = "url('fondo1.jpg')"; break;
    case 'seccion-cocina-ligera': urlFondo = "url('fondo.jpg')"; break;
    case 'seccion-cocina-postres': urlFondo = "url('fondo-postre.jpg')"; break;
    default: urlFondo = "url('fondo-home.jpg')";
  }

  const style = document.getElementById('dynamic-bg') || document.createElement('style');
  style.id = 'dynamic-bg';
  style.innerHTML = `body::before { background-image: ${urlFondo} !important; }`;
  if (!document.getElementById('dynamic-bg')) document.head.appendChild(style);

  // Cambio de Imagen Derecha
  const imgDinamica = document.getElementById('img-dinamica');
  if (imgDinamica) {
      switch (idSeccion) {
        case 'seccion-home': imgDinamica.src = 'Cocinero.png'; break;
        case 'seccion-bar': imgDinamica.src = 'piña-colada.png'; break;
        case 'seccion-cocina-principal': imgDinamica.src = 'comida.png'; break;
        case 'seccion-cocina-ligera': imgDinamica.src = 'papas.png'; break;
        case 'seccion-cocina-postres': imgDinamica.src = 'postres.png'; break;
        default: imgDinamica.src = 'Cocinero.png';
      }
  }

  document.getElementById('submenu-cocina').style.display = 'none';
}

function toggleSubmenu() {
  const submenu = document.getElementById('submenu-cocina');
  submenu.style.display = (submenu.style.display === 'flex') ? 'none' : 'flex';
}

window.onload = () => {
  cargarMenu(); // Carga los datos del Excel
  mostrarSeccion('seccion-home'); // Muestra el inicio
};

