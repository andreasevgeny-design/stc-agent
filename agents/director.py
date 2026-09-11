"""
Агент-помощник руководителя для ООО «СТК»
Аналитика, стратегия и управление
"""

from typing import Dict, List, Optional
from dataclasses import dataclass


@dataclass
class KPI:
    """Ключевой показатель эффективности"""
    name: str
    target: float
    actual: float
    unit: str = ""

    @property
    def completion_rate(self) -> float:
        if self.target == 0:
            return 0
        return round((self.actual / self.target) * 100, 1)


class DirectorAgent:
    """AI-агент помощник руководителя СТК"""

    def __init__(self):
        self.role = "руководитель"
        self.company = "ООО «Сибирская Торговая Компания»"
        self.key_metrics = {
            "tenders_won": 2390,
            "years_on_market": 20,
            "warehouse_area": "1 500 м²",
            "delivery_regions": "Томская область + СФО",
        }

    def analyze_performance(self, data: Dict) -> Dict:
        """Анализ показателей эффективности"""
        return {
            "period": data.get("period", "не указан"),
            "revenue": data.get("revenue", 0),
            "tenders_participated": data.get("tenders", 0),
            "new_clients": data.get("new_clients", 0),
            "recommendations": self._generate_recommendations(data),
        }

    def _generate_recommendations(self, data: Dict) -> List[str]:
        """Генерация рекомендаций на основе данных"""
        recommendations = []
        if data.get("revenue", 0) < 1_000_000:
            recommendations.append("Рассмотреть расширение клиентской базы")
        if data.get("tenders", 0) < 10:
            recommendations.append("Увеличить количество поданных заявок на тендеры")
        if data.get("new_clients", 0) < 5:
            recommendations.append("Активизировать работу с новыми клиентами")
        return recommendations

    def strategic_plan(self, goals: List[str]) -> Dict:
        """Формирование стратегического плана"""
        return {
            "company": self.company,
            "current_position": {
                "experience": "20 лет",
                "tenders": "2 390 выигранных",
                "infrastructure": "Склады 1 500 м², автопарк",
            },
            "goals": goals,
            "actions": [
                "Расширение географии доставки",
                "Увеличение ассортимента",
                "Автоматизация бизнес-процессов",
                "Развитие eCommerce-направления",
            ],
        }

    def risk_assessment(self, situation: str) -> Dict:
        """Оценка рисков"""
        return {
            "situation": situation,
            "risk_level": "требует анализа",
            "factors": [
                "Зависимость от ключевых поставщиков",
                "Конкуренция на региональном рынке",
                "Изменения в законодательстве",
                "Логистические риски",
            ],
            "mitigation": [
                "Диверсификация поставщиков",
                "Развитие эксклюзивных контрактов",
                "Мониторинг изменений в законах",
                "Страхование грузов",
            ],
        }

    def get_system_prompt(self) -> str:
        return """Ты — Помощник руководителя ООО «СТК». Помогай с:
- Аналитикой продаж и эффективности
- Мониторингом KPI
- Управленческими отчётами
- Планированием и стратегией
- Оптимизацией бизнес-процессов
- Оценкой рисков
Формулируй краткие, структурированные выводы с конкретными действиями."""
