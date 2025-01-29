const card = document.getElementById('card');
const counter = document.getElementById('counter');
const scoreElement = document.getElementById('score');
const endGameElement = document.getElementById('end-game');
const finalScoreElement = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

let isDragging = false;
let startX, offsetX;

// Datos de ejemplo (preguntas e imágenes)
const questions = [
    { image: "https://picsum.photos/150", question: "¿Es esta persona un científico famoso?", answer: true },
    { image: "https://picsum.photos/150", question: "¿Es esta persona un artista reconocido?", answer: false },
    { image: "https://picsum.photos/150", question: "¿Es esta persona un político importante?", answer: true },
];
let currentIndex = 0;
let correctAnswers = 0;

// Función para actualizar la tarjeta
function updateCard() {
    const cardImage = card.querySelector('.card-image');
    const cardQuestion = card.querySelector('.card-question');
    cardImage.src = questions[currentIndex].image;
    cardQuestion.textContent = questions[currentIndex].question;
    card.style.backgroundColor = '#fff'; // Restablecer el color de fondo a blanco
    counter.textContent = `Pregunta ${currentIndex + 1} de ${questions.length}`; // Actualizar contador

    // Aplicar la animación de rebote
    card.classList.add('bounce');

    // Eliminar la clase de rebote después de que termine la animación
    setTimeout(() => {
        card.classList.remove('bounce');
    }, 800); // Duración de la animación: 800ms
}

// Función para actualizar la puntuación
function updateScore(isCorrect) {
    if (isCorrect) {
        correctAnswers++;
    }
    scoreElement.textContent = `Correctas: ${correctAnswers}/${questions.length}`;
}

// Función para restablecer la tarjeta al centro
function resetCard() {
    card.style.transition = 'transform 0.3s ease, background-color 0.3s ease';
    card.style.transform = 'translate(0, 0) rotate(0deg)';
    card.style.backgroundColor = '#fff'; // Restablecer color de fondo
}

// Función para manejar el final del deslizamiento
function handleSwipeEnd() {
    if (Math.abs(offsetX) > 100) {
        const isCorrect = (offsetX > 0 && questions[currentIndex].answer) || (offsetX < 0 && !questions[currentIndex].answer);
        updateScore(isCorrect);

        // Animación para que la tarjeta "vuele" fuera de la pantalla
        card.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
        card.style.transform = `translate(${offsetX > 0 ? 500 : -500}px, 0) rotate(${offsetX * 0.2}deg)`;
        card.style.opacity = '0';

        // Esperar a que termine la animación antes de actualizar la tarjeta
        setTimeout(() => {
            currentIndex++;

            // Verificar si el juego ha terminado
            if (currentIndex >= questions.length) {
                showEndGame();
            } else {
                updateCard();

                // Restablecer la tarjeta al centro sin animación
                card.style.transition = 'none'; // Desactivar transición
                card.style.transform = 'translate(0, 0) rotate(0deg)';
                card.style.opacity = '1';

                // Reactivar la transición después de un breve retraso
                setTimeout(() => {
                    card.style.transition = 'transform 0.3s ease, background-color 0.3s ease';
                }, 10); // Breve retraso para reactivar la transición
            }
        }, 500); // Esperar 500ms para que termine la animación
    } else {
        resetCard();
    }
}

// Función para lanzar el confeti
function launchConfetti() {
    confetti({
        particleCount: 100, // Cantidad de partículas de confeti
        spread: 70, // Ángulo de dispersión
        origin: { y: 0.6 }, // Origen del confeti (parte inferior de la pantalla)
    });
}

// Función para mostrar el mensaje de fin del juego
function showEndGame() {
    endGameElement.classList.remove('hidden');
    finalScoreElement.textContent = `Respuestas correctas: ${correctAnswers} de ${questions.length}`;

    // Lanzar el confeti si todas las respuestas son correctas
    if (correctAnswers === questions.length) {
        launchConfetti();
    }
}

// Función para reiniciar el juego
function restartGame() {
    currentIndex = 0;
    correctAnswers = 0;

    // Restablecer la tarjeta a su estado inicial
    card.style.transition = 'none'; // Desactivar transición temporalmente
    card.style.transform = 'translate(0, 0) rotate(0deg)'; // Centrar la tarjeta
    card.style.opacity = '1'; // Hacerla visible
    card.style.backgroundColor = '#fff'; // Restablecer el color de fondo

    // Actualizar la tarjeta y la puntuación
    updateCard();
    scoreElement.textContent = `Correctas: 0/${questions.length}`;

    // Ocultar el mensaje de fin del juego
    endGameElement.classList.add('hidden');

    // Reactivar la transición después de un breve retraso
    setTimeout(() => {
        card.style.transition = 'transform 0.3s ease, background-color 0.3s ease';
    }, 10); // Breve retraso para reactivar la transición
}

// Evento para reiniciar el juego
restartButton.addEventListener('click', restartGame);

// Eventos para el deslizamiento
card.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    card.style.transition = 'none'; // Desactiva la transición mientras se arrastra
});

card.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault(); // Evita el scroll no deseado

    offsetX = e.clientX - startX;
    // Limita el movimiento horizontal
    card.style.transform = `translate(${offsetX}px, 0) rotate(${offsetX * 0.1}deg)`;

    // Cambiar el color de fondo mientras se desliza
    if (offsetX > 100) {
        card.style.backgroundColor = '#d4edda'; // Verde para "Verdadero"
    } else if (offsetX < -100) {
        card.style.backgroundColor = '#f8d7da'; // Rojo para "Falso"
    } else {
        card.style.backgroundColor = '#fff'; // Blanco si no se ha deslizado lo suficiente
    }
});

card.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    handleSwipeEnd();
});

card.addEventListener('mouseleave', () => {
    if (!isDragging) return;
    isDragging = false;
    handleSwipeEnd();
});

card.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX; // Capturar posición inicial del toque
    card.style.transition = 'none'; // Desactiva la transición mientras se arrastra
});

card.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault(); // Evita el scroll no deseado

    offsetX = e.touches[0].clientX - startX;
    card.style.transform = `translate(${offsetX}px, 0) rotate(${offsetX * 0.1}deg)`;

    if (offsetX > 100) {
        card.style.backgroundColor = '#d4edda';
    } else if (offsetX < -100) {
        card.style.backgroundColor = '#f8d7da';
    } else {
        card.style.backgroundColor = '#fff';
    }
});

card.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    handleSwipeEnd();
});


// Inicializar la primera tarjeta
updateCard();