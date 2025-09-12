// Función para mostrar el formulario de inicio de sesión de administrador
function showAdminLogin() {
    document.getElementById('loginModal').style.display = 'block';
}

// Función para cerrar el formulario de inicio de sesión de administrador
function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

// Función para iniciar sesión como administrador
function adminLogin(event) {
    event.preventDefault();

    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;

    // Verificar credenciales (esto es solo un ejemplo)
    if (email === 'desarrollador@skylearn.com' && password === 'skylearn2025') {
        // Cerrar el modal
        closeLoginModal();

        // Mostrar el enlace de administración
        document.getElementById('adminLink').style.display = 'block';

        // Mostrar la sección de administración
        showSection('admin');

        // Cargar datos del panel de administración
        loadAdminData();
    } else {
        alert('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
    }
}

// Función para cerrar sesión de administrador
function adminLogout() {
    // Ocultar el enlace de administración
    document.getElementById('adminLink').style.display = 'none';

    // Mostrar la sección de inicio
    showSection('home');
}

// Función para cargar datos del panel de administración
function loadAdminData() {
    // Actualizar estadísticas del panel
    document.getElementById('totalStudents').textContent = '5000';
    document.getElementById('totalCourses').textContent = '120';
    document.getElementById('totalComments').textContent = '45';

    // Cargar última actividad
    document.getElementById('lastComment').textContent = '¡Excelente plataforma! - Ana García';
    document.getElementById('lastRegistration').textContent = 'Carlos Rodríguez - Inglés Intermedio';
}

// Función para mostrar pestaña de administración
function showAdminTab(tabName) {
    // Ocultar todos los contenidos de administración
    const adminContents = document.querySelectorAll('.admin-content');
    adminContents.forEach(content => {
        content.classList.remove('active');
    });

    // Mostrar el contenido seleccionado
    document.getElementById(`admin-${tabName}`).classList.add('active');

    // Actualizar pestañas activas
    const adminTabs = document.querySelectorAll('.admin-tab');
    adminTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.textContent.toLowerCase().includes(tabName) ||
            (tabName === 'dashboard' && tab.textContent === 'Dashboard')) {
            tab.classList.add('active');
        }
    });

    // Cargar datos específicos de la pestaña
    if (tabName === 'courses') {
        loadAdminCourses();
    } else if (tabName === 'pricing') {
        loadAdminPricing();
    } else if (tabName === 'live') {
        loadAdminLiveClasses();
    } else if (tabName === 'access') {
        loadAdminAccessClasses();
    } else if (tabName === 'banners') {
        loadAdminBanners();
    }
}

// Función para actualizar estadísticas de inicio
function updateHomeStats() {
    const students = document.getElementById('statsStudents').value;
    const courses = document.getElementById('statsCourses').value;
    const teachers = document.getElementById('statsTeachers').value;
    const satisfaction = document.getElementById('statsSatisfaction').value;

    // Actualizar los atributos data-target
    document.querySelector('.stat-item:nth-child(1) .stat-number').setAttribute('data-target', students);
    document.querySelector('.stat-item:nth-child(2) .stat-number').setAttribute('data-target', courses);
    document.querySelector('.stat-item:nth-child(3) .stat-number').setAttribute('data-target', teachers);
    document.querySelector('.stat-item:nth-child(4) .stat-number').setAttribute('data-target', satisfaction);

    // Actualizar los valores mostrados
    document.querySelector('.stat-item:nth-child(1) .stat-number').textContent = students;
    document.querySelector('.stat-item:nth-child(2) .stat-number').textContent = courses;
    document.querySelector('.stat-item:nth-child(3) .stat-number').textContent = teachers;
    document.querySelector('.stat-item:nth-child(4) .stat-number').textContent = satisfaction;
    
    // Volver a animar las estadísticas
    animateStats();

    alert('Estadísticas actualizadas correctamente.');
}

// Función para actualizar noticias
function updateNews(event) {
    event.preventDefault();

    const newsText = document.getElementById('newsInput').value;
    document.getElementById('newsText').textContent = newsText;

    alert('Noticia actualizada correctamente.');
}

// Función para mostrar formulario de agregar curso
function showAddCourseForm() {
    document.getElementById('addCourseForm').style.display = 'block';
}

// Función para ocultar formulario de agregar curso
function hideAddCourseForm() {
    document.getElementById('addCourseForm').style.display = 'none';
}

// Función para agregar curso
function addCourse(event) {
    event.preventDefault();

    // Obtener valores del formulario
    const title = document.getElementById('newCourseTitle').value;
    const teacher = document.getElementById('newCourseTeacher').value;
    const duration = document.getElementById('newCourseDuration').value;
    const students = document.getElementById('newCourseStudents').value;
    const price = document.getElementById('newCoursePrice').value;
    const image = document.getElementById('newCourseImage').value;
    const description = document.getElementById('newCourseDescription').value;

    // Aquí se agregaría el curso a la base de datos
    // Por ahora, solo mostramos un mensaje
    alert(`Curso "${title}" agregado correctamente.`);

    // Ocultar el formulario
    hideAddCourseForm();

    // Recargar la lista de cursos
    loadAdminCourses();
    loadCourses(); // También recargar los cursos en la sección pública
}

// Función para cargar cursos en el panel de administración
function loadAdminCourses() {
    const adminCoursesList = document.getElementById('adminCoursesList');

    // Datos de cursos de ejemplo
    const courses = [
        { id: 1, title: "Inglés Básico", teacher: "Prof. John Smith", duration: "8 semanas", students: "120", price: "$99" },
        { id: 2, title: "Inglés Intermedio", teacher: "Prof. Sarah Johnson", duration: "12 semanas", students: "85", price: "$149" },
        { id: 3, title: "Inglés Avanzado", teacher: "Prof. Michael Brown", duration: "16 semanas", students: "65", price: "$199" },
        { id: 4, title: "Preparación TOEFL", teacher: "Prof. Emily Davis", duration: "10 semanas", students: "45", price: "$179" }
    ];

    // Limpiar el contenedor
    adminCoursesList.innerHTML = '';

    // Generar la lista de cursos
    courses.forEach(course => {
        const courseItem = document.createElement('div');
        courseItem.className = 'admin-item';
        courseItem.innerHTML = `
            <div>
                <strong>${course.title}</strong> - ${course.teacher} - ${course.duration} - ${course.students} estudiantes - ${course.price}
            </div>
            <div class="admin-actions">
                <button class="btn btn-secondary" onclick="editCourse(${course.id})">Editar</button>
                <button class="btn btn-danger" onclick="deleteCourse(${course.id})">Eliminar</button>
            </div>
        `;
        adminCoursesList.appendChild(courseItem);
    });
}

// Función para mostrar formulario de agregar precio
function showAddPricingForm() {
    document.getElementById('addPricingForm').style.display = 'block';
}

// Función para ocultar formulario de agregar precio
function hideAddPricingForm() {
    document.getElementById('addPricingForm').style.display = 'none';
}

// Función para agregar precio
function addPricing(event) {
    event.preventDefault();

    // Obtener valores del formulario
    const course = document.getElementById('pricingCourse').value;
    const price = document.getElementById('pricingPrice').value;
    const schedule = document.getElementById('pricingSchedule').value;
    const duration = document.getElementById('pricingDuration').value;
    const type = document.getElementById('pricingType').value;

    // Aquí se agregaría el precio a la base de datos
    // Por ahora, solo mostramos un mensaje
    alert(`Precio para "${course}" agregado correctamente.`);

    // Ocultar el formulario
    hideAddPricingForm();

    // Recargar la lista de precios
    loadAdminPricing();
    loadPricing(type); // También recargar los precios en la sección pública
}

// Función para cargar precios en el panel de administración
function loadAdminPricing() {
    const adminPricingList = document.getElementById('adminPricingList');

    // Datos de precios de ejemplo
    const pricing = [
        { id: 1, course: "Inglés Básico", price: "$99", schedule: "Lunes y Miércoles 18:00-20:00", duration: "8 semanas", type: "monthly" },
        { id: 2, course: "Inglés Intermedio", price: "$149", schedule: "Martes y Jueves 18:00-20:00", duration: "12 semanas", type: "monthly" },
        { id: 3, course: "Inglés Avanzado", price: "$199", schedule: "Lunes y Miércoles 20:00-22:00", duration: "16 semanas", type: "monthly" },
        { id: 4, course: "Preparación TOEFL", price: "$179", schedule: "Sábados 10:00-13:00", duration: "10 semanas", type: "monthly" }
    ];

    // Limpiar el contenedor
    adminPricingList.innerHTML = '';

    // Generar la lista de precios
    pricing.forEach(item => {
        const pricingItem = document.createElement('div');
        pricingItem.className = 'admin-item';
        pricingItem.innerHTML = `
            <div>
                <strong>${item.course}</strong> - ${item.price} - ${item.schedule} - ${item.duration} - ${item.type}
            </div>
            <div class="admin-actions">
                <button class="btn btn-secondary" onclick="editPricing(${item.id})">Editar</button>
                <button class="btn btn-danger" onclick="deletePricing(${item.id})">Eliminar</button>
            </div>
        `;
        adminPricingList.appendChild(pricingItem);
    });
}

// Función para mostrar formulario de agregar clase en vivo
function showAddLiveClassForm() {
    document.getElementById('addLiveClassForm').style.display = 'block';
}

// Función para ocultar formulario de agregar clase en vivo
function hideAddLiveClassForm() {
    document.getElementById('addLiveClassForm').style.display = 'none';
}

// Función para agregar clase en vivo
function addLiveClass(event) {
    event.preventDefault();

    // Obtener valores del formulario
    const title = document.getElementById('liveClassTitle').value;
    const date = document.getElementById('liveClassDate').value;
    const time = document.getElementById('liveClassTime').value;
    const platform = document.getElementById('liveClassPlatform').value;
    const url = document.getElementById('liveClassUrl').value;

    // Aquí se agregaría la clase en vivo a la base de datos
    // Por ahora, solo mostramos un mensaje
    alert(`Clase en vivo "${title}" agregada correctamente.`);

    // Ocultar el formulario
    hideAddLiveClassForm();

    // Recargar la lista de clases en vivo
    loadAdminLiveClasses();
    loadLiveClasses(); // También recargar las clases en vivo en la sección pública
}

// Función para cargar clases en vivo en el panel de administración
function loadAdminLiveClasses() {
    const adminLiveClassesList = document.getElementById('adminLiveClassesList');

    // Datos de clases en vivo de ejemplo
    const liveClasses = [
        { id: 1, title: "Conversación en Inglés", date: "2023-11-15", time: "18:00", platform: "YouTube" },
        { id: 2, title: "Gramática Avanzada", date: "2023-11-17", time: "19:30", platform: "Twitch" },
        { id: 3, title: "Pronunciación Perfecta", date: "2023-11-20", time: "17:00", platform: "YouTube" },
        { id: 4, title: "Vocabulario de Negocios", date: "2023-11-22", time: "20:00", platform: "Facebook" }
    ];

    // Limpiar el contenedor
    adminLiveClassesList.innerHTML = '';

    // Generar la lista de clases en vivo
    liveClasses.forEach(classItem => {
        const classItemElement = document.createElement('div');
        classItemElement.className = 'admin-item';
        classItemElement.innerHTML = `
            <div>
                <strong>${classItem.title}</strong> - ${formatDate(classItem.date)} - ${classItem.time} - ${classItem.platform}
            </div>
            <div class="admin-actions">
                <button class="btn btn-secondary" onclick="editLiveClass(${classItem.id})">Editar</button>
                <button class="btn btn-danger" onclick="deleteLiveClass(${classItem.id})">Eliminar</button>
            </div>
        `;
        adminLiveClassesList.appendChild(classItemElement);
    });
}

// Función para mostrar formulario de agregar acceso a clase
function showAddAccessClassForm() {
    document.getElementById('addAccessClassForm').style.display = 'block';
}

// Función para ocultar formulario de agregar acceso a clase
function hideAddAccessClassForm() {
    document.getElementById('addAccessClassForm').style.display = 'none';
}

// Función para agregar acceso a clase
function addAccessClass(event) {
    event.preventDefault();

    // Obtener valores del formulario
    const title = document.getElementById('accessClassTitle').value;
    const platform = document.getElementById('accessClassPlatform').value;
    const url = document.getElementById('accessClassUrl').value;
    const teacher = document.getElementById('accessClassTeacher').value;
    const schedule = document.getElementById('accessClassSchedule').value;

    // Aquí se agregaría el acceso a clase a la base de datos
    // Por ahora, solo mostramos un mensaje
    alert(`Acceso a clase "${title}" agregado correctamente.`);

    // Ocultar el formulario
    hideAddAccessClassForm();

    // Recargar la lista de acceso a clases
    loadAdminAccessClasses();
    loadAccessClasses(); // También recargar los accesos a clases en la sección pública
}

// Función para cargar acceso a clases en el panel de administración
function loadAdminAccessClasses() {
    const adminAccessClassesList = document.getElementById('adminAccessClassesList');

    // Datos de acceso a clases de ejemplo
    const accessClasses = [
        { id: 1, title: "Inglés Básico - Grupo A", platform: "Zoom", teacher: "Prof. John Smith", schedule: "Lunes y Miércoles 18:00-20:00" },
        { id: 2, title: "Inglés Intermedio - Grupo B", platform: "Google Meet", teacher: "Prof. Sarah Johnson", schedule: "Martes y Jueves 18:00-20:00" },
        { id: 3, title: "Inglés Avanzado - Grupo A", platform: "Zoom", teacher: "Prof. Michael Brown", schedule: "Lunes y Miércoles 20:00-22:00" },
        { id: 4, title: "Preparación TOEFL - Grupo A", platform: "Google Meet", teacher: "Prof. Emily Davis", schedule: "Sábados 10:00-13:00" }
    ];

    // Limpiar el contenedor
    adminAccessClassesList.innerHTML = '';

    // Generar la lista de acceso a clases
    accessClasses.forEach(classItem => {
        const classItemElement = document.createElement('div');
        classItemElement.className = 'admin-item';
        classItemElement.innerHTML = `
            <div>
                <strong>${classItem.title}</strong> - ${classItem.platform} - ${classItem.teacher} - ${classItem.schedule}
            </div>
            <div class="admin-actions">
                <button class="btn btn-secondary" onclick="editAccessClass(${classItem.id})">Editar</button>
                <button class="btn btn-danger" onclick="deleteAccessClass(${classItem.id})">Eliminar</button>
            </div>
        `;
        adminAccessClassesList.appendChild(classItemElement);
    });
}

// Función para mostrar formulario de agregar banner
function showAddBannerForm() {
    document.getElementById('addBannerForm').style.display = 'block';
}

// Función para ocultar formulario de agregar banner
function hideAddBannerForm() {
    document.getElementById('addBannerForm').style.display = 'none';
}

// Función para agregar banner
function addBanner(event) {
    event.preventDefault();

    // Obtener valores del formulario
    const title = document.getElementById('bannerTitle').value;
    const url = document.getElementById('bannerUrl').value;

    // Aquí se agregaría el banner a la base de datos
    // Por ahora, solo mostramos un mensaje
    alert(`Banner "${title}" agregado correctamente.`);

    // Ocultar el formulario
    hideAddBannerForm();

    // Recargar la lista de banners
    loadAdminBanners();
}

// Función para cargar banners en el panel de administración
function loadAdminBanners() {
    const adminBannersList = document.getElementById('adminBannersList');

    // Datos de banners de ejemplo
    const banners = [
        { id: 1, title: "Promoción de Verano", url: "https://example.com/banner1.jpg" },
        { id: 2, title: "Nuevo Curso de Negocios", url: "https://example.com/banner2.jpg" },
        { id: 3, title: "Clases Gratuitas", url: "https://example.com/banner3.jpg" }
    ];

    // Limpiar el contenedor
    adminBannersList.innerHTML = '';

    // Generar la lista de banners
    banners.forEach(banner => {
        const bannerItem = document.createElement('div');
        bannerItem.className = 'admin-item';
        bannerItem.innerHTML = `
            <div>
                <strong>${banner.title}</strong> - ${banner.url}
            </div>
            <div class="admin-actions">
                <button class="btn btn-secondary" onclick="editBanner(${banner.id})">Editar</button>
                <button class="btn btn-danger" onclick="deleteBanner(${banner.id})">Eliminar</button>
            </div>
        `;
        adminBannersList.appendChild(bannerItem);
    });
}

// Función para resetear formulario
function resetForm(formName) {
    if (formName === 'news') {
        document.getElementById('newsInput').value = '¡¡OBTÉN UN 30% DE DESCUENTO AL INSCRIBIRTE AHORA!! Válido hasta el 30 de noviembre.';
    }
}

// Funciones de edición y eliminación (modificadas para actualizar en tiempo real)
function editCourse(id) {
    // Aquí deberías mostrar un formulario con los datos actuales del curso
    // Por ahora, solo simularemos la actualización
    
    // Simulación de actualización
    alert(`Editando curso con ID: ${id}`);
    
    // Después de editar, recargar los cursos para que se vean los cambios
    loadCourses();
    loadAdminCourses();
}

function deleteCourse(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este curso?')) {
        alert(`Curso con ID: ${id} eliminado correctamente.`);
        loadCourses();
        loadAdminCourses();
    }
}

function editPricing(id) {
    // Simulación de actualización
    alert(`Editando precio con ID: ${id}`);
    
    // Recargar los precios
    const activeTab = document.querySelector('.pricing-tab.active').textContent.toLowerCase();
    let pricingType = 'monthly';
    
    if (activeTab.includes('trimestral')) pricingType = 'quarterly';
    if (activeTab.includes('anual')) pricingType = 'yearly';
    
    loadPricing(pricingType);
    loadAdminPricing();
}

function deletePricing(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este precio?')) {
        alert(`Precio con ID: ${id} eliminado correctamente.`);
        
        const activeTab = document.querySelector('.pricing-tab.active').textContent.toLowerCase();
        let pricingType = 'monthly';
        
        if (activeTab.includes('trimestral')) pricingType = 'quarterly';
        if (activeTab.includes('anual')) pricingType = 'yearly';
        
        loadPricing(pricingType);
        loadAdminPricing();
    }
}

function editLiveClass(id) {
    // Simulación de actualización
    alert(`Editando clase en vivo con ID: ${id}`);
    
    // Recargar las clases en vivo
    loadLiveClasses();
    loadAdminLiveClasses();
}

function deleteLiveClass(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta clase en vivo?')) {
        alert(`Clase en vivo con ID: ${id} eliminada correctamente.`);
        loadLiveClasses();
        loadAdminLiveClasses();
    }
}

function editAccessClass(id) {
    // Simulación de actualización
    alert(`Editando acceso a clase con ID: ${id}`);
    
    // Recargar los accesos a clases
    loadAccessClasses();
    loadAdminAccessClasses();
}

function deleteAccessClass(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este acceso a clase?')) {
        alert(`Acceso a clase con ID: ${id} eliminado correctamente.`);
        loadAccessClasses();
        loadAdminAccessClasses();
    }
}

function editBanner(id) {
    // Simulación de actualización
    alert(`Editando banner con ID: ${id}`);
    
    // Recargar los banners
    loadAdminBanners();
}

function deleteBanner(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este banner?')) {
        alert(`Banner con ID: ${id} eliminado correctamente.`);
        loadAdminBanners();
    }
}

// Función para formatear fecha (necesaria para admin.js)
function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
}

// Función para animar estadísticas (necesaria para admin.js)
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        let count = 0;
        const increment = target / 100;

        const updateCount = () => {
            if (count < target) {
                count += increment;
                stat.innerText = Math.ceil(count);
                setTimeout(updateCount, 20);
            } else {
                stat.innerText = target;
            }
        };

        updateCount();
    });
}

// Función para cargar cursos (necesaria para admin.js)
function loadCourses() {
    const coursesGrid = document.getElementById('coursesGrid');

    // Datos de cursos de ejemplo
    const courses = [
        {
            title: "Inglés Básico",
            teacher: "Prof. John Smith",
            duration: "8 semanas",
            students: "120",
            price: "$99",
            image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
            description: "Curso ideal para principiantes que quieren aprender los fundamentos del inglés."
        },
        {
            title: "Inglés Intermedio",
            teacher: "Prof. Sarah Johnson",
            duration: "12 semanas",
            students: "85",
            price: "$149",
            image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80",
            description: "Perfecciona tu inglés con este curso diseñado para estudiantes de nivel intermedio."
        },
        {
            title: "Inglés Avanzado",
            teacher: "Prof. Michael Brown",
            duration: "16 semanas",
            students: "65",
            price: "$199",
            image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            description: "Domina el inglés a nivel avanzado con técnicas especializadas y práctica intensiva."
        },
        {
            title: "Preparación TOEFL",
            teacher: "Prof. Emily Davis",
            duration: "10 semanas",
            students: "45",
            price: "$179",
            image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            description: "Prepárate para el examen TOEFL con estrategias probadas y simulacros."
        }
    ];

    // Limpiar el contenedor
    coursesGrid.innerHTML = '';

    // Generar las tarjetas de cursos
    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.innerHTML = `
            <div class="course-image">
                <img src="${course.image}" alt="${course.title}">
            </div>
            <div class="course-content">
                <h3>${course.title}</h3>
                <p class="course-teacher"><i class="fas fa-user-tie"></i> ${course.teacher}</p>
                <p class="course-duration"><i class="fas fa-clock"></i> ${course.duration}</p>
                <p class="course-students"><i class="fas fa-users"></i> ${course.students} estudiantes</p>
                <p class="course-description">${course.description}</p>
                <div class="course-footer">
                    <span class="course-price">${course.price}</span>
                    <button class="btn btn-primary">Inscribirse</button>
                </div>
            </div>
        `;
        coursesGrid.appendChild(courseCard);
    });
}

// Función para cargar precios (necesaria para admin.js)
function loadPricing(type) {
    const pricingTableBody = document.getElementById('pricingTableBody');

    // Datos de precios de ejemplo
    const pricingData = {
        monthly: [
            { course: "Inglés Básico", price: "$99", schedule: "Lunes y Miércoles 18:00-20:00", duration: "8 semanas" },
            { course: "Inglés Intermedio", price: "$149", schedule: "Martes y Jueves 18:00-20:00", duration: "12 semanas" },
            { course: "Inglés Avanzado", price: "$199", schedule: "Lunes y Miércoles 20:00-22:00", duration: "16 semanas" },
            { course: "Preparación TOEFL", price: "$179", schedule: "Sábados 10:00-13:00", duration: "10 semanas" }
        ],
        quarterly: [
            { course: "Inglés Básico", price: "$269", schedule: "Lunes y Miércoles 18:00-20:00", duration: "8 semanas" },
            { course: "Inglés Intermedio", price: "$399", schedule: "Martes y Jueves 18:00-20:00", duration: "12 semanas" },
            { course: "Inglés Avanzado", price: "$539", schedule: "Lunes y Miércoles 20:00-22:00", duration: "16 semanas" },
            { course: "Preparación TOEFL", price: "$479", schedule: "Sábados 10:00-13:00", duration: "10 semanas" }
        ],
        yearly: [
            { course: "Inglés Básico", price: "$999", schedule: "Lunes y Miércoles 18:00-20:00", duration: "8 semanas" },
            { course: "Inglés Intermedio", price: "$1499", schedule: "Martes y Jueves 18:00-20:00", duration: "12 semanas" },
            { course: "Inglés Avanzado", price: "$1999", schedule: "Lunes y Miércoles 20:00-22:00", duration: "16 semanas" },
            { course: "Preparación TOEFL", price: "$1799", schedule: "Sábados 10:00-13:00", duration: "10 semanas" }
        ]
    };

    // Limpiar el contenedor
    pricingTableBody.innerHTML = '';

    // Generar las filas de la tabla
    pricingData[type].forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.course}</td>
            <td>${item.price}</td>
            <td>${item.schedule}</td>
            <td>${item.duration}</td>
        `;
        pricingTableBody.appendChild(row);
    });
}

// Función para cargar clases en vivo (necesaria para admin.js)
function loadLiveClasses() {
    const liveScheduleContainer = document.getElementById('liveScheduleContainer');

    // Datos de clases en vivo de ejemplo
    const liveClasses = [
        { title: "Conversación en Inglés", date: "2023-11-15", time: "18:00", platform: "YouTube" },
        { title: "Gramática Avanzada", date: "2023-11-17", time: "19:30", platform: "Twitch" },
        { title: "Pronunciación Perfecta", date: "2023-11-20", time: "17:00", platform: "YouTube" },
        { title: "Vocabulario de Negocios", date: "2023-11-22", time: "20:00", platform: "Facebook" }
    ];

    // Limpiar el contenedor
    liveScheduleContainer.innerHTML = '';

    // Generar las tarjetas de clases en vivo
    liveClasses.forEach(classItem => {
        const classCard = document.createElement('div');
        classCard.className = 'live-class-card';
        classCard.innerHTML = `
            <div class="live-class-date">${formatDate(classItem.date)}</div>
            <div class="live-class-time">${classItem.time}</div>
            <div class="live-class-title">${classItem.title}</div>
            <div class="live-class-platform"><i class="fab fa-${classItem.platform.toLowerCase()}"></i> ${classItem.platform}</div>
            <button class="btn btn-primary">Unirse a la Clase</button>
        `;
        liveScheduleContainer.appendChild(classCard);
    });
}

// Función para cargar acceso a clases (necesaria para admin.js)
function loadAccessClasses() {
    const accessGrid = document.getElementById('accessGrid');

    // Datos de acceso a clases de ejemplo
    const accessClasses = [
        { title: "Inglés Básico - Grupo A", platform: "Zoom", teacher: "Prof. John Smith", schedule: "Lunes y Miércoles 18:00-20:00" },
        { title: "Inglés Intermedio - Grupo B", platform: "Google Meet", teacher: "Prof. Sarah Johnson", schedule: "Martes y Jueves 18:00-20:00" },
        { title: "Inglés Avanzado - Grupo A", platform: "Zoom", teacher: "Prof. Michael Brown", schedule: "Lunes y Miércoles 20:00-22:00" },
        { title: "Preparación TOEFL - Grupo A", platform: "Google Meet", teacher: "Prof. Emily Davis", schedule: "Sábados 10:00-13:00" }
    ];

    // Limpiar el contenedor
    accessGrid.innerHTML = '';

    // Generar las tarjetas de acceso a clases
    accessClasses.forEach(classItem => {
        const accessCard = document.createElement('div');
        accessCard.className = 'access-card';
        accessCard.innerHTML = `
            <div class="access-card-header">
                <h3>${classItem.title}</h3>
                <span class="access-platform">${classItem.platform}</span>
            </div>
            <div class="access-card-content">
                <p><i class="fas fa-user-tie"></i> ${classItem.teacher}</p>
                <p><i class="fas fa-clock"></i> ${classItem.schedule}</p>
            </div>
            <div class="access-card-footer">
                <button class="btn btn-primary">Unirse a la Clase</button>
            </div>
        `;
        accessGrid.appendChild(accessCard);
    });
}

// Función para mostrar secciones (necesaria para admin.js)
function showSection(sectionId) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Mostrar la sección seleccionada
    document.getElementById(sectionId).classList.add('active');

    // Actualizar enlace activo en la navegación
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });

    // Cargar contenido específico de la sección si es necesario
    if (sectionId === 'courses') {
        loadCourses();
    } else if (sectionId === 'pricing') {
        loadPricing('monthly');
    } else if (sectionId === 'live') {
        loadLiveClasses();
        initCalendar();
    } else if (sectionId === 'access') {
        loadAccessClasses();
    }
}
