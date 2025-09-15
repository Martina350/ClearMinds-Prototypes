// EcoSolution App - JavaScript Principal
class EcoSolutionApp {
    constructor() {
        this.currentUser = null;
        this.currentView = 'services';
        this.currentService = null;
        this.bookingData = null;
        this.currentRescheduleBookingId = null;
        this.selectedServiceCountry = null;
        this.initialSelection = null;
        
        // Base de datos quemada
        this.database = {
            users: [
                {
                    id: 1,
                    role: 'client',
                    country: 'Ecuador',
                    lang: 'es-EC',
                    name: 'Juan Pérez',
                    email: 'juan@test.com',
                    phone: '+593987654321',
                    address: 'Av. Amazonas 123',
                    city: 'Quito',
                    state: 'Pichincha',
                    password: '12345',
                    createdAt: new Date('2024-01-15')
                },
                {
                    id: 2,
                    role: 'client',
                    country: 'USA',
                    lang: 'en-US',
                    name: 'John Smith',
                    email: 'john@test.com',
                    phone: '+1234567890',
                    address: '123 Main St',
                    city: 'New York',
                    state: 'NY',
                    password: '12345',
                    createdAt: new Date('2024-01-20')
                },
                {
                    id: 4,
                    role: 'client',
                    country: 'Canada',
                    lang: 'fr-CA',
                    name: 'Marie Dubois',
                    email: 'marie@test.com',
                    phone: '+14165551234',
                    address: '456 Queen St',
                    city: 'Toronto',
                    state: 'ON',
                    password: '12345',
                    createdAt: new Date('2024-01-25')
                },
                {
                    id: 5,
                    role: 'client',
                    country: 'Peru',
                    lang: 'es-PE',
                    name: 'Carlos Mendoza',
                    email: 'carlos@test.com',
                    phone: '+51987654321',
                    address: 'Av. Arequipa 789',
                    city: 'Lima',
                    state: 'Lima',
                    password: '12345',
                    createdAt: new Date('2024-01-30')
                },
                {
                    id: 3,
                    role: 'admin',
                    username: 'admin',
                    password: 'admin123',
                    name: 'Administrador',
                    email: 'admin@ecosolution.com',
                    lang: 'en-US'
                }
            ],
            services: [
                // ECUADOR
                {
                    id: 's1',
                    country: 'Ecuador',
                    name: 'Baños Portátiles',
                    description: 'Servicio de alquiler de baños portátiles para eventos y construcciones. Incluye limpieza y mantenimiento.',
                    price: 100,
                    duration: 60,
                    coverage: ['Pichincha', 'Guayas', 'Azuay'],
                    image: '🚽',
                    available: true
                },
                {
                    id: 's2',
                    country: 'Ecuador',
                    name: 'Pozos Sépticos',
                    description: 'Limpieza y mantenimiento de pozos sépticos residenciales y comerciales.',
                    price: 150,
                    duration: 90,
                    coverage: ['Pichincha', 'Guayas', 'Azuay', 'Manabí'],
                    image: '🏗️',
                    available: true
                },
                {
                    id: 's3',
                    country: 'Ecuador',
                    name: 'Trampas de Grasa',
                    description: 'Instalación y mantenimiento de trampas de grasa para restaurantes y cocinas industriales.',
                    price: 200,
                    duration: 120,
                    coverage: ['Pichincha', 'Guayas'],
                    image: '🛠️',
                    available: true
                },
                // USA
                {
                    id: 's4',
                    country: 'USA',
                    name: 'Limpieza de Basureros',
                    description: 'Servicio de limpieza y desinfección de contenedores de basura comerciales.',
                    price: 80,
                    duration: 45,
                    coverage: ['NY', 'CA', 'TX', 'FL'],
                    image: '🗑️',
                    available: true
                },
                {
                    id: 's5',
                    country: 'USA',
                    name: 'Recolección de Escombros',
                    description: 'Recolección y disposición de escombros de construcción y demolición.',
                    price: 300,
                    duration: 180,
                    coverage: ['NY', 'CA', 'TX', 'FL', 'IL'],
                    image: '🏗️',
                    available: true
                },
                {
                    id: 's6',
                    country: 'USA',
                    name: 'Baños Portátiles',
                    description: 'Alquiler de baños portátiles para eventos, construcciones y emergencias.',
                    price: 120,
                    duration: 60,
                    coverage: ['NY', 'CA', 'TX', 'FL', 'IL', 'WA'],
                    image: '🚽',
                    available: true
                },
                // PERÚ
                {
                    id: 's7',
                    country: 'Peru',
                    name: 'Baños Portátiles',
                    description: 'Servicio de alquiler de baños portátiles para eventos y construcciones.',
                    price: 80,
                    duration: 60,
                    coverage: ['Lima', 'Arequipa', 'Cusco', 'Trujillo'],
                    image: '🚽',
                    available: true
                },
                {
                    id: 's8',
                    country: 'Peru',
                    name: 'Pozos Sépticos',
                    description: 'Limpieza y mantenimiento de pozos sépticos residenciales y comerciales.',
                    price: 120,
                    duration: 90,
                    coverage: ['Lima', 'Arequipa', 'Cusco', 'Trujillo', 'Chiclayo'],
                    image: '🏗️',
                    available: true
                },
                {
                    id: 's9',
                    country: 'Peru',
                    name: 'Trampas de Grasa',
                    description: 'Instalación y mantenimiento de trampas de grasa para restaurantes y cocinas industriales.',
                    price: 180,
                    duration: 120,
                    coverage: ['Lima', 'Arequipa', 'Cusco'],
                    image: '🛠️',
                    available: true
                },
                // CANADÁ
                {
                    id: 's10',
                    country: 'Canada',
                    name: 'Limpieza de Basureros',
                    description: 'Servicio de limpieza y desinfección de contenedores de basura comerciales y residenciales.',
                    price: 90,
                    duration: 45,
                    coverage: ['ON', 'BC', 'AB', 'QC'],
                    image: '🗑️',
                    available: true
                },
                {
                    id: 's11',
                    country: 'Canada',
                    name: 'Recolección de Escombros',
                    description: 'Recolección y disposición de escombros de construcción y demolición.',
                    price: 250,
                    duration: 120,
                    coverage: ['ON', 'BC', 'AB', 'QC', 'MB'],
                    image: '🏗️',
                    available: true
                },
                {
                    id: 's12',
                    country: 'Canada',
                    name: 'Baños Portátiles',
                    description: 'Alquiler de baños portátiles para eventos, construcciones y emergencias.',
                    price: 110,
                    duration: 60,
                    coverage: ['ON', 'BC', 'AB', 'QC', 'MB', 'SK'],
                    image: '🚽',
                    available: true
                }
            ],
            bookings: [
                {
                    id: 'b1',
                    service_id: 's1',
                    user_id: 1,
                    client_type: 'casa',
                    date: '2024-12-20',
                    time: '09:00',
                    status: 'pendiente',
                    payment: {
                        method: 'transfer',
                        proof: 'comprobante_transferencia_001.jpg',
                        status: 'pending'
                    },
                    technician_id: null,
                    notes: '',
                    createdAt: new Date('2024-12-15')
                },
                {
                    id: 'b2',
                    service_id: 's4',
                    user_id: 2,
                    client_type: 'empresa',
                    date: '2024-12-18',
                    time: '14:00',
                    status: 'confirmado',
                    payment: {
                        method: 'card',
                        proof: null,
                        status: 'approved'
                    },
                    technician_id: 1,
                    notes: 'Edificio de oficinas - 3er piso',
                    createdAt: new Date('2024-12-10')
                },
                {
                    id: 'b3',
                    service_id: 's10',
                    user_id: 5,
                    client_type: 'casa',
                    date: '2024-12-22',
                    time: '10:00',
                    status: 'pendiente',
                    payment: {
                        method: 'transfer',
                        proof: 'comprobante_peru_002.png',
                        status: 'pending'
                    },
                    technician_id: null,
                    notes: 'Casa en Miraflores',
                    createdAt: new Date('2024-12-16')
                }
            ],
            staff: [
                {
                    id: 1,
                    name: 'Carlos Mendoza',
                    phone: '+593987654321',
                    email: 'carlos@ecosolution.com',
                    zone: 'Pichincha',
                    status: 'available',
                    specialties: ['Baños Portátiles', 'Pozos Sépticos']
                },
                {
                    id: 2,
                    name: 'Mike Johnson',
                    phone: '+1234567890',
                    email: 'mike@ecosolution.com',
                    zone: 'NY',
                    status: 'available',
                    specialties: ['Limpieza de Basureros', 'Recolección de Escombros']
                },
                {
                    id: 3,
                    name: 'Ana García',
                    phone: '+593987654322',
                    email: 'ana@ecosolution.com',
                    zone: 'Guayas',
                    status: 'busy',
                    specialties: ['Trampas de Grasa', 'Pozos Sépticos']
                },
                {
                    id: 4,
                    name: 'David Thompson',
                    phone: '+14165551235',
                    email: 'david@ecosolution.com',
                    zone: 'ON',
                    status: 'available',
                    specialties: ['Limpieza de Contenedores', 'Recolección de Residuos']
                },
                {
                    id: 5,
                    name: 'Roberto Silva',
                    phone: '+51987654322',
                    email: 'roberto@ecosolution.com',
                    zone: 'Lima',
                    status: 'available',
                    specialties: ['Baños Portátiles', 'Limpieza de Pozos Sépticos']
                }
            ],
            zones: [
                { country: 'Ecuador', province: 'Pichincha', enabled: true },
                { country: 'Ecuador', province: 'Guayas', enabled: true },
                { country: 'Ecuador', province: 'Azuay', enabled: true },
                { country: 'Ecuador', province: 'Manabí', enabled: false },
                { country: 'Ecuador', province: 'Loja', enabled: false },
                { country: 'USA', state: 'NY', enabled: true },
                { country: 'USA', state: 'CA', enabled: true },
                { country: 'USA', state: 'TX', enabled: true },
                { country: 'USA', state: 'FL', enabled: true },
                { country: 'USA', state: 'IL', enabled: false },
                { country: 'USA', state: 'WA', enabled: true },
                { country: 'Canada', province: 'ON', enabled: true },
                { country: 'Canada', province: 'BC', enabled: true },
                { country: 'Canada', province: 'AB', enabled: true },
                { country: 'Canada', province: 'QC', enabled: true },
                { country: 'Canada', province: 'MB', enabled: false },
                { country: 'Canada', province: 'SK', enabled: false },
                { country: 'Peru', province: 'Lima', enabled: true },
                { country: 'Peru', province: 'Arequipa', enabled: true },
                { country: 'Peru', province: 'Cusco', enabled: true },
                { country: 'Peru', province: 'Trujillo', enabled: false },
                { country: 'Peru', province: 'Chiclayo', enabled: false }
            ],
            prices: [
                { service_id: 's1', country: 'Ecuador', price: 100 },
                { service_id: 's2', country: 'Ecuador', price: 150 },
                { service_id: 's3', country: 'Ecuador', price: 200 },
                { service_id: 's4', country: 'USA', price: 80 },
                { service_id: 's5', country: 'USA', price: 300 },
                { service_id: 's6', country: 'USA', price: 120 },
                { service_id: 's7', country: 'Canada', price: 90 },
                { service_id: 's8', country: 'Canada', price: 250 },
                { service_id: 's9', country: 'Canada', price: 110 },
                { service_id: 's10', country: 'Peru', price: 80 },
                { service_id: 's11', country: 'Peru', price: 120 },
                { service_id: 's12', country: 'Peru', price: 180 }
            ]
        };
        
        this.init();
    }

    init() {
        this.hideLoadingScreen();
        this.setupEventListeners();
        this.updateNotificationCounts();
        this.setupMobileToggle();
        
        // Mostrar servicios públicamente al inicio
        this.showScreen('client');
        this.loadServices();
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
        }, 1500);
    }

    setupMobileToggle() {
        const mobileToggle = document.getElementById('mobileToggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                this.toggleMobileView();
            });
        }
    }

    toggleMobileView() {
        const appContainer = document.getElementById('app');
        const mobileToggle = document.getElementById('mobileToggle');
        
        if (appContainer && mobileToggle) {
            const isMobile = appContainer.classList.contains('mobile-view');
            
            if (isMobile) {
                // Switch to desktop view
                appContainer.classList.remove('mobile-view');
                mobileToggle.classList.remove('active');
                mobileToggle.innerHTML = '<i class="fas fa-mobile-alt"></i>';
            } else {
                // Switch to mobile view
                appContainer.classList.add('mobile-view');
                mobileToggle.classList.add('active');
                mobileToggle.innerHTML = '<i class="fas fa-desktop"></i>';
            }
        }
    }

    setupEventListeners() {
        // Auth forms
        document.getElementById('showRegister')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showAuthForm('register');
        });

        document.getElementById('showLogin')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showAuthForm('login');
        });

        document.getElementById('showAdminLogin')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showAuthForm('admin');
        });

        document.getElementById('backToClientLogin')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showAuthForm('login');
        });

        // Form submissions
        document.getElementById('loginFormElement')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('initialSelectionForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleInitialSelection();
        });

        document.getElementById('clientRegisterFormElement')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleClientRegister();
        });

        document.getElementById('companyRegisterFormElement')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCompanyRegister();
        });

        document.getElementById('adminLoginFormElement')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAdminLogin();
        });

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.switchView(view);
            });
        });

        document.querySelectorAll('.admin-nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.switchAdminView(view);
            });
        });


        // Status filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterMyServices(e.target.dataset.status);
            });
        });

        // Profile actions
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            this.logout();
        });

        document.getElementById('adminLogoutBtn')?.addEventListener('click', () => {
            this.logout();
        });

        // Profile language button
        document.getElementById('profileLangBtn')?.addEventListener('click', (e) => {
            try {
                const r = e.currentTarget.getBoundingClientRect();
                document.dispatchEvent(new CustomEvent('region:prompt', { detail: { anchorRect: { top: r.top, left: r.left, right: r.right, bottom: r.bottom } } }));
            } catch (_) {}
        });

        // Edit profile open/close
        document.getElementById('editProfileBtn')?.addEventListener('click', () => {
            this.openProfileEdit();
        });
        document.getElementById('closeProfileEditModal')?.addEventListener('click', () => {
            this.closeModal('profileEditModal');
        });

        document.getElementById('profileEditForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfileEdit();
        });

        // Language toggle buttons (cliente/admin)
        document.getElementById('langToggleBtn')?.addEventListener('click', (e) => {
            try {
                const r = e.currentTarget.getBoundingClientRect();
                document.dispatchEvent(new CustomEvent('region:prompt', { detail: { anchorRect: { top: r.top, left: r.left, right: r.right, bottom: r.bottom } } }));
            } catch (_) {}
        });
        document.getElementById('adminLangToggleBtn')?.addEventListener('click', (e) => {
            try {
                const r = e.currentTarget.getBoundingClientRect();
                document.dispatchEvent(new CustomEvent('region:prompt', { detail: { anchorRect: { top: r.top, left: r.left, right: r.right, bottom: r.bottom } } }));
            } catch (_) {}
        });

        // Modal controls
        document.getElementById('closeServiceModal')?.addEventListener('click', () => {
            this.closeModal('serviceDetailModal');
        });

        document.getElementById('closePaymentModal')?.addEventListener('click', () => {
            this.closeModal('paymentModal');
        });

        // Payment tabs
        document.querySelectorAll('.payment-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchPaymentMethod(e.target.dataset.method);
            });
        });

        // Form submissions
        document.getElementById('bookingForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleBooking();
        });

        document.getElementById('cardPaymentForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCardPayment();
        });

        document.getElementById('transferPaymentForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleTransferPayment();
        });



        // Reschedule modal
        document.getElementById('closeRescheduleModal')?.addEventListener('click', () => {
            this.closeModal('rescheduleModal');
        });

        document.getElementById('rescheduleForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleReschedule();
        });

        // Botones de volver en registro
        document.getElementById('backToInitialSelection')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showAuthForm('register');
        });

        document.getElementById('backToInitialSelectionCompany')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showAuthForm('register');
        });
    }

    showAuthForm(formType) {
        // Hide all forms
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
            form.style.display = 'none';
        });

        // Limpiar indicadores de preselección
        this.clearPreselectionIndicators();

        // Show selected form
        if (formType === 'login') {
            document.getElementById('loginForm').classList.add('active');
            document.getElementById('loginForm').style.display = 'block';
        } else if (formType === 'register') {
            document.getElementById('registerForm').classList.add('active');
            document.getElementById('registerForm').style.display = 'block';
        } else if (formType === 'admin') {
            document.getElementById('adminLoginForm').classList.add('active');
            document.getElementById('adminLoginForm').style.display = 'block';
        }
    }

    clearPreselectionIndicators() {
        const countrySelect = document.getElementById('registerCountry');
        if (countrySelect) {
            countrySelect.style.backgroundColor = '';
            countrySelect.style.borderColor = '';
        }
    }

    async handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const user = this.database.users.find(u => 
            u.email === email && u.password === password && u.role === 'client'
        );

        if (user) {
            // Establecer región al idioma del usuario de prueba
            try { window.Region?.setRegion(this.mapCountryCode(user.country), user.lang); } catch (_) {}
            this.currentUser = user;
            this.showScreen('client');
            this.loadUserData();
            
            // Mostrar botones de navegación después del login
            this.showNavigationButtons();
            
            this.loadServices(); // Cargar servicios filtrados por país y zona
            this.showToast('¡Bienvenido!', 'success');
        } else {
            this.showToast('Credenciales incorrectas', 'error');
        }
    }

    handleInitialSelection() {
        const userType = document.getElementById('registerUserType').value;
        const country = document.getElementById('registerCountry').value;

        // Validate required fields
        if (!userType || !country) {
            this.showToast('Por favor selecciona tipo de usuario y país', 'error');
            return;
        }

        // Guardar selección inicial
        this.initialSelection = { userType, country };

        // Mostrar formulario correspondiente
        if (userType === 'cliente') {
            this.showClientRegisterForm();
        } else if (userType === 'empresa') {
            this.showCompanyRegisterForm();
        }
    }

    showClientRegisterForm() {
        // Hide all forms
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
            form.style.display = 'none';
        });

        // Show client form
        document.getElementById('clientRegisterForm').classList.add('active');
        document.getElementById('clientRegisterForm').style.display = 'block';
    }

    showCompanyRegisterForm() {
        // Hide all forms
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
            form.style.display = 'none';
        });

        // Show company form
        document.getElementById('companyRegisterForm').classList.add('active');
        document.getElementById('companyRegisterForm').style.display = 'block';
    }

    async handleClientRegister() {
        const formData = {
            userType: 'cliente',
            country: this.initialSelection.country,
            name: document.getElementById('clientRegisterName').value,
            email: document.getElementById('clientRegisterEmail').value,
            phone: document.getElementById('clientRegisterPhone').value,
            address: document.getElementById('clientRegisterAddress').value,
            city: document.getElementById('clientRegisterCity').value,
            state: document.getElementById('clientRegisterState').value,
            password: document.getElementById('clientRegisterPassword').value
        };

        await this.processRegistration(formData);
    }

    async handleCompanyRegister() {
        const formData = {
            userType: 'empresa',
            country: this.initialSelection.country,
            name: document.getElementById('companyRegisterName').value,
            email: document.getElementById('companyRegisterEmail').value,
            phone: document.getElementById('companyRegisterPhone').value,
            companyType: document.getElementById('companyRegisterType').value,
            locationsCount: document.getElementById('companyRegisterLocationsCount').value,
            address: document.getElementById('companyRegisterAddress').value,
            city: document.getElementById('companyRegisterCity').value,
            state: document.getElementById('companyRegisterState').value,
            password: document.getElementById('companyRegisterPassword').value
        };

        // Validar campos específicos de empresa
        if (!formData.companyType || !formData.locationsCount) {
            this.showToast('Por favor completa todos los campos de empresa', 'error');
            return;
        }

        await this.processRegistration(formData);
    }

    async processRegistration(formData) {
        // Validate required fields
        if (!formData.name || !formData.email || !formData.password) {
            this.showToast('Por favor completa todos los campos requeridos', 'error');
            return;
        }

        // Check if user already exists
        const existingUser = this.database.users.find(u => u.email === formData.email);
        if (existingUser) {
            this.showToast('El correo electrónico ya está registrado', 'error');
            return;
        }

        // Mapear nombres de países a códigos consistentes
        const countryMapping = {
            'Ecuador': 'Ecuador',
            'Estados Unidos': 'USA',
            'USA': 'USA',
            'Canadá': 'Canada',
            'Canada': 'Canada',
            'Perú': 'Peru',
            'Peru': 'Peru'
        };

        // Verificar que el país mapeado esté en la base de datos
        const mappedCountry = countryMapping[formData.country] || formData.country;
        const availableCountries = [...new Set(this.database.services.map(s => s.country))];
        
        if (!availableCountries.includes(mappedCountry)) {
            this.showToast('Error: País no válido', 'error');
            return;
        }

        // Create new user
        const newUser = {
            id: this.database.users.length + 1,
            role: 'client',
            ...formData,
            country: mappedCountry,
            createdAt: new Date()
        };

        this.database.users.push(newUser);
        this.currentUser = newUser;
        this.showScreen('client');
        this.loadUserData();
        
        // Mostrar botones de navegación después del registro
        this.showNavigationButtons();
        
        // Limpiar indicadores de preselección
        this.clearPreselectionIndicators();
        
        // Si había un servicio seleccionado, mostrar solo los servicios de ese país
        if (this.selectedServiceCountry) {
            this.filterServicesByCountry(this.selectedServiceCountry);
            this.selectedServiceCountry = null; // Limpiar la selección
        } else {
            // Cargar servicios filtrados por país y zona
            this.loadServices();
        }
        
        // Asegurar que la vista esté activa
        setTimeout(() => {
            this.switchView('services');
        }, 100);
        
        // Forzar recarga de servicios después del registro
        setTimeout(() => {
            this.loadServices();
        }, 500);
        
        this.showToast('¡Registro exitoso!', 'success');
    }

    showNavigationButtons() {
        // Mostrar botones de navegación después del registro
        const myServicesNav = document.getElementById('myServicesNav');
        const profileNav = document.getElementById('profileNav');
        
        if (myServicesNav) {
            myServicesNav.style.display = 'block';
        }
        if (profileNav) {
            profileNav.style.display = 'block';
        }
    }

    hideNavigationButtons() {
        // Ocultar botones de navegación al cerrar sesión
        const myServicesNav = document.getElementById('myServicesNav');
        const profileNav = document.getElementById('profileNav');
        
        if (myServicesNav) {
            myServicesNav.style.display = 'none';
        }
        if (profileNav) {
            profileNav.style.display = 'none';
        }
    }

    async handleAdminLogin() {
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;

        const admin = this.database.users.find(u => 
            u.username === username && u.password === password && u.role === 'admin'
        );

        if (admin) {
            try { window.Region?.setRegion('US', admin.lang || 'en-US'); } catch (_) {}
            this.currentUser = admin;
            this.showScreen('admin');
            this.loadAdminData();
            this.showToast('¡Bienvenido Administrador!', 'success');
        } else {
            this.showToast('Credenciales de administrador incorrectas', 'error');
        }
    }

    showScreen(screenType) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        if (screenType === 'client') {
            document.getElementById('clientScreen').classList.add('active');
        } else if (screenType === 'admin') {
            document.getElementById('adminScreen').classList.add('active');
        } else {
            document.getElementById('authScreen').classList.add('active');
        }
    }


    switchView(viewName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(`${viewName}View`).classList.add('active');

        this.currentView = viewName;

        // Load specific data
        if (viewName === 'services') {
            this.loadServices(); // Cargar servicios filtrados automáticamente
        } else if (viewName === 'myServices') {
            this.loadMyServices();
        } else if (viewName === 'profile') {
            this.loadProfile();
        }
    }

    switchAdminView(viewName) {
        // Update navigation
        document.querySelectorAll('.admin-nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.admin-view').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(`admin${viewName.charAt(0).toUpperCase() + viewName.slice(1)}View`).classList.add('active');

        // Load specific data
        if (viewName === 'dashboard') {
            this.loadAdminDashboard();
        } else if (viewName === 'services') {
            this.loadAdminServices();
        } else if (viewName === 'payments') {
            this.loadAdminPayments();
        } else if (viewName === 'calendar') {
            this.loadAdminCalendar();
        } else if (viewName === 'zones') {
            this.loadAdminZones();
        } else if (viewName === 'staff') {
            this.loadAdminStaff();
        } else if (viewName === 'prices') {
            this.loadAdminPrices();
        }
    }

    loadUserData() {
        if (this.currentUser) {
            document.getElementById('userName').textContent = this.currentUser.name;
            document.getElementById('userEmail').textContent = this.currentUser.email;
        }
    }

    loadServices() {
        const servicesList = document.getElementById('servicesList');
        if (!servicesList) return;

        // Si no hay usuario logueado, mostrar todos los servicios con banderas
        if (!this.currentUser) {
            this.loadPublicServices();
            return;
        }

        const country = this.currentUser?.country || 'Ecuador';
        const userState = this.currentUser?.state;
        
        // Filtrar servicios por país y disponibilidad en la zona del usuario
        const userServices = this.database.services.filter(service => {
            if (service.country !== country || !service.available) {
                return false;
            }
            
            // Si no hay estado específico del usuario o el estado es inválido, mostrar todos los servicios del país
            if (!userState || userState.length <= 1) {
                return true;
            }
            
            // Verificar si el servicio está disponible en la zona del usuario
            if (service.coverage) {
                const isInCoverage = service.coverage.includes(userState);
                return isInCoverage;
            }
            
            return true;
        });

        // Agrupar servicios del usuario por nombre
        const groupedUserServices = this.groupUserServicesByName(userServices);

        // Mostrar mensaje si no hay servicios disponibles
        if (groupedUserServices.length === 0) {
            servicesList.innerHTML = `
                <div class="no-services-message">
                    <div class="no-services-icon">🚫</div>
                    <h3>No hay servicios disponibles</h3>
                    <p>No hay servicios disponibles en tu zona actual. Próximamente expandiremos nuestra cobertura.</p>
                </div>
            `;
            return;
        }

        servicesList.innerHTML = groupedUserServices.map(service => `
            <div class="service-card" onclick="app.showServiceDetail('${service.id}')">
                <div class="service-image">
                    <img src="${this.getServiceImagePath(service)}" alt="${service.name}">
                </div>
                <div class="service-content">
                    <h3 class="service-name">${service.name}</h3>
                    <p class="service-description">${service.description}</p>
                    <div class="service-price">$${service.price}</div>
                    <div class="service-actions">
                        <button class="btn btn-primary btn-small">Solicitar Servicio</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    loadPublicServices() {
        const servicesList = document.getElementById('servicesList');
        if (!servicesList) return;

        // Agrupar servicios por nombre
        const groupedServices = this.groupServicesByName();

        if (groupedServices.length === 0) {
            servicesList.innerHTML = `
                <div class="no-services-message">
                    <div class="no-services-icon">🚫</div>
                    <h3>No hay servicios disponibles</h3>
                    <p>Próximamente tendremos servicios disponibles.</p>
                </div>
            `;
            return;
        }

        servicesList.innerHTML = groupedServices.map(service => `
            <div class="service-card" onclick="app.showServiceDetail('${service.id}')">
                <div class="service-image">
                    <img src="${this.getServiceImagePath(service)}" alt="${service.name}">
                </div>
                <div class="service-content">
                    <h3 class="service-name">${service.name}</h3>
                    <p class="service-description">${service.description}</p>
                    <div class="service-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${service.countries.join(', ')}</span>
                    </div>
                    <div class="service-price">Desde $${service.minPrice}</div>
                    <div class="service-actions">
                        <button class="btn btn-primary btn-small">Solicitar Servicio</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    groupServicesByName() {
        const services = this.database.services.filter(service => service.available);
        const grouped = {};

        // Función para normalizar nombres de servicios (agrupar variaciones similares)
        const normalizeServiceName = (name) => {
            return name.toLowerCase()
                .replace(/de|del|la|el|los|las/g, '')
                .replace(/\s+/g, ' ')
                .trim();
        };

        // Agrupar servicios por nombre normalizado
        services.forEach(service => {
            const normalizedName = normalizeServiceName(service.name);
            
            if (!grouped[normalizedName]) {
                grouped[normalizedName] = {
                    id: service.id, // Usar el primer ID encontrado
                    name: service.name, // Usar el nombre original del primer servicio
                    description: service.description,
                    countries: [],
                    prices: [],
                    minPrice: service.price,
                    maxPrice: service.price,
                    originalServices: []
                };
            }
            
            // Evitar duplicados de países
            if (!grouped[normalizedName].countries.includes(service.country)) {
                grouped[normalizedName].countries.push(service.country);
                grouped[normalizedName].prices.push(service.price);
                grouped[normalizedName].minPrice = Math.min(grouped[normalizedName].minPrice, service.price);
                grouped[normalizedName].maxPrice = Math.max(grouped[normalizedName].maxPrice, service.price);
            }
            
            grouped[normalizedName].originalServices.push(service);
        });

        // Convertir a array y ordenar por nombre
        return Object.values(grouped).sort((a, b) => a.name.localeCompare(b.name));
    }

    groupUserServicesByName(userServices) {
        const grouped = {};

        // Función para normalizar nombres de servicios (agrupar variaciones similares)
        const normalizeServiceName = (name) => {
            return name.toLowerCase()
                .replace(/de|del|la|el|los|las/g, '')
                .replace(/\s+/g, ' ')
                .trim();
        };

        // Agrupar servicios del usuario por nombre normalizado
        userServices.forEach(service => {
            const normalizedName = normalizeServiceName(service.name);
            
            if (!grouped[normalizedName]) {
                grouped[normalizedName] = {
                    id: service.id, // Usar el primer ID encontrado
                    name: service.name, // Usar el nombre original del primer servicio
                    description: service.description,
                    price: service.price,
                    duration: service.duration,
                    originalServices: []
                };
            }
            
            grouped[normalizedName].originalServices.push(service);
        });

        // Convertir a array y ordenar por nombre
        return Object.values(grouped).sort((a, b) => a.name.localeCompare(b.name));
    }

    getCountryFlag(country) {
        const flags = {
            'Ecuador': '🇪🇨',
            'USA': '🇺🇸',
            'Canada': '🇨🇦',
            'Peru': '🇵🇪'
        };
        return flags[country] || '🌍';
    }

    getPaymentDisplayText(payment) {
        if (payment.method === 'transfer') {
            return 'Transferencia';
        } else if (payment.method === 'card') {
            if (payment.cardType === 'debit') {
                return 'Tarjeta Débito';
            } else if (payment.cardType === 'credit') {
                return 'Tarjeta Crédito';
            } else {
                return 'Tarjeta';
            }
        }
        return 'Pago';
    }

    filterServicesByCountry(country) {
        const servicesList = document.getElementById('servicesList');
        if (!servicesList) return;

        // Filtrar servicios por país específico
        const services = this.database.services.filter(service => 
            service.country === country && service.available
        );

        // Mostrar mensaje si no hay servicios disponibles
        if (services.length === 0) {
            servicesList.innerHTML = `
                <div class="no-services-message">
                    <div class="no-services-icon">🚫</div>
                    <h3>No hay servicios disponibles</h3>
                    <p>No hay servicios disponibles en ${country}. Próximamente expandiremos nuestra cobertura.</p>
                </div>
            `;
            return;
        }

        servicesList.innerHTML = services.map(service => `
            <div class="service-card" onclick="app.showServiceDetail('${service.id}')">
                <div class="service-image">
                    <img src="${this.getServiceImagePath(service)}" alt="${service.name}">
                </div>
                <div class="service-content">
                    <h3 class="service-name">${service.name}</h3>
                    <p class="service-description">${service.description}</p>
                    <div class="service-price">$${service.price}</div>
                    <div class="service-actions">
                        <button class="btn btn-primary btn-small">Solicitar Servicio</button>
                    </div>
                </div>
            </div>
        `).join('');
    }


    showServiceDetail(serviceId) {
        const service = this.database.services.find(s => s.id === serviceId);
        if (!service) return;

        // Si no hay usuario logueado, redirigir al registro
        if (!this.currentUser) {
        this.currentService = service;
            this.selectedServiceCountry = service.country;
            this.showScreen('auth');
            this.showAuthForm('register');
            
            // Preseleccionar el país del servicio en el formulario de registro
            setTimeout(() => {
                const countrySelect = document.getElementById('registerCountry');
                if (countrySelect) {
                    // Mapear el país del servicio al valor del select
                    const countryMapping = {
                        'Ecuador': 'Ecuador',
                        'USA': 'USA',
                        'Canada': 'Canada',
                        'Peru': 'Peru'
                    };
                    const selectValue = countryMapping[service.country] || service.country;
                    countrySelect.value = selectValue;
                    
                    // Agregar indicador visual sutil de preselección
                    countrySelect.style.backgroundColor = '#e8f5e8';
                    countrySelect.style.borderColor = '#4CAF50';
                }
            }, 100);
            
            this.showToast('Por favor regístrate para solicitar este servicio', 'info');
            return;
        }

        // Si el usuario está logueado, verificar si el servicio está disponible en su país
        const userCountry = this.currentUser.country;
        
        // Buscar servicios similares por nombre normalizado
        const normalizeServiceName = (name) => {
            return name.toLowerCase()
                .replace(/de|del|la|el|los|las/g, '')
                .replace(/\s+/g, ' ')
                .trim();
        };
        
        const normalizedServiceName = normalizeServiceName(service.name);
        const availableServices = this.database.services.filter(s => 
            normalizeServiceName(s.name) === normalizedServiceName && 
            s.country === userCountry && 
            s.available
        );

        if (availableServices.length === 0) {
            this.showToast('Este servicio no está disponible en tu país', 'error');
            return;
        }

        // Usar el servicio específico del país del usuario
        this.currentService = availableServices[0];

        // Update modal content
        document.getElementById('modalServiceName').textContent = this.currentService.name;
        document.getElementById('modalServiceDescription').textContent = this.currentService.description;
        document.getElementById('modalServicePrice').textContent = `$${this.currentService.price}`;

        const modalImg = document.getElementById('modalServiceImage');
        if (modalImg) {
            modalImg.src = this.getServiceImagePath(this.currentService);
            modalImg.alt = this.currentService.name;
        }

        // Actualizar duración basada en el tipo de usuario
        this.updateServiceDuration();

        // Poblar slots disponibles de fecha y hora en un único select
        this.populateAvailableDateTimes();

        // Show modal
        this.showModal('serviceDetailModal');
    }

    getServiceImagePath(service) {
        const name = (service?.name || '').toLowerCase();
        // Mapeo por tipo de servicio
        if (name.includes('baños')) {
            return 'images/baños_portatiles.jpg';
        }
        if (name.includes('pozos') || name.includes('séptico') || name.includes('septico')) {
            return 'images/pozo_septico.jpg';
        }
        if (name.includes('trampas') || name.includes('trampa')) {
            return 'images/trampas_grasas.jpg';
        }
        if (name.includes('basureros')) {
            // Si no existe una imagen específica de basureros, reutiliza contenedores
            return 'images/limpieza_contenedores.jpg';
        }
        if (name.includes('contenedores')) {
            return 'images/limpieza_contenedores.jpg';
        }
        if (name.includes('escombros')) {
            return 'images/recoleccion_escombros.jpg';
        }
        if (name.includes('residuos')) {
            return 'images/recoleccion_residuos.jpg';
        }
        // Fallback genérico
        return 'images/recoleccion_residuos.jpg';
    }

    populateAvailableDateTimes(daysAhead = 14) {
        const select = document.getElementById('bookingDateTime');
        if (!select || !this.currentService) return;

        const slots = this.generateAvailableSlots(this.currentService, daysAhead);
        if (slots.length === 0) {
            select.innerHTML = '<option value="" disabled>No hay horarios disponibles</option>';
            return;
        }

        select.innerHTML = '<option value="">Seleccionar fecha y hora</option>' +
            slots.map(({ date, time }) => {
                const label = `${this.formatDateDisplay(date)} - ${time}`;
                const value = `${date}|${time}`;
                return `<option value="${value}">${label}</option>`;
            }).join('');
    }

    generateAvailableSlots(service, daysAhead) {
        const slots = [];
        const now = new Date();

        for (let dayOffset = 0; dayOffset < daysAhead; dayOffset++) {
            const dateObj = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset);
            const dateStr = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`;

            const existingBookings = this.database.bookings.filter(booking =>
                booking.service_id === service.id &&
                booking.date === dateStr &&
                booking.status !== 'cancelado'
            );

            for (let hour = 9; hour <= 17; hour++) {
                const timeStr = `${hour.toString().padStart(2, '0')}:00`;
                // Evitar horas pasadas del día actual
                if (dayOffset === 0) {
                    const slotDateTime = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), hour, 0, 0);
                    if (slotDateTime <= now) continue;
                }
                const isBooked = existingBookings.some(b => b.time === timeStr);
                if (!isBooked) {
                    slots.push({ date: dateStr, time: timeStr });
                }
            }
        }

        return slots;
    }

    formatDateDisplay(isoDate) {
        const [y, m, d] = isoDate.split('-');
        return `${d}/${m}/${y}`;
    }

    updateServiceDuration() {
        const durationElement = document.getElementById('modalServiceDuration');
        
        if (this.currentService && durationElement && this.currentUser) {
            let duration = this.currentService.duration;
            const clientType = this.currentUser.userType === 'empresa' ? 'empresa' : 'casa';
            
            if (clientType === 'empresa') {
                duration = Math.round(duration * 1.5); // 50% more time for businesses
            }
            durationElement.textContent = `${duration} min`;
        }
    }

    handleBooking() {
        const combined = document.getElementById('bookingDateTime').value;
        const [date, time] = combined ? combined.split('|') : ['', ''];

        if (!date || !time) {
            this.showToast('Por favor selecciona fecha y hora', 'error');
            return;
        }

        // Usar el tipo de usuario del registro
        const clientType = this.currentUser.userType === 'empresa' ? 'empresa' : 'casa';

        this.bookingData = {
            clientType,
            date,
            time,
            service: this.currentService
        };

        this.closeModal('serviceDetailModal');
        this.showPaymentModal();
    }

    showPaymentModal() {
        if (!this.bookingData) return;

        // Update payment summary
        document.getElementById('paymentServiceName').textContent = this.bookingData.service.name;
        document.getElementById('paymentDate').textContent = this.bookingData.date;
        document.getElementById('paymentTime').textContent = this.bookingData.time;
        
        let total = this.bookingData.service.price;
        if (this.bookingData.clientType === 'empresa') {
            total = Math.round(total * 1.2); // 20% more for businesses
        }
        
        document.getElementById('paymentTotal').textContent = `$${total}`;
        document.getElementById('transferAmount').textContent = `$${total}`;

        // Configurar opciones de pago según el país
        this.configurePaymentOptionsByCountry();

        this.showModal('paymentModal');
    }

    configurePaymentOptionsByCountry() {
        const transferTab = document.getElementById('transferTab');
        const cardTab = document.querySelector('[data-method="card"]');
        
        // Obtener el país del usuario actual
        const userCountry = this.currentUser?.country;
        
        if (userCountry === 'USA' || userCountry === 'Canada') {
            // Para USA y Canadá: solo tarjeta (con opción débito/crédito)
            transferTab.style.display = 'none';
            cardTab.style.display = 'block';
            
            // Activar la pestaña de tarjeta por defecto
            this.switchPaymentMethod('card');
        } else {
            // Para Ecuador y Perú: tarjeta + transferencia
            transferTab.style.display = 'block';
            cardTab.style.display = 'block';
            
            // Activar la pestaña de tarjeta por defecto
            this.switchPaymentMethod('card');
        }
    }

    switchPaymentMethod(method) {
        // Update tabs
        document.querySelectorAll('.payment-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-method="${method}"]`).classList.add('active');

        // Update forms
        document.querySelectorAll('.payment-form').forEach(form => {
            form.classList.remove('active');
        });
        
        if (method === 'card') {
            document.getElementById('cardPayment').classList.add('active');
        } else if (method === 'transfer') {
            document.getElementById('transferPayment').classList.add('active');
        }
    }

    handleCardPayment() {
        const cardType = document.getElementById('cardType').value;
        const cardData = {
            number: document.getElementById('cardNumber').value,
            expiry: document.getElementById('cardExpiry').value,
            cvc: document.getElementById('cardCVC').value,
            holder: document.getElementById('cardHolder').value
        };

        // Simulate card validation
        if (cardData.number && cardData.expiry && cardData.cvc && cardData.holder) {
            this.processPayment(cardType, cardData);
        } else {
            this.showToast('Por favor completa todos los campos de la tarjeta', 'error');
        }
    }

    handleTransferPayment() {
        const proofFile = document.getElementById('transferProof').files[0];
        
        if (!proofFile) {
            this.showToast('Por favor sube el comprobante de transferencia', 'error');
            return;
        }

        this.processPayment('transfer', { proof: proofFile.name });
    }

    processPayment(method, data) {
        // Determinar el tipo de pago y estado según el método
        let paymentMethod, paymentStatus, bookingStatus;
        
        if (method === 'debit' || method === 'credit') {
            paymentMethod = 'card';
            paymentStatus = 'approved';
            bookingStatus = 'confirmado';
        } else if (method === 'transfer') {
            paymentMethod = 'transfer';
            paymentStatus = 'pending';
            bookingStatus = 'pendiente';
        }

        // Create booking
        const booking = {
            id: 'b' + (this.database.bookings.length + 1),
            service_id: this.bookingData.service.id,
            user_id: this.currentUser.id,
            client_type: this.bookingData.clientType,
            date: this.bookingData.date,
            time: this.bookingData.time,
            status: bookingStatus,
            payment: {
                method: paymentMethod,
                cardType: (method === 'debit' || method === 'credit') ? method : null,
                proof: data.proof || null,
                status: paymentStatus
            },
            technician_id: null,
            notes: '',
            createdAt: new Date()
        };

        this.database.bookings.push(booking);
        
        this.closeModal('paymentModal');
        // Crear objeto de pago temporal para obtener el texto de visualización
        const tempPayment = {
            method: (method === 'debit' || method === 'credit') ? 'card' : 'transfer',
            cardType: (method === 'debit' || method === 'credit') ? method : null
        };
        
        this.showToast(
            (method === 'debit' || method === 'credit')
                ? `¡Pago con ${this.getPaymentDisplayText(tempPayment)} procesado exitosamente! Servicio confirmado.` 
                : '¡Comprobante de transferencia enviado! Esperando validación del pago.',
            'success'
        );

        // Reset booking data
        this.bookingData = null;
        this.currentService = null;

        // Update views
        this.loadMyServices();
        this.updateNotificationCounts();
        
        // Limpiar cualquier estado inconsistente
        this.selectedServiceCountry = null;
        this.initialSelection = null;
        
        // Recargar servicios para asegurar que se muestren correctamente
        this.loadServices();
    }

    loadMyServices() {
        const myServicesList = document.getElementById('myServicesList');
        if (!myServicesList || !this.currentUser) return;

        const userBookings = this.database.bookings.filter(booking => 
            booking.user_id === this.currentUser.id
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        myServicesList.innerHTML = userBookings.map(booking => {
            const service = this.database.services.find(s => s.id === booking.service_id);
            if (!service) return '';

            return `
                <div class="booking-card">
                    <div class="booking-header">
                        <div class="booking-service">${service.name}</div>
                        <div class="booking-status ${booking.status}">${booking.status}</div>
                    </div>
                    <div class="booking-details">
                        <p><strong>Fecha:</strong> ${booking.date}</p>
                        <p><strong>Hora:</strong> ${booking.time}</p>
                        <p><strong>Tipo:</strong> ${booking.client_type === 'casa' ? 'Casa' : 'Empresa'}</p>
                        <p><strong>Pago:</strong> ${this.getPaymentDisplayText(booking.payment)} - ${booking.payment.status}</p>
                    </div>
                    <div class="booking-actions">
                        ${booking.status === 'pendiente' || booking.status === 'confirmado' ? `
                            <button class="btn btn-primary btn-small" onclick="app.showRescheduleModal('${booking.id}')">Reagendar</button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    filterMyServices(status) {
        const myServicesList = document.getElementById('myServicesList');
        if (!myServicesList || !this.currentUser) return;

        let userBookings = this.database.bookings.filter(booking => 
            booking.user_id === this.currentUser.id
        );

        if (status !== 'all') {
            userBookings = userBookings.filter(booking => booking.status === status);
        }

        userBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        myServicesList.innerHTML = userBookings.map(booking => {
            const service = this.database.services.find(s => s.id === booking.service_id);
            if (!service) return '';

            return `
                <div class="booking-card">
                    <div class="booking-header">
                        <div class="booking-service">${service.name}</div>
                        <div class="booking-status ${booking.status}">${booking.status}</div>
                    </div>
                    <div class="booking-details">
                        <p><strong>Fecha:</strong> ${booking.date}</p>
                        <p><strong>Hora:</strong> ${booking.time}</p>
                        <p><strong>Tipo:</strong> ${booking.client_type === 'casa' ? 'Casa' : 'Empresa'}</p>
                        <p><strong>Pago:</strong> ${this.getPaymentDisplayText(booking.payment)} - ${booking.payment.status}</p>
                    </div>
                    <div class="booking-actions">
                        ${booking.status === 'pendiente' || booking.status === 'confirmado' ? `
                            <button class="btn btn-primary btn-small" onclick="app.showRescheduleModal('${booking.id}')">Reagendar</button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    showRescheduleModal(bookingId) {
        const booking = this.database.bookings.find(b => b.id === bookingId);
        if (!booking) return;

        const service = this.database.services.find(s => s.id === booking.service_id);
        if (!service) return;

        // Guardar el ID del booking para el reagendamiento
        this.currentRescheduleBookingId = bookingId;

        // Actualizar información del modal
        document.getElementById('rescheduleServiceName').textContent = service.name;
        document.getElementById('rescheduleCurrentDate').textContent = this.formatDateDisplay(booking.date);
        document.getElementById('rescheduleCurrentTime').textContent = booking.time;

        // Poblar opciones de reagendamiento
        this.populateRescheduleOptions(service, booking);

        // Mostrar modal
        this.showModal('rescheduleModal');
    }

    populateRescheduleOptions(service, currentBooking) {
        const select = document.getElementById('rescheduleDateTime');
        if (!select) return;

        const slots = this.generateAvailableSlots(service, 14);
        
        // Filtrar el slot actual
        const availableSlots = slots.filter(slot => 
            !(slot.date === currentBooking.date && slot.time === currentBooking.time)
        );

        if (availableSlots.length === 0) {
            select.innerHTML = '<option value="" disabled>No hay horarios disponibles</option>';
            return;
        }

        select.innerHTML = '<option value="">Seleccionar nueva fecha y hora</option>' +
            availableSlots.map(({ date, time }) => {
                const label = `${this.formatDateDisplay(date)} - ${time}`;
                const value = `${date}|${time}`;
                return `<option value="${value}">${label}</option>`;
            }).join('');
    }

    handleReschedule() {
        const bookingId = this.currentRescheduleBookingId;
        const combined = document.getElementById('rescheduleDateTime').value;
        const [date, time] = combined ? combined.split('|') : ['', ''];

        if (!date || !time) {
            this.showToast('Por favor selecciona una nueva fecha y hora', 'error');
            return;
        }

        const booking = this.database.bookings.find(b => b.id === bookingId);
        if (booking) {
            booking.date = date;
            booking.time = time;
            booking.status = 'pendiente'; // Resetear a pendiente para nueva confirmación
            this.loadMyServices();
            this.closeModal('rescheduleModal');
            this.showToast('Servicio reagendado exitosamente', 'success');
        }
    }

    loadProfile() {
        // Profile is already loaded in loadUserData(); ensure buttons exist
    }

    openProfileEdit() {
        if (!this.currentUser) {
            this.showToast('Inicia sesión para editar tu perfil', 'warning');
            return;
        }
        // Prefill
        document.getElementById('editName').value = this.currentUser.name || '';
        document.getElementById('editEmail').value = this.currentUser.email || '';
        document.getElementById('editPhone').value = this.currentUser.phone || '';
        document.getElementById('editAddress').value = this.currentUser.address || '';
        document.getElementById('editCity').value = this.currentUser.city || '';
        document.getElementById('editState').value = this.currentUser.state || '';
        this.showModal('profileEditModal');
    }

    saveProfileEdit() {
        if (!this.currentUser) return;
        const name = document.getElementById('editName').value.trim();
        const email = document.getElementById('editEmail').value.trim();
        const phone = document.getElementById('editPhone').value.trim();
        const address = document.getElementById('editAddress').value.trim();
        const city = document.getElementById('editCity').value.trim();
        const state = document.getElementById('editState').value.trim();

        if (!name || !email) {
            this.showToast('Nombre y correo son obligatorios', 'error');
            return;
        }

        // Update user object in DB
        this.currentUser.name = name;
        this.currentUser.email = email;
        this.currentUser.phone = phone;
        this.currentUser.address = address;
        this.currentUser.city = city;
        this.currentUser.state = state;

        // Reflect on UI
        this.loadUserData();
        this.closeModal('profileEditModal');
        this.showToast('Perfil actualizado', 'success');
    }

    // Admin functions
    loadAdminData() {
        this.loadAdminDashboard();
    }

    loadAdminDashboard() {
        // Update stats
        const pendingServices = this.database.bookings.filter(b => b.status === 'pendiente').length;
        const pendingPayments = this.database.bookings.filter(b => b.payment.status === 'pending').length;
        const weeklyBookings = this.database.bookings.filter(b => {
            const bookingDate = new Date(b.date);
            const now = new Date();
            const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            return bookingDate >= now && bookingDate <= weekFromNow;
        }).length;
        const totalStaff = this.database.staff.length;

        document.getElementById('pendingServices').textContent = pendingServices;
        document.getElementById('pendingPayments').textContent = pendingPayments;
        document.getElementById('weeklyBookings').textContent = weeklyBookings;
        document.getElementById('totalStaff').textContent = totalStaff;

        // Load recent activity
        this.loadRecentActivity();
    }

    loadRecentActivity() {
        const recentActivity = document.getElementById('recentActivity');
        if (!recentActivity) return;

        const recentBookings = this.database.bookings
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        recentActivity.innerHTML = recentBookings.map(booking => {
            const service = this.database.services.find(s => s.id === booking.service_id);
            const user = this.database.users.find(u => u.id === booking.user_id);
            
            return `
                <div class="activity-item">
                    <div class="activity-icon" style="background: #4CAF50;">
                        <i class="fas fa-calendar-plus"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-text">
                            ${user?.name || 'Usuario'} solicitó ${service?.name || 'servicio'}
                        </div>
                        <div class="activity-time">
                            ${new Date(booking.createdAt).toLocaleString()}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    loadAdminServices() {
        const adminServicesList = document.getElementById('adminServicesList');
        if (!adminServicesList) return;

        const bookings = this.database.bookings
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        adminServicesList.innerHTML = bookings.map(booking => {
            const service = this.database.services.find(s => s.id === booking.service_id);
            const user = this.database.users.find(u => u.id === booking.user_id);
            
            return `
                <div class="admin-item">
                    <div class="admin-item-content">
                        <div class="admin-item-title">${service?.name || 'Servicio'}</div>
                        <div class="admin-item-subtitle">
                            Cliente: ${user?.name || 'N/A'} | 
                            Fecha: ${booking.date} ${booking.time} | 
                            Estado: ${booking.status}
                        </div>
                    </div>
                    <div class="admin-item-actions">
                        <button class="btn btn-primary btn-small" onclick="app.viewBookingDetails('${booking.id}')">
                            Ver Detalles
                        </button>
                        ${booking.status === 'pendiente' ? `
                            <button class="btn btn-secondary btn-small" onclick="app.approveBooking('${booking.id}')">
                                Aprobar
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    loadAdminPayments() {
        const adminPaymentsList = document.getElementById('adminPaymentsList');
        if (!adminPaymentsList) return;

        const pendingPayments = this.database.bookings.filter(b => b.payment.status === 'pending');

        adminPaymentsList.innerHTML = pendingPayments.map(booking => {
            const service = this.database.services.find(s => s.id === booking.service_id);
            const user = this.database.users.find(u => u.id === booking.user_id);
            
            return `
                <div class="admin-item">
                    <div class="admin-item-content">
                        <div class="admin-item-title">${user?.name || 'Usuario'}</div>
                        <div class="admin-item-subtitle">
                            ${service?.name || 'Servicio'} | 
                            ${booking.payment.method === 'transfer' ? 'Transferencia' : 'Tarjeta'} | 
                            ${booking.date}
                        </div>
                        ${booking.payment.method === 'transfer' && booking.payment.proof ? `
                            <div class="payment-proof-section">
                                <button class="btn btn-small btn-outline" onclick="app.viewPaymentProof('${booking.id}')">
                                    <i class="fas fa-eye"></i> Ver Comprobante
                                </button>
                            </div>
                        ` : ''}
                    </div>
                    <div class="admin-item-actions">
                        <button class="btn btn-circle btn-approve" onclick="app.approvePayment('${booking.id}')" title="Aprobar pago">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-circle btn-reject" onclick="app.rejectPayment('${booking.id}')" title="Rechazar pago">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    loadAdminCalendar() {
        const calendarContainer = document.getElementById('calendarContainer');
        if (!calendarContainer) return;

        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        calendarContainer.innerHTML = this.generateCalendar(currentYear, currentMonth);
    }

    generateCalendar(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];

        const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

        let calendarHTML = `
            <div class="calendar-header">
                <button class="calendar-nav" onclick="app.previousMonth()">‹</button>
                <h3>${monthNames[month]} ${year}</h3>
                <button class="calendar-nav" onclick="app.nextMonth()">›</button>
            </div>
            <div class="calendar-grid">
        `;

        // Add day headers
        dayNames.forEach(day => {
            calendarHTML += `<div class="calendar-day-header">${day}</div>`;
        });

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            calendarHTML += '<div class="calendar-day other-month"></div>';
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const hasBookings = this.database.bookings.some(booking => booking.date === dateStr);
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            
            let dayClass = 'calendar-day';
            if (isToday) dayClass += ' today';
            if (hasBookings) dayClass += ' has-bookings';

            calendarHTML += `<div class="${dayClass}" onclick="app.showDayBookings('${dateStr}')">${day}</div>`;
        }

        calendarHTML += '</div>';
        return calendarHTML;
    }

    loadAdminZones() {
        const zonesList = document.getElementById('zonesList');
        if (!zonesList) return;

        zonesList.innerHTML = this.database.zones.map(zone => `
            <div class="admin-item">
                <div class="admin-item-content">
                    <div class="admin-item-title">${zone.country}</div>
                    <div class="admin-item-subtitle">
                        ${zone.province || zone.state} - 
                        ${zone.enabled ? 'Habilitada' : 'Deshabilitada'}
                    </div>
                </div>
                <div class="admin-item-actions">
                    <button class="btn ${zone.enabled ? 'btn-secondary' : 'btn-primary'} btn-small" 
                            onclick="app.toggleZone('${zone.country}', '${zone.province || zone.state}')">
                        ${zone.enabled ? 'Deshabilitar' : 'Habilitar'}
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadAdminStaff() {
        const staffList = document.getElementById('staffList');
        if (!staffList) return;

        staffList.innerHTML = this.database.staff.map(staff => `
            <div class="admin-item">
                <div class="admin-item-content">
                    <div class="admin-item-title">${staff.name}</div>
                    <div class="admin-item-subtitle">
                        ${staff.zone} | 
                        ${staff.status === 'available' ? 'Disponible' : 'Ocupado'} | 
                        ${staff.specialties.join(', ')}
                    </div>
                </div>
                <div class="admin-item-actions">
                    <button class="btn ${staff.status === 'available' ? 'btn-secondary' : 'btn-primary'} btn-small" 
                            onclick="app.toggleStaffStatus(${staff.id})">
                        ${staff.status === 'available' ? 'Marcar Ocupado' : 'Marcar Disponible'}
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadAdminPrices() {
        const pricesList = document.getElementById('pricesList');
        if (!pricesList) return;

        pricesList.innerHTML = this.database.prices.map(price => {
            const service = this.database.services.find(s => s.id === price.service_id);
            return `
                <div class="admin-item">
                    <div class="admin-item-content">
                        <div class="admin-item-title">${service?.name || 'Servicio'}</div>
                        <div class="admin-item-subtitle">${price.country} - $${price.price}</div>
                    </div>
                    <div class="admin-item-actions">
                        <button class="btn btn-primary btn-small" onclick="app.editPrice('${price.service_id}', '${price.country}')">
                            Editar Precio
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Admin actions
    approveBooking(bookingId) {
        const booking = this.database.bookings.find(b => b.id === bookingId);
        if (booking) {
            booking.status = 'confirmado';
            this.loadAdminServices();
            this.loadAdminDashboard();
            this.showToast('Servicio aprobado', 'success');
        }
    }

    approvePayment(bookingId) {
        const booking = this.database.bookings.find(b => b.id === bookingId);
        if (booking) {
            booking.payment.status = 'approved';
            booking.status = 'confirmado';
            this.loadAdminPayments();
            this.loadAdminDashboard();
            this.showToast('Pago aprobado', 'success');
        }
    }

    rejectPayment(bookingId) {
        const booking = this.database.bookings.find(b => b.id === bookingId);
        if (booking) {
            booking.payment.status = 'rejected';
            booking.status = 'cancelado';
            this.loadAdminPayments();
            this.loadAdminDashboard();
            this.showToast('Pago rechazado', 'warning');
        }
    }

    viewPaymentProof(bookingId) {
        const booking = this.database.bookings.find(b => b.id === bookingId);
        if (!booking || !booking.payment.proof) return;

        const service = this.database.services.find(s => s.id === booking.service_id);
        const user = this.database.users.find(u => u.id === booking.user_id);

        // Crear modal para mostrar el comprobante
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.id = 'paymentProofModal';
        modal.innerHTML = `
            <div class="modal-content payment-proof-modal">
                <div class="modal-header">
                    <h3>Comprobante de Transferencia</h3>
                    <button class="close-btn" onclick="app.closePaymentProofModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="payment-proof-info">
                        <div class="proof-details">
                            <h4>Detalles del Pago</h4>
                            <div class="detail-row">
                                <span class="label">Cliente:</span>
                                <span class="value">${user?.name || 'N/A'}</span>
                            </div>
                            <div class="detail-row">
                                <span class="label">Servicio:</span>
                                <span class="value">${service?.name || 'N/A'}</span>
                            </div>
                            <div class="detail-row">
                                <span class="label">Fecha:</span>
                                <span class="value">${booking.date}</span>
                            </div>
                            <div class="detail-row">
                                <span class="label">Hora:</span>
                                <span class="value">${booking.time}</span>
                            </div>
                            <div class="detail-row">
                                <span class="label">Monto:</span>
                                <span class="value">$${service?.price || 0}</span>
                            </div>
                        </div>
                        <div class="proof-image-container">
                            <h4>Comprobante de Transferencia</h4>
                            <div class="proof-image">
                                <img src="data:image/svg+xml;base64,${this.generateProofImage(booking.payment.proof)}" 
                                     alt="Comprobante de transferencia" 
                                     onerror="this.src='data:image/svg+xml;base64,${this.generateDefaultProofImage()}'">
                            </div>
                            <p class="proof-note">Imagen del comprobante enviado por el cliente</p>
                        </div>
                    </div>
                    <div class="proof-actions">
                        <button class="btn btn-circle btn-approve" onclick="app.approvePayment('${bookingId}')" title="Aprobar pago">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-circle btn-reject" onclick="app.rejectPayment('${bookingId}')" title="Rechazar pago">
                            <i class="fas fa-times"></i>
                        </button>
                        <button class="btn btn-circle btn-close" onclick="app.closePaymentProofModal()" title="Cerrar">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    closePaymentProofModal() {
        const modal = document.getElementById('paymentProofModal');
        if (modal) {
            modal.remove();
        }
    }

    generateProofImage(proofName) {
        // Generar una imagen SVG simulada del comprobante
        const svg = `
            <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="300" fill="#f8f9fa" stroke="#dee2e6" stroke-width="2"/>
                <rect x="20" y="20" width="360" height="40" fill="#4CAF50" rx="5"/>
                <text x="200" y="45" text-anchor="middle" fill="white" font-family="Arial" font-size="16" font-weight="bold">COMPROBANTE DE TRANSFERENCIA</text>
                
                <text x="30" y="80" fill="#333" font-family="Arial" font-size="12">Banco:</text>
                <text x="100" y="80" fill="#666" font-family="Arial" font-size="12">Banco del Pichincha</text>
                
                <text x="30" y="100" fill="#333" font-family="Arial" font-size="12">Cuenta:</text>
                <text x="100" y="100" fill="#666" font-family="Arial" font-size="12">1234567890</text>
                
                <text x="30" y="120" fill="#333" font-family="Arial" font-size="12">Titular:</text>
                <text x="100" y="120" fill="#666" font-family="Arial" font-size="12">EcoSolution S.A.</text>
                
                <text x="30" y="140" fill="#333" font-family="Arial" font-size="12">Monto:</text>
                <text x="100" y="140" fill="#4CAF50" font-family="Arial" font-size="14" font-weight="bold">$100.00</text>
                
                <text x="30" y="160" fill="#333" font-family="Arial" font-size="12">Fecha:</text>
                <text x="100" y="160" fill="#666" font-family="Arial" font-size="12">${new Date().toLocaleDateString()}</text>
                
                <text x="30" y="180" fill="#333" font-family="Arial" font-size="12">Referencia:</text>
                <text x="100" y="180" fill="#666" font-family="Arial" font-size="12">TRF-${Math.random().toString(36).substr(2, 8).toUpperCase()}</text>
                
                <rect x="30" y="200" width="340" height="60" fill="#e9ecef" stroke="#ced4da" stroke-width="1" rx="3"/>
                <text x="200" y="220" text-anchor="middle" fill="#666" font-family="Arial" font-size="10">COMPROBANTE SIMULADO</text>
                <text x="200" y="235" text-anchor="middle" fill="#666" font-family="Arial" font-size="10">Archivo: ${proofName}</text>
                <text x="200" y="250" text-anchor="middle" fill="#666" font-family="Arial" font-size="10">En un sistema real, aquí se mostraría la imagen real</text>
            </svg>
        `;
        return btoa(svg);
    }

    generateDefaultProofImage() {
        // Imagen por defecto si no se puede cargar la imagen del comprobante
        const svg = `
            <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="300" fill="#f8f9fa" stroke="#dee2e6" stroke-width="2"/>
                <circle cx="200" cy="150" r="50" fill="#6c757d"/>
                <text x="200" y="160" text-anchor="middle" fill="white" font-family="Arial" font-size="24">📄</text>
                <text x="200" y="220" text-anchor="middle" fill="#666" font-family="Arial" font-size="14">Imagen no disponible</text>
                <text x="200" y="240" text-anchor="middle" fill="#666" font-family="Arial" font-size="12">El comprobante no se pudo cargar</text>
            </svg>
        `;
        return btoa(svg);
    }

    toggleZone(country, province) {
        const zone = this.database.zones.find(z => z.country === country && (z.province === province || z.state === province));
        if (zone) {
            zone.enabled = !zone.enabled;
            this.loadAdminZones();
            this.showToast(`Zona ${zone.enabled ? 'habilitada' : 'deshabilitada'}`, 'success');
        }
    }

    toggleStaffStatus(staffId) {
        const staff = this.database.staff.find(s => s.id === staffId);
        if (staff) {
            staff.status = staff.status === 'available' ? 'busy' : 'available';
            this.loadAdminStaff();
            this.showToast(`Personal ${staff.status === 'available' ? 'disponible' : 'ocupado'}`, 'success');
        }
    }

    editPrice(serviceId, country) {
        const newPrice = prompt(`Nuevo precio para ${country}:`);
        if (newPrice && !isNaN(newPrice)) {
            const price = this.database.prices.find(p => p.service_id === serviceId && p.country === country);
            if (price) {
                price.price = parseInt(newPrice);
                this.loadAdminPrices();
                this.showToast('Precio actualizado', 'success');
            }
        }
    }

    // Utility functions
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            modal.style.display = 'flex';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
        }
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        toastContainer.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    updateNotificationCounts() {
        const clientCount = this.database.bookings.filter(b => 
            b.user_id === this.currentUser?.id && b.status === 'pendiente'
        ).length;

        const adminCount = this.database.bookings.filter(b => 
            b.payment.status === 'pending'
        ).length;

        const clientBadge = document.getElementById('notificationCount');
        const adminBadge = document.getElementById('adminNotificationCount');

        if (clientBadge) clientBadge.textContent = clientCount;
        if (adminBadge) adminBadge.textContent = adminCount;
    }

    logout() {
        this.currentUser = null;
        this.currentService = null;
        this.bookingData = null;
        
        // Ocultar botones de navegación al cerrar sesión
        this.hideNavigationButtons();
        
        this.showScreen('auth');
        this.showAuthForm('login');
        this.showToast('Sesión cerrada', 'info');
    }

    // --- Región/Idioma helpers ---
    toggleLanguage() {
        try {
            const region = window.Region?.getRegion();
            if (!region) return;
            const { COUNTRY_LANGS } = window.Region;
            const langs = COUNTRY_LANGS[region.country] || ['en-US'];
            const idx = langs.indexOf(region.lang);
            const next = langs[(idx + 1) % langs.length];
            window.Region.setRegion(region.country, next);
        } catch (_) {}
    }

    mapCountryCode(countryName) {
        // Mapear nombres usados en base a los 4 códigos
        const map = { 'Ecuador': 'EC', 'USA': 'US', 'Canada': 'CA', 'Peru': 'PE' };
        return map[countryName] || 'US';
    }

    defaultLangForCountry(code) {
        if (code === 'EC') return 'es-EC';
        if (code === 'PE') return 'es-PE';
        if (code === 'CA') return 'en-CA';
        return 'en-US';
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new EcoSolutionApp();
});

// Global functions for onclick handlers
window.app = window.app || {};

// Additional utility functions
function previousMonth() {
    // Implementation for calendar navigation
}

function nextMonth() {
    // Implementation for calendar navigation
}

function showDayBookings(date) {
    // Implementation for showing day bookings
}
