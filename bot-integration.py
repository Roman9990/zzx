# ✨ КРАСИВАЯ ИНТЕГРАЦИЯ С БОТОМ

import json
import asyncio
from aiogram import Router, F
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton, CallbackQuery
from aiogram.types import WebAppInfo

# ===== НАСТРОЙКИ КРАСИВОГО СЕЛЕКТОРА =====

# ✨ ЗАМЕНИТЕ НА ВАШ РЕАЛЬНЫЙ URL
BEAUTIFUL_WEBAPP_URL = "https://ВАШ-USERNAME.github.io/ВАШ-РЕПОЗИТОРИЙ/"

# ID администраторов
ADMIN_IDS = {
    5518423575: "roman",
    123456789: "мукра_адская", 
    987654321: "support",
    555666777: "moderator_1",
    444333222: "helper"
}

@dp.message(F.text == "/webapp")
async def show_beautiful_webapp(message: Message):
    """✨ Запустить красивый селектор администраторов"""

    user_id = message.from_user.id

    # Проверяем активные диалоги
    active_dialog = get_active_dialog_by_user(user_id)
    if active_dialog:
        admin_info = get_admin_by_id(active_dialog['admin_id'])
        admin_tag = admin_info['tag'] if admin_info else "неизвестен"

        await message.answer(
            f"⚠️ У вас уже есть активный диалог с администратором #{admin_tag}\n"
            f"Завершите текущий диалог перед выбором нового.\n\n"
            f"Используйте /end чтобы завершить диалог."
        )
        return

    # Создаем кнопку с красивым WebApp
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="✨ Открыть Селектор ✨",
                    web_app=WebAppInfo(url=BEAUTIFUL_WEBAPP_URL)
                )
            ],
            [
                InlineKeyboardButton(
                    text="📊 Статистика системы",
                    callback_data="beautiful_stats"
                ),
                InlineKeyboardButton(
                    text="💡 Как это работает",
                    callback_data="beautiful_help"
                )
            ]
        ]
    )

    beautiful_message = """
✨ **Селектор Администраторов Premium** ✨

🎨 Откройте красивый интерфейс выбора администраторов с потрясающими анимациями!

🌟 **Что вас ждет:**
• Glassmorphism дизайн с blur эффектами
• Плавающие анимации и градиенты
• Интерактивные карточки администраторов
• Детальная статистика каждого админа
• Responsive дизайн для всех устройств

👥 **Наша команда экспертов:**
👑 **Владелец** - VIP поддержка, критические вопросы
🛡️ **Администратор** - Модерация и конфликты  
⚖️ **Модератор** - Жалобы и спам
🎧 **Техподдержка** - Технические проблемы
🤝 **Помощник** - Базовые вопросы новичков

⚡ **Средняя эффективность:** 84.2%
⭐ **Средний рейтинг:** 4.5/5.0
🕐 **Среднее время ответа:** 6 минут

🎯 Нажмите "Открыть Селектор" для невероятного опыта!
    """

    await message.answer(
        beautiful_message,
        reply_markup=keyboard,
        parse_mode="Markdown"
    )

@dp.message(F.web_app_data)
async def handle_beautiful_admin_selection(message: Message):
    """🎨 Обработка выбора из красивого селектора"""

    try:
        data = json.loads(message.web_app_data.data)

        if data.get('type') == 'beautiful_admin_selected':
            admin_data = data['admin']
            user_id = message.from_user.id

            # Проверяем активные диалоги
            active_dialog = get_active_dialog_by_user(user_id)
            if active_dialog:
                await message.answer(
                    "⚠️ У вас уже есть активный диалог!\n"
                    "Завершите его командой /end"
                )
                return

            admin_id = admin_data['id']
            admin_info = get_admin_by_id(admin_id)

            if not admin_info:
                await message.answer(
                    f"❌ Администратор #{admin_data['tag']} не найден в системе!"
                )
                return

            # Проверяем доступность
            admin_dialogs = get_dialogs_by_admin(admin_id)
            active_count = len([d for d in admin_dialogs if d['status'] == 'active'])

            if active_count >= 3:
                await message.answer(
                    f"😔 Администратор #{admin_info['tag']} сейчас занят\n"
                    f"(активных диалогов: {active_count}/3)\n\n"
                    f"Попробуйте выбрать другого или повторите позже."
                )
                return

            # Создаем диалог
            dialog_id = create_dialog(user_id, admin_id)

            if not dialog_id:
                await message.answer("❌ Ошибка создания диалога")
                return

            # Красивый ответ пользователю
            specialties_text = "\n".join([f"• {spec}" for spec in admin_data.get('specialties', [])])

            response = f"""
✨ **Администратор успешно выбран!** ✨

👤 **Выбран:** #{admin_info['tag']}
🏷️ **Роль:** {admin_info['role']}
📈 **Опыт:** {admin_data.get('experience', 'Неизвестно')}
⭐ **Рейтинг:** {admin_data['rating']:.1f}/5.0
⚡ **Эффективность:** {admin_data['efficiency']}%
🕐 **Время ответа:** ~{admin_data['response_time']}
🆔 **Диалог:** `{dialog_id}`

🎯 **Специализации:**
{specialties_text}

💬 Администратор уведомлен о вашем запросе и скоро свяжется с вами.

🔚 Команда /end завершит диалог
            """

            keyboard = InlineKeyboardMarkup(
                inline_keyboard=[
                    [
                        InlineKeyboardButton(
                            text="✨ Выбрать другого",
                            web_app=WebAppInfo(url=BEAUTIFUL_WEBAPP_URL)
                        )
                    ],
                    [
                        InlineKeyboardButton(
                            text="📊 Профиль админа",
                            callback_data=f"beautiful_profile_{admin_id}"
                        ),
                        InlineKeyboardButton(
                            text="❌ Завершить диалог",
                            callback_data=f"end_dialog_{dialog_id}"
                        )
                    ]
                ]
            )

            await message.answer(response, reply_markup=keyboard, parse_mode="Markdown")

            # Уведомляем админа
            await notify_admin_beautiful(admin_id, admin_info, message.from_user, dialog_id, admin_data)

    except Exception as e:
        await message.answer("❌ Ошибка обработки данных из селектора")
        print(f"Error: {e}")

async def notify_admin_beautiful(admin_id, admin_info, user, dialog_id, admin_data):
    """✨ Красивое уведомление администратора"""

    try:
        user_name = user.first_name
        if user.last_name:
            user_name += f" {user.last_name}"
        if user.username:
            user_name += f" (@{user.username})"

        specialties_text = ", ".join(admin_data.get('specialties', []))

        notification = f"""
✨ **Вы выбраны через Premium Селектор!** ✨

🎯 **Пользователь выбрал именно ВАС** из всех администраторов!

👤 **Пользователь:** {user_name}
🆔 **ID:** `{user.id}`
🎮 **Диалог:** `{dialog_id}`

🏆 **Ваш профиль:**
👨‍💼 **Роль:** {admin_info['role']}
⭐ **Рейтинг:** {admin_data['rating']:.1f}/5.0
⚡ **Эффективность:** {admin_data['efficiency']}%
🎯 **Специализации:** {specialties_text}

💡 Пользователь выбрал вас на основе:
• Высокого рейтинга и эффективности
• Подходящих специализаций
• Быстрого времени ответа

💬 **Отвечайте на это сообщение** для связи с пользователем
🔚 **Команда /end** завершит диалог

🌟 Покажите высокое качество обслуживания!
        """

        keyboard = InlineKeyboardMarkup(
            inline_keyboard=[
                [
                    InlineKeyboardButton(
                        text="👤 Профиль пользователя",
                        callback_data=f"user_profile_{user.id}"
                    )
                ],
                [
                    InlineKeyboardButton(
                        text="📊 Мои статистики",
                        callback_data="beautiful_my_stats"
                    ),
                    InlineKeyboardButton(
                        text="❌ Завершить диалог",
                        callback_data=f"end_dialog_{dialog_id}"
                    )
                ]
            ]
        )

        await bot.send_message(
            admin_id,
            notification,
            reply_markup=keyboard,
            parse_mode="Markdown"
        )

    except Exception as e:
        print(f"Error notifying admin {admin_id}: {e}")

@dp.callback_query(F.data == "beautiful_stats")
async def show_beautiful_stats(callback: CallbackQuery):
    """📊 Красивая статистика системы"""

    admins_list = get_admins_list()
    total_dialogs = len(get_all_dialogs())
    active_dialogs = len([d for d in get_all_dialogs() if d['status'] == 'active'])

    # Вычисляем статистику
    active_admins = len([a for a in admins_list if a.get('status', 'active') == 'active'])
    avg_rating = sum([4.5, 5.0, 4.8, 4.6, 4.2, 4.1]) / 6  # Примерные рейтинги
    success_rate = 84.2

    stats_text = f"""
📊 **Premium Dashboard - Статистика**

✨ **Общие показатели системы:**
┌─ 👥 Администраторов: {len(admins_list)}
├─ 🟢 Активных сейчас: {active_admins}
├─ 💬 Всего диалогов: {total_dialogs}
├─ 🔥 Активных диалогов: {active_dialogs}
├─ ⭐ Средний рейтинг: {avg_rating:.1f}/5.0
├─ 📈 Успешность: {success_rate}%
└─ 🕐 Среднее время ответа: 6 мин

🏆 **Рейтинг администраторов:**
👑 **roman** - 5.0⭐ (95% эффективность)
🛡️ **мукра_адская** - 4.8⭐ (89% эффективность) 
⚖️ **moderator_1** - 4.6⭐ (82% эффективность)
🎧 **support** - 4.2⭐ (76% эффективность)
🤝 **helper** - 4.1⭐ (71% эффективность)

⚡ **Статус системы:** ОПТИМАЛЬНЫЙ
🌟 **Качество обслуживания:** ВЫСОКОЕ
🎯 **Удовлетворенность пользователей:** 96%

🔮 Система работает в премиум режиме!
    """

    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="✨ Открыть Селектор",
                    web_app=WebAppInfo(url=BEAUTIFUL_WEBAPP_URL)
                )
            ],
            [
                InlineKeyboardButton(
                    text="📈 Детальная статистика",
                    callback_data="beautiful_detailed_stats"
                )
            ]
        ]
    )

    await callback.message.edit_text(
        stats_text,
        reply_markup=keyboard,
        parse_mode="Markdown"
    )

@dp.callback_query(F.data == "beautiful_help")
async def show_beautiful_help(callback: CallbackQuery):
    """💡 Помощь по красивому селектору"""

    help_text = """
💡 **Premium Селектор - Руководство**

✨ **Как пользоваться:**
1️⃣ Нажмите "Открыть Селектор" 
2️⃣ Дождитесь загрузки красивого интерфейса
3️⃣ Изучите карточки администраторов
4️⃣ Используйте поиск по специализациям
5️⃣ Кликните на нужного администратора
6️⃣ Подтвердите выбор в модальном окне
7️⃣ Начинайте общение!

🎨 **Особенности интерфейса:**
• **Glassmorphism** дизайн с blur эффектами
• **Плавающие анимации** и градиенты
• **Интерактивные карточки** с hover эффектами
• **Адаптивный дизайн** для всех устройств
• **Поиск в реальном времени**

👥 **Выбор администратора:**
🔍 **Поиск** - Найдите админа по специализации
⭐ **Рейтинг** - Показывает качество работы
⚡ **Эффективность** - Процент решенных вопросов
🕐 **Время ответа** - Как быстро отвечает
🎯 **Специализации** - В чем специализируется

🎭 **Интерактивные элементы:**
• Наведите на карточку для анимации
• Кликните для создания ripple эффекта
• Используйте поиск для фильтрации
• Просматривайте детали в модальном окне

❓ **Проблемы?** Обращайтесь к /support
    """

    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="✨ Попробовать сейчас",
                    web_app=WebAppInfo(url=BEAUTIFUL_WEBAPP_URL)
                )
            ]
        ]
    )

    await callback.message.edit_text(
        help_text,
        reply_markup=keyboard,
        parse_mode="Markdown"
    )

print("✨ Красивая интеграция с ботом создана!")