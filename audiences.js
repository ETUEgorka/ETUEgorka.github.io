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
    { id: "4501", floor: 5, building: "4", type: "аудитория"},
	{ id: "4502", floor: 5, building: "4", type: "аудитория"},
	{ id: "4503", floor: 5, building: "4", type: "аудитория"},
	{ id: "4503-1", floor: 5, building: "4", type: "аудитория"},
	{ id: "4504", floor: 5, building: "4", type: "аудитория"},
	{ id: "4504-1", floor: 5, building: "4", type: "аудитория"},
	{ id: "4505", floor: 5, building: "4", type: "аудитория"},
	{ id: "4506", floor: 5, building: "4", type: "аудитория"},
	{ id: "4507", floor: 5, building: "4", type: "аудитория"},
	{ id: "4508", floor: 5, building: "4", type: "аудитория"},
	{ id: "4508-1", floor: 5, building: "4", type: "аудитория"},
	{ id: "4508-2", floor: 5, building: "4", type: "аудитория"},
	{ id: "4509", floor: 5, building: "4", type: "аудитория"},
	
	{ id: "toilet_man", floor: 5, building: "4", type: "туалет мужской"},

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






        /**
         * Инициализация корпусов
         * Заполняет список корпусов при загрузке страницы
         */
        function initBuildings() {
			const buildingSelect = document.getElementById("building");
			for (const building in buildings) {
				const option = document.createElement("option");
				option.value = building;
				option.textContent = `Корпус ${building}`;
				buildingSelect.appendChild(option);
			}
			updateFloors(); // Обновляем этажи для первого корпуса
			loadFloorMap(); // Загружаем карту для первого корпуса и этажа
		}


        /**
         * Обновление этажей в зависимости от выбранного корпуса
         */
        function updateFloors() {
			const building = document.getElementById("building").value;
			const floorSelect = document.getElementById("floor");
			const floors = buildings[building] || 0;

			floorSelect.innerHTML = ""; // Очищаем старые этажи

			for (let i = 1; i <= floors; i++) {
				const option = document.createElement("option");
				option.value = i;
				option.textContent = `Этаж ${i}`;
				floorSelect.appendChild(option);
			}
			loadFloorMap(); // Загружаем карту после обновления списка этажей
		}


        /**
         * Отображение подсказок при поиске аудитории
         */
        function showSuggestions(query) {
            const list = document.getElementById("suggestions-list");
            list.innerHTML = ""; // Очищаем старые подсказки
            if (!query) return; // Если поле пустое, не отображаем подсказки

            // Фильтруем список по запросу
            const matches = suggestions.filter(item => item.toLowerCase().includes(query.toLowerCase()));
            matches.forEach(match => {
                const li = document.createElement("li");
                li.textContent = match;
                li.onclick = () => {
                    document.getElementById("audience-search").value = match;
                    list.innerHTML = ""; // Убираем подсказки
                };
                list.appendChild(li);
            });
        }

        /**
         * Построение маршрута
         */
        function calculateRoute() {
            const from = document.getElementById("route-from").value;
            const to = document.getElementById("route-to").value;
            if (from && to) {
                alert(`Построение маршрута от ${from} до ${to}`);
            } else {
                alert("Пожалуйста, заполните оба поля!");
            }
        }

        /**
         * Загрузка SVG карты этажа
         */
        function loadFloorMap() {
    const building = document.getElementById("building").value;
    const floor = document.getElementById("floor").value;

    if (!building || !floor) return; // Ничего не делаем, если данные не выбраны

    const mapFile = `maps/${building}-${floor}.svg`; // Путь к файлу
    const svgContainer = document.getElementById("svg-container");

    fetch(mapFile)
        .then(response => {
            if (response.ok) {
                return response.text(); // Получаем содержимое SVG как текст
            } else {
                console.error(`Файл карты ${mapFile} не найден.`);
                svgContainer.innerHTML = ""; // Очищаем контейнер
            }
        })
        .then(svgContent => {
            svgContainer.innerHTML = svgContent; // Встраиваем SVG в контейнер
            enableSvgInteraction(); // Подключаем взаимодействие
        })
        .catch(err => {
            console.error(`Ошибка при загрузке карты: ${err}`);
            svgContainer.innerHTML = ""; // Очищаем контейнер
        });
}



        // Инициализация при загрузке страницы
        document.addEventListener("DOMContentLoaded", initBuildings);

document.addEventListener("DOMContentLoaded", () => {
    const svgContainer = document.getElementById("svg-container");
    const floorMap = document.getElementById("floor-map");

    let scale = 1;
    let panX = 0, panY = 0;
    let isDragging = false;
    let startX, startY;

    // Масштабирование
    svgContainer.addEventListener("wheel", (event) => {
        event.preventDefault();
        const delta = event.deltaY > 0 ? 0.9 : 1.1; // Уменьшаем или увеличиваем масштаб
        scale = Math.min(Math.max(scale * delta, 0.5), 3); // Ограничиваем масштаб
        floorMap.style.transform = `scale(${scale}) translate(${panX}px, ${panY}px)`;
    });

    // Начало перетаскивания
    svgContainer.addEventListener("mousedown", (event) => {
        isDragging = true;
        startX = event.clientX - panX;
        startY = event.clientY - panY;
        svgContainer.style.cursor = "grabbing";
    });

    // Завершение перетаскивания
    document.addEventListener("mouseup", () => {
        isDragging = false;
        svgContainer.style.cursor = "grab";
    });

    // Перетаскивание
    svgContainer.addEventListener("mousemove", (event) => {
        if (isDragging) {
            panX = event.clientX - startX;
            panY = event.clientY - startY;
            floorMap.style.transform = `scale(${scale}) translate(${panX}px, ${panY}px)`;
        }
    });
});



function enableSvgInteraction() {
    const svgElement = document.querySelector("#svg-container svg");

    if (!svgElement) return; // Если SVG не загружен, ничего не делаем

    let scale = 1;
    let panX = 0, panY = 0;
    let isDragging = false;
    let startX, startY;

    const svgContainer = document.getElementById("svg-container");

    // Масштабирование
    svgContainer.addEventListener("wheel", (event) => {
        event.preventDefault();
        const delta = event.deltaY > 0 ? 0.9 : 1.1; // Уменьшаем или увеличиваем масштаб
        scale = Math.min(Math.max(scale * delta, 0.5), 3); // Ограничиваем масштаб
        svgElement.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
        svgElement.style.transformOrigin = "center center";
    });

    // Начало перетаскивания
    svgContainer.addEventListener("mousedown", (event) => {
        isDragging = true;
        startX = event.clientX - panX;
        startY = event.clientY - panY;
        svgContainer.style.cursor = "grabbing";
    });

    // Завершение перетаскивания
    document.addEventListener("mouseup", () => {
        isDragging = false;
        svgContainer.style.cursor = "grab";
    });

    // Перетаскивание
    svgContainer.addEventListener("mousemove", (event) => {
        if (isDragging) {
            panX = event.clientX - startX;
            panY = event.clientY - startY;
            svgElement.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
        }
    });
}

