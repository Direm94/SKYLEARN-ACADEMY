// Global variables
let currentSlide = 0;
let currentSection = 'home';
let isAdminLoggedIn = false;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let courses = [];
let pricingData = {
    monthly: [
        { course: "Inglés Básico", price: "$50", schedule: "Lunes y Miércoles 18:00-20:00", duration: "3 meses" },
        { course: "Inglés Intermedio", price: "$70", schedule: "Martes y Jueves 18:00-20:00", duration: "3 meses" },
        { course: "Inglés Avanzado", price: "$90", schedule: "Sábados 10:00-14:00", duration: "3 meses" },
        { course: "Conversación", price: "$60", schedule: "Viernes 18:00-20:00", duration: "2 meses" }
    ],
    quarterly: [
        { course: "Inglés Básico", price: "$135", schedule: "Lunes y Miércoles 18:00-20:00", duration: "3 meses" },
        { course: "Inglés Intermedio", price: "$189", schedule: "Martes y Jueves 18:00-20:00", duration: "3 meses" },
        { course: "Inglés Avanzado", price: "$243", schedule: "Sábados 10:00-14:00", duration: "3 meses" },
        { course: "Conversación", price: "$162", schedule: "Viernes 18:00-20:00", duration: "2 meses" }
    ],
    yearly: [
        { course: "Inglés Básico", price: "$480", schedule: "Lunes y Miércoles 18:00-20:00", duration: "12 meses" },
        { course: "Inglés Intermedio", price: "$672", schedule: "Martes y Jueves 18:00-20:00", duration: "12 meses" },
        { course: "Inglés Avanzado", price: "$864", schedule: "Sábados 10:00-14:00", duration: "12 meses" },
        { course: "Conversación", price: "$576", schedule: "Viernes 18:00-20:00", duration: "12 meses" }
    ]
};
let scheduleItems = [
    { day: "Lunes", time: "18:00", title: "Inglés Básico", teacher: "Prof. John Smith" },
    { day: "Martes", time: "18:00", title: "Inglés Intermedio", teacher: "Prof. Emily Johnson" },
    { day: "Miércoles", time: "18:00", title: "Inglés Básico", teacher: "Prof. John Smith" },
    { day: "Jueves", time: "18:00", title: "Inglés Intermedio", teacher: "Prof. Emily Johnson" },
    { day: "Viernes", time: "18:00", title: "Conversación", teacher: "Prof. Michael Brown" },
    { day: "Sábado", time: "10:00", title: "Inglés Avanzado", teacher: "Prof. Sarah Davis" }
];
let calendarEvents = {};
let comments = [];
let users = [
    { id: 1, name: "Admin User", email: "admin@skylearn.com", role: "admin" },
    { id: 2, name: "John Doe", email: "john@example.com", role: "student" },
    { id: 3, name: "Jane Smith", email: "jane@example.com", role: "student" }
];

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading bar
    simulateLoading();
    
    // Initialize courses
    initializeCourses();
    
    // Initialize pricing
    showPricing('monthly');
    
    // Initialize calendar
    generateCalendar();
    
    // Initialize schedule
    loadSchedule();
    
    // Initialize comments
    loadComments();
    
    // Initialize admin dashboard
    updateAdminDashboard();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize stats animation
    animateStats();
});

// Simulate loading progress
function simulateLoading() {
    const loadingProgress = document.getElementById('loadingProgress');
    let width = 0;
    const interval = setInterval(() => {
        width += 5;
        loadingProgress.style.width = width + '%';
        if (width >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                document.querySelector('.loading-bar').style.display = 'none';
            }, 500);
        }
    }, 100);
}

// Pre-registration form submission
document.getElementById('preRegisterForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('preName').value;
    localStorage.setItem('userName', name);
    
    // Show login screen
    document.getElementById('preRegisterScreen').style.opacity = '0';
    document.getElementById('preRegisterScreen').style.visibility = 'hidden';
    document.getElementById('loginScreen').style.opacity = '1';
    document.getElementById('loginScreen').style.visibility = 'visible';
    
    // Show notification
    showNotification('success', '¡Bienvenido!', `Hola ${name}, gracias por registrarte en SkyLearn Academy.`);
});

// Show main content
function showMainContent() {
    document.getElementById('loginScreen').style.opacity = '0';
    document.getElementById('loginScreen').style.visibility = 'hidden';
    document.body.style.overflow = 'auto';
    
    // Show admin link if user is admin
    const userName = localStorage.getItem('userName');
    if (userName === 'Admin') {
        document.getElementById('adminLink').style.display = 'block';
    }
}

// Show section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Update active nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Update current section
    currentSection = sectionId;
    
    // Special handling for sections
    if (sectionId === 'courses') {
        loadCourses();
    } else if (sectionId === 'live') {
        generateCalendar();
    }
}

// Slider functionality
function goToSlide(index) {
    const slides = document.querySelectorAll('.slider-image');
    const dots = document.querySelectorAll('.slider-dot');
    
    // Hide current slide
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    // Show new slide
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

// Auto-advance slider
setInterval(() => {
    const slides = document.querySelectorAll('.slider-image');
    const dots = document.querySelectorAll('.slider-dot');
    
    // Hide current slide
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    // Show next slide
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}, 5000);

// Animate stats
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                let count = 0;
                const increment = target / 100;
                
                const updateCount = () => {
                    count += increment;
                    if (count < target) {
                        entry.target.textContent = Math.ceil(count);
                        requestAnimationFrame(updateCount);
                    } else {
                        entry.target.textContent = target;
                    }
                };
                
                updateCount();
                observer.unobserve(entry.target);
            }
        });
    });
    
    statNumbers.forEach(statNumber => {
        observer.observe(statNumber);
    });
}

// Add comment
function addComment(event) {
    event.preventDefault();
    
    const commentInput = document.getElementById('commentInput');
    const commentText = commentInput.value.trim();
    
    if (commentText) {
        const userName = localStorage.getItem('userName') || 'Usuario Anónimo';
        const comment = {
            id: Date.now(),
            text: commentText,
            user: userName,
            date: new Date().toLocaleString()
        };
        
        comments.unshift(comment);
        saveComments();
        loadComments();
        
        commentInput.value = '';
        
        // Show notification
        showNotification('success', 'Comentario enviado', 'Tu comentario ha sido publicado correctamente.');
        
        // Update admin dashboard
        updateAdminDashboard();
    }
}

// Load comments
function loadComments() {
    const commentsContainer = document.getElementById('commentsContainer');
    commentsContainer.innerHTML = '';
    
    if (comments.length === 0) {
        commentsContainer.innerHTML = '<p>No hay comentarios aún. Sé el primero en comentar.</p>';
        return;
    }
    
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment-item';
        commentElement.innerHTML = `
            <div class="comment-header">
                <strong>${comment.user}</strong>
                <span class="comment-date">${comment.date}</span>
            </div>
            <p>${comment.text}</p>
        `;
        commentsContainer.appendChild(commentElement);
    });
}

// Save comments to localStorage
function saveComments() {
    localStorage.setItem('comments', JSON.stringify(comments));
}

// Initialize courses
function initializeCourses() {
    courses = [
        {
            id: 1,
            title: "Inglés Básico",
            teacher: "Prof. John Smith",
            duration: "3 meses",
            students: "120",
            price: "$50/mes",
            image: "https://via.placeholder.com/400x250/3498db/ffffff?text=Basic+English",
            badge: "Popular",
            description: "Aprende los fundamentos del inglés con nuestro curso básico. Perfecto para principiantes.",
            features: [
                "Clases en vivo",
                "Material didáctico incluido",
                "Certificado al finalizar",
                "Acceso a comunidad de estudiantes"
            ]
        },
        {
            id: 2,
            title: "Inglés Intermedio",
            teacher: "Prof. Emily Johnson",
            duration: "3 meses",
            students: "85",
            price: "$70/mes",
            image: "https://via.placeholder.com/400x250/2ecc71/ffffff?text=Intermediate+English",
            badge: "Nuevo",
            description: "Mejora tus habilidades de inglés con nuestro curso intermedio.",
            features: [
                "Clases en vivo",
                "Material didáctico incluido",
                "Certificado al finalizar",
                "Acceso a comunidad de estudiantes",
                "Talleres de conversación"
            ]
        },
        {
            id: 3,
            title: "Inglés Avanzado",
            teacher: "Prof. Sarah Davis",
            duration: "4 meses",
            students: "65",
            price: "$90/mes",
            image: "https://via.placeholder.com/400x250/e74c3c/ffffff?text=Advanced+English",
            badge: "Premium",
            description: "Domina el inglés con nuestro curso avanzado. Ideal para profesionales.",
            features: [
                "Clases en vivo",
                "Material didáctico incluido",
                "Certificado al finalizar",
                "Acceso a comunidad de estudiantes",
                "Talleres de conversación",
                "Preparación para exámenes internacionales"
            ]
        },
        {
            id: 4,
            title: "Conversación",
            teacher: "Prof. Michael Brown",
            duration: "2 meses",
            students: "95",
            price: "$60/mes",
            image: "https://via.placeholder.com/400x250/9b59b6/ffffff?text=Conversation",
            badge: "",
            description: "Practica tu conversación en inglés con hablantes nativos.",
            features: [
                "Clases en vivo",
                "Material didáctico incluido",
                "Certificado al finalizar",
                "Sesiones de conversación con nativos"
            ]
        },
        {
            id: 5,
            title: "Business English",
            teacher: "Prof. Robert Wilson",
            duration: "3 meses",
            students: "45",
            price: "$85/mes",
            image: "https://via.placeholder.com/400x250/34495e/ffffff?text=Business+English",
            badge: "Profesional",
            description: "Aprende inglés para entornos empresariales y profesionales.",
            features: [
                "Clases en vivo",
                "Material didáctico incluido",
                "Certificado al finalizar",
                "Casos de estudio reales",
                "Simulaciones de negocios"
            ]
        },
        {
            id: 6,
            title: "Preparación TOEFL",
            teacher: "Prof. Jennifer Lee",
            duration: "4 meses",
            students: "55",
            price: "$100/mes",
            image: "https://via.placeholder.com/400x250/16a085/ffffff?text=TOEFL+Prep",
            badge: "Examen",
            description: "Prepárate para el examen TOEFL con nuestros expertos.",
            features: [
                "Clases en vivo",
                "Material didáctico incluido",
                "Simulacros de examen",
                "Estrategias de examen",
                "Retroalimentación personalizada"
            ]
        }
    ];
}

// Load courses
function loadCourses() {
    const coursesGrid = document.getElementById('coursesGrid');
    coursesGrid.innerHTML = '';
    
    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <div class="course-img-container">
                        <img src="${course.image}" alt="${course.title}" class="course-img">
                        ${course.badge ? `<span class="course-badge">${course.badge}</span>` : ''}
                    </div>
                    <div class="course-info">
                        <h3>${course.title}</h3>
                        <div class="course-teacher">
                            <img src="https://i.pravatar.cc/150?img=${course.id}" alt="${course.teacher}" class="teacher-avatar">
                            <span class="teacher-name">${course.teacher}</span>
                        </div>
                        <div class="course-meta">
                            <span><i class="far fa-clock"></i> ${course.duration}</span>
                            <span><i class="fas fa-users"></i> ${course.students} estudiantes</span>
                        </div>
                        <div class="course-price">${course.price}</div>
                        <button onclick="enrollCourse(${course.id})">
                            <i class="fas fa-shopping-cart"></i> Inscribirse
                        </button>
                    </div>
                </div>
                <div class="card-back">
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                    <ul>
                        ${course.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    <button onclick="enrollCourse(${course.id})">
                        <i class="fas fa-shopping-cart"></i> Inscribirse
                    </button>
                </div>
            </div>
        `;
        coursesGrid.appendChild(courseCard);
    });
}

// Enroll in course
function enrollCourse(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (course) {
        showNotification('success', '¡Inscripción exitosa!', `Te has inscrito en el curso "${course.title}".`);
    }
}

// Show pricing
function showPricing(period) {
    // Update active tab
    document.querySelectorAll('.pricing-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.textContent.toLowerCase().includes(period)) {
            tab.classList.add('active');
        }
    });
    
    // Load pricing data
    const pricingTableBody = document.getElementById('pricingTableBody');
    pricingTableBody.innerHTML = '';
    
    pricingData[period].forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.course}</td>
            <td class="highlight">${item.price}</td>
            <td>${item.schedule}</td>
            <td>${item.duration}</td>
        `;
        pricingTableBody.appendChild(row);
    });
}

// Live chat functionality
function sendLiveChatMessage() {
    const input = document.getElementById('liveChatInput');
    const message = input.value.trim();
    
    if (message) {
        const chatMessages = document.getElementById('liveChatMessages');
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message user-message';
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        
        input.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Simulate response
        setTimeout(() => {
            const responseElement = document.createElement('div');
            responseElement.className = 'chat-message other-message';
            responseElement.textContent = "Gracias por tu mensaje. El profesor responderá en breve.";
            chatMessages.appendChild(responseElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }
}

function handleLiveChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendLiveChatMessage();
    }
}

// Load schedule
function loadSchedule() {
    const scheduleContainer = document.getElementById('liveScheduleContainer');
    scheduleContainer.innerHTML = '';
    
    scheduleItems.forEach(item => {
        const scheduleItem = document.createElement('div');
        scheduleItem.className = 'schedule-item';
        scheduleItem.innerHTML = `
            <div>
                <div class="schedule-time">${item.day} ${item.time}</div>
                <div>${item.title}</div>
            </div>
            <div>${item.teacher}</div>
        `;
        scheduleContainer.appendChild(scheduleItem);
    });
}

// Calendar functionality
function generateCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthElement = document.getElementById('currentMonth');
    
    // Set month and year
    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    
    currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Clear calendar
    calendarGrid.innerHTML = '';
    
    // Add day names
    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    dayNames.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day weekday';
        dayElement.textContent = day;
        calendarGrid.appendChild(dayElement);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day other-month';
        calendarGrid.appendChild(dayElement);
    }
    
    // Add days of the month
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        // Mark today
        if (currentYear === today.getFullYear() && 
            currentMonth === today.getMonth() && 
            day === today.getDate()) {
            dayElement.classList.add('today');
        }
        
        // Add class indicator
        const eventKey = `${currentYear}-${currentMonth + 1}-${day}`;
        if (calendarEvents[eventKey]) {
            dayElement.classList.add('has-class');
            
            const eventElement = document.createElement('div');
            eventElement.className = 'class-event';
            eventElement.textContent = calendarEvents[eventKey];
            dayElement.appendChild(eventElement);
        }
        
        // Add click event for admin
        if (isAdminLoggedIn && currentSection === 'admin') {
            dayElement.classList.add('editable');
            dayElement.addEventListener('click', () => addCalendarEventAdmin(day));
        }
        
        calendarGrid.appendChild(dayElement);
    }
    
    // Set up navigation
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar();
    });
    
    document.getElementById('nextMonth').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar();
    });
}

// Admin functionality
function showAdminLogin() {
    document.getElementById('loginModal').style.display = 'flex';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function adminLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    // Simple authentication (in a real app, this would be done server-side)
    if (username === 'admin' && password === 'admin123') {
        isAdminLoggedIn = true;
        localStorage.setItem('isAdminLoggedIn', 'true');
        
        closeLoginModal();
        showSection('admin');
        
        // Show notification
        showNotification('success', 'Sesión iniciada', 'Has iniciado sesión como administrador.');
    } else {
        showNotification('error', 'Error de autenticación', 'Usuario o contraseña incorrectos.');
    }
}

function adminLogout() {
    isAdminLoggedIn = false;
    localStorage.removeItem('isAdminLoggedIn');
    showSection('home');
    
    // Show notification
    showNotification('success', 'Sesión cerrada', 'Has cerrado sesión correctamente.');
}

function showAdminTab(tabId) {
    // Hide all admin tabs
    document.querySelectorAll('.admin-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`admin-${tabId}`).classList.add('active');
    
    // Update active tab button
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.textContent.toLowerCase().includes(tabId) || 
            (tabId === 'dashboard' && tab.textContent.toLowerCase().includes('dashboard'))) {
            tab.classList.add('active');
        }
    });
    
    // Special handling for tabs
    if (tabId === 'courses') {
        loadCoursesAdmin();
    } else if (tabId === 'pricing') {
        loadPricingAdmin();
    } else if (tabId === 'live') {
        loadScheduleAdmin();
    } else if (tabId === 'users') {
        loadUsersAdmin();
    }
}

function updateAdminDashboard() {
    // Update stats
    document.getElementById('totalStudents').textContent = users.filter(u => u.role === 'student').length;
    document.getElementById('totalCourses').textContent = courses.length;
    document.getElementById('totalComments').textContent = comments.length;
    
    // Update recent activity
    if (comments.length > 0) {
        document.getElementById('lastComment').textContent = `${comments[0].user}: ${comments[0].text.substring(0, 50)}...`;
    }
    
    const lastRegistration = localStorage.getItem('lastRegistration');
    if (lastRegistration) {
        document.getElementById('lastRegistration').textContent = lastRegistration;
    }
}

function updateHomeStats() {
    const students = document.getElementById('statsStudents').value;
    const coursesCount = document.getElementById('statsCourses').value;
    const teachers = document.getElementById('statsTeachers').value;
    const satisfaction = document.getElementById('statsSatisfaction').value;
    
    // Update stat elements
    document.querySelectorAll('.stat-number').forEach(stat => {
        const target = stat.getAttribute('data-target');
        if (stat.parentElement.querySelector('.stat-label').textContent === 'Estudiantes') {
            stat.setAttribute('data-target', students);
            stat.textContent = '0';
            animateSingleStat(stat);
        } else if (stat.parentElement.querySelector('.stat-label').textContent === 'Cursos') {
            stat.setAttribute('data-target', coursesCount);
            stat.textContent = '0';
            animateSingleStat(stat);
        } else if (stat.parentElement.querySelector('.stat-label').textContent === 'Profesores') {
            stat.setAttribute('data-target', teachers);
            stat.textContent = '0';
            animateSingleStat(stat);
        } else if (stat.parentElement.querySelector('.stat-label').textContent === '% Satisfacción') {
            stat.setAttribute('data-target', satisfaction);
            stat.textContent = '0';
            animateSingleStat(stat);
        }
    });
    
    // Show notification
    showNotification('success', 'Estadísticas actualizadas', 'Las estadísticas se han actualizado correctamente.');
}

function animateSingleStat(statElement) {
    const target = parseInt(statElement.getAttribute('data-target'));
    let count = 0;
    const increment = target / 100;
    
    const updateCount = () => {
        count += increment;
        if (count < target) {
            statElement.textContent = Math.ceil(count);
            requestAnimationFrame(updateCount);
        } else {
            statElement.textContent = target;
        }
    };
    
    updateCount();
}

function updateNews(event) {
    event.preventDefault();
    
    const newsText = document.getElementById('newsInput').value;
    document.getElementById('newsText').textContent = newsText;
    
    // Show notification
    showNotification('success', 'Noticia actualizada', 'La noticia se ha actualizado correctamente.');
}

function resetForm(formType) {
    if (formType === 'news') {
        document.getElementById('newsInput').value = '¡¡OBTÉN UN 30% DE DESCUENTO AL INSCRIBIRTE AHORA!! Válido hasta el 30 de noviembre.';
    }
}

// Courses admin functions
function showAddCourseForm() {
    document.getElementById('addCourseForm').style.display = 'block';
}

function hideAddCourseForm() {
    document.getElementById('addCourseForm').style.display = 'none';
}

function addCourse(event) {
    event.preventDefault();
    
    const newCourse = {
        id: courses.length + 1,
        title: document.getElementById('newCourseTitle').value,
        teacher: document.getElementById('newCourseTeacher').value,
        duration: document.getElementById('newCourseDuration').value,
        students: document.getElementById('newCourseStudents').value,
        price: document.getElementById('newCoursePrice').value,
        image: document.getElementById('newCourseImage').value,
        badge: document.getElementById('newCourseBadge').value,
        description: "Nuevo curso agregado",
        features: ["Clases en vivo", "Material didáctico incluido", "Certificado al finalizar"]
    };
    
    courses.push(newCourse);
    hideAddCourseForm();
    loadCoursesAdmin();
    
    // Show notification
    showNotification('success', 'Curso agregado', 'El curso se ha agregado correctamente.');
}

function loadCoursesAdmin() {
    const coursesTableBody = document.getElementById('coursesTableBody');
    coursesTableBody.innerHTML = '';
    
    courses.forEach(course => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${course.id}</td>
            <td>${course.title}</td>
            <td>${course.teacher}</td>
            <td>${course.price}</td>
            <td class="admin-item-actions">
                <button class="btn-small btn-primary" onclick="editCourse(${course.id})">Editar</button>
                <button class="btn-small btn-danger" onclick="deleteCourse(${course.id})">Eliminar</button>
            </td>
        `;
        coursesTableBody.appendChild(row);
    });
}

function editCourse(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (course) {
        document.getElementById('newCourseTitle').value = course.title;
        document.getElementById('newCourseTeacher').value = course.teacher;
        document.getElementById('newCourseDuration').value = course.duration;
        document.getElementById('newCourseStudents').value = course.students;
        document.getElementById('newCoursePrice').value = course.price;
        document.getElementById('newCourseImage').value = course.image;
        document.getElementById('newCourseBadge').value = course.badge;
        
        showAddCourseForm();
        
        // Change form behavior to update instead of add
        const form = document.querySelector('#addCourseForm form');
        form.onsubmit = function(e) {
            e.preventDefault();
            
            course.title = document.getElementById('newCourseTitle').value;
            course.teacher = document.getElementById('newCourseTeacher').value;
            course.duration = document.getElementById('newCourseDuration').value;
            course.students = document.getElementById('newCourseStudents').value;
            course.price = document.getElementById('newCoursePrice').value;
            course.image = document.getElementById('newCourseImage').value;
            course.badge = document.getElementById('newCourseBadge').value;
            
            hideAddCourseForm();
            loadCoursesAdmin();
            
            // Show notification
            showNotification('success', 'Curso actualizado', 'El curso se ha actualizado correctamente.');
            
            // Reset form behavior
            form.onsubmit = addCourse;
        };
    }
}

function deleteCourse(courseId) {
    if (confirm('¿Estás seguro de que quieres eliminar este curso?')) {
        courses = courses.filter(c => c.id !== courseId);
        loadCoursesAdmin();
        
        // Show notification
        showNotification('success', 'Curso eliminado', 'El curso se ha eliminado correctamente.');
    }
}

// Pricing admin functions
function loadPricingAdmin() {
    const period = document.getElementById('pricingPeriod').value;
    const pricingFormContainer = document.getElementById('pricingFormContainer');
    
    pricingFormContainer.innerHTML = '';
    
    pricingData[period].forEach((item, index) => {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';
        formGroup.innerHTML = `
            <label>Curso ${index + 1}</label>
            <div class="form-row">
                <input type="text" value="${item.course}" placeholder="Nombre del curso" id="pricingCourse${index}">
                <input type="text" value="${item.price}" placeholder="Precio" id="pricingPrice${index}">
            </div>
            <div class="form-row">
                <input type="text" value="${item.schedule}" placeholder="Horario" id="pricingSchedule${index}">
                <input type="text" value="${item.duration}" placeholder="Duración" id="pricingDuration${index}">
            </div>
        `;
        pricingFormContainer.appendChild(formGroup);
    });
    
    const updateButton = document.createElement('div');
    updateButton.className = 'form-actions';
    updateButton.innerHTML = `
        <button type="button" class="btn-primary" onclick="updatePricing('${period}')">Actualizar Precios</button>
    `;
    pricingFormContainer.appendChild(updateButton);
}

function updatePricing(period) {
    pricingData[period] = [];
    
    let index = 0;
    while (document.getElementById(`pricingCourse${index}`)) {
        pricingData[period].push({
            course: document.getElementById(`pricingCourse${index}`).value,
            price: document.getElementById(`pricingPrice${index}`).value,
            schedule: document.getElementById(`pricingSchedule${index}`).value,
            duration: document.getElementById(`pricingDuration${index}`).value
        });
        index++;
    }
    
    // Show notification
    showNotification('success', 'Precios actualizados', 'Los precios se han actualizado correctamente.');
}

// Contact admin functions
function updateContactInfo() {
    const email = document.getElementById('contactEmailInput').value;
    const phone = document.getElementById('contactPhoneInput').value;
    const address = document.getElementById('contactAddressInput').value;
    
    document.getElementById('contactEmail').textContent = email;
    document.getElementById('contactPhone').textContent = phone;
    document.getElementById('contactAddress').textContent = address;
    
    // Update email link
    document.querySelector('a[href^="mailto:"]').href = `mailto:${email}`;
    
    // Update phone link
    document.querySelector('a[href^="tel:"]').href = `tel:${phone}`;
    
    // Show notification
    showNotification('success', 'Contacto actualizado', 'La información de contacto se ha actualizado correctamente.');
}

// Live classes admin functions
function updateLiveStream() {
    const url = document.getElementById('liveStreamUrl').value;
    document.querySelector('.live-video iframe').src = url;
    
    // Show notification
    showNotification('success', 'Stream actualizado', 'La URL del stream se ha actualizado correctamente.');
}

function showAddScheduleForm() {
    document.getElementById('addScheduleForm').style.display = 'block';
}

function hideAddScheduleForm() {
    document.getElementById('addScheduleForm').style.display = 'none';
}

function addScheduleItem(event) {
    event.preventDefault();
    
    const newItem = {
        day: document.getElementById('scheduleDay').value,
        time: document.getElementById('scheduleTime').value,
        title: document.getElementById('scheduleTitle').value,
        teacher: document.getElementById('scheduleTeacher').value
    };
    
    scheduleItems.push(newItem);
    hideAddScheduleForm();
    loadScheduleAdmin();
    
    // Show notification
    showNotification('success', 'Clase agregada', 'La clase se ha agregado correctamente.');
}

function loadScheduleAdmin() {
    const scheduleTableBody = document.getElementById('scheduleTableBody');
    scheduleTableBody.innerHTML = '';
    
    scheduleItems.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.day}</td>
            <td>${item.time}</td>
            <td>${item.title}</td>
            <td>${item.teacher}</td>
            <td class="admin-item-actions">
                <button class="btn-small btn-primary" onclick="editScheduleItem(${index})">Editar</button>
                <button class="btn-small btn-danger" onclick="deleteScheduleItem(${index})">Eliminar</button>
            </td>
        `;
        scheduleTableBody.appendChild(row);
    });
}

function editScheduleItem(index) {
    const item = scheduleItems[index];
    document.getElementById('scheduleDay').value = item.day;
    document.getElementById('scheduleTime').value = item.time;
    document.getElementById('scheduleTitle').value = item.title;
    document.getElementById('scheduleTeacher').value = item.teacher;
    
    showAddScheduleForm();
    
    // Change form behavior to update instead of add
    const form = document.querySelector('#addScheduleForm form');
    form.onsubmit = function(e) {
        e.preventDefault();
        
        item.day = document.getElementById('scheduleDay').value;
        item.time = document.getElementById('scheduleTime').value;
        item.title = document.getElementById('scheduleTitle').value;
        item.teacher = document.getElementById('scheduleTeacher').value;
        
        hideAddScheduleForm();
        loadScheduleAdmin();
        
        // Show notification
        showNotification('success', 'Clase actualizada', 'La clase se ha actualizado correctamente.');
        
        // Reset form behavior
        form.onsubmit = addScheduleItem;
    };
}

function deleteScheduleItem(index) {
    if (confirm('¿Estás seguro de que quieres eliminar esta clase?')) {
        scheduleItems.splice(index, 1);
        loadScheduleAdmin();
        
        // Show notification
        showNotification('success', 'Clase eliminada', 'La clase se ha eliminado correctamente.');
    }
}

// Calendar admin functions
function updateCalendar() {
    currentMonth = parseInt(document.getElementById('calendarMonth').value);
    currentYear = parseInt(document.getElementById('calendarYear').value);
    generateCalendar();
    
    // Show notification
    showNotification('success', 'Calendario actualizado', 'El calendario se ha actualizado correctamente.');
}

function addCalendarEvent(event) {
    event.preventDefault();
    
    const day = document.getElementById('eventDay').value;
    const title = document.getElementById('eventTitle').value;
    
    const eventKey = `${currentYear}-${currentMonth + 1}-${day}`;
    calendarEvents[eventKey] = title;
    
    generateCalendar();
    
    // Show notification
    showNotification('success', 'Evento agregado', 'El evento se ha agregado correctamente.');
}

function addCalendarEventAdmin(day) {
    const title = prompt('Ingrese el título del evento:');
    if (title) {
        const eventKey = `${currentYear}-${currentMonth + 1}-${day}`;
        calendarEvents[eventKey] = title;
        generateCalendar();
        
        // Show notification
        showNotification('success', 'Evento agregado', 'El evento se ha agregado correctamente.');
    }
}

// Banners admin functions
function updateBanners() {
    const banner1 = document.getElementById('banner1Url').value;
    const banner2 = document.getElementById('banner2Url').value;
    const banner3 = document.getElementById('banner3Url').value;
    
    document.querySelectorAll('.slider-image')[0].src = banner1;
    document.querySelectorAll('.slider-image')[1].src = banner2;
    document.querySelectorAll('.slider-image')[2].src = banner3;
    
    // Show notification
    showNotification('success', 'Banners actualizados', 'Los banners se han actualizado correctamente.');
}

// Users admin functions
function loadUsersAdmin() {
    const usersTableBody = document.getElementById('usersTableBody');
    usersTableBody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td class="admin-item-actions">
                <button class="btn-small btn-primary" onclick="editUser(${user.id})">Editar</button>
                <button class="btn-small btn-danger" onclick="deleteUser(${user.id})">Eliminar</button>
            </td>
        `;
        usersTableBody.appendChild(row);
    });
}

function searchUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const usersTableBody = document.getElementById('usersTableBody');
    usersTableBody.innerHTML = '';
    
    users.filter(user => 
        user.name.toLowerCase().includes(searchTerm) || 
        user.email.toLowerCase().includes(searchTerm)
    ).forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td class="admin-item-actions">
                <button class="btn-small btn-primary" onclick="editUser(${user.id})">Editar</button>
                <button class="btn-small btn-danger" onclick="deleteUser(${user.id})">Eliminar</button>
            </td>
        `;
        usersTableBody.appendChild(row);
    });
}

function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        const newName = prompt('Ingrese el nuevo nombre:', user.name);
        if (newName) {
            user.name = newName;
            loadUsersAdmin();
            
            // Show notification
            showNotification('success', 'Usuario actualizado', 'El usuario se ha actualizado correctamente.');
        }
    }
}

function deleteUser(userId) {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
        users = users.filter(u => u.id !== userId);
        loadUsersAdmin();
        
        // Show notification
        showNotification('success', 'Usuario eliminado', 'El usuario se ha eliminado correctamente.');
    }
}

// Chatbot functionality
function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    if (chatWindow.style.display === 'flex') {
        chatWindow.style.display = 'none';
    } else {
        chatWindow.style.display = 'flex';
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
        const chatMessages = document.getElementById('chatMessages');
        
        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'user-message';
        userMessage.textContent = message;
        chatMessages.appendChild(userMessage);
        
        input.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Simulate bot response
        setTimeout(() => {
            const botMessage = document.createElement('div');
            botMessage.className = 'bot-message';
            
            // Simple response logic
            let response = "Gracias por tu mensaje. ¿En qué más puedo ayudarte?";
            
            if (message.toLowerCase().includes('curso')) {
                response = "Ofrecemos una variedad de cursos de inglés, desde nivel básico hasta avanzado. ¿Te gustaría conocer más sobre algún curso en particular?";
            } else if (message.toLowerCase().includes('precio')) {
                response = "Nuestros precios varían según el curso y la duración. Te recomiendo visitar nuestra sección de precios para obtener más información.";
            } else if (message.toLowerCase().includes('registro')) {
                response = "Para registrarte, simplemente haz clic en el botón de inscribirse en el curso de tu elección. Si necesitas ayuda, no dudes en contactarnos.";
            }
            
            botMessage.textContent = response;
            chatMessages.appendChild(botMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }
}

function sendSuggestion(text) {
    document.getElementById('chatInput').value = text;
    sendChatMessage();
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

// Newsletter subscription
function subscribeNewsletter(event) {
    event.preventDefault();
    
    const email = event.target.querySelector('input[type="email"]').value;
    
    // Show notification
    showNotification('success', 'Suscripción exitosa', `Te has suscrito a nuestro newsletter con el email ${email}.`);
    
    // Clear form
    event.target.reset();
}

// Back to top button
window.addEventListener('scroll', () => {
    const backToTop = document.getElementById('backToTop');
    if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// WhatsApp button
function openWhatsApp() {
    window.open('https://wa.me/51929601732?text=Hola,%20me%20interesa%20conocer%20más%20sobre%20los%20cursos%20de%20inglés', '_blank');
}

// Notification system
function showNotification(type, title, message) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    
    // Set notification type
    notification.className = 'notification ' + type;
    
    // Set notification content
    notification.querySelector('h4').textContent = title;
    notificationMessage.textContent = message;
    
    // Show notification
    notification.classList.add('show');
    
    // Hide notification after 5 seconds
    setTimeout(() => {
        closeNotification();
    }, 5000);
}

function closeNotification() {
    const notification = document.getElementById('notification');
    notification.classList.remove('show');
}

// Setup event listeners
function setupEventListeners() {
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.pageYOffset > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Check if admin is logged in
    if (localStorage.getItem('isAdminLoggedIn') === 'true') {
        isAdminLoggedIn = true;
        document.getElementById('adminLink').style.display = 'block';
    }
    
    // Load saved comments
    const savedComments = localStorage.getItem('comments');
    if (savedComments) {
        comments = JSON.parse(savedComments);
    }
    
    // Set last registration
    const userName = localStorage.getItem('userName');
    if (userName) {
        const now = new Date();
        localStorage.setItem('lastRegistration', `${userName} - ${now.toLocaleString()}`);
    }
}
