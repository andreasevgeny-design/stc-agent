/* ============================================================
   СТК AI-Агент — веб-версия
   Логика маршрутизации + база знаний + генерация ответов
   ============================================================ */

/* ---------- БАЗА ЗНАНИЙ ---------- */
const KNOWLEDGE = {
  company: {
    name: "ООО «Сибирская Торговая Компания»",
    short: "ООО «СТК»",
    since: 2006,
    years: 20,
    tenders: 2390,
    warehouse: "1 500 м²",
    address: "г. Томск, ул. Пролетарская, 53",
    email: "STKompany@yandex.ru",
    phones: {
      main: "+7 952-152-30-65",
      accounting: "+7 (3822) 25-60-82",
      procurement: "+7 953-922-62-10",
    },
    mission: "Обеспечивать бизнес качественным сырьём для лучших продуктов",
    memberships: ["ТПП Томской области (с 2026)"],
  },
  advantages: [
    "20 лет на рынке оптовых поставок",
    "2 390 выигранных тендеров (44-ФЗ и 223-ФЗ)",
    "Доставка по Томской области и городам СФО",
    "Собственный автопарк: холодильники до −18°C и изотермики +2…+6°C",
    "Склады 1 500 м²",
    "Эксклюзивные контракты на говядину от мясокомбинатов",
    "Коммерческое предложение за 2 часа",
    "ВСД в системе «Меркурий», сертификация ХАССП и ГОСТ",
  ],
  clients: [
    "Бюджетные учреждения (детские сады, школы, больницы)",
    "Нефтегазовые компании и корпоративные столовые",
    "Вахтовые посёлки",
    "Кафе, рестораны, столовые, магазины",
  ],
  categories: [
    ["Мясо", "Говядина (от 450₽/кг), свинина (от 240₽/кг), птица (от 195₽/кг), субпродукты, фарш. Бренды: Сибирь, СибАгро, Мираторг."],
    ["Рыба", "Замороженная (от 185₽/кг), копчёная/солёная (от 250₽/кг), икра. Примрыбснаб, Владкон."],
    ["Молочная продукция", "Молоко (от 65₽), творог, сметана, масло (от 125₽). Деревенское молочко, Алтайская Буренка."],
    ["Крупы и мука", "Гречка, рис, пшено (от 23₽/кг), мука (от 33₽/кг), макароны (от 33₽). СТК, Ларица, Алейка."],
    ["Консервация", "Овощные (от 45₽), мясные (от 82₽), рыбные (от 55₽). Дядя Ваня, Доброфлот."],
    ["Свежие овощи и фрукты", "Картофель, морковь, свёкла, лук, зелень, яблоки, цитрусовые. Цена — договорная."],
    ["Заморозка", "Ягоды (от 260₽/кг), овощные смеси (от 170₽/кг), грибы, картофель-фри."],
    ["Яйца, сахар, соль", "Яйцо куриное (договорная), сахар/соль (от 25₽/кг), дрожжи (от 10₽)."],
    ["Напитки", "Чай (от 42₽), кофе (от 16₽), соки (от 18₽), вода. Гринфилд, Сады Придонья, Жокей."],
    ["Кондитерские изделия", "Печенье, вафли, зефир (от 166₽), шоколад и конфеты (от 285₽). КДВ, Красный Октябрь."],
    ["Приправы и масло", "Специи (от 9₽), растительное масло (от 113₽), майонез и соусы (от 72₽)."],
  ],
  logistics: {
    regions: "Томская область и города СФО",
    temperature: "от −18°C до +6°C",
    dispatch: "Отгрузка на следующий день после заказа (учёт в 1С)",
    fleet: "Холодильники, изотермические фуры, тентованные грузовики с трекингом",
    stages: [
      "1. Заявка — клиент оставляет запрос",
      "2. Договор — подписываем (44-ФЗ или стандартная оферта)",
      "3. Поставка — доставка точно в срок",
      "4. Оплата — прозрачные закрывающие документы",
    ],
  },
  docs: [
    "Договор поставки",
    "Счёт и счёт-фактура",
    "Товарная накладная (ТОРГ-12)",
    "Акт приёма-передачи",
    "ВСД в системе «Меркурий»",
    "Сертификаты соответствия и декларации ТР ТС",
  ],
};

/* ---------- РОЛИ ---------- */
const ROLES = {
  lawyer: {
    name: "Юрист",
    icon: "⚖️",
    keywords: ["договор", "юрид", "правов", "закон", "44-фз", "223-фз", "тендер", "претенз", "риск", "лиценз", "сертиф", "меркурий", "всд", "норматив", "штраф", "иск"],
    prompt: "Вы юрист ООО «СТК». Консультируете по договорам, 44-ФЗ, 223-ФЗ, тендерным документам и правовым вопросам. Ссылаетесь на статьи законов.",
  },
  accountant: {
    name: "Бухгалтер",
    icon: "💰",
    keywords: ["бухгалтер", "налог", "ндс", "счёт", "оплат", "отчет", "акт", "счёт-фактур", "касс", "дебитор", "кредитор", "1с", "задолжен", "платёж", "сдача", "фнс"],
    prompt: "Вы бухгалтер ООО «СТК». Помогаете с учётом, НДС, счетами, отчётностью и закрывающими документами. Пишете конкретные проводки и сроки.",
  },
  sales: {
    name: "Менеджер продаж",
    icon: "📈",
    keywords: ["продаж", "клиент", "заказ", "прайс", "кп", "коммерческое предложени", "ассортимент", "цена", "стоимост", "скидк", "доставк", "оптов", "категори", "мясо", "крупы", "молок"],
    prompt: "Вы менеджер продаж ООО «СТК». Формируете КП, общаетесь с клиентами, знаете каталог и условия поставки. Акцентируете: 20 лет, 2390 тендеров, эксклюзивные цены.",
  },
  director: {
    name: "Руководитель",
    icon: "🎯",
    keywords: ["анализ", "аналитик", "стратег", "план", "отчет", "kpi", "показател", "прибыл", "рентабель", "эффективн", "управлен", "риск", "развити", "персонал"],
    prompt: "Вы помощник руководителя ООО «СТК». Анализирует показатели, даёте стратегические рекомендации, оцениваете риски. Ответы краткие и структурные.",
  },
  marketer: {
    name: "Маркетолог",
    icon: "🎨",
    keywords: ["маркетинг", "реклам", "продвижени", "бренд", "акци", "соцсет", "контент", "сайт", "конкурент", "аудитор", "лид", "позициониров", "канал"],
    prompt: "Вы маркетолог ООО «СТК». Разрабатываете стратегию продвижения, контент-план, анализируете конкурентов, опираясь на преимущества компании.",
  },
};

const ROLE_ORDER = ["lawyer", "accountant", "sales", "director", "marketer"];

/* ---------- МАРШРУТИЗАЦИЯ ---------- */
function detectRole(text) {
  const lower = text.toLowerCase();
  const scores = {};
  for (const [key, role] of Object.entries(ROLES)) {
    let s = 0;
    for (const kw of role.keywords) {
      if (lower.includes(kw.toLowerCase())) s++;
    }
    if (s > 0) scores[key] = s;
  }
  const entries = Object.entries(scores);
  if (!entries.length) return "sales";
  const max = Math.max(...entries.map(e => e[1]));
  const top = entries.filter(([, s]) => s === max).map(([k]) => k);
  if (top.length === 1) return top[0];
  for (const r of ROLE_ORDER) if (top.includes(r)) return r;
  return top[0];
}

/* ---------- ГЕНЕРАЦИЯ ОТВЕТОВ ---------- */
function answer(message, roleKey) {
  const role = ROLES[roleKey];
  const m = message.toLowerCase();
  const cx = KNOWLEDGE.company;

  // Продукты/каталог
  let cat = KNOWLEDGE.categories.find(([name]) => m.includes(name.split(" ")[0].toLowerCase()) ||
    (name.includes("Мясо") && /мясо|говядин|свинин|птиц/.test(m)) ||
    (name.includes("Рыба") && /рыб|морепродукт/.test(m)) ||
    (name.includes("Молочная") && /молок|творог|сметан|масло/.test(m)));
  if (!cat && /каталог|ассортимент|что вы поставляете|позици/i.test(m)) cat = null;

  // Разные темы по ключевым словам в теме конкретной роли
  if (roleKey === "lawyer") return lawyerAnswer(m, cx);
  if (roleKey === "accountant") return accountantAnswer(m, cx);
  if (roleKey === "sales") return salesAnswer(m, role, cx, cat);
  if (roleKey === "director") return directorAnswer(m, cx);
  return marketerAnswer(m, cx);
}

function bullet(list) {
  return list.map(x => "• " + x).join("\n");
}

/* ----- ЮРИСТ ----- */
function lawyerAnswer(m, cx) {
  if (/44-фз|44 фз|госзакуп|бюджетн/.test(m)) {
    return `**Контрактная система (44-ФЗ)**\n\nКак работает поставка по 44-ФЗ:\n${bullet(KNOWLEDGE.logistics.stages)}\n\nДокументы для участия:\n${bullet(["Заявка на участие", "Декларация соответствия", "Выписка из ЕГРЮЛ", "Справка об исполнении налогов", "Сертификаты и документы ХАССП"])}\n\nНаш опыт: ${cx.tenders} выигранных тендеров. Работаем по ст. 34, 44, 94 44-ФЗ (контракт, исполнение, приёмка). При сложности — направим к юрисконсульту.`;
  }
  if (/223-фз|223 фз|госкомпан/.test(m)) {
    return `**Закупки по 223-ФЗ**\n\nОсобенности:\n• Работаем с госкорпорациями и компаниями с госучастием (нефтегаз, крупные холдинги)\n• Возможна свобода выбора процедуры\n• Индивидуальные условия и гибкие сроки\n\nПолный комплект документов ${cx.short} готовит в течение 1–2 дней. Потребуется выписка из ЕГРЮЛ и документы ХАССП.`;
  }
  if (/договор|договы|контракт/.test(m)) {
    return `**Договор поставки**\n\nМы работаем по двум схемам:\n• **44-ФЗ** — для бюджетных учреждений и госзаказчиков\n• **Стандартная оферта** — для частных компаний (кафе, магазины)\n\nВ договоре фиксируются: объёмы, сроки, тары/фасовка, температурный режим (от −18°C до +6°C), порядок приёмки и оплаты.\n\nЗакрывающие документы:\n${bullet(KNOWLEDGE.docs)}\n\nСложные вопросы по договору — юрист ${cx.short} рассмотрит в течение рабочего дня.`;
  }
  if (/претенз|рекламац|возврат|брак/.test(m)) {
    return `**Претензии и рекламации**\n\nПорядок действий:\n1. Составить акт приёмки с фиксацией несоответствия\n2. Приложить фото и документы (накладная, ВСД «Меркурий»)\n3. Направить претензию ответственному менеджеру\n\nГарантируем урегулирование в срок до 30 дней (ст. 476 ГК РФ — по качеству товара). Повреждения при доставке оцениваются перевозчиком.`;
  }
  if (/меркурий|всд|ветеринар/.test(m)) {
    return `**Система «Меркурий» (ВСД)**\n\nКаждая партия животноводческой продукции сопровождается электронными ветеринарными документами:\n• Оформление ВСД — мгновенно при отгрузке\n• Полная прослеживаемость от склада до получателя\n• Соответствие приказам МСХ РФ\n\nЭто ключевое требование для тендеров на поставку мяса, рыбы и молочной продукции.`;
  }
  return `**Правовая поддержка ${cx.short}**\n\nГотов помочь по направлениям:\n${bullet(["Договоры и контракты (44-ФЗ / 223-ФЗ)", "Тендерная документация и заявки", "Сертификация и лицензирование", "Претензии и рекламации", "Система «Меркурий» (ВСД)"])}\n\nУточните вопрос — и я подготовлю детальную консультацию со ссылками на нормы.`;
}

/* ----- БУХГАЛТЕР ----- */
function accountantAnswer(m, cx) {
  if (/ндс|vat|20%/.test(m) && /счисл|рассчита|посчита/.test(m)) {
    return `**Расчёт НДС (20%)**\n\nФормула:\nНДС = Сумма без НДС × 0,20\nИтого = Сумма + НДС\n\nПример для поставки на 100 000 ₽ без НДС:\n• НДС = 20 000 ₽\n• Итого к оплате = 120 000 ₽\n\nВ ${cx.short} НДС выделяется корректно в каждом счёте-фактуре, что важно для возмещения налога клиентами.`;
  }
  if (/сроки|сдать|отчетность|отчет|декларац/.test(m)) {
    return `**Сроки сдачи отчётности**\n\n• НДС — декларация до 25-го числа после квартала\n• Налог на прибыль — до 28-го числа после квартала\n• Единая упрощённая декларация — до 20-го числа\n• 6-НДФЛ — по месту учёта в установленные сроки\n• Сведения о среднесписочной численности — до 20 января\n\nДля ${cx.short}: бухгалтерия на связи ${cx.phones.accounting}.`;
  }
  if (/счёт-фактур|счет-фактур|закрыва|документ для|бухгалтери|для бухг/.test(m)) {
    return `**Закрывающие документы**\n\nПосле каждой поставки ${cx.short} предоставляет:\n${bullet(KNOWLEDGE.docs.map(d => d + " (в т.ч. для бухгалтерии клиента)"))}\n\nПроверяйте: правильные реквизиты, НДС 20%, соответствие объёмов накладной и заказа. При расхождении — акт сверки с подключённым отделом.`;
  }
  if (/дебитор|кредитор|задолжен/.test(m)) {
    return `**Учёт задолженности**\n\nРекомендуемая практика:\n• Регламент отсрочки платежа (обычно 7–14 дней для юрлиц)\n• Акт сверки ежемесячно\n• Контроль лимита наличных расчётов 100 000 ₽ по одной сделке\n\nДля данных по дебиторке ${cx.short} — обратитесь в бухгалтерию: ${cx.phones.accounting}.`;
  }
  return `**Бухгалтерский помощник ${cx.short}**\n\nПодскажу по темам:\n${bullet(["Расчёт НДС и налогов", "Счета, акты, счёт-фактуры", "Сроки сдачи отчётности", "Дебиторская/кредиторская задолженность", "Кассовые операции и лимиты", "Работа в 1С и закрывающие документы"])}\n\nЗадайте конкретный вопрос — посчитаю или подскажу регламент.`;
}

/* ----- МЕНЕДЖЕР ПРОДАЖ ----- */
function salesAnswer(m, role, cx, cat) {
  if (cat) {
    const [name, desc] = cat;
    return `**${name}**\n\n${desc}\n\nГарантии: сертификация ГОСТ и ХАССП, ВСД «Меркурий», фасовка под ваши задачи (для говядины — от 1 до 50 кг).\n\nПодготовлю персональный прайс и КП за 2 часа — оставьте заявку на stkompany.ru.`;
  }
  if (/кп|предложени|прайс|цены|сколько|стоимост/.test(m)) {
    return `**Коммерческое предложение**\n\n${cx.short} готовит КП за 2 часа.\n\nУсловия для клиентов:\n${bullet(KNOWLEDGE.advantages.slice(0, 6))}\n\nИндивидуально: скидка от объёма, отсрочка платежа, удобный график поставок.\n\nОставьте заявку на сайте https://stkompany.ru или позвоните ${cx.phones.main}.`;
  }
  if (/доставк|логистик|регион|возим|поступ/.test(m)) {
    return `**Логистика и доставка**\n\n${bullet(KNOWLEDGE.logistics.stages)}\n\nХарактеристики:\n• Регионы: ${KNOWLEDGE.logistics.regions}\n• Температурный режим: ${KNOWLEDGE.logistics.temperature}\n• ${KNOWLEDGE.logistics.dispatch}\n• Автопарк: ${KNOWLEDGE.logistics.fleet}\n\nОтгрузка со склада 1 500 м² в Томске на следующий день после заказа.`;
  }
  if (/говор|мяс|свинин|птиц|субпродукт/.test(m)) {
    return `**Мясная группа (эксклюзив)**\n\nПоставляем говядину напрямую от мясокомбинатов Сибири и ЦФО без посредников:\n• Говядина высший сорт — от 480 ₽/кг\n• Говядина односорная — от 450 ₽/кг\n• Свинина — от 240 ₽/кг, птица — от 195 ₽/кг\n• Фасовка от 1 до 50 кг\n\nКаждая партия — с ВСД «Меркурий» и сертификатами ХАССП. Эксклюзивные контракты = прозрачная себестоимость.`;
  }
  if (/клиент|школ|детск|сад|больниц|бюджет/.test(m)) {
    return `**Работа с бюджетными учреждениями**\n\n${cx.short} — проверенный поставщик для школ, детских садов и больниц:\n• ${cx.tenders} выигранных тендеров\n• Соответствие СанПиН и тендерным требованиям\n• Полный пакет документов под 44-ФЗ\n\nПредложим персональные условия и поможем с заявкой на ЭТП.`;
  }
  return `**Менеджер продаж ${cx.short}**\n\nКатегории в каталоге:\n${bullet(["Мясо и мясопродукты", "Рыба и морепродукты", "Молочная продукция", "Крупы, мука, макароны", "Консервация", "Свежие овощи и фрукты", "Заморозка", "Напитки и бакалея", "Кондитерские изделия"])}\n\nУточните категорию или напишите «КП» — соберу коммерческое предложение.`;
}

/* ----- РУКОВОДИТЕЛЬ ----- */
function directorAnswer(m, cx) {
  if (/риск/.test(m) && /оцен/.test(m) || (/риск/.test(m))) {
    return `**Оценка рисков**\n\nКлючевые риски ${cx.short}:\n• Зависимость от ключевых поставщиков мяса\n• Конкуренция на региональном рынке\n• Изменения в законодательстве о закупках\n\nМеры снижения:\n${bullet(["Диверсификация поставщиков и брендов", "Развитие эксклюзивных контрактов", "Мониторинг изменений 44-ФЗ/223-ФЗ", "Страхование грузов и трекинг автопарка"])}`;
  }
  if (/план|стратег|развити|год|цел/.test(m)) {
    return `**Стратегический план ${cx.short}**\n\nТекущая позиция: ${cx.years} лет, ${cx.tenders} тендеров, склады ${cx.warehouse}, Томская область + СФО.\n\nПриоритеты:\n${bullet(["Расширение географии доставки", "Увеличение доли эксклюзивных контрактов", "Автоматизация процессов (1С → eCommerce)", "Развитие работы с бюджетным сектором", "Усиление digital-продвижения"])}`;
  }
  if (/анализ|аналитик|продаж|отчет|динамик|результат/.test(m)) {
    return `**Аналитика ${cx.short}**\n\nКлючевые метрики:\n• Выигранные тендеры: ${cx.tenders}\n• Опыт: ${cx.years} лет\n• Склад: ${cx.warehouse}\n• Клиенты: 4 сегмента (бюджет, нефтегаз, вахта, розница)\n\nДля детального анализа подключите данные из 1С — сформирую отчёт по KPI и отклонениям. Рекомендация: ежемесячно сводить выручку, число новых клиентов и долю тендерных поставок.`;
  }
  return `**Помощник руководителя**\n\nПодскажу по направлениям:\n${bullet(["Аналитика продаж и KPI", "Стратегия и план развития", "Оценка рисков", "Оптимизация процессов", "Управление персоналом"])}\n\nСформулируйте задачу — подготовлю структурированный ответ.`;
}

/* ----- МАРКЕТОЛОГ ----- */
function marketerAnswer(m, cx) {
  if (/контент|пост|соцсет|вк|телеграм/.test(m)) {
    return `**Контент-план для соцсетей**\n\nТемы (исходя из преимуществ ${cx.short}):\n• «20 лет надёжных поставок» — история компании\n• «2 390 тендеров» — кейсы и репутация\n• Обзоры продукции и брендов\n• Как мы держим температуру от −18°C до +6°C\n• Отзывы клиентов, фото поставок\n\nФорматы: VK — посты 3–5 раз/нед, Telegram — ежедневные короткие сообщения и карусели с прайсами.`;
  }
  if (/конкурент|рынок|позициониров/.test(m)) {
    return `**Позиционирование vs конкуренты**\n\nСильные стороны:\n${bullet(KNOWLEDGE.advantages.slice(0, 6))}\n\nРекомендации:\n• Акцент на опыт и число тендеров в каждой коммуникации\n• Эксклюзив на говядину — ключевой дифференциатор\n• География СФО как преимущество перед локальными поставщиками\n• Членство в ТПП повышает доверие B2B`;
  }
  if (/акци|спецпредлож|скидк для|бонус/.test(m)) {
    return `**Акции и спецпредложения**\n\nИдеи для B2B ${cx.short}:\n• Скидка от объёма (при единовременном заказе от N руб.)\n• Отсрочка платежа 7–14 дней для новых клиентов\n• Программа лояльности для постоянных заказчиков\n• Комплекты «столовая под ключ» (мясо + крупы + бакалея)\n\nКаналы: email-рассылка по базе, рассылка в VK/Telegram, страница на сайте.`;
  }
  return `**Маркетинг ${cx.short}**\n\nГотов проработать:\n${bullet(["Маркетинговая стратегия и позиционирование", "Контент-план для VK / Telegram / сайта", "Акции и спецпредложения для B2B", "Анализ конкурентов и рынка", "Продвижение тендерного бренда (44-ФЗ)"])}\n\nУточните задачу — предложу конкретные действия и каналы.`;
}

/* ---------- РЕАЛЬНЫЙ ИИ (опционально) ---------- */
const AI_SETTINGS_KEY = "stc_ai_settings";
const SUGGESTED_MODELS = {
  gemini: "gemini-2.0-flash (бесплатно, 60 запр/мин). Альтернативы: gemini-1.5-flash, gemini-2.5-flash",
  openrouter: "Бесплатные: meta-llama/llama-3.3-70b-instruct:free, deepseek/deepseek-r1:free, google/gemini-2.0-flash-exp:free",
  custom: "Укажите любую модель вашего провайдера",
};

function loadAiSettings() {
  try {
    return JSON.parse(localStorage.getItem(AI_SETTINGS_KEY) || "{}");
  } catch (e) {
    return {};
  }
}

function buildSystemPrompt(roleKey) {
  const role = ROLES[roleKey];
  const cx = KNOWLEDGE.company;
  const facts = `КОМПАНИЯ (только эти факты, не выдумывай):
- ${cx.name} (${cx.short}), с ${cx.since} года, стаж ${cx.years} лет
- Адрес: ${cx.address}, email: ${cx.email}, тел.: ${cx.phones.main}
- Выигранных тендеров: ${cx.tenders} (44-ФЗ и 223-ФЗ)
- Склады ${cx.warehouse}, автопарк с температурой от −18°C до +6°C
- Профиль роли: ${role.icon} ${role.name}
- Миссия: ${cx.mission}`;
  return `${role.prompt}\n\nБаза знаний по компании СТК:\n${facts}\n\nКаталог категорий:\n${KNOWLEDGE.categories.map(([n, d]) => "• " + n + " — " + d).join("\n")}\n\nЛогистика:\n${KNOWLEDGE.logistics.stages.join("\n")}\n\nПравила: отвечай на русском, кратко и по делу. Если не знаешь точного факта — честно скажи «точной информации нет в моей базе», не придумывай цены. Преимущества компании: ${KNOWLEDGE.advantages.join("; ")}.`;
}

async function callLLM(roleKey, userText) {
  const s = loadAiSettings();
  if (!s.provider || !s.key) return null;

  const system = buildSystemPrompt(roleKey);
  const messages = [
    { role: "system", content: system },
    { role: "user", content: userText },
  ];

  if (s.provider === "gemini") {
    const url = "https://generativelanguage.googleapis.com/v1beta/models/" +
      encodeURIComponent(s.model || "gemini-2.0-flash") + ":generateContent?key=" + encodeURIComponent(s.key);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [
          { role: "user", parts: [{ text: userText }] },
        ],
        generationConfig: { temperature: 0.5, maxOutputTokens: 1024 },
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error("Gemini " + res.status + ": " + err.slice(0, 200));
    }
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join("") || "";
    return text || null;
  }

  if (s.provider === "openrouter") {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + s.key,
        "HTTP-Referer": location.origin,
        "X-Title": "CTK AI Agent",
      },
      body: JSON.stringify({
        model: s.model || "meta-llama/llama-3.3-70b-instruct:free",
        messages,
        temperature: 0.5,
        max_tokens: 1024,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error("OpenRouter " + res.status + ": " + err.slice(0, 200));
    }
    const data = await res.json();
    return data?.choices?.[0]?.message?.content || null;
  }

  if (s.provider === "custom") {
    const base = (s.base || "https://api.openai.com/v1").replace(/\/$/, "");
    const res = await fetch(base + "/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + s.key,
      },
      body: JSON.stringify({
        model: s.model || "gpt-4o-mini",
        messages,
        temperature: 0.5,
        max_tokens: 1024,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error("API " + res.status + ": " + err.slice(0, 200));
    }
    const data = await res.json();
    return data?.choices?.[0]?.message?.content || null;
  }

  return null;
}
const chat = document.getElementById("chat");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const roleBadge = document.getElementById("roleBadge");
let currentRole = "auto";

document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    currentRole = chip.dataset.role;
    roleBadge.textContent = chip.textContent.split(" ")[0];
    updateBadge(currentRole);
  });
});

function updateBadge(roleKey) {
  const r = ROLES[roleKey] || { icon: "🔀", name: "Авто" };
  roleBadge.textContent = r.icon;
}

function addMessage(text, cls) {
  const div = document.createElement("div");
  div.className = "message " + cls;
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  if (cls === "bot" && text.includes("roleTag")) {
    bubble.innerHTML = text;
  } else {
    bubble.innerHTML = hlight(text);
  }
  div.appendChild(bubble);
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function hlight(text) {
  return text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
}

function showTyping() {
  const div = document.createElement("div");
  div.className = "message bot";
  div.id = "typing";
  div.innerHTML = '<div class="bubble typing-dots"><span></span><span></span><span></span></div>';
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById("typing");
  if (el) el.remove();
}

async function respond(userText) {
  const roleKey = currentRole === "auto" ? detectRole(userText) : currentRole;
  const role = ROLES[roleKey];
  updateBadge(roleKey);

  addMessage(userText, "user");
  showTyping();

  let text = null;
  let usedLLM = false;
  try {
    text = await callLLM(roleKey, userText);
    usedLLM = !!text;
  } catch (e) {
    text = null;
  }
  removeTyping();

  const source = usedLLM ? "ИИ" : (currentRole === "auto" ? "определено автоматически" : "выбранный профиль");
  if (!text) text = answer(userText, roleKey);
  const tagged = `<span class="role-tag">${role.icon} ${role.name} · ${source}</span>` + hlight(text);
  addMessage(tagged, "bot");
}

/* ---------- НАСТРОЙКИ ИИ ---------- */
const settingsModal = document.getElementById("settingsModal");
const settingsBtn = document.getElementById("settingsBtn");
const modalClose = document.getElementById("modalClose");
const providerEl = document.getElementById("aiProvider");
const modelEl = document.getElementById("aiModel");
const keyEl = document.getElementById("aiKey");
const baseEl = document.getElementById("aiBase");
const modelSuggest = document.getElementById("modelSuggest");
const testResult = document.getElementById("testResult");
const testBtn = document.getElementById("testBtn");
const saveBtn = document.getElementById("saveBtn");

function openSettings() {
  const s = loadAiSettings();
  providerEl.value = s.provider || "";
  modelEl.value = s.model || "";
  keyEl.value = s.key || "";
  baseEl.value = s.base || "";
  updateSuggest();
  settingsModal.classList.add("open");
}

function closeSettings() {
  settingsModal.classList.remove("open");
  testResult.textContent = "";
  testResult.className = "test-result";
}

function updateSuggest() {
  modelSuggest.textContent = SUGGESTED_MODELS[providerEl.value] || "";
  baseEl.parentElement.style.display = providerEl.value === "custom" ? "" : "none";
}

settingsBtn.addEventListener("click", openSettings);
modalClose.addEventListener("click", closeSettings);
settingsModal.addEventListener("click", (e) => {
  if (e.target === settingsModal) closeSettings();
});
providerEl.addEventListener("change", updateSuggest);

saveBtn.addEventListener("click", () => {
  const settings = {
    provider: providerEl.value,
    model: modelEl.value.trim(),
    key: keyEl.value.trim(),
    base: baseEl.value.trim(),
  };
  localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(settings));
  testResult.textContent = settings.provider ? "Настройки сохранены ✓" : "ИИ отключён — агент отвечает по готовым ответам";
  testResult.className = "test-result ok";
});

testBtn.addEventListener("click", async () => {
  const settings = {
    provider: providerEl.value,
    model: modelEl.value.trim(),
    key: keyEl.value.trim(),
    base: baseEl.value.trim(),
  };
  if (!settings.provider || !settings.key) {
    testResult.textContent = "Выберите провайдера и введите ключ";
    testResult.className = "test-result err";
    return;
  }
  testResult.textContent = "Проверяю связь с нейросетью…";
  testResult.className = "test-result";
  try {
    const reply = await callLLM("sales", "Скажи одним словом: все системы работают?");
    testResult.textContent = "Связь есть ✓ Модель ответила: " + reply.slice(0, 80);
    testResult.className = "test-result ok";
  } catch (e) {
    testResult.textContent = "Ошибка: " + e.message;
    testResult.className = "test-result err";
  }
});

updateBadge("auto");

function send() {
  const value = input.value.trim();
  if (!value) return;
  input.value = "";
  input.style.height = "auto";
  respond(value);
}

sendBtn.addEventListener("click", send);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    send();
  }
});
input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = Math.min(input.scrollHeight, 120) + "px";
});