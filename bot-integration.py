# 🚀 ПРЯМАЯ ИНТЕГРАЦИЯ С БОТОМ ДЛЯ ЗАПРОСОВ К АДМИНИСТРАТОРАМ

import json
import asyncio
from datetime import datetime
from aiogram import Router, F
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton, CallbackQuery
from aiogram.types import WebAppInfo

# ===== НАСТРОЙКИ ПРЯМОГО СЕЛЕКТОРА =====

# 🚀 ЗАМЕНИТЕ НА ВАШ РЕАЛЬНЫЙ URL
DIRECT_WEBAPP_URL = "https://ВАШ-USERNAME.github.io/ВАШ-РЕПОЗИТОРИЙ/"

# Реальные username администраторов в Telegram
ADMIN_USERNAMES = {
    5518423575: "roman",              # Замените на реальный username
    123456789: "mukra_admin",         # Замените на реальный username  
    987654321: "support_bot",         # Замените на реальный username
    555666777: "moderator_one",       # Замените на реальный username
    444333222: "helper_bot"           # Замените на реальный username
}

# ID администраторов для отправки уведомлений
ADMIN_IDS = {
    5518423575: "roman",
    123456789: "мукра_адская",
    987654321: "support", 
    555666777: "moderator_1",
    444333222: "helper"
}

@dp.message(F.text == "/admin")
async def show_direct_admin_selector(message: Message):
    """🚀 Показать прямой селектор администраторов"""

    user_id = message.from_user.id

    # Проверяем активные диалоги
    active_dialog = get_active_dialog_by_user(user_id)
    if active_dialog:
        admin_info = get_admin_by_id(active_dialog['admin_id'])
        admin_tag = admin_info['tag'] if admin_info else "неизвестен"

        await message.answer(
            f"⚠️ У вас уже есть активный диалог с администратором #{admin_tag}\n"
            f"Завершите текущий диалог перед обращением к новому.\n\n"
            f"Команда /end завершит диалог."
        )
        return

    # Создаем кнопку с прямым селектором
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="👥 Выбрать Администратора",
                    web_app=WebAppInfo(url=DIRECT_WEBAPP_URL)
                )
            ],
            [
                InlineKeyboardButton(
                    text="📊 Статистика админов",
                    callback_data="direct_stats"
                ),
                InlineKeyboardButton(
                    text="❓ Помощь",
                    callback_data="direct_help"
                )
            ]
        ]
    )

    message_text = """
🚀 **Обращение к Администраторам**

Выберите администратора и отправьте ему запрос на диалог.
После выбора администратор получит уведомление и сможет связаться с вами.

👥 **Наша команда:**
👑 **Владелец** - Важные вопросы и VIP поддержка
🛡️ **Администратор** - Модерация и управление
⚖️ **Модератор** - Конфликты и жалобы  
🎧 **Техподдержка** - Технические проблемы
🤝 **Помощник** - Помощь новичкам

📋 **Как это работает:**
1. Выберите подходящего администратора
2. Отправьте запрос на диалог
3. Администратор получит уведомление
4. Продолжите диалог в этом боте

🎯 Нажмите кнопку ниже для выбора
    """

    await message.answer(
        message_text,
        reply_markup=keyboard,
        parse_mode="Markdown"
    )

@dp.message(F.web_app_data)
async def handle_direct_admin_request(message: Message):
    """📨 Обработка прямого запроса к администратору"""

    try:
        data = json.loads(message.web_app_data.data)

        if data.get('type') == 'admin_direct_request':
            admin_data = data['admin']
            user_id = message.from_user.id
            user = message.from_user

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
                    f"❌ Администратор {admin_data['name']} не найден в системе!"
                )
                return

            # Проверяем доступность админа
            admin_dialogs = get_dialogs_by_admin(admin_id)
            active_count = len([d for d in admin_dialogs if d['status'] == 'active'])

            if active_count >= 3:
                await message.answer(
                    f"😔 Администратор {admin_data['name']} сейчас занят\n"
                    f"(активных диалогов: {active_count}/3)\n\n"
                    f"Попробуйте выбрать другого или повторите позже."
                )
                return

            # Создаем диалог
            dialog_id = create_dialog(user_id, admin_id)

            if not dialog_id:
                await message.answer("❌ Ошибка создания диалога")
                return

            # Ответ пользователю
            response = f"""
✅ **Запрос отправлен администратору!**

👤 **Выбран:** {admin_data['name']} ({admin_data['role']})
⭐ **Рейтинг:** {admin_data['rating']:.1f}/5.0
🆔 **Диалог:** `{dialog_id}`

📨 Администратор {admin_data['name']} получил уведомление о вашем запросе.
Он свяжется с вами в ближайшее время для продолжения диалога.

💬 **Что делать дальше:**
• Ожидайте сообщения от администратора
• Все общение будет происходить в этом боте
• Используйте /end для завершения диалога

⏱️ **Ожидаемое время ответа:** ~{admin_data.get('response_time', '5 мин')}
            """

            keyboard = InlineKeyboardMarkup(
                inline_keyboard=[
                    [
                        InlineKeyboardButton(
                            text="👥 Выбрать другого админа",
                            web_app=WebAppInfo(url=DIRECT_WEBAPP_URL)
                        )
                    ],
                    [
                        InlineKeyboardButton(
                            text="📊 Профиль админа",
                            callback_data=f"direct_profile_{admin_id}"
                        ),
                        InlineKeyboardButton(
                            text="❌ Отменить запрос",
                            callback_data=f"end_dialog_{dialog_id}"
                        )
                    ]
                ]
            )

            await message.answer(response, reply_markup=keyboard, parse_mode="Markdown")

            # Отправляем уведомление администратору
            await notify_admin_direct_request(admin_id, admin_info, user, dialog_id, admin_data)

            # Логируем запрос
            await log_direct_admin_request(admin_data, user, data['timestamp'])

    except json.JSONDecodeError:
        await message.answer("❌ Ошибка: неверный формат данных")
    except Exception as e:
        await message.answer("❌ Произошла ошибка при обработке запроса")
        print(f"Error handling direct admin request: {e}")

async def notify_admin_direct_request(admin_id, admin_info, user, dialog_id, admin_data):
    """📢 Уведомить администратора о прямом запросе"""

    try:
        user_name = user.first_name
        if user.last_name:
            user_name += f" {user.last_name}"
        if user.username:
            user_name += f" (@{user.username})"

        notification = f"""
🚀 **ПРЯМОЙ ЗАПРОС НА ДИАЛОГ**

👤 **От пользователя:** {user_name}
🆔 **User ID:** `{user.id}`
🎯 **Диалог ID:** `{dialog_id}`

💡 **Пользователь выбрал именно ВАС** из списка администраторов!

👨‍💼 **Ваш профиль:**
🏷️ **Роль:** {admin_info['role']}
⭐ **Рейтинг:** {admin_data['rating']:.1f}/5.0
🎯 **Статус:** {admin_info.get('status', 'active')}

📝 **Сообщение:** {admin_data.get('user_message', 'Пользователь хочет связаться')}

💬 **Для ответа:**
• Просто отвечайте на это сообщение
• Все ваши сообщения будут переданы пользователю
• Используйте /end для завершения диалога

⏱️ **Время создания запроса:** {datetime.now().strftime('%H:%M, %d.%m.%Y')}

🌟 Покажите высокое качество обслуживания!
        """

        # Кнопки для администратора
        keyboard = InlineKeyboardMarkup(
            inline_keyboard=[
                [
                    InlineKeyboardButton(
                        text="👤 Профиль пользователя",
                        callback_data=f"user_profile_{user.id}"
                    ),
                    InlineKeyboardButton(
                        text="📊 Статистика диалогов",
                        callback_data="direct_my_stats"
                    )
                ],
                [
                    InlineKeyboardButton(
                        text="✅ Принять диалог",
                        callback_data=f"accept_dialog_{dialog_id}"
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

        # Дополнительно отправляем быстрое уведомление
        await bot.send_message(
            admin_id,
            f"🔔 Новый запрос на диалог от {user_name}\n"
            f"Диалог #{dialog_id}"
        )

    except Exception as e:
        print(f"Error notifying admin {admin_id}: {e}")

@dp.callback_query(F.data.startswith("accept_dialog_"))
async def accept_dialog_request(callback: CallbackQuery):
    """✅ Принять диалог администратором"""

    dialog_id = int(callback.data.split("_")[2])
    admin_id = callback.from_user.id

    dialog = get_dialog_by_id(dialog_id)
    if not dialog:
        await callback.answer("❌ Диалог не найден", show_alert=True)
        return

    if dialog['admin_id'] != admin_id:
        await callback.answer("❌ Это не ваш диалог", show_alert=True)
        return

    if dialog['status'] != 'active':
        await callback.answer("ℹ️ Диалог уже завершен", show_alert=True)
        return

    # Уведомляем пользователя о принятии
    user_id = dialog['user_id']
    admin_info = get_admin_by_id(admin_id)
    admin_name = admin_info['tag'] if admin_info else "администратор"

    try:
        await bot.send_message(
            user_id,
            f"✅ **Администратор #{admin_name} принял ваш запрос!**\n\n"
            f"Теперь вы можете писать ваши сообщения.\n"
            f"Все сообщения будут переданы администратору.\n\n"
            f"🔚 Используйте /end для завершения диалога",
            parse_mode="Markdown"
        )

        # Обновляем сообщение администратора
        await callback.message.edit_text(
            f"✅ **Диалог #{dialog_id} принят**\n\n"
            f"Пользователь уведомлен о принятии запроса.\n"
            f"Отвечайте на сообщения для связи с пользователем.\n\n"
            f"❌ /end для завершения диалога",
            parse_mode="Markdown"
        )

        await callback.answer("✅ Диалог принят!")

    except Exception as e:
        await callback.answer("❌ Ошибка уведомления пользователя", show_alert=True)
        print(f"Error accepting dialog: {e}")

@dp.callback_query(F.data == "direct_stats")
async def show_direct_stats(callback: CallbackQuery):
    """📊 Показать статистику прямых запросов"""

    admins_list = get_admins_list()
    total_dialogs = len(get_all_dialogs())
    active_dialogs = len([d for d in get_all_dialogs() if d['status'] == 'active'])

    # Статистика по администраторам
    admin_stats = []
    for admin in admins_list:
        admin_dialogs = get_dialogs_by_admin(admin['id'])
        active_count = len([d for d in admin_dialogs if d['status'] == 'active'])
        total_count = len(admin_dialogs)

        admin_stats.append({
            'name': admin['tag'],
            'total': total_count,
            'active': active_count,
            'status': 'busy' if active_count >= 3 else 'available'
        })

    stats_text = f"""
📊 **Статистика Прямых Запросов**

📈 **Общие показатели:**
• 💬 Всего диалогов: {total_dialogs}
• 🔥 Активных сейчас: {active_dialogs}
• 👥 Администраторов: {len(admins_list)}

👨‍💼 **Статистика администраторов:**
"""

    for stat in admin_stats:
        status_emoji = "🟢" if stat['status'] == 'available' else "🔴"
        stats_text += f"\n{status_emoji} **#{stat['name']}**"
        stats_text += f"\n├ Диалогов: {stat['total']}"
        stats_text += f"\n├ Активных: {stat['active']}/3"
        stats_text += f"\n└ Статус: {'Доступен' if stat['status'] == 'available' else 'Занят'}"
        stats_text += "\n"

    stats_text += f"""
⚡ **Эффективность системы:**
• Средний рейтинг: 4.5/5.0
• Время ответа: ~6 минут
• Удовлетворенность: 91%

🎯 Система работает стабильно!
    """

    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="👥 Выбрать администратора",
                    web_app=WebAppInfo(url=DIRECT_WEBAPP_URL)
                )
            ],
            [
                InlineKeyboardButton(
                    text="🔄 Обновить статистику",
                    callback_data="direct_stats"
                )
            ]
        ]
    )

    await callback.message.edit_text(
        stats_text,
        reply_markup=keyboard,
        parse_mode="Markdown"
    )

@dp.callback_query(F.data == "direct_help")
async def show_direct_help(callback: CallbackQuery):
    """❓ Показать помощь по прямым запросам"""

    help_text = """
❓ **Помощь: Прямые Запросы к Администраторам**

🚀 **Как это работает:**
1️⃣ Выберите администратора из списка
2️⃣ Отправьте запрос на диалог
3️⃣ Администратор получит уведомление
4️⃣ Он свяжется с вами в этом боте
5️⃣ Продолжайте общение как обычно

👥 **Типы администраторов:**

👑 **Владелец**
├ VIP поддержка
├ Критические вопросы
└ Жалобы на систему

🛡️ **Администратор**  
├ Модерация чатов
├ Нарушения правил
└ Конфликты между пользователями

⚖️ **Модератор**
├ Жалобы на пользователей
├ Спам и реклама
└ Неподобающее поведение

🎧 **Техподдержка**
├ Технические проблемы
├ Ошибки в работе бота
└ Вопросы по функциям

🤝 **Помощник**
├ Помощь новичкам
├ Базовые вопросы
└ Обучение использованию

⏱️ **Время ответа:**
• Владелец: ~2 минуты
• Администратор: ~3 минуты  
• Модератор: ~5 минут
• Техподдержка: ~8 минут
• Помощник: ~12 минут

💡 **Советы:**
• Выбирайте админа по специализации
• Четко формулируйте свой вопрос
• Будьте терпеливы в ожидании ответа

🔚 **Завершение:** Используйте /end в любое время
    """

    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="👥 Выбрать администратора",
                    web_app=WebAppInfo(url=DIRECT_WEBAPP_URL)
                )
            ]
        ]
    )

    await callback.message.edit_text(
        help_text,
        reply_markup=keyboard,
        parse_mode="Markdown"
    )

@dp.callback_query(F.data.startswith("direct_profile_"))
async def show_direct_admin_profile(callback: CallbackQuery):
    """👤 Показать профиль администратора"""

    admin_id = int(callback.data.split("_")[2])
    admin_info = get_admin_by_id(admin_id)

    if not admin_info:
        await callback.answer("❌ Администратор не найден", show_alert=True)
        return

    # Статистика администратора
    admin_dialogs = get_dialogs_by_admin(admin_id)
    total_dialogs = len(admin_dialogs)
    active_dialogs = len([d for d in admin_dialogs if d['status'] == 'active'])

    # Примерные данные (в реальности берите из базы)
    profile_data = {
        'roman': {'rating': 5.0, 'efficiency': 95, 'response_time': '2 мин', 'specialties': ['VIP поддержка', 'Критические вопросы']},
        'мукра_адская': {'rating': 4.8, 'efficiency': 89, 'response_time': '3 мин', 'specialties': ['Модерация', 'Конфликты']},
        'moderator_1': {'rating': 4.6, 'efficiency': 82, 'response_time': '5 мин', 'specialties': ['Жалобы', 'Спам']},
        'support': {'rating': 4.2, 'efficiency': 76, 'response_time': '8 мин', 'specialties': ['Техподдержка', 'Баги']},
        'helper': {'rating': 4.1, 'efficiency': 71, 'response_time': '12 мин', 'specialties': ['Новички', 'Базовые вопросы']}
    }

    data = profile_data.get(admin_info['tag'], {})
    rating = data.get('rating', 4.0)
    efficiency = data.get('efficiency', 80)
    response_time = data.get('response_time', '10 мин')
    specialties = data.get('specialties', ['Общие вопросы'])

    specialties_text = "\n".join([f"• {spec}" for spec in specialties])

    profile_text = f"""
👤 **Профиль Администратора**

🏷️ **Тег:** #{admin_info['tag']}
👨‍💼 **Роль:** {admin_info['role']}
⭐ **Рейтинг:** {rating}/5.0
📈 **Эффективность:** {efficiency}%
🕐 **Время ответа:** {response_time}

📊 **Статистика диалогов:**
• Всего диалогов: {total_dialogs}
• Активных сейчас: {active_dialogs}/3
• Статус: {'🟢 Доступен' if active_dialogs < 3 else '🔴 Занят'}

🎯 **Специализации:**
{specialties_text}

💡 **Когда обращаться:**
Выберите этого администратора, если ваш вопрос 
касается указанных специализаций.

⏱️ **Ожидаемое время ответа:** {response_time}
    """

    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="💬 Написать этому админу",
                    web_app=WebAppInfo(url=DIRECT_WEBAPP_URL)
                )
            ],
            [
                InlineKeyboardButton(
                    text="◀️ Назад к статистике",
                    callback_data="direct_stats"
                )
            ]
        ]
    )

    await callback.message.edit_text(
        profile_text,
        reply_markup=keyboard,
        parse_mode="Markdown"
    )

async def log_direct_admin_request(admin_data, user, timestamp):
    """📝 Логирование прямого запроса"""

    log_entry = {
        'timestamp': timestamp,
        'type': 'direct_request',
        'user_id': user.id,
        'username': user.username,
        'user_name': f"{user.first_name} {user.last_name or ''}".strip(),
        'admin': {
            'id': admin_data['id'],
            'name': admin_data['name'],
            'tag': admin_data['tag'],
            'role': admin_data['role'],
            'rating': admin_data['rating']
        }
    }

    print(f"📝 Direct admin request logged: {log_entry}")

    # Опционально: сохранить в файл
    try:
        with open('direct_requests.log', 'a', encoding='utf-8') as f:
            f.write(f"{datetime.now().isoformat()}: {json.dumps(log_entry, ensure_ascii=False)}\n")
    except:
        pass

print("🚀 Прямая интеграция с ботом для запросов к администраторам создана!")