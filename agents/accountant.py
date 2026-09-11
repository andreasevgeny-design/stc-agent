"""
Агент-бухгалтер для ООО «СТК»
Помощь по учёту, налогам и отчётности
"""

from typing import Dict, List, Optional
from datetime import date


class AccountantAgent:
    """AI-агент бухгалтера СТК"""

    def __init__(self):
        self.role = "бухгалтер"
        self.company = "ООО «Сибирская Торговая Компания»"
        self.vat_rate = 0.20  # НДС 20%

    def calculate_vat(self, amount: float) -> Dict:
        """Расчёт НДС"""
        vat = amount * self.vat_rate
        total = amount + vat
        return {
            "sum_without_vat": amount,
            "vat_rate": f"{self.vat_rate * 100}%",
            "vat_amount": round(vat, 2),
            "total_with_vat": round(total, 2),
        }

    def create_invoice(
        self,
        client: str,
        items: List[Dict],
        date: Optional[str] = None,
    ) -> Dict:
        """Формирование счёта на оплату"""
        total = sum(item.get("price", 0) * item.get("quantity", 1) for item in items)
        vat_data = self.calculate_vat(total)
        return {
            "invoice_number": f"СТК-{date.today().strftime('%Y%m%d')}-001",
            "date": date or date.today().isoformat(),
            "client": client,
            "items": items,
            **vat_data,
        }

    def check_closing_documents(self, documents: List[str]) -> Dict:
        """Проверка закрывающих документов"""
        required = [
            "Счёт-фактура",
            "Товарная накладная (ТОРГ-12)",
            "Акт приёма-передачи",
        ]
        missing = [doc for doc in required if doc not in documents]
        return {
            "status": "ОК" if not missing else "Требуется доработка",
            "provided": documents,
            "missing": missing,
            "recommendation": "Убедитесь в наличии всех документов перед оплатой",
        }

    def get_accounting_reminders(self) -> List[str]:
        """Напоминания по отчётности"""
        return [
            "Декларация по НДС — до 25 числа месяца, следующего за кварталом",
            "Декларация по налогу на прибыль — до 28 числа месяца, следующего за кварталом",
            "Единая упрощённая декларация — до 20 числа месяца, следующего за кварталом",
            "Сведения о среднесписочной численности — до 20 января",
            "Справки 2-НДФЛ и 6-НДФЛ — в установленные сроки",
        ]

    def get_system_prompt(self) -> str:
        return """Ты — Бухгалтер ООО «СТК». Помогай с:
- Расчётом НДС и налогов
- Подготовкой счетов и актов
- Проверкой закрывающих документов
- Отчётностью в ФНС, ПФР, ФСС
- Работой в 1С
Напоминай о сроках и лимитах."""
