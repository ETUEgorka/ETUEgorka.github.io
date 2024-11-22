// Данные о корпусах и этажах
const buildings = {
    "1": 5,
    "2": 4,
    "3": 3,
    "4": 6,
    "5": 4,
    "6": 2,
    "7": 7,
    "P": 3,
    "C": 5,
    "D": 4,
    "K": 4,
    "M": 5,
    "E": 3,
    "O": 4,
    "T": 2
};

// База данных помещений и зон
const places = [
    { id: "101", floor: 1, building: "1", type: "аудитория", color: "#6da9f2" },
    { id: "102", floor: 1, building: "1", type: "аудитория", color: "#6da9f2" },
    { id: "201", floor: 2, building: "1", type: "аудитория", color: "#6da9f2" },
    { id: "Дарья", floor: 1, building: "2", type: "зона еды", color: "#f2d06d" },
    { id: "Варя", floor: 2, building: "2", type: "зона еды", color: "#f2d06d" },
    { id: "Буфет первого корпуса", floor: 1, building: "1", type: "зона еды", color: "#f2d06d" },
    { id: "314А", floor: 3, building: "1", type: "лаборатория", color: "#d088f2" },
    { id: "401B", floor: 4, building: "2", type: "лаборатория", color: "#d088f2" },
    { id: "505C", floor: 5, building: "3", type: "аудитория", color: "#6da9f2" },
    { id: "Коридор_1_1", floor: 1, building: "1", type: "коридор", color: "#d3d3d3" },
    { id: "Коридор_2_1", floor: 2, building: "1", type: "коридор", color: "#d3d3d3" },
    { id: "K101", floor: 1, building: "K", type: "аудитория", color: "#6da9f2" },
    { id: "M202", floor: 2, building: "M", type: "аудитория", color: "#6da9f2" },
    { id: "E303", floor: 3, building: "E", type: "лаборатория", color: "#d088f2" },
    { id: "T505", floor: 5, building: "T", type: "прочие зоны", color: "#9fc6a8" }
];


// Функция для улучшенных подсказок
function getSuggestions(query) {
    if (!query) return [];

    // Фильтрация по совпадению с id, типом или названием (независимо от регистра)
    const lowerCaseQuery = query.toLowerCase();
    return places.filter(place =>
        place.id.toLowerCase().includes(lowerCaseQuery) ||
        place.type.toLowerCase().includes(lowerCaseQuery) ||
        (`Корпус ${place.building}`).toLowerCase().includes(lowerCaseQuery) ||
        (`Этаж ${place.floor}`).toLowerCase().includes(lowerCaseQuery)
    ).slice(0, 5); // Ограничение до 5 подсказок
}

// Пример использования функции подсказок
document.addEventListener("DOMContentLoaded", () => {
    const fields = [
        { inputId: "audience-search", listId: "suggestions-list" },
        { inputId: "route-from", listId: "suggestions-list-from" },
        { inputId: "route-to", listId: "suggestions-list-to" },
    ];

    fields.forEach(({ inputId, listId }) => {
        const inputElement = document.getElementById(inputId);
        const suggestionList = document.getElementById(listId);

        inputElement.addEventListener("input", () => {
            const query = inputElement.value;
            const suggestions = getSuggestions(query); // Используем реальную функцию подсказок

            suggestionList.innerHTML = ""; // Очищаем предыдущие подсказки

            if (suggestions.length === 0) {
                suggestionList.style.display = "none"; // Прячем список, если подсказок нет
                return;
            }

            suggestions.forEach(suggestion => {
                const li = document.createElement("li");
                li.textContent = `${suggestion.id} (Корпус ${suggestion.building}, Этаж ${suggestion.floor}, ${suggestion.type})`;
                li.onclick = () => {
                    inputElement.value = suggestion.id;
                    suggestionList.innerHTML = ""; // Очищаем список
                    suggestionList.style.display = "none"; // Прячем список
                };
                suggestionList.appendChild(li);
            });

            setPosition(inputElement, suggestionList); // Расположение списка
            suggestionList.style.display = "block"; // Показываем список
        });

        // Скрываем список при клике вне поля
        document.addEventListener("click", (e) => {
            if (!inputElement.contains(e.target) && !suggestionList.contains(e.target)) {
                suggestionList.style.display = "none";
            }
        });
    });
});

// Устанавливаем позицию списка подсказок
function setPosition(inputElement, suggestionList) {
    suggestionList.style.position = "absolute";
    suggestionList.style.top = `${inputElement.offsetTop + inputElement.offsetHeight}px`; // Под полем
    suggestionList.style.left = `${inputElement.offsetLeft}px`; // Совпадает с началом поля
    suggestionList.style.width = `${inputElement.offsetWidth}px`; // Ширина как у поля
    suggestionList.style.zIndex = "1000";
}

