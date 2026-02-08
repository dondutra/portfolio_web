// CONFIGURACIÓN PERSONAL
const MI_NOMBRE = "Don Dutra"; 

// LISTADO DE INVESTIGACIONES
const postIndex = [
    { 
        id: '1', 
        file: 'posts/UNI/1_1/UNI_1_1.md', 
        tag: 'UNI', 
        titulo: 'Volcado y Análisis de Memoria del Proceso MEMPASS', 
        desc: 'Tarea 1.1 para la asignatura Auditoría Informática II.' 
    },
];

// EFECTO TERMINAL (TYPEWRITER)
function typeWriter(text, elementId, speed = 100) {
    let i = 0;
    const element = document.getElementById(elementId);
    if (!element) return;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML = text.substring(0, i + 1) + '<span class="cursor">&nbsp;</span>';
            i++;
            setTimeout(type, speed);
        } else {
            element.innerHTML = text + '<span class="cursor">&nbsp;</span>';
        }
    }
    type();
}

// SISTEMA DE NAVEGACIÓN
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    
    setTimeout(() => {
        const target = document.getElementById(sectionId);
        if (target) target.classList.add('active');
        
        const btn = document.getElementById('btn-' + sectionId);
        if (btn) btn.classList.add('active');
        
        if (sectionId === 'home') typeWriter(MI_NOMBRE, 'typewriter-name');
    }, 50);
    window.scrollTo(0, 0);
}

// RENDERIZAR LISTADO DE POSTS
function cargarListado() {
    const container = document.getElementById('posts-container');
    if (!container) return;
    container.innerHTML = postIndex.map(post => `
        <article class="card-evidence p-6 cursor-pointer group" onclick="leerPost('${post.file}')">
            <span class="mono text-[9px] tracking-[0.2em] px-2 py-1 bg-black" style="color: var(--accent-main); border: 1px solid var(--border-soft);">${post.tag}</span>
            <h3 class="text-xl font-bold mt-4 mb-2 group-hover:text-white transition-colors">${post.titulo}</h3>
            <p class="text-xs opacity-60 mb-4">${post.desc}</p>
            <span class="mono text-[10px] uppercase tracking-widest" style="color: var(--accent-main);">Acceder_archivo -></span>
        </article>
    `).join('');
}

// CARGAR Y CONVERTIR MARKDOWN
async function leerPost(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error("404"); // Solo lanza error si el fetch falla
        let text = await response.text();

        const baseUrl = filePath.substring(0, filePath.lastIndexOf('/') + 1);
        const renderer = new marked.Renderer();
        
        // Nueva sintaxis para imágenes: se recibe un objeto { href, title, text }
        renderer.image = ({ href, title, text }) => {
            const fullPath = href.startsWith('http') ? href : baseUrl + href;
            return `<img src="${fullPath}" alt="${text || ''}" class="my-8 rounded border border-[#34312D] shadow-lg mx-auto max-w-full">`;
        };

        // Nueva sintaxis para enlaces: se recibe un objeto { href, title, text }
        renderer.link = ({ href, title, text }) => {
            const isExternal = href.startsWith('http');
            const fullPath = isExternal ? href : baseUrl + href;
            const downloadAttr = href.toLowerCase().endsWith('.zip') ? 'download' : '';
            return `<a href="${fullPath}" ${downloadAttr} target="_blank" class="text-[#00ff41] underline hover:opacity-80 transition-opacity">${text}</a>`;
        };

        document.getElementById('post-content').innerHTML = marked.parse(text, { renderer });
        showSection('post-viewer');
    } catch (e) {
        console.error("Error cargando el post:", e);
        const errorMsg = e.message === "404" 
            ? `[!] ERROR: ARCHIVO_NO_ENCONTRADO en ${filePath}` 
            : `[!] ERROR_DE_SINTAXIS: Consulta la consola del navegador.`;
        
        document.getElementById('post-content').innerHTML = `<div class="mono text-xs text-red-400">${errorMsg}</div>`;
        showSection('post-viewer');
    }
}

// INICIALIZACIÓN
window.onload = () => {
    // Poner fecha actual en el footer
    const ts = document.getElementById('timestamp');
    if (ts) ts.innerText = new Date().toISOString().split('T')[0];
    
    cargarListado();
    typeWriter(MI_NOMBRE, 'typewriter-name');
};