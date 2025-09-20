// Función para cargar cursos en el panel de administración
function loadAdminCourses() {
    const adminCoursesList = document.getElementById('adminCoursesList');
    
    // Limpiar el contenedor
    adminCoursesList.innerHTML = '';
    
    // Cargar datos desde Firebase
    db.collection('courses').get().then((querySnapshot) => {
        const courses = [];
        querySnapshot.forEach((doc) => {
            courses.push({ id: doc.id, ...doc.data() });
        });
        
        // Si no hay cursos en Firebase, usar datos de ejemplo
        if (courses.length === 0) {
            courses.push(
                { id: 1, title: "Inglés Básico", teacher: "Prof. John Smith", duration: "8 semanas", students: "120", price: "$99" },
                { id: 2, title: "Inglés Intermedio", teacher: "Prof. Sarah Johnson", duration: "12 semanas", students: "85", price: "$149" },
                { id: 3, title: "Inglés Avanzado", teacher: "Prof. Michael Brown", duration: "16 semanas", students: "65", price: "$199" },
                { id: 4, title: "Preparación TOEFL", teacher: "Prof. Emily Davis", duration: "10 semanas", students: "45", price: "$179" }
            );
        }
        
        // Generar la lista de cursos
        courses.forEach(course => {
            const courseItem = document.createElement('div');
            courseItem.className = 'admin-item';
            courseItem.innerHTML = `
                <div>
                    <strong>${course.title}</strong> - ${course.teacher} - ${course.duration} - ${course.students} estudiantes - ${course.price}
                </div>
                <div class="admin-actions">
                    <button class="btn btn-secondary" onclick="editCourse('${course.id}')">Editar</button>
                    <button class="btn btn-danger" onclick="deleteCourse('${course.id}')">Eliminar</button>
                </div>
            `;
            adminCoursesList.appendChild(courseItem);
        });
    });
}

// Función para agregar curso desde el panel de administración
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
    
    // Crear objeto con los datos del curso
    const courseData = {
        title,
        teacher,
        duration,
        students,
        price,
        image,
        description
    };
    
    // Guardar en Firebase
    db.collection('courses').add(courseData)
        .then(() => {
            alert(`Curso "${title}" agregado correctamente.`);
            hideAddCourseForm();
            // Los cursos se recargarán automáticamente gracias al listener en tiempo real
        })
        .catch((error) => {
            console.error("Error al agregar curso: ", error);
            alert("Error al agregar el curso. Por favor, inténtalo de nuevo.");
        });
}

// Función para editar curso
function editCourse(id) {
    // Obtener datos actuales del curso
    db.collection('courses').doc(id).get().then((doc) => {
        if (doc.exists) {
            const course = doc.data();
            
            // Llenar el formulario con los datos actuales
            document.getElementById('editCourseId').value = id;
            document.getElementById('editCourseTitle').value = course.title;
            document.getElementById('editCourseTeacher').value = course.teacher;
            document.getElementById('editCourseDuration').value = course.duration;
            document.getElementById('editCourseStudents').value = course.students;
            document.getElementById('editCoursePrice').value = course.price;
            document.getElementById('editCourseImage').value = course.image;
            document.getElementById('editCourseDescription').value = course.description;
            
            // Mostrar el formulario de edición
            document.getElementById('editCourseForm').style.display = 'block';
        }
    });
}

// Función para guardar cambios de curso editado
function saveEditedCourse(event) {
    event.preventDefault();
    
    const id = document.getElementById('editCourseId').value;
    const title = document.getElementById('editCourseTitle').value;
    const teacher = document.getElementById('editCourseTeacher').value;
    const duration = document.getElementById('editCourseDuration').value;
    const students = document.getElementById('editCourseStudents').value;
    const price = document.getElementById('editCoursePrice').value;
    const image = document.getElementById('editCourseImage').value;
    const description = document.getElementById('editCourseDescription').value;
    
    // Crear objeto con los datos actualizados
    const updatedCourse = {
        title,
        teacher,
        duration,
        students,
        price,
        image,
        description
    };
    
    // Actualizar en Firebase
    db.collection('courses').doc(id).update(updatedCourse)
        .then(() => {
            alert(`Curso "${title}" actualizado correctamente.`);
            document.getElementById('editCourseForm').style.display = 'none';
            // Los cursos se recargarán automáticamente gracias al listener en tiempo real
        })
        .catch((error) => {
            console.error("Error al actualizar curso: ", error);
            alert("Error al actualizar el curso. Por favor, inténtalo de nuevo.");
        });
}

// Función para eliminar curso
function deleteCourse(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este curso?')) {
        db.collection('courses').doc(id).delete()
            .then(() => {
                alert('Curso eliminado correctamente.');
                // Los cursos se recargarán automáticamente gracias al listener en tiempo real
            })
            .catch((error) => {
                console.error("Error al eliminar curso: ", error);
                alert("Error al eliminar el curso. Por favor, inténtalo de nuevo.");
            });
    }
}

// Función para cargar precios en el panel de administración
function loadAdminPricing() {
    const adminPricingList = document.getElementById('adminPricingList');
    
    // Limpiar el contenedor
    adminPricingList.innerHTML = '';
    
    // Cargar datos desde Firebase
    db.collection('pricing').get().then((querySnapshot) => {
        const pricing = [];
        querySnapshot.forEach((doc) => {
            pricing.push({ id: doc.id, ...doc.data() });
        });
        
        // Si no hay precios en Firebase, usar datos de ejemplo
        if (pricing.length === 0) {
            pricing.push(
                { id: 1, course: "Inglés Básico", price: "$99", schedule: "Lunes y Miércoles 18:00-20:00", duration: "8 semanas", type: "monthly" },
                { id: 2, course: "Inglés Intermedio", price: "$149", schedule: "Martes y Jueves 18:00-20:00", duration: "12 semanas", type: "monthly" },
                { id: 3, course: "Inglés Avanzado", price: "$199", schedule: "Lunes y Miércoles 20:00-22:00", duration: "16 semanas", type: "monthly" },
                { id: 4, course: "Preparación TOEFL", price: "$179", schedule: "Sábados 10:00-13:00", duration: "10 semanas", type: "monthly" }
            );
        }
        
        // Generar la lista de precios
        pricing.forEach(item => {
            const pricingItem = document.createElement('div');
            pricingItem.className = 'admin-item';
            pricingItem.innerHTML = `
                <div>
                    <strong>${item.course}</strong> - ${item.price} - ${item.schedule} - ${item.duration} - ${item.type}
                </div>
                <div class="admin-actions">
                    <button class="btn btn-secondary" onclick="editPricing('${item.id}')">Editar</button>
                    <button class="btn btn-danger" onclick="deletePricing('${item.id}')">Eliminar</button>
                </div>
            `;
            adminPricingList.appendChild(pricingItem);
        });
    });
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
    
    // Crear objeto con los datos del precio
    const pricingData = {
        course,
        price,
        schedule,
        duration,
        type
    };
    
    // Guardar en Firebase
    db.collection('pricing').add(pricingData)
        .then(() => {
            alert(`Precio para "${course}" agregado correctamente.`);
            hideAddPricingForm();
            // Los precios se recargarán automáticamente gracias al listener en tiempo real
        })
        .catch((error) => {
            console.error("Error al agregar precio: ", error);
            alert("Error al agregar el precio. Por favor, inténtalo de nuevo.");
        });
}

// Función para editar precio
function editPricing(id) {
    // Obtener datos actuales del precio
    db.collection('pricing').doc(id).get().then((doc) => {
        if (doc.exists) {
            const pricing = doc.data();
            
            // Llenar el formulario con los datos actuales
            document.getElementById('editPricingId').value = id;
            document.getElementById('editPricingCourse').value = pricing.course;
            document.getElementById('editPricingPrice').value = pricing.price;
            document.getElementById('editPricingSchedule').value = pricing.schedule;
            document.getElementById('editPricingDuration').value = pricing.duration;
            document.getElementById('editPricingType').value = pricing.type;
            
            // Mostrar el formulario de edición
            document.getElementById('editPricingForm').style.display = 'block';
        }
    });
}

// Función para guardar cambios de precio editado
function saveEditedPricing(event) {
    event.preventDefault();
    
    const id = document.getElementById('editPricingId').value;
    const course = document.getElementById('editPricingCourse').value;
    const price = document.getElementById('editPricingPrice').value;
    const schedule = document.getElementById('editPricingSchedule').value;
    const duration = document.getElementById('editPricingDuration').value;
    const type = document.getElementById('editPricingType').value;
    
    // Crear objeto con los datos actualizados
    const updatedPricing = {
        course,
        price,
        schedule,
        duration,
        type
    };
    
    // Actualizar en Firebase
    db.collection('pricing').doc(id).update(updatedPricing)
        .then(() => {
            alert(`Precio para "${course}" actualizado correctamente.`);
            document.getElementById('editPricingForm').style.display = 'none';
            // Los precios se recargarán automáticamente gracias al listener en tiempo real
        })
        .catch((error) => {
            console.error("Error al actualizar precio: ", error);
            alert("Error al actualizar el precio. Por favor, inténtalo de nuevo.");
        });
}

// Función para eliminar precio
function deletePricing(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este precio?')) {
        db.collection('pricing').doc(id).delete()
            .then(() => {
                alert('Precio eliminado correctamente.');
                // Los precios se recargarán automáticamente gracias al listener en tiempo real
            })
            .catch((error) => {
                console.error("Error al eliminar precio: ", error);
                alert("Error al eliminar el precio. Por favor, inténtalo de nuevo.");
            });
    }
}

// Función para cargar clases en vivo en el panel de administración
function loadAdminLiveClasses() {
    const adminLiveClassesList = document.getElementById('adminLiveClassesList');
    
    // Limpiar el contenedor
    adminLiveClassesList.innerHTML = '';
    
    // Cargar datos desde Firebase
    db.collection('liveClasses').get().then((querySnapshot) => {
        const liveClasses = [];
        querySnapshot.forEach((doc) => {
            liveClasses.push({ id: doc.id, ...doc.data() });
        });
        
        // Si no hay clases en vivo en Firebase, usar datos de ejemplo
        if (liveClasses.length === 0) {
            liveClasses.push(
                { id: 1, title: "Conversación en Inglés", date: "2023-11-15", time: "18:00", platform: "YouTube" },
                { id: 2, title: "Gramática Avanzada", date: "2023-11-17", time: "19:30", platform: "Twitch" },
                { id: 3, title: "Pronunciación Perfecta", date: "2023-11-20", time: "17:00", platform: "YouTube" },
                { id: 4, title: "Vocabulario de Negocios", date: "2023-11-22", time: "20:00", platform: "Facebook" }
            );
        }
        
        // Generar la lista de clases en vivo
        liveClasses.forEach(classItem => {
            const classItemElement = document.createElement('div');
            classItemElement.className = 'admin-item';
            classItemElement.innerHTML = `
                <div>
                    <strong>${classItem.title}</strong> - ${formatDate(classItem.date)} - ${classItem.time} - ${classItem.platform}
                </div>
                <div class="admin-actions">
                    <button class="btn btn-secondary" onclick="editLiveClass('${classItem.id}')">Editar</button>
                    <button class="btn btn-danger" onclick="deleteLiveClass('${classItem.id}')">Eliminar</button>
                </div>
            `;
            adminLiveClassesList.appendChild(classItemElement);
        });
    });
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
    
    // Crear objeto con los datos de la clase en vivo
    const liveClassData = {
        title,
        date,
        time,
        platform,
        url
    };
    
    // Guardar en Firebase
    db.collection('liveClasses').add(liveClassData)
        .then(() => {
            alert(`Clase en vivo "${title}" agregada correctamente.`);
            hideAddLiveClassForm();
            // Las clases en vivo se recargarán automáticamente gracias al listener en tiempo real
        })
        .catch((error) => {
            console.error("Error al agregar clase en vivo: ", error);
            alert("Error al agregar la clase en vivo. Por favor, inténtalo de nuevo.");
        });
}

// Función para editar clase en vivo
function editLiveClass(id) {
    // Obtener datos actuales de la clase en vivo
    db.collection('liveClasses').doc(id).get().then((doc) => {
        if (doc.exists) {
            const liveClass = doc.data();
            
            // Llenar el formulario con los datos actuales
            document.getElementById('editLiveClassId').value = id;
            document.getElementById('editLiveClassTitle').value = liveClass.title;
            document.getElementById('editLiveClassDate').value = liveClass.date;
            document.getElementById('editLiveClassTime').value = liveClass.time;
            document.getElementById('editLiveClassPlatform').value = liveClass.platform;
            document.getElementById('editLiveClassUrl').value = liveClass.url;
            
            // Mostrar el formulario de edición
            document.getElementById('editLiveClassForm').style.display = 'block';
        }
    });
}

// Función para guardar cambios de clase en vivo editada
function saveEditedLiveClass(event) {
    event.preventDefault();
    
    const id = document.getElementById('editLiveClassId').value;
    const title = document.getElementById('editLiveClassTitle').value;
    const date = document.getElementById('editLiveClassDate').value;
    const time = document.getElementById('editLiveClassTime').value;
    const platform = document.getElementById('editLiveClassPlatform').value;
    const url = document.getElementById('editLiveClassUrl').value;
    
    // Crear objeto con los datos actualizados
    const updatedLiveClass = {
        title,
        date,
        time,
        platform,
        url
    };
    
    // Actualizar en Firebase
    db.collection('liveClasses').doc(id).update(updatedLiveClass)
        .then(() => {
            alert(`Clase en vivo "${title}" actualizada correctamente.`);
            document.getElementById('editLiveClassForm').style.display = 'none';
            // Las clases en vivo se recargarán automáticamente gracias al listener en tiempo real
        })
        .catch((error) => {
            console.error("Error al actualizar clase en vivo: ", error);
            alert("Error al actualizar la clase en vivo. Por favor, inténtalo de nuevo.");
        });
}

// Función para eliminar clase en vivo
function deleteLiveClass(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta clase en vivo?')) {
        db.collection('liveClasses').doc(id).delete()
            .then(() => {
                alert('Clase en vivo eliminada correctamente.');
                // Las clases en vivo se recargarán automáticamente gracias al listener en tiempo real
            })
            .catch((error) => {
                console.error("Error al eliminar clase en vivo: ", error);
                alert("Error al eliminar la clase en vivo. Por favor, inténtalo de nuevo.");
            });
    }
}

// Función para cargar acceso a clases en el panel de administración
function loadAdminAccessClasses() {
    const adminAccessClassesList = document.getElementById('adminAccessClassesList');
    
    // Limpiar el contenedor
    adminAccessClassesList.innerHTML = '';
    
    // Cargar datos desde Firebase
    db.collection('accessClasses').get().then((querySnapshot) => {
        const accessClasses = [];
        querySnapshot.forEach((doc) => {
            accessClasses.push({ id: doc.id, ...doc.data() });
        });
        
        // Si no hay acceso a clases en Firebase, usar datos de ejemplo
        if (accessClasses.length === 0) {
            accessClasses.push(
                { id: 1, title: "Inglés Básico - Grupo A", platform: "Zoom", teacher: "Prof. John Smith", schedule: "Lunes y Miércoles 18:00-20:00" },
                { id: 2, title: "Inglés Intermedio - Grupo B", platform: "Google Meet", teacher: "Prof. Sarah Johnson", schedule: "Martes y Jueves 18:00-20:00" },
                { id: 3, title: "Inglés Avanzado - Grupo A", platform: "Zoom", teacher: "Prof. Michael Brown", schedule: "Lunes y Miércoles 20:00-22:00" },
                { id: 4, title: "Preparación TOEFL - Grupo A", platform: "Google Meet", teacher: "Prof. Emily Davis", schedule: "Sábados 10:00-13:00" }
            );
        }
        
        // Generar la lista de acceso a clases
        accessClasses.forEach(classItem => {
            const classItemElement = document.createElement('div');
            classItemElement.className = 'admin-item';
            classItemElement.innerHTML = `
                <div>
                    <strong>${classItem.title}</strong> - ${classItem.platform} - ${classItem.teacher} - ${classItem.schedule}
                </div>
                <div class="admin-actions">
                    <button class="btn btn-secondary" onclick="editAccessClass('${classItem.id}')">Editar</button>
                    <button class="btn btn-danger" onclick="deleteAccessClass('${classItem.id}')">Eliminar</button>
                </div>
            `;
            adminAccessClassesList.appendChild(classItemElement);
        });
    });
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
    
    // Crear objeto con los datos del acceso a clase
    const accessClassData = {
        title,
        platform,
        url,
        teacher,
        schedule
    };
    
    // Guardar en Firebase
    db.collection('accessClasses').add(accessClassData)
        .then(() => {
            alert(`Acceso a clase "${title}" agregado correctamente.`);
            hideAddAccessClassForm();
            // Los accesos a clases se recargarán automáticamente gracias al listener en tiempo real
        })
        .catch((error) => {
            console.error("Error al agregar acceso a clase: ", error);
            alert("Error al agregar el acceso a clase. Por favor, inténtalo de nuevo.");
        });
}

// Función para editar acceso a clase
function editAccessClass(id) {
    // Obtener datos actuales del acceso a clase
    db.collection('accessClasses').doc(id).get().then((doc) => {
        if (doc.exists) {
            const accessClass = doc.data();
            
            // Llenar el formulario con los datos actuales
            document.getElementById('editAccessClassId').value = id;
            document.getElementById('editAccessClassTitle').value = accessClass.title;
            document.getElementById('editAccessClassPlatform').value = accessClass.platform;
            document.getElementById('editAccessClassUrl').value = accessClass.url;
            document.getElementById('editAccessClassTeacher').value = accessClass.teacher;
            document.getElementById('editAccessClassSchedule').value = accessClass.schedule;
            
            // Mostrar el formulario de edición
            document.getElementById('editAccessClassForm').style.display = 'block';
        }
    });
}

// Función para guardar cambios de acceso a clase editado
function saveEditedAccessClass(event) {
    event.preventDefault();
    
    const id = document.getElementById('editAccessClassId').value;
    const title = document.getElementById('editAccessClassTitle').value;
    const platform = document.getElementById('editAccessClassPlatform').value;
    const url = document.getElementById('editAccessClassUrl').value;
    const teacher = document.getElementById('editAccessClassTeacher').value;
    const schedule = document.getElementById('editAccessClassSchedule').value;
    
    // Crear objeto con los datos actualizados
    const updatedAccessClass = {
        title,
        platform,
        url,
        teacher,
        schedule
    };
    
    // Actualizar en Firebase
    db.collection('accessClasses').doc(id).update(updatedAccessClass)
        .then(() => {
            alert(`Acceso a clase "${title}" actualizado correctamente.`);
            document.getElementById('editAccessClassForm').style.display = 'none';
            // Los accesos a clases se recargarán automáticamente gracias al listener en tiempo real
        })
        .catch((error) => {
            console.error("Error al actualizar acceso a clase: ", error);
            alert("Error al actualizar el acceso a clase. Por favor, inténtalo de nuevo.");
        });
}

// Función para eliminar acceso a clase
function deleteAccessClass(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este acceso a clase?')) {
        db.collection('accessClasses').doc(id).delete()
            .then(() => {
                alert('Acceso a clase eliminado correctamente.');
                // Los accesos a clases se recargarán automáticamente gracias al listener en tiempo real
            })
            .catch((error) => {
                console.error("Error al eliminar acceso a clase: ", error);
                alert("Error al eliminar el acceso a clase. Por favor, inténtalo de nuevo.");
            });
    }
}

// Función para cargar banners en el panel de administración
function loadAdminBanners() {
    const adminBannersList = document.getElementById('adminBannersList');
    
    // Limpiar el contenedor
    adminBannersList.innerHTML = '';
    
    // Cargar datos desde Firebase
    db.collection('banners').get().then((querySnapshot) => {
        const banners = [];
        querySnapshot.forEach((doc) => {
            banners.push({ id: doc.id, ...doc.data() });
        });
        
        // Si no hay banners en Firebase, usar datos de ejemplo
        if (banners.length === 0) {
            banners.push(
                { id: 1, title: "Promoción de Verano", url: "https://example.com/banner1.jpg" },
                { id: 2, title: "Nuevo Curso de Negocios", url: "https://example.com/banner2.jpg" },
                { id: 3, title: "Clases Gratuitas", url: "https://example.com/banner3.jpg" }
            );
        }
        
        // Generar la lista de banners
        banners.forEach(banner => {
            const bannerItem = document.createElement('div');
            bannerItem.className = 'admin-item';
            bannerItem.innerHTML = `
                <div>
                    <strong>${banner.title}</strong> - ${banner.url}
                </div>
                <div class="admin-actions">
                    <button class="btn btn-secondary" onclick="editBanner('${banner.id}')">Editar</button>
                    <button class="btn btn-danger" onclick="deleteBanner('${banner.id}')">Eliminar</button>
                </div>
            `;
            adminBannersList.appendChild(bannerItem);
        });
    });
}

// Función para agregar banner
function addBanner(event) {
    event.preventDefault();
    
    // Obtener valores del formulario
    const title = document.getElementById('bannerTitle').value;
    const url = document.getElementById('bannerUrl').value;
    
    // Crear objeto con los datos del banner
    const bannerData = {
        title,
        url
    };
    
    // Guardar en Firebase
    db.collection('banners').add(bannerData)
        .then(() => {
            alert(`Banner "${title}" agregado correctamente.`);
            hideAddBannerForm();
            // Los banners se recargarán automáticamente gracias al listener en tiempo real
        })
        .catch((error) => {
            console.error("Error al agregar banner: ", error);
            alert("Error al agregar el banner. Por favor, inténtalo de nuevo.");
        });
}

// Función para editar banner
function editBanner(id) {
    // Obtener datos actuales del banner
    db.collection('banners').doc(id).get().then((doc) => {
        if (doc.exists) {
            const banner = doc.data();
            
            // Llenar el formulario con los datos actuales
            document.getElementById('editBannerId').value = id;
            document.getElementById('editBannerTitle').value = banner.title;
            document.getElementById('editBannerUrl').value = banner.url;
            
            // Mostrar el formulario de edición
            document.getElementById('editBannerForm').style.display = 'block';
        }
    });
}

// Función para guardar cambios de banner editado
function saveEditedBanner(event) {
    event.preventDefault();
    
    const id = document.getElementById('editBannerId').value;
    const title = document.getElementById('editBannerTitle').value;
    const url = document.getElementById('editBannerUrl').value;
    
    // Crear objeto con los datos actualizados
    const updatedBanner = {
        title,
        url
    };
    
    // Actualizar en Firebase
    db.collection('banners').doc(id).update(updatedBanner)
        .then(() => {
            alert(`Banner "${title}" actualizado correctamente.`);
            document.getElementById('editBannerForm').style.display = 'none';
            // Los banners se recargarán automáticamente gracias al listener en tiempo real
        })
        .catch((error) => {
            console.error("Error al actualizar banner: ", error);
            alert("Error al actualizar el banner. Por favor, inténtalo de nuevo.");
        });
}

// Función para eliminar banner
function deleteBanner(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este banner?')) {
        db.collection('banners').doc(id).delete()
            .then(() => {
                alert('Banner eliminado correctamente.');
                // Los banners se recargarán automáticamente gracias al listener en tiempo real
            })
            .catch((error) => {
                console.error("Error al eliminar banner: ", error);
                alert("Error al eliminar el banner. Por favor, inténtalo de nuevo.");
            });
    }
}

// Función para formatear fecha
function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
}
