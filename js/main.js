document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initApp();
    
    // Load data from localStorage
    loadCourses();
    loadPricing();
    loadLiveClasses();
    loadAccessClasses();
    loadBanners();
    loadComments();
    
    // Initialize slider
    initSlider();
    
    // Initialize stats animation
    initStatsAnimation();
    
    // Initialize navbar scroll effect
    initNavbarScroll();
    
    // Initialize chatbot
    initChatbot();
});

// Initialize the application
function initApp() {
    // Update loading bar
    const loadingProgress = document.getElementById('loadingProgress');
    loadingProgress.style.width = '100%';
    
    // Hide loading bar after page loads
    setTimeout(() => {
        document.querySelector('.loading-bar').style.display = 'none';
    }, 1000);
}

// Show main content after login screen
function showMainContent() {
    const loginScreen = document.getElementById('loginScreen');
    loginScreen.style.opacity = '0';
    loginScreen.style.visibility = 'hidden';
}

// Show section
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Update nav links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Initialize slider
function initSlider() {
    const slides = document.querySelectorAll('.slider-image');
    const dots = document.querySelectorAll('.slider-dot');
    let currentSlide = 0;
    
    // Auto-advance slides
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
    }, 5000);
    
    function updateSlider() {
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
}

// Go to specific slide
function goToSlide(slideIndex) {
    const slides = document.querySelectorAll('.slider-image');
    const dots = document.querySelectorAll('.slider-dot');
    
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === slideIndex);
    });
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === slideIndex);
    });
}

// Initialize stats animation
function initStatsAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateNumber(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

// Animate number counting up
function animateNumber(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.ceil(current);
        }
    }, 20);
}

// Initialize navbar scroll effect
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Load courses from localStorage
function loadCourses() {
    const coursesGrid = document.getElementById('coursesGrid');
    const courses = JSON.parse(localStorage.getItem('courses')) || getDefaultCourses();
    
    coursesGrid.innerHTML = '';
    
    courses.forEach(course => {
        const courseCard = createCourseCard(course);
        coursesGrid.appendChild(courseCard);
    });
    
    // Save to localStorage if not already saved
    if (!localStorage.getItem('courses')) {
        localStorage.setItem('courses', JSON.stringify(courses));
    }
}

// Get default courses
function getDefaultCourses() {
    return [
        {
            id: 1,
            title: "Inglés Básico",
            teacher: "Prof. John Smith",
            duration: "3 meses",
            students: "120",
            price: "$99",
            image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
            description: "Aprende los fundamentos del inglés con vocabulario básico y estructuras simples."
        },
        {
            id: 2,
            title: "Inglés Intermedio",
            teacher: "Prof. Sarah Johnson",
            duration: "4 meses",
            students: "85",
            price: "$149",
            image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80",
            description: "Desarrolla tu fluidez con conversaciones y estructuras gramaticales más complejas."
        },
        {
            id: 3,
            title: "Inglés Avanzado",
            teacher: "Prof. Michael Brown",
            duration: "5 meses",
            students: "65",
            price: "$199",
            image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            description: "Perfecciona tu inglés con vocabulario avanzado y expresiones idiomáticas."
        },
        {
            id: 4,
            title: "Conversación",
            teacher: "Prof. Emily Davis",
            duration: "2 meses",
            students: "95",
            price: "$129",
            image: "https://images.unsplash.com/photo-1533228268271-b7a49525b3d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            description: "Practica tu habilidad para mantener conversaciones fluidas en inglés."
        },
        {
            id: 5,
            title: "Preparación TOEFL",
            teacher: "Prof. Robert Wilson",
            duration: "6 meses",
            students: "45",
            price: "$249",
            image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
            description: "Prepárate para el examen TOEFL con estrategias y práctica intensiva."
        },
        {
            id: 6,
            title: "Inglés de Negocios",
            teacher: "Prof. Jennifer Lee",
            duration: "4 meses",
            students: "70",
            price: "$179",
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            description: "Aprende el inglés necesario para el entorno empresarial y profesional."
        }
    ];
}

// Create course card element
function createCourseCard(course) {
    const card = document.createElement('div');
    card.className = 'course-card';
    card.innerHTML = `
        <div class="course-img-container">
            <img src="${course.image}" alt="${course.title}" class="course-img">
            <div class="course-badge">Popular</div>
        </div>
        <div class="course-info">
            <h3>${course.title}</h3>
            <div class="course-teacher">
                <img src="https://ui-avatars.com/api/?name=${course.teacher}&background=1a3a8f&color=fff&size=40" alt="${course.teacher}" class="teacher-avatar">
                <span class="teacher-name">${course.teacher}</span>
            </div>
            <div class="course-meta">
                <span><i class="fas fa-clock"></i> ${course.duration}</span>
                <span><i class="fas fa-users"></i> ${course.students} estudiantes</span>
            </div>
            <div class="course-price">${course.price}</div>
            <button onclick="enrollCourse(${course.id})">
                <i class="fas fa-shopping-cart"></i> Inscribirse
            </button>
        </div>
    `;
    return card;
}

// Enroll in course
function enrollCourse(courseId) {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const course = courses.find(c => c.id === courseId);
    
    if (course) {
        showNotification(`Te has inscrito en el curso: ${course.title}`, 'success');
    }
}

// Load pricing from localStorage
function loadPricing() {
    const pricingTableBody = document.getElementById('pricingTableBody');
    const pricing = JSON.parse(localStorage.getItem('pricing')) || getDefaultPricing();
    
    pricingTableBody.innerHTML = '';
    
    pricing.forEach(item => {
        if (item.type === 'monthly') { // Default to monthly pricing
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.course}</td>
                <td class="highlight">${item.price}</td>
                <td>${item.schedule}</td>
                <td>${item.duration}</td>
            `;
            pricingTableBody.appendChild(row);
        }
    });
    
    // Save to localStorage if not already saved
    if (!localStorage.getItem('pricing')) {
        localStorage.setItem('pricing', JSON.stringify(pricing));
    }
}

// Get default pricing
function getDefaultPricing() {
    return [
        {
            id: 1,
            course: "Inglés Básico",
            price: "$99",
            schedule: "Lunes y Miércoles 18:00-20:00",
            duration: "3 meses",
            type: "monthly"
        },
        {
            id: 2,
            course: "Inglés Intermedio",
            price: "$149",
            schedule: "Martes y Jueves 18:00-20:00",
            duration: "4 meses",
            type: "monthly"
        },
        {
            id: 3,
            course: "Inglés Avanzado",
            price: "$199",
            schedule: "Lunes, Miércoles y Viernes 18:00-20:00",
            duration: "5 meses",
            type: "monthly"
        },
        {
            id: 4,
            course: "Conversación",
            price: "$129",
            schedule: "Sábados 10:00-13:00",
            duration: "2 meses",
            type: "monthly"
        },
        {
            id: 5,
            course: "Preparación TOEFL",
            price: "$249",
            schedule: "Martes y Jueves 19:00-21:00",
            duration: "6 meses",
            type: "monthly"
        },
        {
            id: 6,
            course: "Inglés de Negocios",
            price: "$179",
            schedule: "Miércoles y Viernes 19:00-21:00",
            duration: "4 meses",
            type: "monthly"
        },
        // Quarterly pricing
        {
            id: 7,
            course: "Inglés Básico",
            price: "$269",
            schedule: "Lunes y Miércoles 18:00-20:00",
            duration: "3 meses",
            type: "quarterly"
        },
        {
            id: 8,
            course: "Inglés Intermedio",
            price: "$399",
            schedule: "Martes y Jueves 18:00-20:00",
            duration: "4 meses",
            type: "quarterly"
        },
        // Yearly pricing
        {
            id: 9,
            course: "Inglés Básico",
            price: "$999",
            schedule: "Lunes y Miércoles 18:00-20:00",
            duration: "3 meses",
            type: "yearly"
        },
        {
            id: 10,
            course: "Inglés Intermedio",
            price: "$1499",
            schedule: "Martes y Jueves 18:00-20:00",
            duration: "4 meses",
            type: "yearly"
        }
    ];
}

// Show pricing by type
function showPricing(type) {
    const pricingTabs = document.querySelectorAll('.pricing-tab');
    const pricingTableBody = document.getElementById('pricingTableBody');
    const pricing = JSON.parse(localStorage.getItem('pricing')) || getDefaultPricing();
    
    // Update active tab
    pricingTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.textContent.toLowerCase().includes(type)) {
            tab.classList.add('active');
        }
    });
    
    // Update pricing table
    pricingTableBody.innerHTML = '';
    
    pricing.forEach(item => {
        if (item.type === type) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.course}</td>
                <td class="highlight">${item.price}</td>
                <td>${item.schedule}</td>
                <td>${item.duration}</td>
            `;
            pricingTableBody.appendChild(row);
        }
    });
}

// Load live classes from localStorage
function loadLiveClasses() {
    const liveScheduleContainer = document.getElementById('liveScheduleContainer');
    const liveClasses = JSON.parse(localStorage.getItem('liveClasses')) || getDefaultLiveClasses();
    
    liveScheduleContainer.innerHTML = '';
    
    liveClasses.forEach(liveClass => {
        const scheduleItem = document.createElement('div');
        scheduleItem.className = 'schedule-item';
        scheduleItem.innerHTML = `
            <div>
                <strong>${liveClass.title}</strong>
                <div>${liveClass.platform}</div>
            </div>
            <div class="schedule-time">${liveClass.date} ${liveClass.time}</div>
        `;
        liveScheduleContainer.appendChild(scheduleItem);
    });
    
    // Save to localStorage if not already saved
    if (!localStorage.getItem('liveClasses')) {
        localStorage.setItem('liveClasses', JSON.stringify(liveClasses));
    }
}

// Get default live classes
function getDefaultLiveClasses() {
    return [
        {
            id: 1,
            title: "Conversación: Daily Activities",
            date: "2023-11-15",
            time: "18:00",
            platform: "YouTube",
            url: "https://youtube.com/watch?v=example"
        },
        {
            id: 2,
            title: "Gramática: Present Perfect",
            date: "2023-11-17",
            time: "19:00",
            platform: "Twitch",
            url: "https://twitch.tv/example"
        },
        {
            id: 3,
            title: "Pronunciación: Difficult Sounds",
            date: "2023-11-20",
            time: "17:00",
            platform: "Facebook",
            url: "https://facebook.com/watch/example"
        }
    ];
}

// Send live chat message
function sendLiveChatMessage() {
    const chatInput = document.getElementById('liveChatInput');
    const chatMessages = document.getElementById('liveChatMessages');
    
    if (chatInput.value.trim() !== '') {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message user-message';
        messageDiv.textContent = chatInput.value;
        
        chatMessages.appendChild(messageDiv);
        chatInput.value = '';
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Simulate response after 1 second
        setTimeout(() => {
            const responseDiv = document.createElement('div');
            responseDiv.className = 'chat-message other-message';
            responseDiv.textContent = "Gracias por tu pregunta. La responderé en breve.";
            
            chatMessages.appendChild(responseDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }
}

// Handle live chat key press
function handleLiveChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendLiveChatMessage();
    }
}

// Load access classes from localStorage
function loadAccessClasses() {
    const accessGrid = document.getElementById('accessGrid');
    const accessClasses = JSON.parse(localStorage.getItem('accessClasses')) || getDefaultAccessClasses();
    
    accessGrid.innerHTML = '';
    
    accessClasses.forEach(accessClass => {
        const accessCard = createAccessCard(accessClass);
        accessGrid.appendChild(accessCard);
    });
    
    // Save to localStorage if not already saved
    if (!localStorage.getItem('accessClasses')) {
        localStorage.setItem('accessClasses', JSON.stringify(accessClasses));
    }
}

// Get default access classes
function getDefaultAccessClasses() {
    return [
        {
            id: 1,
            title: "Inglés Básico - Grupo A",
            platform: "Zoom",
            url: "https://zoom.us/j/example",
            teacher: "Prof. John Smith",
            schedule: "Lunes y Miércoles 18:00-20:00"
        },
        {
            id: 2,
            title: "Inglés Intermedio - Grupo B",
            platform: "Google Meet",
            url: "https://meet.google.com/example",
            teacher: "Prof. Sarah Johnson",
            schedule: "Martes y Jueves 18:00-20:00"
        },
        {
            id: 3,
            title: "Inglés Avanzado - Grupo C",
            platform: "Zoom",
            url: "https://zoom.us/j/example",
            teacher: "Prof. Michael Brown",
            schedule: "Lunes, Miércoles y Viernes 18:00-20:00"
        },
        {
            id: 4,
            title: "Conversación - Grupo D",
            platform: "Google Meet",
            url: "https://meet.google.com/example",
            teacher: "Prof. Emily Davis",
            schedule: "Sábados 10:00-13:00"
        }
    ];
}

// Create access card element
function createAccessCard(accessClass) {
    const card = document.createElement('div');
    card.className = 'access-card';
    card.innerHTML = `
        <div class="access-info">
            <h3>${accessClass.title}</h3>
            <div class="access-meta">
                <span><i class="fas fa-${accessClass.platform === 'Zoom' ? 'video' : 'video'}"></i> ${accessClass.platform}</span>
                <span><i class="fas fa-user"></i> ${accessClass.teacher}</span>
            </div>
            <div class="access-meta">
                <span><i class="fas fa-clock"></i> ${accessClass.schedule}</span>
            </div>
            <button onclick="joinClass('${accessClass.url}')">
                <i class="fas fa-sign-in-alt"></i> Unirse a la Clase
            </button>
        </div>
    `;
    return card;
}

// Join class
function joinClass(url) {
    window.open(url, '_blank');
}

// Load banners from localStorage
function loadBanners() {
    const banners = JSON.parse(localStorage.getItem('banners')) || getDefaultBanners();
    
    // Update slider images
    const sliderImages = document.querySelectorAll('.slider-image');
    
    banners.forEach((banner, index) => {
        if (sliderImages[index]) {
            sliderImages[index].src = banner.url;
            sliderImages[index].alt = banner.title;
        }
    });
    
    // Save to localStorage if not already saved
    if (!localStorage.getItem('banners')) {
        localStorage.setItem('banners', JSON.stringify(banners));
    }
}

// Get default banners
function getDefaultBanners() {
    return [
        {
            id: 1,
            title: "Aprende inglés con SkyLearn Academy",
            url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
        },
        {
            id: 2,
            title: "Profesores nativos de inglés",
            url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80"
        },
        {
            id: 3,
            title: "Clases interactivas de inglés",
            url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        }
    ];
}

// Load comments from localStorage
function loadComments() {
    const commentsContainer = document.getElementById('commentsContainer');
    const comments = JSON.parse(localStorage.getItem('comments')) || [];
    
    commentsContainer.innerHTML = '';
    
    if (comments.length === 0) {
        commentsContainer.innerHTML = '<p>No hay comentarios aún. Sé el primero en comentar.</p>';
    } else {
        comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment-item';
            commentDiv.innerHTML = `
                <div class="comment-content">
                    <p>${comment.text}</p>
                    <small class="comment-date">${comment.date}</small>
                </div>
            `;
            commentsContainer.appendChild(commentDiv);
        });
    }
}

// Add comment
function addComment(event) {
    event.preventDefault();
    
    const commentInput = document.getElementById('commentInput');
    const comments = JSON.parse(localStorage.getItem('comments')) || [];
    
    const newComment = {
        id: Date.now(),
        text: commentInput.value,
        date: new Date().toLocaleString()
    };
    
    comments.unshift(newComment);
    localStorage.setItem('comments', JSON.stringify(comments));
    
    loadComments();
    commentInput.value = '';
    
    // Update last comment in admin panel
    document.getElementById('lastComment').textContent = newComment.text;
    
    showNotification('Tu comentario ha sido publicado', 'success');
}

// Subscribe to newsletter
function subscribeNewsletter(event) {
    event.preventDefault();
    
    const email = event.target.querySelector('input[type="email"]').value;
    
    // Here you would normally send the email to your server
    console.log('Newsletter subscription:', email);
    
    showNotification('¡Gracias por suscribirte a nuestro boletín!', 'success');
    
    // Reset form
    event.target.reset();
}

// Initialize chatbot
function initChatbot() {
    // Chatbot functionality is handled by toggleChat and sendChatMessage functions
}

// Toggle chat window
function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
}

// Send chat message
function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    
    if (chatInput.value.trim() !== '') {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'user-message';
        messageDiv.textContent = chatInput.value;
        
        chatMessages.appendChild(messageDiv);
        chatInput.value = '';
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Simulate response after 1 second
        setTimeout(() => {
            const responses = [
                "Gracias por tu mensaje. ¿En qué más puedo ayudarte?",
                "¿Tienes alguna pregunta sobre nuestros cursos?",
                "Puedes encontrar más información en nuestra sección de cursos.",
                "¿Te gustaría agendar una clase de prueba?",
                "Nuestros horarios de atención son de lunes a viernes de 9:00 a 18:00."
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            
            const responseDiv = document.createElement('div');
            responseDiv.className = 'bot-message';
            responseDiv.textContent = randomResponse;
            
            chatMessages.appendChild(responseDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }
}

// Handle chat key press
function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = '';
    if (type === 'success') {
        icon = '<i class="fas fa-check-circle"></i>';
    } else if (type === 'error') {
        icon = '<i class="fas fa-exclamation-circle"></i>';
    } else if (type === 'warning') {
        icon = '<i class="fas fa-exclamation-triangle"></i>';
    }
    
    notification.innerHTML = `
        <div class="notification-icon">${icon}</div>
        <div class="notification-content">
            <h4>${type.charAt(0).toUpperCase() + type.slice(1)}</h4>
            <p>${message}</p>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
    
    // Close notification on click
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });
}

// Show admin login modal
function showAdminLogin() {
    const loginModal = document.getElementById('loginModal');
    loginModal.style.display = 'flex';
}

// Close login modal
function closeLoginModal() {
    const loginModal = document.getElementById('loginModal');
    loginModal.style.display = 'none';
}

// Admin login
function adminLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    // Check credentials
    if (email === 'desarrollador@skylearn.com' && password === 'skylearn2025') {
        // Show admin panel
        showSection('admin');
        
        // Show admin link in navigation
        document.getElementById('adminLink').style.display = 'block';
        
        // Close modal
        closeLoginModal();
        
        // Load admin data
        loadAdminData();
        
        showNotification('Has iniciado sesión como administrador', 'success');
    } else {
        showNotification('Credenciales incorrectas. Inténtalo de nuevo.', 'error');
    }
}

// Admin logout
function adminLogout() {
    // Hide admin link in navigation
    document.getElementById('adminLink').style.display = 'none';
    
    // Show home section
    showSection('home');
    
    showNotification('Has cerrado sesión como administrador', 'success');
}

// Load admin data
function loadAdminData() {
    // Load stats
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const comments = JSON.parse(localStorage.getItem('comments')) || [];
    
    document.getElementById('totalStudents').textContent = courses.reduce((sum, course) => sum + parseInt(course.students), 0);
    document.getElementById('totalCourses').textContent = courses.length;
    document.getElementById('totalComments').textContent = comments.length;
    
    // Load admin lists
    loadAdminCoursesList();
    loadAdminPricingList();
    loadAdminLiveClassesList();
    loadAdminAccessClassesList();
    loadAdminBannersList();
}

// Show admin tab
function showAdminTab(tabId) {
    // Hide all admin tabs
    const adminContents = document.querySelectorAll('.admin-content');
    adminContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`admin-${tabId}`).classList.add('active');
    
    // Update tab buttons
    const adminTabs = document.querySelectorAll('.admin-tab');
    adminTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.textContent.toLowerCase().includes(tabId) || 
            (tabId === 'dashboard' && tab.textContent.toLowerCase().includes('dashboard'))) {
            tab.classList.add('active');
        }
    });
}
