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
    loadBanners();
    loadNews();
}

// Función para mostrar secciones
function showSection(sectionId) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
    
    // Actualizar enlace activo en la navegación
    const navLinks = document.querySelectorAll('.nav-links a, .nav-link');
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
        
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        if (dots[index]) {
            dots[index].classList.add('active');
        }
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

// Función para cargar cursos desde Firebase
function loadCourses() {
    const coursesGrid = document.getElementById('coursesGrid');
    
    // Limpiar el contenedor
    coursesGrid.innerHTML = '';
    
    // Cargar datos desde Firebase
    db.collection('courses').get().then((querySnapshot) => {
        const courses = [];
        querySnapshot.forEach((doc) => {
            courses.push({ id: doc.id, ...doc.data() });
        });
        
        // Si no hay cursos en Firebase, usar datos de ejemplo
        if (courses.length === 0) {
            courses.push(
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
            );
        }
        
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
    });
}

// Función para cargar precios desde Firebase
function loadPricing(type) {
    const pricingTableBody = document.getElementById('pricingTableBody');
    
    // Limpiar el contenedor
    pricingTableBody.innerHTML = '';
    
    // Cargar datos desde Firebase
    db.collection('pricing').where('type', '==', type).get().then((querySnapshot) => {
        const pricingData = [];
        querySnapshot.forEach((doc) => {
            pricingData.push({ id: doc.id, ...doc.data() });
        });
        
        // Si no hay precios en Firebase, usar datos de ejemplo
        if (pricingData.length === 0) {
            const exampleData = {
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
            
            pricingData.push(...exampleData[type]);
        }
        
        // Generar las filas de la tabla
        pricingData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.course}</td>
                <td>${item.price}</td>
                <td>${item.schedule}</td>
                <td>${item.duration}</td>
            `;
            pricingTableBody.appendChild(row);
        });
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

// Función para cargar clases en vivo desde Firebase
function loadLiveClasses() {
    const liveScheduleContainer = document.getElementById('liveScheduleContainer');
    
    // Limpiar el contenedor
    liveScheduleContainer.innerHTML = '';
    
    // Cargar datos desde Firebase
    db.collection('liveClasses').get().then((querySnapshot) => {
        const liveClasses = [];
        querySnapshot.forEach((doc) => {
            liveClasses.push({ id: doc.id, ...doc.data() });
        });
        
        // Si no hay clases en vivo en Firebase, usar datos de ejemplo
        if (liveClasses.length === 0) {
            liveClasses.push(
                { title: "Conversación en Inglés", date: "2023-11-15", time: "18:00", platform: "YouTube" },
                { title: "Gramática Avanzada", date: "2023-11-17", time: "19:30", platform: "Twitch" },
                { title: "Pronunciación Perfecta", date: "2023-11-20", time: "17:00", platform: "YouTube" },
                { title: "Vocabulario de Negocios", date: "2023-11-22", time: "20:00", platform: "Facebook" }
            );
        }
        
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
    });
}

// Función para cargar acceso a clases desde Firebase
function loadAccessClasses() {
    const accessGrid = document.getElementById('accessGrid');
    
    // Limpiar el contenedor
    accessGrid.innerHTML = '';
    
    // Cargar datos desde Firebase
    db.collection('accessClasses').get().then((querySnapshot) => {
        const accessClasses = [];
        querySnapshot.forEach((doc) => {
            accessClasses.push({ id: doc.id, ...doc.data() });
        });
        
        // Si no hay acceso a clases en Firebase, usar datos de ejemplo
        if (accessClasses.length === 0) {
            accessClasses.push(
                { title: "Inglés Básico - Grupo A", platform: "Zoom", teacher: "Prof. John Smith", schedule: "Lunes y Miércoles 18:00-20:00" },
                { title: "Inglés Intermedio - Grupo B", platform: "Google Meet", teacher: "Prof. Sarah Johnson", schedule: "Martes y Jueves 18:00-20:00" },
                { title: "Inglés Avanzado - Grupo A", platform: "Zoom", teacher: "Prof. Michael Brown", schedule: "Lunes y Miércoles 20:00-22:00" },
                { title: "Preparación TOEFL - Grupo A", platform: "Google Meet", teacher: "Prof. Emily Davis", schedule: "Sábados 10:00-13:00" }
            );
        }
        
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
    });
}

// Función para cargar comentarios desde Firebase
function loadComments() {
    const commentsContainer = document.getElementById('commentsContainer');
    
    // Limpiar el contenedor
    commentsContainer.innerHTML = '';
    
    // Cargar datos desde Firebase
    db.collection('comments').orderBy('date', 'desc').limit(5).get().then((querySnapshot) => {
        const comments = [];
        querySnapshot.forEach((doc) => {
            comments.push({ id: doc.id, ...doc.data() });
        });
        
        // Si no hay comentarios en Firebase, usar datos de ejemplo
        if (comments.length === 0) {
            comments.push(
                { user: "Ana García", text: "¡Excelente plataforma! He mejorado mi inglés mucho desde que me inscribí.", date: "2023-11-10" },
                { user: "Carlos Rodríguez", text: "Los profesores son muy profesionales y las clases son muy interactivas.", date: "2023-11-08" },
                { user: "María López", text: "Recomiendo totalmente los cursos de preparación para exámenes. Me ayudó a aprobar el TOEFL.", date: "2023-11-05" }
            );
        }
        
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
    });
}

// Función para cargar banners desde Firebase
function loadBanners() {
    const sliderContainer = document.querySelector('.home-slider');
    
    // Cargar datos desde Firebase
    db.collection('banners').get().then((querySnapshot) => {
        const banners = [];
        querySnapshot.forEach((doc) => {
            banners.push({ id: doc.id, ...doc.data() });
        });
        
        // Si no hay banners en Firebase, usar los existentes en el HTML
        if (banners.length === 0) {
            // Los banners ya están en el HTML, no es necesario hacer nada
            return;
        }
        
        // Limpiar el contenedor actual (excepto los controles)
        const sliderImages = sliderContainer.querySelectorAll('.slider-image');
        sliderImages.forEach(img => img.remove());
        
        const sliderControls = sliderContainer.querySelector('.slider-controls');
        const dots = sliderControls.querySelectorAll('.slider-dot');
        dots.forEach(dot => dot.remove());
        
        // Agregar las nuevas imágenes
        banners.forEach((banner, index) => {
            const img = document.createElement('img');
            img.src = banner.url;
            img.alt = banner.title;
            img.className = 'slider-image';
            if (index === 0) img.classList.add('active');
            sliderContainer.insertBefore(img, sliderControls);
            
            // Agregar punto de control
            const dot = document.createElement('div');
            dot.className = 'slider-dot';
            if (index === 0) dot.classList.add('active');
            dot.setAttribute('onclick', `goToSlide(${index})`);
            sliderControls.appendChild(dot);
        });
        
        // Reinicializar el carrusel
        initSlider();
    });
}

// Función para cargar noticias desde Firebase
function loadNews() {
    // Cargar datos desde Firebase
    db.collection('news').orderBy('date', 'desc').limit(1).get().then((querySnapshot) => {
        if (!querySnapshot.empty) {
            const news = querySnapshot.docs[0].data();
            document.getElementById('newsText').textContent = news.content;
            document.getElementById('currentNews').textContent = news.content;
        }
    });
}

// Función para agregar un comentario
function addComment(event) {
    event.preventDefault();
    
    const commentInput = document.getElementById('commentInput');
    const commentText = commentInput.value.trim();
    
    if (commentText) {
        // Crear objeto con los datos del comentario
        const commentData = {
            user: "Usuario",
            text: commentText,
            date: new Date().toISOString().split('T')[0]
        };
        
        // Guardar en Firebase
        db.collection('comments').add(commentData)
            .then(() => {
                // Limpiar el input
                commentInput.value = '';
                
                // Los comentarios se recargarán automáticamente gracias al listener en tiempo real
            })
            .catch((error) => {
                console.error("Error al agregar comentario: ", error);
                alert("Error al agregar el comentario. Por favor, inténtalo de nuevo.");
            });
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

// Función para alternar la ventana del chatbot
function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.classList.toggle('active');
}

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
    
    // Verificar credenciales actualizadas
    if (email === 'desarrollador@skylearn.com' && password === 'skylearn2025') {
        // Cerrar el modal
        closeLoginModal();
        
        // Mostrar el enlace de administración
        document.getElementById('adminLink').style.display = 'block';
        
        // Mostrar la sección de administración
        showSection('admin');
        
        // Cargar datos del panel de administración
        loadAdminData();
        
        // Guardar sesión de administrador
        sessionStorage.setItem('isAdminLoggedIn', 'true');
    } else {
        alert('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
    }
}

// Función para verificar si el administrador ha iniciado sesión
function checkAdminSession() {
    const isLoggedIn = sessionStorage.getItem('isAdminLoggedIn') === 'true';
    if (isLoggedIn) {
        document.getElementById('adminLink').style.display = 'block';
    }
}

// Función para cerrar sesión de administrador
function adminLogout() {
    // Ocultar el enlace de administración
    document.getElementById('adminLink').style.display = 'none';
    
    // Eliminar la sesión de administrador
    sessionStorage.removeItem('isAdminLoggedIn');
    
    // Mostrar la sección de inicio
    showSection('home');
}

// Función para cargar datos del panel de administración
function loadAdminData() {
    // Actualizar estadísticas del panel
    db.collection('statistics').doc('main').get().then((doc) => {
        if (doc.exists) {
            const stats = doc.data();
            document.getElementById('totalStudents').textContent = stats.students || '5000';
            document.getElementById('totalCourses').textContent = stats.courses || '120';
            document.getElementById('totalComments').textContent = stats.comments || '45';
        }
    });
    
    // Cargar última actividad
    db.collection('activity').orderBy('date', 'desc').limit(2).get().then((querySnapshot) => {
        if (!querySnapshot.empty) {
            const activities = querySnapshot.docs;
            document.getElementById('lastComment').textContent = activities[0].data().text || 'Sin comentarios recientes';
            document.getElementById('lastRegistration').textContent = activities[1].data().text || 'Sin registros recientes';
        }
    });
}

// Función para mostrar pestaña de administración
function showAdminTab(tabName) {
    // Ocultar todos los contenidos de administración
    const adminContents = document.querySelectorAll('.admin-content');
    adminContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Mostrar el contenido seleccionado
    const selectedContent = document.getElementById(`admin-${tabName}`);
    if (selectedContent) {
        selectedContent.classList.add('active');
    }
    
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
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers[0]) {
        statNumbers[0].setAttribute('data-target', students);
        statNumbers[0].textContent = students;
    }
    if (statNumbers[1]) {
        statNumbers[1].setAttribute('data-target', courses);
        statNumbers[1].textContent = courses;
    }
    if (statNumbers[2]) {
        statNumbers[2].setAttribute('data-target', teachers);
        statNumbers[2].textContent = teachers;
    }
    if (statNumbers[3]) {
        statNumbers[3].setAttribute('data-target', satisfaction);
        statNumbers[3].textContent = satisfaction;
    }
    
    // Guardar en Firebase
    db.collection('statistics').doc('main').set({
        students,
        courses,
        teachers,
        satisfaction
    });
    
    alert('Estadísticas actualizadas correctamente.');
}

// Función para actualizar noticias
function updateNews(event) {
    event.preventDefault();
    
    const newsText = document.getElementById('newsInput').value;
    
    // Crear objeto con los datos de la noticia
    const newsData = {
        content: newsText,
        date: new Date().toISOString()
    };
    
    // Guardar en Firebase
    db.collection('news').add(newsData)
        .then(() => {
            alert('Noticia actualizada correctamente.');
            // Las noticias se recargarán automáticamente gracias al listener en tiempo real
        })
        .catch((error) => {
            console.error("Error al actualizar noticia: ", error);
            alert("Error al actualizar la noticia. Por favor, inténtalo de nuevo.");
        });
}

// Función para mostrar formulario de agregar curso
function showAddCourseForm() {
    document.getElementById('addCourseForm').style.display = 'block';
}

// Función para ocultar formulario de agregar curso
function hideAddCourseForm() {
    document.getElementById('addCourseForm').style.display = 'none';
}

// Función para mostrar formulario de agregar precio
function showAddPricingForm() {
    document.getElementById('addPricingForm').style.display = 'block';
}

// Función para ocultar formulario de agregar precio
function hideAddPricingForm() {
    document.getElementById('addPricingForm').style.display = 'none';
}

// Función para mostrar formulario de agregar clase en vivo
function showAddLiveClassForm() {
    document.getElementById('addLiveClassForm').style.display = 'block';
}

// Función para ocultar formulario de agregar clase en vivo
function hideAddLiveClassForm() {
    document.getElementById('addLiveClassForm').style.display = 'none';
}

// Función para mostrar formulario de agregar acceso a clase
function showAddAccessClassForm() {
    document.getElementById('addAccessClassForm').style.display = 'block';
}

// Función para ocultar formulario de agregar acceso a clase
function hideAddAccessClassForm() {
    document.getElementById('addAccessClassForm').style.display = 'none';
}

// Función para mostrar formulario de agregar banner
function showAddBannerForm() {
    document.getElementById('addBannerForm').style.display = 'block';
}

// Función para ocultar formulario de agregar banner
function hideAddBannerForm() {
    document.getElementById('addBannerForm').style.display = 'none';
}

// Función para mostrar formulario de actualización de noticias
function showUpdateNewsForm() {
    // Obtener la noticia actual
    db.collection('news').orderBy('date', 'desc').limit(1).get().then((querySnapshot) => {
        if (!querySnapshot.empty) {
            const news = querySnapshot.docs[0].data();
            document.getElementById('newsInput').value = news.content;
        }
        document.getElementById('updateNewsForm').style.display = 'block';
    });
}

// Función para suscribirse al boletín
function subscribeNewsletter(event) {
    event.preventDefault();
    
    const email = event.target.querySelector('input[type="email"]').value;
    
    // Crear objeto con los datos de la suscripción
    const subscriptionData = {
        email,
        date: new Date().toISOString()
    };
    
    // Guardar en Firebase
    db.collection('subscriptions').add(subscriptionData)
        .then(() => {
            alert(`Gracias por suscribirte con el email: ${email}`);
            // Limpiar el formulario
            event.target.reset();
        })
        .catch((error) => {
            console.error("Error al suscribirse: ", error);
            alert("Error al suscribirte. Por favor, inténtalo de nuevo.");
        });
}

// Función para enviar formulario de contacto
function submitContactForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;
    
    // Crear objeto con los datos del contacto
    const contactData = {
        name,
        email,
        subject,
        message,
        date: new Date().toISOString()
    };
    
    // Guardar en Firebase
    db.collection('contacts').add(contactData)
        .then(() => {
            alert('Mensaje enviado correctamente. Te responderemos pronto.');
            // Limpiar el formulario
            event.target.reset();
        })
        .catch((error) => {
            console.error("Error al enviar mensaje: ", error);
            alert("Error al enviar el mensaje. Por favor, inténtalo de nuevo.");
        });
}

// Función para ir a un slide específico
function goToSlide(index) {
    const slides = document.querySelectorAll('.slider-image');
    const dots = document.querySelectorAll('.slider-dot');
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (slides[index]) {
        slides[index].classList.add('active');
    }
    if (dots[index]) {
        dots[index].classList.add('active');
    }
}

// Función para resetear formulario
function resetForm(formName) {
    if (formName === 'news') {
        document.getElementById('newsInput').value = '¡¡OBTÉN UN 30% DE DESCUENTO AL INSCRIBIRTE AHORA!! Válido hasta el 30 de noviembre.';
    }
}

// Configurar listeners en tiempo real para diferentes colecciones
function setupRealTimeListeners() {
    // Listener para cursos
    db.collection('courses').onSnapshot((snapshot) => {
        loadCourses();
    });
    
    // Listener para precios
    db.collection('pricing').onSnapshot((snapshot) => {
        loadPricing('monthly');
    });
    
    // Listener para clases en vivo
    db.collection('liveClasses').onSnapshot((snapshot) => {
        loadLiveClasses();
    });
    
    // Listener para acceso a clases
    db.collection('accessClasses').onSnapshot((snapshot) => {
        loadAccessClasses();
    });
    
    // Listener para banners
    db.collection('banners').onSnapshot((snapshot) => {
        loadBanners();
    });
    
    // Listener para noticias
    db.collection('news').onSnapshot((snapshot) => {
        loadNews();
    });
    
    // Listener para comentarios
    db.collection('comments').onSnapshot((snapshot) => {
        loadComments();
    });
}
