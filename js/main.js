// Admin functionality for SkyLearn Academy

// Load admin courses list
function loadAdminCoursesList() {
    const adminCoursesList = document.getElementById('adminCoursesList');
    const courses = JSON.parse(localStorage.getItem('courses')) || getDefaultCourses();
    
    adminCoursesList.innerHTML = '';
    
    courses.forEach(course => {
        const adminItem = document.createElement('div');
        adminItem.className = 'admin-item';
        adminItem.innerHTML = `
            <div>
                <strong>${course.title}</strong>
                <div>Profesor: ${course.teacher} | Precio: ${course.price}</div>
            </div>
            <div class="admin-item-actions">
                <button class="btn-primary btn-small" onclick="editCourse(${course.id})">Editar</button>
                <button class="btn-danger btn-small" onclick="deleteCourse(${course.id})">Eliminar</button>
            </div>
        `;
        adminCoursesList.appendChild(adminItem);
    });
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
function addCourse(event) {
    event.preventDefault();
    
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    
    const newCourse = {
        id: Date.now(),
        title: document.getElementById('newCourseTitle').value,
        teacher: document.getElementById('newCourseTeacher').value,
        duration: document.getElementById('newCourseDuration').value,
        students: document.getElementById('newCourseStudents').value,
        price: document.getElementById('newCoursePrice').value,
        image: document.getElementById('newCourseImage').value,
        description: document.getElementById('newCourseDescription').value
    };
    
    courses.push(newCourse);
    localStorage.setItem('courses', JSON.stringify(courses));
    
    // Reload courses
    loadCourses();
    loadAdminCoursesList();
    
    // Hide form
    hideAddCourseForm();
    
    showNotification('Curso agregado exitosamente', 'success');
}

// Edit course
function editCourse(courseId) {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const course = courses.find(c => c.id === courseId);
    
    if (course) {
        // Fill form with course data
        document.getElementById('newCourseTitle').value = course.title;
        document.getElementById('newCourseTeacher').value = course.teacher;
        document.getElementById('newCourseDuration').value = course.duration;
        document.getElementById('newCourseStudents').value = course.students;
        document.getElementById('newCoursePrice').value = course.price;
        document.getElementById('newCourseImage').value = course.image;
        document.getElementById('newCourseDescription').value = course.description;
        
        // Show form
        showAddCourseForm();
        
        // Change form submit function
        const form = document.querySelector('#addCourseForm form');
        form.onsubmit = function(event) {
            event.preventDefault();
            
            // Update course
            course.title = document.getElementById('newCourseTitle').value;
            course.teacher = document.getElementById('newCourseTeacher').value;
            course.duration = document.getElementById('newCourseDuration').value;
            course.students = document.getElementById('newCourseStudents').value;
            course.price = document.getElementById('newCoursePrice').value;
            course.image = document.getElementById('newCourseImage').value;
            course.description = document.getElementById('newCourseDescription').value;
            
            localStorage.setItem('courses', JSON.stringify(courses));
            
            // Reload courses
            loadCourses();
            loadAdminCoursesList();
            
            // Hide form
            hideAddCourseForm();
            
            // Reset form submit function
            form.onsubmit = addCourse;
            
            showNotification('Curso actualizado exitosamente', 'success');
        };
    }
}

// Delete course
function deleteCourse(courseId) {
    if (confirm('¿Estás seguro de que quieres eliminar este curso?')) {
        const courses = JSON.parse(localStorage.getItem('courses')) || [];
        const filteredCourses = courses.filter(c => c.id !== courseId);
        
        localStorage.setItem('courses', JSON.stringify(filteredCourses));
        
        // Reload courses
        loadCourses();
        loadAdminCoursesList();
        
        showNotification('Curso eliminado exitosamente', 'success');
    }
}

// Load admin pricing list
function loadAdminPricingList() {
    const adminPricingList = document.getElementById('adminPricingList');
    const pricing = JSON.parse(localStorage.getItem('pricing')) || getDefaultPricing();
    
    adminPricingList.innerHTML = '';
    
    pricing.forEach(item => {
        const adminItem = document.createElement('div');
        adminItem.className = 'admin-item';
        adminItem.innerHTML = `
            <div>
                <strong>${item.course}</strong>
                <div>Precio: ${item.price} | Tipo: ${item.type}</div>
            </div>
            <div class="admin-item-actions">
                <button class="btn-primary btn-small" onclick="editPricing(${item.id})">Editar</button>
                <button class="btn-danger btn-small" onclick="deletePricing(${item.id})">Eliminar</button>
            </div>
        `;
        adminPricingList.appendChild(adminItem);
    });
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
function addPricing(event) {
    event.preventDefault();
    
    const pricing = JSON.parse(localStorage.getItem('pricing')) || [];
    
    const newPricing = {
        id: Date.now(),
        course: document.getElementById('pricingCourse').value,
        price: document.getElementById('pricingPrice').value,
        schedule: document.getElementById('pricingSchedule').value,
        duration: document.getElementById('pricingDuration').value,
        type: document.getElementById('pricingType').value
    };
    
    pricing.push(newPricing);
    localStorage.setItem('pricing', JSON.stringify(pricing));
    
    // Reload pricing
    loadPricing('monthly');
    loadAdminPricingList();
    
    // Hide form
    hideAddPricingForm();
    
    showNotification('Precio agregado exitosamente', 'success');
}

// Edit pricing
function editPricing(pricingId) {
    const pricing = JSON.parse(localStorage.getItem('pricing')) || [];
    const pricingItem = pricing.find(p => p.id === pricingId);
    
    if (pricingItem) {
        // Fill form with pricing data
        document.getElementById('pricingCourse').value = pricingItem.course;
        document.getElementById('pricingPrice').value = pricingItem.price;
        document.getElementById('pricingSchedule').value = pricingItem.schedule;
        document.getElementById('pricingDuration').value = pricingItem.duration;
        document.getElementById('pricingType').value = pricingItem.type;
        
        // Show form
        showAddPricingForm();
        
        // Change form submit function
        const form = document.querySelector('#addPricingForm form');
        form.onsubmit = function(event) {
            event.preventDefault();
            
            // Update pricing
            pricingItem.course = document.getElementById('pricingCourse').value;
            pricingItem.price = document.getElementById('pricingPrice').value;
            pricingItem.schedule = document.getElementById('pricingSchedule').value;
            pricingItem.duration = document.getElementById('pricingDuration').value;
            pricingItem.type = document.getElementById('pricingType').value;
            
            localStorage.setItem('pricing', JSON.stringify(pricing));
            
            // Reload pricing
            loadPricing('monthly');
            loadAdminPricingList();
            
            // Hide form
            hideAddPricingForm();
            
            // Reset form submit function
            form.onsubmit = addPricing;
            
            showNotification('Precio actualizado exitosamente', 'success');
        };
    }
}

// Delete pricing
function deletePricing(pricingId) {
    if (confirm('¿Estás seguro de que quieres eliminar este precio?')) {
        const pricing = JSON.parse(localStorage.getItem('pricing')) || [];
        const filteredPricing = pricing.filter(p => p.id !== pricingId);
        
        localStorage.setItem('pricing', JSON.stringify(filteredPricing));
        
        // Reload pricing
        loadPricing('monthly');
        loadAdminPricingList();
        
        showNotification('Precio eliminado exitosamente', 'success');
    }
}

// Load admin live classes list
function loadAdminLiveClassesList() {
    const adminLiveClassesList = document.getElementById('adminLiveClassesList');
    const liveClasses = JSON.parse(localStorage.getItem('liveClasses')) || getDefaultLiveClasses();
    
    adminLiveClassesList.innerHTML = '';
    
    liveClasses.forEach(liveClass => {
        const adminItem = document.createElement('div');
        adminItem.className = 'admin-item';
        adminItem.innerHTML = `
            <div>
                <strong>${liveClass.title}</strong>
                <div>Fecha: ${liveClass.date} ${liveClass.time} | Plataforma: ${liveClass.platform}</div>
            </div>
            <div class="admin-item-actions">
                <button class="btn-primary btn-small" onclick="editLiveClass(${liveClass.id})">Editar</button>
                <button class="btn-danger btn-small" onclick="deleteLiveClass(${liveClass.id})">Eliminar</button>
            </div>
        `;
        adminLiveClassesList.appendChild(adminItem);
    });
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
function addLiveClass(event) {
    event.preventDefault();
    
    const liveClasses = JSON.parse(localStorage.getItem('liveClasses')) || [];
    
    const newLiveClass = {
        id: Date.now(),
        title: document.getElementById('liveClassTitle').value,
        date: document.getElementById('liveClassDate').value,
        time: document.getElementById('liveClassTime').value,
        platform: document.getElementById('liveClassPlatform').value,
        url: document.getElementById('liveClassUrl').value
    };
    
    liveClasses.push(newLiveClass);
    localStorage.setItem('liveClasses', JSON.stringify(liveClasses));
    
    // Reload live classes
    loadLiveClasses();
    loadAdminLiveClassesList();
    
    // Hide form
    hideAddLiveClassForm();
    
    showNotification('Clase en vivo agregada exitosamente', 'success');
}

// Edit live class
function editLiveClass(liveClassId) {
    const liveClasses = JSON.parse(localStorage.getItem('liveClasses')) || [];
    const liveClass = liveClasses.find(l => l.id === liveClassId);
    
    if (liveClass) {
        // Fill form with live class data
        document.getElementById('liveClassTitle').value = liveClass.title;
        document.getElementById('liveClassDate').value = liveClass.date;
        document.getElementById('liveClassTime').value = liveClass.time;
        document.getElementById('liveClassPlatform').value = liveClass.platform;
        document.getElementById('liveClassUrl').value = liveClass.url;
        
        // Show form
        showAddLiveClassForm();
        
        // Change form submit function
        const form = document.querySelector('#addLiveClassForm form');
        form.onsubmit = function(event) {
            event.preventDefault();
            
            // Update live class
            liveClass.title = document.getElementById('liveClassTitle').value;
            liveClass.date = document.getElementById('liveClassDate').value;
            liveClass.time = document.getElementById('liveClassTime').value;
            liveClass.platform = document.getElementById('liveClassPlatform').value;
            liveClass.url = document.getElementById('liveClassUrl').value;
            
            localStorage.setItem('liveClasses', JSON.stringify(liveClasses));
            
            // Reload live classes
            loadLiveClasses();
            loadAdminLiveClassesList();
            
            // Hide form
            hideAddLiveClassForm();
            
            // Reset form submit function
            form.onsubmit = addLiveClass;
            
            showNotification('Clase en vivo actualizada exitosamente', 'success');
        };
    }
}

// Delete live class
function deleteLiveClass(liveClassId) {
    if (confirm('¿Estás seguro de que quieres eliminar esta clase en vivo?')) {
        const liveClasses = JSON.parse(localStorage.getItem('liveClasses')) || [];
        const filteredLiveClasses = liveClasses.filter(l => l.id !== liveClassId);
        
        localStorage.setItem('liveClasses', JSON.stringify(filteredLiveClasses));
        
        // Reload live classes
        loadLiveClasses();
        loadAdminLiveClassesList();
        
        showNotification('Clase en vivo eliminada exitosamente', 'success');
    }
}

// Load admin access classes list
function loadAdminAccessClassesList() {
    const adminAccessClassesList = document.getElementById('adminAccessClassesList');
    const accessClasses = JSON.parse(localStorage.getItem('accessClasses')) || getDefaultAccessClasses();
    
    adminAccessClassesList.innerHTML = '';
    
    accessClasses.forEach(accessClass => {
        const adminItem = document.createElement('div');
        adminItem.className = 'admin-item';
        adminItem.innerHTML = `
            <div>
                <strong>${accessClass.title}</strong>
                <div>Profesor: ${accessClass.teacher} | Plataforma: ${accessClass.platform}</div>
            </div>
            <div class="admin-item-actions">
                <button class="btn-primary btn-small" onclick="editAccessClass(${accessClass.id})">Editar</button>
                <button class="btn-danger btn-small" onclick="deleteAccessClass(${accessClass.id})">Eliminar</button>
            </div>
        `;
        adminAccessClassesList.appendChild(adminItem);
    });
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
function addAccessClass(event) {
    event.preventDefault();
    
    const accessClasses = JSON.parse(localStorage.getItem('accessClasses')) || [];
    
    const newAccessClass = {
        id: Date.now(),
        title: document.getElementById('accessClassTitle').value,
        platform: document.getElementById('accessClassPlatform').value,
        url: document.getElementById('accessClassUrl').value,
        teacher: document.getElementById('accessClassTeacher').value,
        schedule: document.getElementById('accessClassSchedule').value
    };
    
    accessClasses.push(newAccessClass);
    localStorage.setItem('accessClasses', JSON.stringify(accessClasses));
    
    // Reload access classes
    loadAccessClasses();
    loadAdminAccessClassesList();
    
    // Hide form
    hideAddAccessClassForm();
    
    showNotification('Acceso a clase agregado exitosamente', 'success');
}

// Edit access class
function editAccessClass(accessClassId) {
    const accessClasses = JSON.parse(localStorage.getItem('accessClasses')) || [];
    const accessClass = accessClasses.find(a => a.id === accessClassId);
    
    if (accessClass) {
        // Fill form with access class data
        document.getElementById('accessClassTitle').value = accessClass.title;
        document.getElementById('accessClassPlatform').value = accessClass.platform;
        document.getElementById('accessClassUrl').value = accessClass.url;
        document.getElementById('accessClassTeacher').value = accessClass.teacher;
        document.getElementById('accessClassSchedule').value = accessClass.schedule;
        
        // Show form
        showAddAccessClassForm();
        
        // Change form submit function
        const form = document.querySelector('#addAccessClassForm form');
        form.onsubmit = function(event) {
            event.preventDefault();
            
            // Update access class
            accessClass.title = document.getElementById('accessClassTitle').value;
            accessClass.platform = document.getElementById('accessClassPlatform').value;
            accessClass.url = document.getElementById('accessClassUrl').value;
            accessClass.teacher = document.getElementById('accessClassTeacher').value;
            accessClass.schedule = document.getElementById('accessClassSchedule').value;
            
            localStorage.setItem('accessClasses', JSON.stringify(accessClasses));
            
            // Reload access classes
            loadAccessClasses();
            loadAdminAccessClassesList();
            
            // Hide form
            hideAddAccessClassForm();
            
            // Reset form submit function
            form.onsubmit = addAccessClass;
            
            showNotification('Acceso a clase actualizado exitosamente', 'success');
        };
    }
}

// Delete access class
function deleteAccessClass(accessClassId) {
    if (confirm('¿Estás seguro de que quieres eliminar este acceso a clase?')) {
        const accessClasses = JSON.parse(localStorage.getItem('accessClasses')) || [];
        const filteredAccessClasses = accessClasses.filter(a => a.id !== accessClassId);
        
        localStorage.setItem('accessClasses', JSON.stringify(filteredAccessClasses));
        
        // Reload access classes
        loadAccessClasses();
        loadAdminAccessClassesList();
        
        showNotification('Acceso a clase eliminado exitosamente', 'success');
    }
}

// Load admin banners list
function loadAdminBannersList() {
    const adminBannersList = document.getElementById('adminBannersList');
    const banners = JSON.parse(localStorage.getItem('banners')) || getDefaultBanners();
    
    adminBannersList.innerHTML = '';
    
    banners.forEach(banner => {
        const adminItem = document.createElement('div');
        adminItem.className = 'admin-item';
        adminItem.innerHTML = `
            <div>
                <strong>${banner.title}</strong>
                <div>URL: ${banner.url}</div>
            </div>
            <div class="admin-item-actions">
                <button class="btn-primary btn-small" onclick="editBanner(${banner.id})">Editar</button>
                <button class="btn-danger btn-small" onclick="deleteBanner(${banner.id})">Eliminar</button>
            </div>
        `;
        adminBannersList.appendChild(adminItem);
    });
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
function addBanner(event) {
    event.preventDefault();
    
    const banners = JSON.parse(localStorage.getItem('banners')) || [];
    
    const newBanner = {
        id: Date.now(),
        title: document.getElementById('bannerTitle').value,
        url: document.getElementById('bannerUrl').value
    };
    
    banners.push(newBanner);
    localStorage.setItem('banners', JSON.stringify(banners));
    
    // Reload banners
    loadBanners();
    loadAdminBannersList();
    
    // Hide form
    hideAddBannerForm();
    
    showNotification('Banner agregado exitosamente', 'success');
}

// Edit banner
function editBanner(bannerId) {
    const banners = JSON.parse(localStorage.getItem('banners')) || [];
    const banner = banners.find(b => b.id === bannerId);
    
    if (banner) {
        // Fill form with banner data
        document.getElementById('bannerTitle').value = banner.title;
        document.getElementById('bannerUrl').value = banner.url;
        
        // Show form
        showAddBannerForm();
        
        // Change form submit function
        const form = document.querySelector('#addBannerForm form');
        form.onsubmit = function(event) {
            event.preventDefault();
            
            // Update banner
            banner.title = document.getElementById('bannerTitle').value;
            banner.url = document.getElementById('bannerUrl').value;
            
            localStorage.setItem('banners', JSON.stringify(banners));
            
            // Reload banners
            loadBanners();
            loadAdminBannersList();
            
            // Hide form
            hideAddBannerForm();
            
            // Reset form submit function
            form.onsubmit = addBanner;
            
            showNotification('Banner actualizado exitosamente', 'success');
        };
    }
}

// Delete banner
function deleteBanner(bannerId) {
    if (confirm('¿Estás seguro de que quieres eliminar este banner?')) {
        const banners = JSON.parse(localStorage.getItem('banners')) || [];
        const filteredBanners = banners.filter(b => b.id !== bannerId);
        
        localStorage.setItem('banners', JSON.stringify(filteredBanners));
        
        // Reload banners
        loadBanners();
        loadAdminBannersList();
        
        showNotification('Banner eliminado exitosamente', 'success');
    }
}

// Update home stats
function updateHomeStats() {
    const statsStudents = document.getElementById('statsStudents').value;
    const statsCourses = document.getElementById('statsCourses').value;
    const statsTeachers = document.getElementById('statsTeachers').value;
    const statsSatisfaction = document.getElementById('statsSatisfaction').value;
    
    // Update stat numbers
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers[0]) {
        statNumbers[0].setAttribute('data-target', statsStudents);
        statNumbers[0].textContent = '0';
        animateNumber(statNumbers[0], statsStudents);
    }
    
    if (statNumbers[1]) {
        statNumbers[1].setAttribute('data-target', statsCourses);
        statNumbers[1].textContent = '0';
        animateNumber(statNumbers[1], statsCourses);
    }
    
    if (statNumbers[2]) {
        statNumbers[2].setAttribute('data-target', statsTeachers);
        statNumbers[2].textContent = '0';
        animateNumber(statNumbers[2], statsTeachers);
    }
    
    if (statNumbers[3]) {
        statNumbers[3].setAttribute('data-target', statsSatisfaction);
        statNumbers[3].textContent = '0';
        animateNumber(statNumbers[3], statsSatisfaction);
    }
    
    showNotification('Estadísticas actualizadas exitosamente', 'success');
}

// Update news
function updateNews(event) {
    event.preventDefault();
    
    const newsText = document.getElementById('newsInput').value;
    
    // Update news text
    document.getElementById('newsText').textContent = newsText;
    
    showNotification('Noticias actualizadas exitosamente', 'success');
}

// Reset form
function resetForm(formType) {
    if (formType === 'news') {
        document.getElementById('newsInput').value = '¡¡OBTÉN UN 30% DE DESCUENTO AL INSCRIBIRTE AHORA!! Válido hasta el 30 de noviembre.';
    }
}
