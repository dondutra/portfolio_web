// CONFIGURACIÓN PERSONAL
const MI_NOMBRE = "Don Dutra"; 

// LISTADO DE INVESTIGACIONES
const postIndex = [
    { id: '1', file: 'posts/sherlock-1.md', tag: 'HTB', titulo: 'Caso Tracer', desc: 'Análisis de intrusión persistente.' },
    { id: '2', file: 'posts/memoria.md', tag: 'LAB', titulo: 'Análisis RAM', desc: 'Dumping de procesos ocultos.' }
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
        if (!response.ok) throw new Error();
        const text = await response.text();
        document.getElementById('post-content').innerHTML = marked.parse(text);
        showSection('post-viewer');
    } catch (e) {
        document.getElementById('post-content').innerHTML = `<div class="mono text-xs text-red-400">[!] ARCHIVO_NO_ENCONTRADO</div>`;
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