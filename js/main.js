// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCNnKi2nsR8Czw7bFMgcLH3r3sEzk42Id4",
    authDomain: "skylearn-e58c2.firebaseapp.com",
    projectId: "skylearn-e58c2",
    storageBucket: "skylearn-e58c2.firebasestorage.app",
    messagingSenderId: "697666499325",
    appId: "1:697666499325:web:365238ff6479cf917f0494"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', function () {
    // Initialize the page
    initApp();
    
    // Set up Firebase authentication listener
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            document.getElementById('adminLink').style.display = 'block';
            loadAdminData(); // Load admin stats and data
            // Subscribe to live data updates
            subscribeToLiveUpdates();
        } else {
            // User is signed out
            document.getElementById('adminLink').style.display = 'none';
            // Load public data (non-admin)
            loadPublicData();
        }
    });

    // Load public data on initial load
    loadPublicData();
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
async function adminLogin(event) {
    event.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        closeLoginModal();
        showNotification('Has iniciado sesión como administrador', 'success');
    } catch (error) {
        console.error("Error logging in:", error);
        showNotification('Credenciales incorrectas. Inténtalo de nuevo.', 'error');
    }
}

// Admin logout
async function adminLogout() {
    try {
        await signOut(auth);
        showNotification('Has cerrado sesión como administrador', 'success');
        showSection('home'); // Redirect to home
    } catch (error) {
        console.error("Error signing out:", error);
        showNotification('Error al cerrar sesión', 'error');
    }
}

// Load public data (for non-admin users)
function loadPublicData() {
    // Load courses
    loadCourses();
    // Load pricing (monthly by default)
    loadPricing('monthly');
    // Load live classes
    loadLiveClasses();
    // Load access classes
    loadAccessClasses();
    // Load banners
    loadBanners();
    // Load comments
    loadComments();
    // Load news
    loadNews();
    // Initialize slider
    initSlider();
    // Initialize stats animation
    initStatsAnimation();
    // Initialize calendar
    initCalendar();
    // Initialize FAQ
    initFAQ();
}

// Subscribe to live updates from Firestore
function subscribeToLiveUpdates() {
    // Subscribe to news updates
    const newsRef = doc(db, "settings", "news");
    const unsubscribeNews = onSnapshot(newsRef, (doc) => {
        if (doc.exists()) {
            const newsData = doc.data();
            document.getElementById('newsText').textContent = newsData.text || "¡¡OBTÉN UN 30% DE DESCUENTO AL INSCRIBIRTE AHORA!! Válido hasta el 30 de noviembre.";
        }
    });

    // Subscribe to banner updates
    const bannersRef = collection(db, "banners");
    const unsubscribeBanners = onSnapshot(bannersRef, (snapshot) => {
        const sliderImages = document.querySelectorAll('.slider-image');
        let index = 0;
        snapshot.docs.forEach((doc) => {
            if (index < sliderImages.length) {
                const bannerData = doc.data();
                sliderImages[index].src = bannerData.imageUrl || "";
                sliderImages[index].alt = bannerData.title || "";
                index++;
            }
        });
        // If there are fewer banners than slots, hide extra slots
        for (let i = index; i < sliderImages.length; i++) {
            sliderImages[i].style.opacity = '0';
        }
    });

    // Subscribe to course updates
    const coursesRef = collection(db, "courses");
    const unsubscribeCourses = onSnapshot(coursesRef, (snapshot) => {
        const coursesGrid = document.getElementById('coursesGrid');
        coursesGrid.innerHTML = '';
        snapshot.docs.forEach((doc) => {
            const courseData = doc.data();
            const courseCard = createCourseCard(courseData);
            coursesGrid.appendChild(courseCard);
        });
    });

    // Subscribe to pricing updates
    const pricingRef = collection(db, "pricing");
    const unsubscribePricing = onSnapshot(pricingRef, (snapshot) => {
        const monthlyData = [];
        snapshot.docs.forEach((doc) => {
            const pricingData = doc.data();
            if (pricingData.type === 'monthly') {
                monthlyData.push(pricingData);
            }
        });
        const pricingTableBody = document.getElementById('pricingTableBody');
        pricingTableBody.innerHTML = '';
        monthlyData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.course}</td>
                <td class="highlight">${item.price}</td>
                <td>${item.schedule}</td>
                <td>${item.duration}</td>
            `;
            pricingTableBody.appendChild(row);
        });
    });

    // Subscribe to live classes updates
    const liveClassesRef = collection(db, "liveClasses");
    const unsubscribeLiveClasses = onSnapshot(liveClassesRef, (snapshot) => {
        const liveScheduleContainer = document.getElementById('liveScheduleContainer');
        liveScheduleContainer.innerHTML = '';
        snapshot.docs.forEach((doc) => {
            const classData = doc.data();
            const scheduleItem = document.createElement('div');
            scheduleItem.className = 'schedule-item';
            scheduleItem.innerHTML = `
                <div>
                    <strong>${classData.title}</strong>
                    <div>${classData.platform}</div>
                </div>
                <div class="schedule-time">${formatDate(classData.date)} ${classData.time}</div>
            `;
            liveScheduleContainer.appendChild(scheduleItem);
        });
    });

    // Subscribe to access classes updates
    const accessClassesRef = collection(db, "accessClasses");
    const unsubscribeAccessClasses = onSnapshot(accessClassesRef, (snapshot) => {
        const accessGrid = document.getElementById('accessGrid');
        accessGrid.innerHTML = '';
        snapshot.docs.forEach((doc) => {
            const classData = doc.data();
            const accessCard = createAccessCard(classData);
            accessGrid.appendChild(accessCard);
        });
    });

    // Subscribe to stats updates
    const statsRef = doc(db, "settings", "stats");
    const unsubscribeStats = onSnapshot(statsRef, (doc) => {
        if (doc.exists()) {
            const statsData = doc.data();
            const statNumbers = document.querySelectorAll('.stat-number');
            if (statNumbers[0]) statNumbers[0].setAttribute('data-target', statsData.totalStudents || 0);
            if (statNumbers[1]) statNumbers[1].setAttribute('data-target', statsData.totalCourses || 0);
            if (statNumbers[2]) statNumbers[2].setAttribute('data-target', statsData.totalTeachers || 0);
            if (statNumbers[3]) statNumbers[3].setAttribute('data-target', statsData.satisfaction || 0);
            animateNumber(statNumbers[0], parseInt(statsData.totalStudents || 0));
            animateNumber(statNumbers[1], parseInt(statsData.totalCourses || 0));
            animateNumber(statNumbers[2], parseInt(statsData.totalTeachers || 0));
            animateNumber(statNumbers[3], parseInt(statsData.satisfaction || 0));
        }
    });

    // Subscribe to comments updates
    const commentsRef = collection(db, "comments");
    const unsubscribeComments = onSnapshot(commentsRef, (snapshot) => {
        const commentsContainer = document.getElementById('commentsContainer');
        commentsContainer.innerHTML = '';
        if (snapshot.empty) {
            commentsContainer.innerHTML = '<p>No hay comentarios aún. Sé el primero en comentar.</p>';
            return;
        }
        snapshot.docs.forEach((doc) => {
            const commentData = doc.data();
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment-item';
            commentDiv.innerHTML = `
                <div class="comment-content">
                    <p>${commentData.text}</p>
                    <small class="comment-date">${formatDate(commentData.date)}</small>
                </div>
            `;
            commentsContainer.appendChild(commentDiv);
        });
    });

    // Store references to unsubscribe when needed
    window.unsubscribeFunctions = [
        unsubscribeNews, unsubscribeBanners, unsubscribeCourses, 
        unsubscribePricing, unsubscribeLiveClasses, unsubscribeAccessClasses, 
        unsubscribeStats, unsubscribeComments
    ];
}

// Load courses from Firestore
async function loadCourses() {
    const coursesGrid = document.getElementById('coursesGrid');
    coursesGrid.innerHTML = '<p>Cargando cursos...</p>';
    try {
        const querySnapshot = await getDocs(collection(db, "courses"));
        coursesGrid.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const courseData = doc.data();
            const courseCard = createCourseCard(courseData);
            coursesGrid.appendChild(courseCard);
        });
    } catch (error) {
        console.error("Error loading courses:", error);
        coursesGrid.innerHTML = '<p>Error al cargar los cursos.</p>';
    }
}

// Create course card element
function createCourseCard(course) {
    const card = document.createElement('div');
    card.className = 'course-card';
    card.innerHTML = `
        <div class="course-img-container">
            <img src="${course.image || 'https://via.placeholder.com/300x200'}" alt="${course.title}" class="course-img">
            <div class="course-badge">Popular</div>
        </div>
        <div class="course-info">
            <h3>${course.title}</h3>
            <div class="course-teacher">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(course.teacher)}&background=1a3a8f&color=fff&size=40" alt="${course.teacher}" class="teacher-avatar">
                <span class="teacher-name">${course.teacher}</span>
            </div>
            <div class="course-meta">
                <span><i class="fas fa-clock"></i> ${course.duration}</span>
                <span><i class="fas fa-users"></i> ${course.students} estudiantes</span>
            </div>
            <div class="course-price">${course.price}</div>
            <button onclick="enrollCourse('${course.id}')">
                <i class="fas fa-shopping-cart"></i> Inscribirse
            </button>
        </div>
    `;
    return card;
}

// Enroll in course
function enrollCourse(courseId) {
    showNotification(`Te has inscrito en el curso: ${courseId}`, 'success');
}

// Load pricing from Firestore
async function loadPricing(type) {
    const pricingTableBody = document.getElementById('pricingTableBody');
    pricingTableBody.innerHTML = '<p>Cargando precios...</p>';
    try {
        const querySnapshot = await getDocs(collection(db, "pricing"));
        pricingTableBody.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const pricingData = doc.data();
            if (pricingData.type === type) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${pricingData.course}</td>
                    <td class="highlight">${pricingData.price}</td>
                    <td>${pricingData.schedule}</td>
                    <td>${pricingData.duration}</td>
                `;
                pricingTableBody.appendChild(row);
            }
        });
    } catch (error) {
        console.error("Error loading pricing:", error);
        pricingTableBody.innerHTML = '<p>Error al cargar los precios.</p>';
    }
}

// Show pricing by type
function showPricing(type) {
    const pricingTabs = document.querySelectorAll('.pricing-tab');
    pricingTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.textContent.toLowerCase().includes(type)) {
            tab.classList.add('active');
        }
    });
    loadPricing(type);
}

// Load live classes from Firestore
async function loadLiveClasses() {
    const liveScheduleContainer = document.getElementById('liveScheduleContainer');
    liveScheduleContainer.innerHTML = '<p>Cargando clases...</p>';
    try {
        const querySnapshot = await getDocs(collection(db, "liveClasses"));
        liveScheduleContainer.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const classData = doc.data();
            const scheduleItem = document.createElement('div');
            scheduleItem.className = 'schedule-item';
            scheduleItem.innerHTML = `
                <div>
                    <strong>${classData.title}</strong>
                    <div>${classData.platform}</div>
                </div>
                <div class="schedule-time">${formatDate(classData.date)} ${classData.time}</div>
            `;
            liveScheduleContainer.appendChild(scheduleItem);
        });
    } catch (error) {
        console.error("Error loading live classes:", error);
        liveScheduleContainer.innerHTML = '<p>Error al cargar las clases en vivo.</p>';
    }
}

// Load access classes from Firestore
async function loadAccessClasses() {
    const accessGrid = document.getElementById('accessGrid');
    accessGrid.innerHTML = '<p>Cargando acceso...</p>';
    try {
        const querySnapshot = await getDocs(collection(db, "accessClasses"));
        accessGrid.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const classData = doc.data();
            const accessCard = createAccessCard(classData);
            accessGrid.appendChild(accessCard);
        });
    } catch (error) {
        console.error("Error loading access classes:", error);
        accessGrid.innerHTML = '<p>Error al cargar el acceso a clases.</p>';
    }
}

// Create access card element
function createAccessCard(accessClass) {
    const card = document.createElement('div');
    card.className = 'access-card';
    card.innerHTML = `
        <div class="access-info">
            <h3>${accessClass.title}</h3>
            <div class="access-meta">
                <span><i class="fas fa-${accessClass.platform === 'zoom' ? 'video' : 'video'}"></i> ${accessClass.platform}</span>
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

// Load banners from Firestore
async function loadBanners() {
    const sliderImages = document.querySelectorAll('.slider-image');
    try {
        const querySnapshot = await getDocs(collection(db, "banners"));
        let index = 0;
        querySnapshot.forEach((doc) => {
            const bannerData = doc.data();
            if (index < sliderImages.length) {
                sliderImages[index].src = bannerData.imageUrl || "";
                sliderImages[index].alt = bannerData.title || "";
                sliderImages[index].style.opacity = '1';
                index++;
            }
        });
        // Hide any remaining sliders if there are fewer banners than slots
        for (let i = index; i < sliderImages.length; i++) {
            sliderImages[i].style.opacity = '0';
        }
    } catch (error) {
        console.error("Error loading banners:", error);
    }
}

// Load news from Firestore
async function loadNews() {
    try {
        const docSnap = await getDoc(doc(db, "settings", "news"));
        if (docSnap.exists()) {
            document.getElementById('newsText').textContent = docSnap.data().text || "¡¡OBTÉN UN 30% DE DESCUENTO AL INSCRIBIRTE AHORA!! Válido hasta el 30 de noviembre.";
        }
    } catch (error) {
        console.error("Error loading news:", error);
    }
}

// Load comments from Firestore
async function loadComments() {
    const commentsContainer = document.getElementById('commentsContainer');
    try {
        const querySnapshot = await getDocs(collection(db, "comments"));
        commentsContainer.innerHTML = '';
        if (querySnapshot.empty) {
            commentsContainer.innerHTML = '<p>No hay comentarios aún. Sé el primero en comentar.</p>';
            return;
        }
        querySnapshot.forEach((doc) => {
            const commentData = doc.data();
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment-item';
            commentDiv.innerHTML = `
                <div class="comment-content">
                    <p>${commentData.text}</p>
                    <small class="comment-date">${formatDate(commentData.date)}</small>
                </div>
            `;
            commentsContainer.appendChild(commentDiv);
        });
    } catch (error) {
        console.error("Error loading comments:", error);
        commentsContainer.innerHTML = '<p>Error al cargar los comentarios.</p>';
    }
}

// Add comment
async function addComment(event) {
    event.preventDefault();
    const commentInput = document.getElementById('commentInput');
    const commentText = commentInput.value.trim();

    if (commentText) {
        try {
            await addDoc(collection(db, "comments"), {
                text: commentText,
                date: new Date().toISOString(),
                timestamp: new Date().getTime()
            });
            commentInput.value = '';
            showNotification('Tu comentario ha sido publicado', 'success');
        } catch (error) {
            console.error("Error adding comment:", error);
            showNotification('Error al publicar el comentario', 'error');
        }
    }
}

// Format date
function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
}

// Initialize slider
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

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });

    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, 5000);
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

// Subscribe to newsletter
function subscribeNewsletter(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    console.log('Newsletter subscription:', email);
    showNotification('¡Gracias por suscribirte a nuestro boletín!', 'success');
    event.target.reset();
}

// Initialize calendar
function initCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthElement = document.getElementById('currentMonth');
    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    function renderCalendar() {
        // Clear calendar
        calendarGrid.innerHTML = '';
        // Set month and year header
        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        // Add day headers
        const dayHeaders = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
        dayHeaders.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day weekday';
            dayElement.textContent = day;
            calendarGrid.appendChild(dayElement);
        });
        // Get first day of month and number of days
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day other-month';
            calendarGrid.appendChild(emptyDay);
        }
        // Add days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            // Check if today
            const today = new Date();
            if (currentYear === today.getFullYear() && currentMonth === today.getMonth() && day === today.getDate()) {
                dayElement.classList.add('today');
            }
            // Add day number
            dayElement.textContent = day;
            // Add sample class events (for demo purposes)
            if (day % 5 === 0) {
                dayElement.classList.add('has-class');
                const classEvent = document.createElement('div');
                classEvent.className = 'class-event';
                classEvent.textContent = 'Clase de inglés';
                dayElement.appendChild(classEvent);
            }
            calendarGrid.appendChild(dayElement);
        }
    }

    // Add event listeners
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
    // Initial render
    renderCalendar();
}

// Initialize FAQ
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Toggle active class
            item.classList.toggle('active');
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
        });
    });
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

// Load admin data
async function loadAdminData() {
    // Load stats
    try {
        const statsDoc = await getDoc(doc(db, "settings", "stats"));
        if (statsDoc.exists()) {
            const statsData = statsDoc.data();
            document.getElementById('totalStudents').textContent = statsData.totalStudents || 0;
            document.getElementById('totalCourses').textContent = statsData.totalCourses || 0;
            document.getElementById('totalComments').textContent = statsData.totalComments || 0;
        }
    } catch (error) {
        console.error("Error loading admin stats:", error);
    }

    // Load last comment
    try {
        const commentsQuery = collection(db, "comments");
        const commentsSnapshot = await getDocs(commentsQuery);
        const sortedComments = [...commentsSnapshot.docs].sort((a, b) => b.data().timestamp - a.data().timestamp);
        if (sortedComments.length > 0) {
            const lastComment = sortedComments[0].data();
            document.getElementById('lastComment').textContent = `${lastComment.text} - ${lastComment.name || 'Anónimo'}`;
        }
    } catch (error) {
        console.error("Error loading last comment:", error);
    }

    // Load last registration (dummy)
    document.getElementById('lastRegistration').textContent = 'Carlos Rodríguez - Inglés Intermedio';

    // Load admin lists
    loadAdminCoursesList();
    loadAdminPricingList();
    loadAdminLiveClassesList();
    loadAdminAccessClassesList();
    loadAdminBannersList();
}

// Load admin courses list
async function loadAdminCoursesList() {
    const adminCoursesList = document.getElementById('adminCoursesList');
    adminCoursesList.innerHTML = '<p>Cargando cursos...</p>';
    try {
        const querySnapshot = await getDocs(collection(db, "courses"));
        adminCoursesList.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const courseData = doc.data();
            const adminItem = document.createElement('div');
            adminItem.className = 'admin-item';
            adminItem.innerHTML = `
                <div>
                    <strong>${courseData.title}</strong>
                    <div>Profesor: ${courseData.teacher} | Precio: ${courseData.price}</div>
                </div>
                <div class="admin-item-actions">
                    <button class="btn-primary btn-small" onclick="editCourse('${doc.id}')">Editar</button>
                    <button class="btn-danger btn-small" onclick="deleteCourse('${doc.id}')">Eliminar</button>
                </div>
            `;
            adminCoursesList.appendChild(adminItem);
        });
    } catch (error) {
        console.error("Error loading admin courses list:", error);
        adminCoursesList.innerHTML = '<p>Error al cargar la lista de cursos.</p>';
    }
}

// Show add course form
function showAddCourseForm() {
    document.getElementById('addCourseForm').style.display = 'block';
}

// Hide add course form
function hideAddCourseForm() {
    document.getElementById('addCourseForm').style.display = 'none';
    document.getElementById('newCourseTitle').value = '';
    document.getElementById('newCourseTeacher').value = '';
    document.getElementById('newCourseDuration').value = '';
    document.getElementById('newCourseStudents').value = '';
    document.getElementById('newCoursePrice').value = '';
    document.getElementById('newCourseImage').value = '';
    document.getElementById('newCourseDescription').value = '';
}

// Add course
async function addCourse(event) {
    event.preventDefault();
    const title = document.getElementById('newCourseTitle').value;
    const teacher = document.getElementById('newCourseTeacher').value;
    const duration = document.getElementById('newCourseDuration').value;
    const students = document.getElementById('newCourseStudents').value;
    const price = document.getElementById('newCoursePrice').value;
    const image = document.getElementById('newCourseImage').value;
    const description = document.getElementById('newCourseDescription').value;

    try {
        await addDoc(collection(db, "courses"), {
            title,
            teacher,
            duration,
            students,
            price,
            image,
            description,
            createdAt: new Date().toISOString()
        });
        showNotification('Curso agregado exitosamente', 'success');
        hideAddCourseForm();
        loadAdminCoursesList();
    } catch (error) {
        console.error("Error adding course:", error);
        showNotification('Error al agregar el curso', 'error');
    }
}

// Edit course
async function editCourse(courseId) {
    const courseRef = doc(db, "courses", courseId);
    const courseDoc = await getDoc(courseRef);
    if (!courseDoc.exists()) {
        showNotification('Curso no encontrado', 'error');
        return;
    }
    const courseData = courseDoc.data();

    // Fill form with course data
    document.getElementById('newCourseTitle').value = courseData.title;
    document.getElementById('newCourseTeacher').value = courseData.teacher;
    document.getElementById('newCourseDuration').value = courseData.duration;
    document.getElementById('newCourseStudents').value = courseData.students;
    document.getElementById('newCoursePrice').value = courseData.price;
    document.getElementById('newCourseImage').value = courseData.image;
    document.getElementById('newCourseDescription').value = courseData.description;

    // Show form
    showAddCourseForm();

    // Change form submit function
    const form = document.querySelector('#addCourseForm form');
    form.onsubmit = async function (event) {
        event.preventDefault();
        const updatedData = {
            title: document.getElementById('newCourseTitle').value,
            teacher: document.getElementById('newCourseTeacher').value,
            duration: document.getElementById('newCourseDuration').value,
            students: document.getElementById('newCourseStudents').value,
            price: document.getElementById('newCoursePrice').value,
            image: document.getElementById('newCourseImage').value,
            description: document.getElementById('newCourseDescription').value
        };

        try {
            await updateDoc(courseRef, updatedData);
            showNotification('Curso actualizado exitosamente', 'success');
            hideAddCourseForm();
            loadAdminCoursesList();
            form.onsubmit = addCourse; // Reset form submit function
        } catch (error) {
            console.error("Error updating course:", error);
            showNotification('Error al actualizar el curso', 'error');
        }
    };
}

// Delete course
async function deleteCourse(courseId) {
    if (confirm('¿Estás seguro de que quieres eliminar este curso?')) {
        try {
            await deleteDoc(doc(db, "courses", courseId));
            showNotification('Curso eliminado exitosamente', 'success');
            loadAdminCoursesList();
        } catch (error) {
            console.error("Error deleting course:", error);
            showNotification('Error al eliminar el curso', 'error');
        }
    }
}

// Load admin pricing list
async function loadAdminPricingList() {
    const adminPricingList = document.getElementById('adminPricingList');
    adminPricingList.innerHTML = '<p>Cargando precios...</p>';
    try {
        const querySnapshot = await getDocs(collection(db, "pricing"));
        adminPricingList.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const pricingData = doc.data();
            const adminItem = document.createElement('div');
            adminItem.className = 'admin-item';
            adminItem.innerHTML = `
                <div>
                    <strong>${pricingData.course}</strong>
                    <div>Precio: ${pricingData.price} | Tipo: ${pricingData.type}</div>
                </div>
                <div class="admin-item-actions">
                    <button class="btn-primary btn-small" onclick="editPricing('${doc.id}')">Editar</button>
                    <button class="btn-danger btn-small" onclick="deletePricing('${doc.id}')">Eliminar</button>
                </div>
            `;
            adminPricingList.appendChild(adminItem);
        });
    } catch (error) {
        console.error("Error loading admin pricing list:", error);
        adminPricingList.innerHTML = '<p>Error al cargar la lista de precios.</p>';
    }
}

// Show add pricing form
function showAddPricingForm() {
    document.getElementById('addPricingForm').style.display = 'block';
}

// Hide add pricing form
function hideAddPricingForm() {
    document.getElementById('addPricingForm').style.display = 'none';
    document.getElementById('pricingCourse').value = '';
    document.getElementById('pricingPrice').value = '';
    document.getElementById('pricingSchedule').value = '';
    document.getElementById('pricingDuration').value = '';
    document.getElementById('pricingType').value = 'monthly';
}

// Add pricing
async function addPricing(event) {
    event.preventDefault();
    const course = document.getElementById('pricingCourse').value;
    const price = document.getElementById('pricingPrice').value;
    const schedule = document.getElementById('pricingSchedule').value;
    const duration = document.getElementById('pricingDuration').value;
    const type = document.getElementById('pricingType').value;

    try {
        await addDoc(collection(db, "pricing"), {
            course,
            price,
            schedule,
            duration,
            type,
            createdAt: new Date().toISOString()
        });
        showNotification('Precio agregado exitosamente', 'success');
        hideAddPricingForm();
        loadAdminPricingList();
    } catch (error) {
        console.error("Error adding pricing:", error);
        showNotification('Error al agregar el precio', 'error');
    }
}

// Edit pricing
async function editPricing(pricingId) {
    const pricingRef = doc(db, "pricing", pricingId);
    const pricingDoc = await getDoc(pricingRef);
    if (!pricingDoc.exists()) {
        showNotification('Precio no encontrado', 'error');
        return;
    }
    const pricingData = pricingDoc.data();

    // Fill form with pricing data
    document.getElementById('pricingCourse').value = pricingData.course;
    document.getElementById('pricingPrice').value = pricingData.price;
    document.getElementById('pricingSchedule').value = pricingData.schedule;
    document.getElementById('pricingDuration').value = pricingData.duration;
    document.getElementById('pricingType').value = pricingData.type;

    // Show form
    showAddPricingForm();

    // Change form submit function
    const form = document.querySelector('#addPricingForm form');
    form.onsubmit = async function (event) {
        event.preventDefault();
        const updatedData = {
            course: document.getElementById('pricingCourse').value,
            price: document.getElementById('pricingPrice').value,
            schedule: document.getElementById('pricingSchedule').value,
            duration: document.getElementById('pricingDuration').value,
            type: document.getElementById('pricingType').value
        };

        try {
            await updateDoc(pricingRef, updatedData);
            showNotification('Precio actualizado exitosamente', 'success');
            hideAddPricingForm();
            loadAdminPricingList();
            form.onsubmit = addPricing; // Reset form submit function
        } catch (error) {
            console.error("Error updating pricing:", error);
            showNotification('Error al actualizar el precio', 'error');
        }
    };
}

// Delete pricing
async function deletePricing(pricingId) {
    if (confirm('¿Estás seguro de que quieres eliminar este precio?')) {
        try {
            await deleteDoc(doc(db, "pricing", pricingId));
            showNotification('Precio eliminado exitosamente', 'success');
            loadAdminPricingList();
        } catch (error) {
            console.error("Error deleting pricing:", error);
            showNotification('Error al eliminar el precio', 'error');
        }
    }
}

// Load admin live classes list
async function loadAdminLiveClassesList() {
    const adminLiveClassesList = document.getElementById('adminLiveClassesList');
    adminLiveClassesList.innerHTML = '<p>Cargando clases...</p>';
    try {
        const querySnapshot = await getDocs(collection(db, "liveClasses"));
        adminLiveClassesList.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const classData = doc.data();
            const adminItem = document.createElement('div');
            adminItem.className = 'admin-item';
            adminItem.innerHTML = `
                <div>
                    <strong>${classData.title}</strong>
                    <div>Fecha: ${formatDate(classData.date)} ${classData.time} | Plataforma: ${classData.platform}</div>
                </div>
                <div class="admin-item-actions">
                    <button class="btn-primary btn-small" onclick="editLiveClass('${doc.id}')">Editar</button>
                    <button class="btn-danger btn-small" onclick="deleteLiveClass('${doc.id}')">Eliminar</button>
                </div>
            `;
            adminLiveClassesList.appendChild(adminItem);
        });
    } catch (error) {
        console.error("Error loading admin live classes list:", error);
        adminLiveClassesList.innerHTML = '<p>Error al cargar la lista de clases en vivo.</p>';
    }
}

// Show add live class form
function showAddLiveClassForm() {
    document.getElementById('addLiveClassForm').style.display = 'block';
}

// Hide add live class form
function hideAddLiveClassForm() {
    document.getElementById('addLiveClassForm').style.display = 'none';
    document.getElementById('liveClassTitle').value = '';
    document.getElementById('liveClassDate').value = '';
    document.getElementById('liveClassTime').value = '';
    document.getElementById('liveClassPlatform').value = 'youtube';
    document.getElementById('liveClassUrl').value = '';
}

// Add live class
async function addLiveClass(event) {
    event.preventDefault();
    const title = document.getElementById('liveClassTitle').value;
    const date = document.getElementById('liveClassDate').value;
    const time = document.getElementById('liveClassTime').value;
    const platform = document.getElementById('liveClassPlatform').value;
    const url = document.getElementById('liveClassUrl').value;

    try {
        await addDoc(collection(db, "liveClasses"), {
            title,
            date,
            time,
            platform,
            url,
            createdAt: new Date().toISOString()
        });
        showNotification('Clase en vivo agregada exitosamente', 'success');
        hideAddLiveClassForm();
        loadAdminLiveClassesList();
    } catch (error) {
        console.error("Error adding live class:", error);
        showNotification('Error al agregar la clase en vivo', 'error');
    }
}

// Edit live class
async function editLiveClass(liveClassId) {
    const liveClassRef = doc(db, "liveClasses", liveClassId);
    const liveClassDoc = await getDoc(liveClassRef);
    if (!liveClassDoc.exists()) {
        showNotification('Clase no encontrada', 'error');
        return;
    }
    const liveClassData = liveClassDoc.data();

    // Fill form with live class data
    document.getElementById('liveClassTitle').value = liveClassData.title;
    document.getElementById('liveClassDate').value = liveClassData.date;
    document.getElementById('liveClassTime').value = liveClassData.time;
    document.getElementById('liveClassPlatform').value = liveClassData.platform;
    document.getElementById('liveClassUrl').value = liveClassData.url;

    // Show form
    showAddLiveClassForm();

    // Change form submit function
    const form = document.querySelector('#addLiveClassForm form');
    form.onsubmit = async function (event) {
        event.preventDefault();
        const updatedData = {
            title: document.getElementById('liveClassTitle').value,
            date: document.getElementById('liveClassDate').value,
            time: document.getElementById('liveClassTime').value,
            platform: document.getElementById('liveClassPlatform').value,
            url: document.getElementById('liveClassUrl').value
        };

        try {
            await updateDoc(liveClassRef, updatedData);
            showNotification('Clase en vivo actualizada exitosamente', 'success');
            hideAddLiveClassForm();
            loadAdminLiveClassesList();
            form.onsubmit = addLiveClass; // Reset form submit function
        } catch (error) {
            console.error("Error updating live class:", error);
            showNotification('Error al actualizar la clase en vivo', 'error');
        }
    };
}

// Delete live class
async function deleteLiveClass(liveClassId) {
    if (confirm('¿Estás seguro de que quieres eliminar esta clase en vivo?')) {
        try {
            await deleteDoc(doc(db, "liveClasses", liveClassId));
            showNotification('Clase en vivo eliminada exitosamente', 'success');
            loadAdminLiveClassesList();
        } catch (error) {
            console.error("Error deleting live class:", error);
            showNotification('Error al eliminar la clase en vivo', 'error');
        }
    }
}

// Load admin access classes list
async function loadAdminAccessClassesList() {
    const adminAccessClassesList = document.getElementById('adminAccessClassesList');
    adminAccessClassesList.innerHTML = '<p>Cargando accesos...</p>';
    try {
        const querySnapshot = await getDocs(collection(db, "accessClasses"));
        adminAccessClassesList.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const classData = doc.data();
            const adminItem = document.createElement('div');
            adminItem.className = 'admin-item';
            adminItem.innerHTML = `
                <div>
                    <strong>${classData.title}</strong>
                    <div>Profesor: ${classData.teacher} | Plataforma: ${classData.platform}</div>
                </div>
                <div class="admin-item-actions">
                    <button class="btn-primary btn-small" onclick="editAccessClass('${doc.id}')">Editar</button>
                    <button class="btn-danger btn-small" onclick="deleteAccessClass('${doc.id}')">Eliminar</button>
                </div>
            `;
            adminAccessClassesList.appendChild(adminItem);
        });
    } catch (error) {
        console.error("Error loading admin access classes list:", error);
        adminAccessClassesList.innerHTML = '<p>Error al cargar la lista de accesos.</p>';
    }
}

// Show add access class form
function showAddAccessClassForm() {
    document.getElementById('addAccessClassForm').style.display = 'block';
}

// Hide add access class form
function hideAddAccessClassForm() {
    document.getElementById('addAccessClassForm').style.display = 'none';
    document.getElementById('accessClassTitle').value = '';
    document.getElementById('accessClassPlatform').value = 'zoom';
    document.getElementById('accessClassUrl').value = '';
    document.getElementById('accessClassTeacher').value = '';
    document.getElementById('accessClassSchedule').value = '';
}

// Add access class
async function addAccessClass(event) {
    event.preventDefault();
    const title = document.getElementById('accessClassTitle').value;
    const platform = document.getElementById('accessClassPlatform').value;
    const url = document.getElementById('accessClassUrl').value;
    const teacher = document.getElementById('accessClassTeacher').value;
    const schedule = document.getElementById('accessClassSchedule').value;

    try {
        await addDoc(collection(db, "accessClasses"), {
            title,
            platform,
            url,
            teacher,
            schedule,
            createdAt: new Date().toISOString()
        });
        showNotification('Acceso a clase agregado exitosamente', 'success');
        hideAddAccessClassForm();
        loadAdminAccessClassesList();
    } catch (error) {
        console.error("Error adding access class:", error);
        showNotification('Error al agregar el acceso a clase', 'error');
    }
}

// Edit access class
async function editAccessClass(accessClassId) {
    const accessClassRef = doc(db, "accessClasses", accessClassId);
    const accessClassDoc = await getDoc(accessClassRef);
    if (!accessClassDoc.exists()) {
        showNotification('Acceso no encontrado', 'error');
        return;
    }
    const accessClassData = accessClassDoc.data();

    // Fill form with access class data
    document.getElementById('accessClassTitle').value = accessClassData.title;
    document.getElementById('accessClassPlatform').value = accessClassData.platform;
    document.getElementById('accessClassUrl').value = accessClassData.url;
    document.getElementById('accessClassTeacher').value = accessClassData.teacher;
    document.getElementById('accessClassSchedule').value = accessClassData.schedule;

    // Show form
    showAddAccessClassForm();

    // Change form submit function
    const form = document.querySelector('#addAccessClassForm form');
    form.onsubmit = async function (event) {
        event.preventDefault();
        const updatedData = {
            title: document.getElementById('accessClassTitle').value,
            platform: document.getElementById('accessClassPlatform').value,
            url: document.getElementById('accessClassUrl').value,
            teacher: document.getElementById('accessClassTeacher').value,
            schedule: document.getElementById('accessClassSchedule').value
        };

        try {
            await updateDoc(accessClassRef, updatedData);
            showNotification('Acceso a clase actualizado exitosamente', 'success');
            hideAddAccessClassForm();
            loadAdminAccessClassesList();
            form.onsubmit = addAccessClass; // Reset form submit function
        } catch (error) {
            console.error("Error updating access class:", error);
            showNotification('Error al actualizar el acceso a clase', 'error');
        }
    };
}

// Delete access class
async function deleteAccessClass(accessClassId) {
    if (confirm('¿Estás seguro de que quieres eliminar este acceso a clase?')) {
        try {
            await deleteDoc(doc(db, "accessClasses", accessClassId));
            showNotification('Acceso a clase eliminado exitosamente', 'success');
            loadAdminAccessClassesList();
        } catch (error) {
            console.error("Error deleting access class:", error);
            showNotification('Error al eliminar el acceso a clase', 'error');
        }
    }
}

// Load admin banners list
async function loadAdminBannersList() {
    const adminBannersList = document.getElementById('adminBannersList');
    adminBannersList.innerHTML = '<p>Cargando banners...</p>';
    try {
        const querySnapshot = await getDocs(collection(db, "banners"));
        adminBannersList.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const bannerData = doc.data();
            const adminItem = document.createElement('div');
            adminItem.className = 'admin-item';
            adminItem.innerHTML = `
                <div>
                    <strong>${bannerData.title}</strong>
                    <div>URL: ${bannerData.imageUrl}</div>
                </div>
                <div class="admin-item-actions">
                    <button class="btn-primary btn-small" onclick="editBanner('${doc.id}')">Editar</button>
                    <button class="btn-danger btn-small" onclick="deleteBanner('${doc.id}')">Eliminar</button>
                </div>
            `;
            adminBannersList.appendChild(adminItem);
        });
    } catch (error) {
        console.error("Error loading admin banners list:", error);
        adminBannersList.innerHTML = '<p>Error al cargar la lista de banners.</p>';
    }
}

// Show add banner form
function showAddBannerForm() {
    document.getElementById('addBannerForm').style.display = 'block';
}

// Hide add banner form
function hideAddBannerForm() {
    document.getElementById('addBannerForm').style.display = 'none';
    document.getElementById('bannerTitle').value = '';
    document.getElementById('bannerUrl').value = '';
}

// Add banner
async function addBanner(event) {
    event.preventDefault();
    const title = document.getElementById('bannerTitle').value;
    const imageUrl = document.getElementById('bannerUrl').value;

    try {
        await addDoc(collection(db, "banners"), {
            title,
            imageUrl,
            createdAt: new Date().toISOString()
        });
        showNotification('Banner agregado exitosamente', 'success');
        hideAddBannerForm();
        loadAdminBannersList();
    } catch (error) {
        console.error("Error adding banner:", error);
        showNotification('Error al agregar el banner', 'error');
    }
}

// Edit banner
async function editBanner(bannerId) {
    const bannerRef = doc(db, "banners", bannerId);
    const bannerDoc = await getDoc(bannerRef);
    if (!bannerDoc.exists()) {
        showNotification('Banner no encontrado', 'error');
        return;
    }
    const bannerData = bannerDoc.data();

    // Fill form with banner data
    document.getElementById('bannerTitle').value = bannerData.title;
    document.getElementById('bannerUrl').value = bannerData.imageUrl;

    // Show form
    showAddBannerForm();

    // Change form submit function
    const form = document.querySelector('#addBannerForm form');
    form.onsubmit = async function (event) {
        event.preventDefault();
        const updatedData = {
            title: document.getElementById('bannerTitle').value,
            imageUrl: document.getElementById('bannerUrl').value
        };

        try {
            await updateDoc(bannerRef, updatedData);
            showNotification('Banner actualizado exitosamente', 'success');
            hideAddBannerForm();
            loadAdminBannersList();
            form.onsubmit = addBanner; // Reset form submit function
        } catch (error) {
            console.error("Error updating banner:", error);
            showNotification('Error al actualizar el banner', 'error');
        }
    };
}

// Delete banner
async function deleteBanner(bannerId) {
    if (confirm('¿Estás seguro de que quieres eliminar este banner?')) {
        try {
            await deleteDoc(doc(db, "banners", bannerId));
            showNotification('Banner eliminado exitosamente', 'success');
            loadAdminBannersList();
        } catch (error) {
            console.error("Error deleting banner:", error);
            showNotification('Error al eliminar el banner', 'error');
        }
    }
}

// Update home stats
async function updateHomeStats() {
    const statsStudents = document.getElementById('statsStudents').value;
    const statsCourses = document.getElementById('statsCourses').value;
    const statsTeachers = document.getElementById('statsTeachers').value;
    const statsSatisfaction = document.getElementById('statsSatisfaction').value;

    try {
        await updateDoc(doc(db, "settings", "stats"), {
            totalStudents: parseInt(statsStudents),
            totalCourses: parseInt(statsCourses),
            totalTeachers: parseInt(statsTeachers),
            satisfaction: parseInt(statsSatisfaction),
            updatedAt: new Date().toISOString()
        });
        showNotification('Estadísticas actualizadas exitosamente', 'success');
    } catch (error) {
        console.error("Error updating stats:", error);
        showNotification('Error al actualizar las estadísticas', 'error');
    }
}

// Update news
async function updateNews(event) {
    event.preventDefault();
    const newsText = document.getElementById('newsInput').value;

    try {
        await updateDoc(doc(db, "settings", "news"), {
            text: newsText,
            updatedAt: new Date().toISOString()
        });
        showNotification('Noticias actualizadas exitosamente', 'success');
    } catch (error) {
        console.error("Error updating news:", error);
        showNotification('Error al actualizar las noticias', 'error');
    }
}

// Reset form
function resetForm(formType) {
    if (formType === 'news') {
        document.getElementById('newsInput').value = '¡¡OBTÉN UN 30% DE DESCUENTO AL INSCRIBIRTE AHORA!! Válido hasta el 30 de noviembre.';
    }
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
