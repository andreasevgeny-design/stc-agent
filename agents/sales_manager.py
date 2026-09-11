"""
Агент-менеджер продаж для ООО «СТК»
Работа с клиентами, КП, ассортиментом и доставкой
"""

from typing import Dict, List, Optional


class SalesManagerAgent:
    """AI-агент менеджера продаж СТК"""

    def __init__(self):
        self.role = "менеджер продаж"
        self.company = "ООО «Сибирская Торговая Компания»"
        self.advantages = [
            "20 лет на рынке",
            "2 390 выигранных тендеров",
            "КП за 2 часа",
            "Собственный автопарк",
            "Склады 1 500 м²",
            "Эксклюзивные контракты на говядину",
        ]

    def create_commercial_offer(
        self,
        client_type: str,
        products: List[Dict],
        volume: str = "стандартный",
    ) -> Dict:
        """Формирование коммерческого предложения"""
        total = sum(p.get("price", 0) * p.get("quantity", 1) for p in products)
        discount = self._calculate_discount(total, volume)
        return {
            "company": self.company,
            "client_type": client_type,
            "products": products,
            "total": total,
            "discount": discount,
            "final_price": round(total * (1 - discount), 2),
            "delivery": "По Томской области и СФО",
            "payment_terms": "Гибкие схемы оплаты",
            "advantages": self.advantages,
        }

    def _calculate_discount(self, total: float, volume: str) -> float:
        """Расчёт скидки в зависимости от объёма"""
        discounts = {
            "мелкий": 0.0,
            "стандартный": 0.03,
            "крупный": 0.05,
            "оптовый": 0.08,
        }
        return discounts.get(volume, 0.03)

    def get_product_info(self, category: str) -> Dict:
        """Информация о категории продуктов"""
        catalog = {
            "мясо": {
                "items": ["Говядина", "Свинина", "Птица", "Субпродукты", "Фарш"],
                "brands": ["Сибирь", "Долинские Колбасы", "СибАгро", "МПФ"],
                "price_from": "от 165 ₽/кг",
            },
            "рыба": {
                "items": ["Минтай", "Горбуша", "Кета", "Сельдь", "Семга"],
                "brands": ["Примрыбснаб", "Владкон", "Магадан"],
                "price_from": "от 185 ₽/кг",
            },
            "молочка": {
                "items": ["Молоко", "Творог", "Сметана", "Масло", "Сгущённое"],
                "brands": ["Деревенское молочко", "Алтайская Буренка", "Домик в деревне"],
                "price_from": "от 65 ₽",
            },
            "крупы": {
                "items": ["Гречка", "Рис", "Пшено", "Мука", "Макароны"],
                "brands": ["СТК", "Ларица", "Алейка", "Мельник"],
                "price_from": "от 23 ₽/кг",
            },
        }
        return catalog.get(category, {"error": "Категория не найдена"})

    def prepare_tender_docs(self, tender_type: str) -> List[str]:
        """Подготовка документов для тендера"""
        base_docs = [
            "Спецификация на продукцию",
            "Сертификаты соответствия",
            "Ветеринарные сопроводительные документы",
            "Декларации ТР ТС",
        ]
        if tender_type == "44-ФЗ":
            base_docs.extend([
                "Заявка на участие",
                "Декларация соответствия",
                "Выписка из ЕГРЮЛ",
                "Справка об исполнении налоговых обязательств",
            ])
        return base_docs

    def get_system_prompt(self) -> str:
        return """Ты — Менеджер продаж ООО «СТК». Помогай с:
- Формированием коммерческих предложений
- Работой с клиентами всех категорий
- Подготовкой спецификаций и прайс-листов
- Согласованием условий поставки
- Документами для тендеров
Акцентируй преимущества: 20 лет, 2390 тендеров, эксклюзивные цены."""
