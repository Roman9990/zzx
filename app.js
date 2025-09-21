// ✨ КРАСИВЫЙ СЕЛЕКТОР АДМИНИСТРАТОРОВ ✨
class BeautifulAdminSelector {
    constructor() {
        this.admins = [
            {
                id: 5518423575,
                tag: "roman",
                role: "Владелец",
                status: "active",
                avatar: "👑",
                rating: 5.0,
                dialogs: 156,
                resolved: 148,
                response_time: "2 мин",
                efficiency: 95,
                specialties: ["VIP поддержка", "Критические вопросы"],
                experience: "2+ года"
            },
            {
                id: 123456789,
                tag: "мукра_адская",
                role: "Администратор",
                status: "active",
                avatar: "🛡️",
                rating: 4.8,
                dialogs: 234,
                resolved: 198,
                response_time: "3 мин",
                efficiency: 89,
                specialties: ["Модерация", "Конфликты"],
                experience: "1.5 года"
            },
            {
                id: 987654321,
                tag: "support",
                role: "Техподдержка",
                status: "inactive",
                avatar: "🎧",
                rating: 4.2,
                dialogs: 89,
                resolved: 67,
                response_time: "8 мин",
                efficiency: 76,
                specialties: ["Технические вопросы", "Баги"],
                experience: "1 год"
            },
            {
                id: 555666777,
                tag: "moderator_1",
                role: "Модератор",
                status: "active",
                avatar: "⚖️",
                rating: 4.6,
                dialogs: 145,
                resolved: 119,
                response_time: "5 мин",
                efficiency: 82,
                specialties: ["Жалобы", "Спам"],
                experience: "8 месяцев"
            },
            {
                id: 444333222,
                tag: "helper",
                role: "Помощник",
                status: "busy",
                avatar: "🤝",
                rating: 4.1,
                dialogs: 67,
                resolved: 48,
                response_time: "12 мин",
                efficiency: 71,
                specialties: ["Новички", "Базовые вопросы"],
                experience: "3 месяца"
            }
        ];

        this.filteredAdmins = [...this.admins];
        this.selectedAdmin = null;
        this.tg = null;

        this.init();
    }

    init() {
        console.log('✨ Инициализация красивого селектора...');

        this.initTelegram();
        this.createParticles();
        this.bindEvents();
        this.animateStats();
        this.renderAdmins();

        setTimeout(() => {
            document.getElementById('app').style.opacity = '1';
        }, 100);

        console.log('🎉 Красивый селектор готов!');
    }

    initTelegram() {
        if (window.Telegram && window.Telegram.WebApp) {
            this.tg = window.Telegram.WebApp;
            this.tg.ready();
            this.tg.expand();
            this.tg.setBackgroundColor('#667eea');
            console.log('📱 Telegram WebApp подключен');
        }
    }

    createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 30;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.opacity = Math.random() * 0.5 + 0.2;
            particlesContainer.appendChild(particle);
        }
    }

    bindEvents() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Ripple effect для всех кликабельных элементов
        document.addEventListener('click', (e) => {
            if (e.target.closest('.admin-card, .btn, .select-button')) {
                this.createRipple(e);
            }
        });

        // Закрытие модального окна по ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        // Закрытие модального окна по клику вне его
        document.getElementById('modal').addEventListener('click', (e) => {
            if (e.target.id === 'modal') {
                this.closeModal();
            }
        });
    }

    createRipple(event) {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number[data-target]');

        statNumbers.forEach((stat, index) => {
            setTimeout(() => {
                this.animateNumber(stat, parseFloat(stat.dataset.target));
            }, index * 300);
        });
    }

    animateNumber(element, target) {
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;

            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            if (target === Math.floor(target)) {
                element.textContent = Math.floor(current);
            } else {
                element.textContent = current.toFixed(1);
            }
        }, 16);
    }

    handleSearch(query) {
        const searchQuery = query.toLowerCase();

        this.filteredAdmins = this.admins.filter(admin => 
            admin.tag.toLowerCase().includes(searchQuery) ||
            admin.role.toLowerCase().includes(searchQuery) ||
            admin.specialties.some(spec => spec.toLowerCase().includes(searchQuery))
        );

        this.renderAdmins();
    }

    renderAdmins() {
        const container = document.getElementById('adminGrid');
        if (!container) return;

        if (this.filteredAdmins.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <div style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;">🔍</div>
                    <h3 style="font-size: 1.5rem; margin-bottom: 10px;">Администраторы не найдены</h3>
                    <p style="color: var(--text-secondary);">Попробуйте изменить поисковый запрос</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredAdmins.map((admin, index) => 
            this.createAdminCard(admin, index)
        ).join('');

        // Анимация появления карточек
        setTimeout(() => {
            const cards = container.querySelectorAll('.admin-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 50);
    }

    createAdminCard(admin, index) {
        const statusClass = `status-${admin.status}`;
        const statusText = {
            'active': 'Активен',
            'busy': 'Занят',
            'inactive': 'Не в сети'
        }[admin.status] || 'Неизвестно';

        const stars = this.generateStars(admin.rating);
        const specialtyTags = admin.specialties.map(spec => 
            `<span class="specialty-tag">${spec}</span>`
        ).join('');

        return `
            <div class="admin-card" onclick="adminSelector.selectAdmin(${admin.id})" style="opacity: 0; transform: translateY(30px); transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);">
                <div class="status-badge ${statusClass}">${statusText}</div>

                <div class="card-header">
                    <div class="admin-avatar">${admin.avatar}</div>
                    <div class="admin-info">
                        <h3>#${admin.tag}</h3>
                        <div class="admin-role">${admin.role}</div>
                    </div>
                </div>

                <div class="rating-display">
                    <div class="stars">${stars}</div>
                    <span class="rating-number">${admin.rating.toFixed(1)}</span>
                </div>

                <div class="admin-stats">
                    <div class="stat-item">
                        <div class="stat-value">${admin.dialogs}</div>
                        <div class="stat-label-small">Диалогов</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${admin.resolved}</div>
                        <div class="stat-label-small">Решено</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${admin.efficiency}%</div>
                        <div class="stat-label-small">Эффективность</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${admin.response_time}</div>
                        <div class="stat-label-small">Ответ</div>
                    </div>
                </div>

                <div class="specialties">
                    ${specialtyTags}
                </div>

                <button class="select-button" onclick="event.stopPropagation(); adminSelector.selectAdmin(${admin.id})">
                    <i class="fas fa-user-check"></i> Выбрать администратора
                </button>
            </div>
        `;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';

        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star star"></i>';
        }

        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt star"></i>';
        }

        for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
            stars += '<i class="far fa-star star"></i>';
        }

        return stars;
    }

    selectAdmin(adminId) {
        const admin = this.admins.find(a => a.id === adminId);
        if (!admin) return;

        this.selectedAdmin = admin;

        // Обновляем визуальное выделение
        document.querySelectorAll('.admin-card').forEach(card => {
            card.classList.remove('selected');
        });

        event.currentTarget.classList.add('selected');

        // Показываем модальное окно
        this.showModal(admin);
    }

    showModal(admin) {
        const modal = document.getElementById('modal');
        const avatar = document.getElementById('modalAvatar');
        const title = document.getElementById('modalTitle');
        const subtitle = document.getElementById('modalSubtitle');
        const stats = document.getElementById('modalStats');

        avatar.textContent = admin.avatar;
        title.textContent = `#${admin.tag}`;
        subtitle.textContent = `${admin.role} • ${admin.experience}`;

        stats.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
                <div style="text-align: center; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 15px;">
                    <div style="font-size: 2rem; margin-bottom: 8px;">⭐</div>
                    <div style="font-size: 1.5rem; font-weight: 600; margin-bottom: 5px;">${admin.rating.toFixed(1)}</div>
                    <div style="color: var(--text-secondary); font-size: 0.9rem;">Рейтинг</div>
                </div>
                <div style="text-align: center; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 15px;">
                    <div style="font-size: 2rem; margin-bottom: 8px;">⚡</div>
                    <div style="font-size: 1.5rem; font-weight: 600; margin-bottom: 5px;">${admin.efficiency}%</div>
                    <div style="color: var(--text-secondary); font-size: 0.9rem;">Эффективность</div>
                </div>
                <div style="text-align: center; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 15px;">
                    <div style="font-size: 2rem; margin-bottom: 8px;">💬</div>
                    <div style="font-size: 1.5rem; font-weight: 600; margin-bottom: 5px;">${admin.dialogs}</div>
                    <div style="color: var(--text-secondary); font-size: 0.9rem;">Диалогов</div>
                </div>
                <div style="text-align: center; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 15px;">
                    <div style="font-size: 2rem; margin-bottom: 8px;">🕐</div>
                    <div style="font-size: 1.5rem; font-weight: 600; margin-bottom: 5px;">${admin.response_time}</div>
                    <div style="color: var(--text-secondary); font-size: 0.9rem;">Ответ</div>
                </div>
            </div>

            <div style="margin-top: 20px; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 15px;">
                <h4 style="margin-bottom: 10px; color: var(--text-primary);">Специализации:</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${admin.specialties.map(spec => `
                        <span style="background: rgba(79,172,254,0.2); color: #4facfe; padding: 6px 12px; border-radius: 15px; font-size: 0.8rem;">
                            ${spec}
                        </span>
                    `).join('')}
                </div>
            </div>
        `;

        modal.classList.add('show');
    }

    closeModal() {
        const modal = document.getElementById('modal');
        modal.classList.remove('show');

        // Убираем выделение
        document.querySelectorAll('.admin-card').forEach(card => {
            card.classList.remove('selected');
        });

        this.selectedAdmin = null;
    }

    confirmSelection() {
        if (!this.selectedAdmin) {
            this.showToast('Администратор не выбран', 'error');
            return;
        }

        const confirmBtn = document.getElementById('confirmBtn');
        const btnText = confirmBtn.querySelector('.btn-text') || confirmBtn;
        const originalText = btnText.innerHTML;

        // Показываем загрузку
        btnText.innerHTML = '<span class="loading"></span> Отправка...';
        confirmBtn.disabled = true;

        // Имитация отправки
        setTimeout(() => {
            this.sendToTelegram(this.selectedAdmin);

            btnText.innerHTML = originalText;
            confirmBtn.disabled = false;

            this.closeModal();
            this.showToast(`Администратор #${this.selectedAdmin.tag} выбран!`, 'success');
        }, 1500);
    }

    sendToTelegram(admin) {
        if (this.tg) {
            const data = {
                type: 'beautiful_admin_selected',
                admin: {
                    id: admin.id,
                    tag: admin.tag,
                    role: admin.role,
                    rating: admin.rating,
                    efficiency: admin.efficiency,
                    response_time: admin.response_time,
                    specialties: admin.specialties,
                    experience: admin.experience
                },
                timestamp: new Date().toISOString()
            };

            console.log('📤 Отправка в Telegram:', data);
            this.tg.sendData(JSON.stringify(data));

            setTimeout(() => {
                this.tg.close();
            }, 2000);
        } else {
            console.log('🎮 Тестовый режим - выбран админ:', admin);
        }
    }

    showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');

        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="font-size: 1.2rem;">
                    ${type === 'success' ? '✅' : '❌'}
                </div>
                <div>
                    <div style="font-weight: 600; margin-bottom: 2px;">
                        ${type === 'success' ? 'Успешно!' : 'Ошибка!'}
                    </div>
                    <div style="font-size: 0.9rem; color: var(--text-secondary);">
                        ${message}
                    </div>
                </div>
            </div>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 500);
        }, 3000);
    }
}

// Глобальная переменная для доступа
let adminSelector;

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Загрузка красивого селектора...');
    adminSelector = new BeautifulAdminSelector();
});

// Глобальные функции для inline обработчиков
function closeModal() {
    adminSelector.closeModal();
}

function confirmSelection() {
    adminSelector.confirmSelection();
}

// Экспорт для отладки
if (typeof window !== 'undefined') {
    window.beautifulAdminSelector = {
        instance: () => adminSelector,
        admins: () => adminSelector.admins,
        showToast: (msg, type) => adminSelector.showToast(msg, type)
    };
}

console.log('✨ Красивый селектор администраторов загружен!');