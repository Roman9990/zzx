// ===== ФУТУРИСТИЧЕСКИЙ ADMIN SELECTOR =====
// Класс для управления всем приложением

class FuturisticAdminPanel {
  constructor() {
    this.selectedAdmin = null;
    this.currentTab = 'available';
    this.searchTerm = '';
    this.filteredAdmins = [];
    this.animationQueue = [];
    this.isLoading = true;
    this.magneticElements = [];

    // Данные приложения (по умолчанию, будут загружены с сервера)
    this.appData = {
      "admins": [
        {
          "id": "123456789",
          "tag": "мукра_адская",
          "role": "Владелица",
          "rating": 4.8,
          "status": "online",
          "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
          "dialogs_count": 15,
          "response_time": "2 мин",
          "specialization": "Общие вопросы"
        },
        {
          "id": "987654321", 
          "tag": "support_master",
          "role": "Техподдержка",
          "rating": 4.5,
          "status": "busy", 
          "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          "dialogs_count": 23,
          "response_time": "5 мин",
          "specialization": "Технические вопросы"
        },
        {
          "id": "555666777",
          "tag": "moderator_pro", 
          "role": "Модератор",
          "rating": 4.9,
          "status": "online",
          "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", 
          "dialogs_count": 8,
          "response_time": "1 мин",
          "specialization": "Модерация"
        },
        {
          "id": "444555666",
          "tag": "helper_girl",
          "role": "Помощник",
          "rating": 4.7,
          "status": "busy",
          "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
          "dialogs_count": 19,
          "response_time": "3 мин", 
          "specialization": "Новые пользователи"
        },
        {
          "id": "777888999",
          "tag": "expert_advisor",
          "role": "Эксперт",
          "rating": 5.0,
          "status": "online", 
          "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
          "dialogs_count": 30,
          "response_time": "1 мин",
          "specialization": "Сложные вопросы"
        }
      ],
      "unavailable_admins": [
        {
          "id": "111222333",
          "tag": "admin_cool", 
          "reason": "Оффлайн",
          "last_seen": "2 часа назад",
          "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        },
        {
          "id": "999000111",
          "tag": "night_admin",
          "reason": "В отпуске",
          "last_seen": "3 дня назад", 
          "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face"
        }
      ]
    };

    this.init();
  }

  // ===== ИНИЦИАЛИЗАЦИЯ =====
  async init() {
    console.log('🚀 Инициализация футуристической панели админов...');

    // Ждем загрузку DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupApp());
    } else {
      this.setupApp();
    }
  }

  async setupApp() {
    try {
      // Показываем загрузку на 3 секунды для эффекта
      setTimeout(() => {
        this.hideLoadingScreen();
      }, 3000);

      // Загружаем данные
      await this.loadData();

      // Настраиваем обработчики событий
      this.setupEventListeners();

      // Инициализируем интерфейс
      this.setupInterface();

      // Запускаем анимации
      this.startAnimations();

      console.log('✅ Приложение инициализировано успешно');

    } catch (error) {
      console.error('❌ Ошибка инициализации:', error);
      this.showError('Ошибка загрузки приложения');
    }
  }

  // ===== ЗАГРУЗКА ДАННЫХ =====
  async loadData() {
    try {
      // Попытка загрузить данные с сервера
      // В реальном приложении здесь будет API запрос
      // const response = await fetch('./data/admins.json');
      // this.appData = await response.json();

      console.log('📊 Данные загружены:', this.appData);
      this.filterAdmins();

    } catch (error) {
      console.warn('⚠️ Не удалось загрузить данные с сервера, используем данные по умолчанию');
    }
  }

  // ===== СКРЫТИЕ ЭКРАНА ЗАГРУЗКИ =====
  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const mainApp = document.getElementById('mainApp');

    if (loadingScreen && mainApp) {
      loadingScreen.style.animation = 'fadeOut 1s ease forwards';

      setTimeout(() => {
        loadingScreen.style.display = 'none';
        mainApp.style.display = 'block';
        mainApp.style.animation = 'fadeIn 1s ease forwards';
        this.isLoading = false;
      }, 1000);
    }
  }

  // ===== НАСТРОЙКА ОБРАБОТЧИКОВ СОБЫТИЙ =====
  setupEventListeners() {
    // Поиск
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
      searchInput.addEventListener('focus', () => this.addSearchFocus());
      searchInput.addEventListener('blur', () => this.removeSearchFocus());
    }

    // Переключение табов
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.getAttribute('data-tab');
        this.switchTab(tab);
      });
    });

    // Модальное окно
    const modal = document.getElementById('confirmModal');
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const confirmBtn = document.getElementById('confirmBtn');

    if (closeModal) closeModal.addEventListener('click', () => this.closeModal());
    if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeModal());
    if (confirmBtn) confirmBtn.addEventListener('click', () => this.confirmSelection());

    // Закрытие модального окна по клику на backdrop
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
          this.closeModal();
        }
      });
    }

    // Клавиши клавиатуры
    document.addEventListener('keydown', (e) => this.handleKeyPress(e));

    // Magnetic эффекты для карточек
    this.setupMagneticEffects();
  }

  // ===== НАСТРОЙКА ИНТЕРФЕЙСА =====
  setupInterface() {
    this.renderAdmins();
    this.updateBadges();
    this.setupParallax();
  }

  // ===== ОБРАБОТКА ПОИСКА =====
  handleSearch(query) {
    this.searchTerm = query.toLowerCase();
    this.filterAdmins();
    this.renderAdmins();

    // Анимация поиска
    this.animateSearch();
  }

  animateSearch() {
    const searchIcon = document.querySelector('.search-icon');
    if (searchIcon) {
      searchIcon.style.animation = 'none';
      setTimeout(() => {
        searchIcon.style.animation = 'breathe 2s infinite';
      }, 10);
    }
  }

  addSearchFocus() {
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
      searchContainer.classList.add('focused');
    }
  }

  removeSearchFocus() {
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
      searchContainer.classList.remove('focused');
    }
  }

  // ===== ФИЛЬТРАЦИЯ АДМИНОВ =====
  filterAdmins() {
    if (!this.searchTerm) {
      this.filteredAdmins = [...this.appData.admins];
    } else {
      this.filteredAdmins = this.appData.admins.filter(admin =>
        admin.tag.toLowerCase().includes(this.searchTerm) ||
        admin.role.toLowerCase().includes(this.searchTerm) ||
        admin.specialization.toLowerCase().includes(this.searchTerm)
      );
    }
  }

  // ===== ПЕРЕКЛЮЧЕНИЕ ТАБОВ =====
  switchTab(tabName) {
    if (this.currentTab === tabName) return;

    this.currentTab = tabName;

    // Обновляем активные классы
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-tab') === tabName) {
        btn.classList.add('active');
      }
    });

    // Переключаем контент с анимацией
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });

    setTimeout(() => {
      const activeContent = document.getElementById(tabName + 'Tab');
      if (activeContent) {
        activeContent.classList.add('active');
        this.renderAdmins();
      }
    }, 150);

    // Анимация переключения
    this.animateTabSwitch();
  }

  animateTabSwitch() {
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab) {
      activeTab.style.transform = 'translateY(-2px) scale(1.05)';
      setTimeout(() => {
        activeTab.style.transform = '';
      }, 200);
    }
  }

  // ===== ОТРИСОВКА АДМИНОВ =====
  renderAdmins() {
    if (this.currentTab === 'available') {
      this.renderAvailableAdmins();
    } else if (this.currentTab === 'unavailable') {
      this.renderUnavailableAdmins();
    }
  }

  renderAvailableAdmins() {
    const grid = document.getElementById('availableGrid');
    if (!grid) return;

    const adminsToShow = this.filteredAdmins;

    if (adminsToShow.length === 0) {
      grid.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">
            <i class="fas fa-search"></i>
          </div>
          <h3>Ничего не найдено</h3>
          <p>Попробуйте изменить параметры поиска</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = adminsToShow.map((admin, index) => 
      this.createAdminCard(admin, index)
    ).join('');

    // Добавляем обработчики событий для карточек
    this.addCardEventListeners();
  }

  renderUnavailableAdmins() {
    const grid = document.getElementById('unavailableGrid');
    if (!grid) return;

    const unavailableAdmins = this.appData.unavailable_admins || [];

    if (unavailableAdmins.length === 0) {
      grid.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">
            <i class="fas fa-smile"></i>
          </div>
          <h3>Все админы доступны!</h3>
          <p>Отличная новость - все администраторы готовы помочь</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = unavailableAdmins.map((admin, index) => 
      this.createUnavailableCard(admin, index)
    ).join('');
  }

  // ===== СОЗДАНИЕ КАРТОЧКИ АДМИНА =====
  createAdminCard(admin, index) {
    const statusClass = this.getStatusClass(admin.status);
    const statusText = this.getStatusText(admin.status);
    const stars = this.generateStars(admin.rating);

    return `
      <div class="admin-card" data-admin-id="${admin.id}" style="animation-delay: ${index * 0.1}s">
        <div class="admin-header">
          <div class="admin-avatar">
            <img src="${admin.avatar}" alt="${admin.tag}" loading="lazy">
          </div>
          <div class="admin-info">
            <h3>@${admin.tag}</h3>
            <div class="admin-role">${admin.role}</div>
          </div>
        </div>

        <div class="admin-details">
          <div class="admin-stat">
            <div class="stat-value">${admin.dialogs_count}</div>
            <div class="stat-label">Диалогов</div>
          </div>
          <div class="admin-stat">
            <div class="stat-value">${admin.response_time}</div>
            <div class="stat-label">Ответ</div>
          </div>
        </div>

        <div class="admin-rating">
          <div class="stars">${stars}</div>
          <span class="rating-value">${admin.rating}</span>
        </div>

        <div class="admin-status ${statusClass}">
          <div class="status-indicator"></div>
          <span>${statusText}</span>
        </div>

        <div class="admin-specialization">
          ${admin.specialization}
        </div>
      </div>
    `;
  }

  // ===== СОЗДАНИЕ КАРТОЧКИ НЕДОСТУПНОГО АДМИНА =====
  createUnavailableCard(admin, index) {
    return `
      <div class="admin-card unavailable-card" style="animation-delay: ${index * 0.1}s">
        <div class="admin-header">
          <div class="admin-avatar">
            <img src="${admin.avatar}" alt="${admin.tag}" loading="lazy">
          </div>
          <div class="admin-info">
            <h3>@${admin.tag}</h3>
            <div class="unavailable-reason">${admin.reason}</div>
          </div>
        </div>

        <div class="last-seen">
          Был в сети: ${admin.last_seen}
        </div>
      </div>
    `;
  }

  // ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
  getStatusClass(status) {
    const statusMap = {
      'online': 'status-online',
      'busy': 'status-busy', 
      'offline': 'status-offline'
    };
    return statusMap[status] || 'status-offline';
  }

  getStatusText(status) {
    const textMap = {
      'online': 'Онлайн',
      'busy': 'Занят',
      'offline': 'Оффлайн'
    };
    return textMap[status] || 'Недоступен';
  }

  generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';

    // Полные звезды
    for (let i = 0; i < fullStars; i++) {
      stars += '<i class="fas fa-star star"></i>';
    }

    // Половина звезды
    if (hasHalfStar) {
      stars += '<i class="fas fa-star-half-alt star"></i>';
    }

    // Пустые звезды
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars += '<i class="far fa-star star"></i>';
    }

    return stars;
  }

  // ===== ОБРАБОТЧИКИ КАРТОЧЕК =====
  addCardEventListeners() {
    document.querySelectorAll('.admin-card:not(.unavailable-card)').forEach(card => {
      card.addEventListener('click', () => {
        const adminId = card.getAttribute('data-admin-id');
        this.selectAdmin(adminId);
      });

      // Magnetic эффект
      this.addMagneticEffect(card);

      // Ripple эффект
      this.addRippleEffect(card);
    });
  }

  // ===== MAGNETIC ЭФФЕКТ =====
  addMagneticEffect(element) {
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const moveX = x * 0.1;
      const moveY = y * 0.1;

      element.style.transform = `translateX(${moveX}px) translateY(${moveY}px) translateZ(0)`;
    });

    element.addEventListener('mouseleave', () => {
      element.style.transform = '';
    });
  }

  // ===== RIPPLE ЭФФЕКТ =====
  addRippleEffect(element) {
    element.addEventListener('click', (e) => {
      const ripple = document.createElement('div');
      const rect = element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(0, 212, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        pointer-events: none;
      `;

      element.style.position = 'relative';
      element.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  }

  // ===== ВЫБОР АДМИНА =====
  selectAdmin(adminId) {
    const admin = this.appData.admins.find(a => a.id === adminId);
    if (!admin) {
      console.error('Админ не найден:', adminId);
      return;
    }

    this.selectedAdmin = admin;
    this.showConfirmModal();
  }

  // ===== МОДАЛЬНОЕ ОКНО =====
  showConfirmModal() {
    if (!this.selectedAdmin) return;

    const modal = document.getElementById('confirmModal');
    const modalAvatar = document.getElementById('modalAvatar');
    const modalTag = document.getElementById('modalTag');
    const modalRole = document.getElementById('modalRole');
    const modalRating = document.getElementById('modalRating');
    const modalSpec = document.getElementById('modalSpec');

    if (modal && modalAvatar && modalTag && modalRole && modalRating && modalSpec) {
      modalAvatar.src = this.selectedAdmin.avatar;
      modalTag.textContent = `@${this.selectedAdmin.tag}`;
      modalRole.textContent = this.selectedAdmin.role;
      modalRating.innerHTML = `${this.generateStars(this.selectedAdmin.rating)} ${this.selectedAdmin.rating}`;
      modalSpec.textContent = this.selectedAdmin.specialization;

      modal.classList.add('show');
      document.body.style.overflow = 'hidden';

      // Анимация появления
      this.animateModal();
    }
  }

  closeModal() {
    const modal = document.getElementById('confirmModal');
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
      this.selectedAdmin = null;
    }
  }

  animateModal() {
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
      modalContent.style.animation = 'modalSlide 0.4s ease forwards';
    }
  }

  // ===== ПОДТВЕРЖДЕНИЕ ВЫБОРА =====
  async confirmSelection() {
    if (!this.selectedAdmin) return;

    try {
      // Показываем loading на кнопке
      const confirmBtn = document.getElementById('confirmBtn');
      if (confirmBtn) {
        const originalText = confirmBtn.innerHTML;
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        confirmBtn.disabled = true;
      }

      // Отправляем данные в Telegram WebApp
      const result = await this.sendToTelegram({
        action: 'select_admin',
        admin_tag: this.selectedAdmin.tag,
        admin_data: this.selectedAdmin
      });

      if (result) {
        this.showSuccess('Запрос отправлен успешно!');
        this.closeModal();

        // Добавляем визуальный feedback
        this.addSelectionEffect();

      } else {
        throw new Error('Не удалось отправить запрос');
      }

    } catch (error) {
      console.error('Ошибка отправки:', error);
      this.showError('Ошибка отправки запроса');

      // Восстанавливаем кнопку
      const confirmBtn = document.getElementById('confirmBtn');
      if (confirmBtn) {
        confirmBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Отправить запрос';
        confirmBtn.disabled = false;
      }
    }
  }

  // ===== ОТПРАВКА В TELEGRAM =====
  async sendToTelegram(data) {
    try {
      // Проверяем доступность Telegram WebApp API
      if (window.Telegram && window.Telegram.WebApp) {
        // Отправляем данные через Telegram WebApp API
        window.Telegram.WebApp.sendData(JSON.stringify(data));
        return true;
      } else {
        console.warn('Telegram WebApp API недоступен');

        // В режиме разработки показываем что отправили бы
        console.log('Данные для отправки:', data);

        // Симулируем отправку
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
      }
    } catch (error) {
      console.error('Ошибка отправки в Telegram:', error);
      return false;
    }
  }

  // ===== ЭФФЕКТ ВЫБОРА =====
  addSelectionEffect() {
    const selectedCard = document.querySelector(`[data-admin-id="${this.selectedAdmin.id}"]`);
    if (selectedCard) {
      selectedCard.style.animation = 'pulse 0.6s ease';
      selectedCard.style.borderColor = '#00ff88';
      selectedCard.style.boxShadow = '0 0 30px rgba(0, 255, 136, 0.6)';

      setTimeout(() => {
        selectedCard.style.animation = '';
        selectedCard.style.borderColor = '';
        selectedCard.style.boxShadow = '';
      }, 2000);
    }
  }

  // ===== УВЕДОМЛЕНИЯ =====
  showSuccess(message) {
    this.showToast(message, 'success');
  }

  showError(message) {
    this.showToast(message, 'error');
  }

  showToast(message, type) {
    const toastId = type === 'success' ? 'successToast' : 'errorToast';
    const toast = document.getElementById(toastId);

    if (toast) {
      const span = toast.querySelector('span');
      if (span) span.textContent = message;

      toast.classList.add('show');

      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }
  }

  // ===== ОБНОВЛЕНИЕ СЧЕТЧИКОВ =====
  updateBadges() {
    const availableBadge = document.getElementById('availableBadge');
    const unavailableBadge = document.getElementById('unavailableBadge');

    if (availableBadge) {
      availableBadge.textContent = this.appData.admins.length;
    }

    if (unavailableBadge) {
      unavailableBadge.textContent = this.appData.unavailable_admins?.length || 0;
    }
  }

  // ===== ОБРАБОТКА КЛАВИШ =====
  handleKeyPress(e) {
    switch(e.key) {
      case 'Escape':
        if (document.getElementById('confirmModal').classList.contains('show')) {
          this.closeModal();
        }
        break;
      case 'Enter':
        if (document.getElementById('confirmModal').classList.contains('show')) {
          this.confirmSelection();
        }
        break;
      case '1':
        if (!e.target.matches('input')) {
          this.switchTab('available');
        }
        break;
      case '2':
        if (!e.target.matches('input')) {
          this.switchTab('unavailable');
        }
        break;
    }
  }

  // ===== PARALLAX ЭФФЕКТЫ =====
  setupParallax() {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;

      document.querySelectorAll('.particle').forEach((particle, index) => {
        const speed = 1 + (index % 3) * 0.5;
        particle.style.transform = `translateY(${rate * speed}px)`;
      });
    });
  }

  // ===== МАГНЕТИЧЕСКИЕ ЭФФЕКТЫ =====
  setupMagneticEffects() {
    document.addEventListener('mousemove', (e) => {
      const cards = document.querySelectorAll('.admin-card:hover');

      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const moveX = x * 0.05;
        const moveY = y * 0.05;

        card.style.transform = `translateX(${moveX}px) translateY(${moveY}px) rotateY(${x * 0.05}deg) rotateX(${-y * 0.05}deg)`;
      });
    });
  }

  // ===== АНИМАЦИИ =====
  startAnimations() {
    // Анимация частиц
    this.animateParticles();

    // Анимация волн
    this.animateWaves();

    // Запускаем цикл анимации
    this.animationLoop();
  }

  animateParticles() {
    const particles = document.querySelectorAll('.particle');

    particles.forEach((particle, index) => {
      const delay = Math.random() * 2000;
      const duration = 15000 + Math.random() * 10000;

      particle.style.animationDelay = `${delay}ms`;
      particle.style.animationDuration = `${duration}ms`;
    });
  }

  animateWaves() {
    const waves = document.querySelectorAll('.wave');

    waves.forEach((wave, index) => {
      wave.style.animationDelay = `${index * 1000}ms`;
    });
  }

  animationLoop() {
    // Обновление анимаций каждый кадр
    requestAnimationFrame(() => {
      this.updateAnimations();
      this.animationLoop();
    });
  }

  updateAnimations() {
    // Обновление позиций элементов и анимаций
    const time = Date.now() * 0.001;

    // Пульсация статус индикаторов
    document.querySelectorAll('.status-indicator').forEach(indicator => {
      const scale = 1 + Math.sin(time * 2) * 0.1;
      indicator.style.transform = `scale(${scale})`;
    });

    // Мерцание звезд
    document.querySelectorAll('.star').forEach((star, index) => {
      const opacity = 0.7 + Math.sin(time * 3 + index) * 0.3;
      star.style.opacity = opacity;
    });
  }
}

// ===== CSS ДЛЯ АНИМАЦИЙ (добавляется динамически) =====
function addDynamicStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }

    .no-results {
      grid-column: 1 / -1;
      text-align: center;
      padding: 60px 20px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      border: 2px dashed rgba(255, 255, 255, 0.2);
    }

    .no-results-icon {
      font-size: 4rem;
      color: #8b5cf6;
      margin-bottom: 20px;
      animation: bounce 2s infinite;
    }

    .no-results h3 {
      font-size: 1.5rem;
      margin-bottom: 10px;
      color: white;
    }

    .no-results p {
      color: rgba(255, 255, 255, 0.7);
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `;
  document.head.appendChild(style);
}

// ===== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ =====
document.addEventListener('DOMContentLoaded', () => {
  // Добавляем динамические стили
  addDynamicStyles();

  // Создаем экземпляр приложения
  window.adminPanel = new FuturisticAdminPanel();

  // Настройка Telegram WebApp API
  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();

    // Настройка главной кнопки
    window.Telegram.WebApp.MainButton.setText('Выбрать админа');
    window.Telegram.WebApp.MainButton.show();

    console.log('📱 Telegram WebApp API инициализирован');
  }

  console.log('✨ Футуристический админ селектор загружен!');
});

// ===== ОТЛАДКА =====
if (typeof window !== 'undefined') {
  window.debugAdminPanel = () => {
    console.log('🔍 Отладочная информация:');
    console.log('Текущая вкладка:', window.adminPanel?.currentTab);
    console.log('Поисковый запрос:', window.adminPanel?.searchTerm);
    console.log('Отфильтрованные админы:', window.adminPanel?.filteredAdmins);
    console.log('Выбранный админ:', window.adminPanel?.selectedAdmin);
  };
}