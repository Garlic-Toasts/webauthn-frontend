// Получение текущего времени
var currentTime = new Date();

// Форматирование времени в строку с помощью функции pad()
var formattedTime = currentTime.getHours().toString().padStart(2, '0') + ":" +
                    currentTime.getMinutes().toString().padStart(2, '0') + ":" +
                    currentTime.getSeconds().toString().padStart(2, '0');

// Обновление текста внутри элемента span с id="session-start-time"
document.getElementById("session-start-time").textContent = formattedTime;