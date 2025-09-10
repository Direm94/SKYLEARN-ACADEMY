// Función para verificar si es la primera visita
function checkFirstVisit() {
    const hasVisited = localStorage.getItem('hasVisited');
    
    if (hasVisited) {
        // Si ya ha visitado, mostrar directamente el contenido principal
        showMainContent();
    } else {
        // Si es la primera visita, mostrar la pantalla de bienvenida
        document.getElementById('loginScreen').style.display = 'flex';
        
        // Guardar que ya ha visitado
        localStorage.setItem('hasVisited', 'true');
    }
}

// Función para mostrar el contenido principal
function showMainContent() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('navbar').style.display = 'block';
    document.querySelector('main').style.display = 'block';

    // Inicializar componentes después de mostrar el contenido
    initializeComponents();
}

// Función para inicializar componentes
function initializeComponents() {
    // Inicializar contador de estadísticas
    animateStats();

    // Inicializar carrusel
    initSlider();

    // Cargar datos dinámicos
    loadCourses();
    loadPricing('monthly');
    loadLiveClasses();
    loadAccessClasses();
    loadComments();
}

// Función para mostrar secciones
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

// Función para animar estadísticas
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

// Función para inicializar el carrusel
function initSlider() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slider-image');
    const dots = document.querySelectorAll('.slider-dot');

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    // Asignar evento a los puntos
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });

    // Cambiar automáticamente de slide cada 5 segundos
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, 5000);
}

// Función para cargar cursos
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

// Función para cargar precios
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

// Función para cambiar la vista de precios
function showPricing(type) {
    // Actualizar pestañas activas
    const tabs = document.querySelectorAll('.pricing-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.textContent.toLowerCase() === type ||
            (type === 'quarterly' && tab.textContent === 'Trimestral') ||
            (type === 'yearly' && tab.textContent === 'Anual')) {
            tab.classList.add('active');
        }
    });

    // Cargar los datos de precios
    loadPricing(type);
}

// Función para cargar clases en vivo
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

// Función para cargar acceso a clases
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

// Función para cargar comentarios
function loadComments() {
    const commentsContainer = document.getElementById('commentsContainer');

    // Datos de comentarios de ejemplo
    const comments = [
        { user: "Ana García", text: "¡Excelente plataforma! He mejorado mi inglés mucho desde que me inscribí.", date: "2023-11-10" },
        { user: "Carlos Rodríguez", text: "Los profesores son muy profesionales y las clases son muy interactivas.", date: "2023-11-08" },
        { user: "María López", text: "Recomiendo totalmente los cursos de preparación para exámenes. Me ayudó a aprobar el TOEFL.", date: "2023-11-05" }
    ];

    // Limpiar el contenedor
    commentsContainer.innerHTML = '';

    // Generar los comentarios
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `
            <div class="comment-header">
                <div class="comment-user">${comment.user}</div>
                <div class="comment-date">${formatDate(comment.date)}</div>
            </div>
            <div class="comment-text">${comment.text}</div>
        `;
        commentsContainer.appendChild(commentElement);
    });
}

// Función para agregar un comentario
function addComment(event) {
    event.preventDefault();

    const commentInput = document.getElementById('commentInput');
    const commentText = commentInput.value.trim();

    if (commentText) {
        const commentsContainer = document.getElementById('commentsContainer');

        // Crear nuevo comentario
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `
            <div class="comment-header">
                <div class="comment-user">Tú</div>
                <div class="comment-date">${formatDate(new Date().toISOString().split('T')[0])}</div>
            </div>
            <div class="comment-text">${commentText}</div>
        `;

        // Agregar al principio de la lista
        commentsContainer.insertBefore(commentElement, commentsContainer.firstChild);

        // Limpiar el input
        commentInput.value = '';
    }
}

// Función para formatear fecha
function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
}

// Función para inicializar el calendario
function initCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthElement = document.getElementById('currentMonth');
    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    function renderCalendar() {
        // Limpiar el calendario
        calendarGrid.innerHTML = '';

        // Actualizar el mes y año mostrados
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;

        // Obtener el primer día del mes y el número de días
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Agregar encabezados de días de la semana
        const dayHeaders = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        dayHeaders.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day-header';
            dayElement.textContent = day;
            calendarGrid.appendChild(dayElement);
        });

        // Agregar días vacíos antes del primer día del mes
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyDay);
        }

        // Agregar los días del mes
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;

            // Marcar el día actual
            if (currentYear === currentDate.getFullYear() &&
                currentMonth === currentDate.getMonth() &&
                day === currentDate.getDate()) {
                dayElement.classList.add('today');
            }

            // Marcar días con clases (ejemplo)
            if ((day === 15 || day === 17 || day === 20 || day === 22) && currentMonth === 10) {
                dayElement.classList.add('has-class');
            }

            calendarGrid.appendChild(dayElement);
        }
    }

    // Eventos para cambiar de mes
    prevMonthButton.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    nextMonthButton.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    // Renderizar el calendario inicial
    renderCalendar();
}

// Función para enviar mensaje del chat en vivo
function sendLiveChatMessage() {
    const liveChatInput = document.getElementById('liveChatInput');
    const liveChatMessages = document.getElementById('liveChatMessages');
    const messageText = liveChatInput.value.trim();

    if (messageText) {
        // Agregar mensaje del usuario
        const userMessage = document.createElement('div');
        userMessage.className = 'chat-message user-message';
        userMessage.textContent = messageText;
        liveChatMessages.appendChild(userMessage);

        // Limpiar el input
        liveChatInput.value = '';

        // Desplazar hacia abajo
        liveChatMessages.scrollTop = liveChatMessages.scrollHeight;
    }
}

// Función para manejar tecla Enter en el chat en vivo
function handleLiveChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendLiveChatMessage();
    }
}

// Función para enviar mensaje del chatbot
function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const messageText = chatInput.value.trim();

    if (messageText) {
        // Agregar mensaje del usuario
        const userMessage = document.createElement('div');
        userMessage.className = 'user-message';
        userMessage.textContent = messageText;
        chatMessages.appendChild(userMessage);

        // Limpiar el input
        chatInput.value = '';

        // Simular respuesta del bot
        setTimeout(() => {
            const botMessage = document.createElement('div');
            botMessage.className = 'bot-message';
            botMessage.textContent = 'Gracias por tu mensaje. Un representante de SkyLearn Academy te responderá pronto.';
            chatMessages.appendChild(botMessage);

            // Desplazar hacia abajo
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);

        // Desplazar hacia abajo
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Función para manejar tecla Enter en el chat
function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

// Función para alternar la ventana del chatbot
function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.classList.toggle('active');
}

// Función para ir a un slide específico
function goToSlide(index) {
    const slides = document.querySelectorAll('.slider-image');
    const dots = document.querySelectorAll('.slider-dot');

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[index].classList.add('active');
    dots[index].classList.add('active');
}

// Función para suscribirse al boletín
function subscribeNewsletter(event) {
    event.preventDefault();

    const email = event.target.querySelector('input[type="email"]').value;

    // Aquí se enviaría el email a la base de datos
    // Por ahora, solo mostramos un mensaje
    alert(`Gracias por suscribirte con el email: ${email}`);

    // Limpiar el formulario
    event.target.reset();
}

// Función para enviar formulario de contacto
function submitContactForm(event) {
    event.preventDefault();
    
    // Aquí se enviaría el formulario a un servidor
    // Por ahora, solo mostramos un mensaje
    alert('Gracias por contactarnos. Te responderemos pronto.');
    
    // Limpiar el formulario
    event.target.reset();
}

// Evento para verificar primera visita al cargar la página
window.addEventListener('load', checkFirstVisit);
