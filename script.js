const card = document.getElementById('card');
const counter = document.getElementById('counter');
const scoreElement = document.getElementById('score');
const endGameElement = document.getElementById('end-game');
const finalScoreElement = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');
const tutorial = document.getElementById('tutorial');
const optionLeft = document.querySelector('.option-left');
const optionRight = document.querySelector('.option-right');

let isDragging = false;
let startX, offsetX;

// Datos de ejemplo (preguntas e imágenes)
const questions = [
    { image: "https://picsum.photos/150", question: "¿Es esta persona un científico famoso?", optionA: "Opcion a", optionB: "Opcion B", correctAnswer: "A" },
    { image: "https://picsum.photos/150", question: "¿Es esta persona un artista reconocido?", optionA: "Hola", optionB: "Chau", correctAnswer: "A" },
    { image: "https://picsum.photos/150", question: "¿Es esta persona un político importante?", optionA: "Rojo", optionB: "Azul", correctAnswer: "A" },
];
const gameState = {
    currentIndex: 0,
    correctAnswers: 0,
};


// Obtener el contenido de la tarjeta
function getCardContent(index) {
    return {
        image: questions[index].image,
        question: questions[index].question,
        counter: `Pregunta ${index + 1} de ${questions.length}`,
        optionA: questions[index].optionA,
        optionB: questions[index].optionB,
        correctAnswer: questions[index].correctAnswer,
    };
}

// Función para renderizar la tarjeta en el DOM
function renderCard() {
    const content = getCardContent(gameState.currentIndex);
    card.querySelector('.card-image').src = content.image; // Actualizar la imagen
    card.querySelector('.card-question').textContent = content.question; // Actualizar la pregunta
    counter.textContent = content.counter; // Actualizar contador
    //card.style.backgroundColor = '#fff';

    // Aplicar la animación de rebote
    card.classList.add('bounce');

    // Eliminar la clase de rebote después de que termine la animación
    setTimeout(() => {
        card.classList.remove('bounce');
    }, 800); // Duración de la animación: 800ms

}

// Función para actualizar la tarjeta
function updateCard() {
    // Llamamos a la función para actualizar la UI
    renderCard();

    const content = getCardContent(gameState.currentIndex);
    document.querySelector('.option-left').textContent = content.optionA;
    document.querySelector('.option-right').textContent = content.optionB;

    // Activar la animación de balanceo y mostrar tutorial al inicio
    if (gameState.currentIndex === 0) {
        card.classList.add('tutorial-active');
        tutorial.classList.remove('hidden'); // Mostrar texto ayuda
    }
}

// Función para actualizar la puntuación
function updateScore(isCorrect) {
    if (isCorrect) {
        gameState.correctAnswers++;
    }
    scoreElement.textContent = `Correctas: ${gameState.correctAnswers}/${questions.length}`;
}

// Función para restablecer la tarjeta al centro
function resetCard() {
    card.style.transition = 'transform 0.3s ease, background-color 0.3s ease';
    card.style.transform = 'translate(0, 0) rotate(0deg)';
    //card.style.backgroundColor = '#fff'; // Restablecer color de fondo
}

function evaluateAnswer(offsetX, answer) {
    return (offsetX > 0 && answer) || (offsetX < 0 && !answer);
}

// Animación para que la tarjeta "vuele" fuera de la pantalla
function animateCardSwipe(offsetX) {
    card.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    card.style.transform = `translate(${offsetX > 0 ? 500 : -500}px, 0) rotate(${offsetX * 0.2}deg)`;
    card.style.opacity = '0';
}

// Función para manejar el final del deslizamiento
function handleSwipeEnd() {
    if (Math.abs(offsetX) > 100) {

        const isCorrect = evaluateAnswer(offsetX, questions[gameState.currentIndex].answer);
        updateScore(isCorrect);
        animateCardSwipe(offsetX);

        // Esperar a que termine la animación antes de actualizar la tarjeta
        setTimeout(() => {
            gameState.currentIndex++;

            // Verificar si el juego ha terminado
            if (gameState.currentIndex >= questions.length) {
                showEndGame();
            } else {
                updateCard();
                resetCardStyles();

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
    finalScoreElement.textContent = `Respuestas correctas: ${gameState.correctAnswers} de ${questions.length}`;

    // Lanzar el confeti si todas las respuestas son correctas
    if (gameState.correctAnswers === questions.length) {
        launchConfetti();
    }
}

// Restablecer el estado visual de la tarjeta a su estado inicial
function resetCardStyles() {
    card.style.transition = 'none'; // Desactivar transición temporalmente
    card.style.transform = 'translate(0, 0) rotate(0deg)'; // Centrar la tarjeta
    card.style.display = 'flex'; // Mostrar la tarjeta
    card.style.opacity = '1'; // Hacerla visible
    
    card.classList.remove('card-left-active', 'card-right-active'); // Restalecer color de fondo

    updateOptionStyles(true, true); // Restablecer las opciones
}

function resetGameState() {
    gameState.currentIndex = 0;
    gameState.correctAnswers = 0;
}

// Función para reiniciar el juego
function restartGame() {
    resetGameState();
    resetCardStyles();

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

// Función auxiliar para actualizar las clases de las opciones
function updateOptionStyles(leftSelected, rightSelected) {
    const optionLeft = document.querySelector('.option-left');
    const optionRight = document.querySelector('.option-right');

    // Restablecer todas las clases
    optionLeft.classList.remove('option-unselected');
    optionRight.classList.remove('option-unselected');

    // Aplicar las clases según los parámetros
    if (leftSelected && rightSelected) {
        optionLeft.classList.remove('option-unselected');
        optionRight.classList.remove('option-unselected');
    }
    else if (leftSelected) {
        optionRight.classList.add('option-unselected'); // Opacar derecha
    } else if (rightSelected) {
        optionLeft.classList.add('option-unselected'); // Opacar izquierda
    } else {
        optionLeft.classList.add('option-unselected');
        optionRight.classList.add('option-unselected');
    }
}

// Funcion para manejar el movimiento de arrastre
function handleDragMove(event) {
    if (!isDragging) return;
    event.preventDefault(); // Evita el scroll no deseado

    offsetX = (event.clientX || event.touches[0].clientX) - startX;

    // Limita el movimiento horizontal
    card.style.transform = `translate(${offsetX}px, 0) rotate(${offsetX * 0.1}deg)`;

    // Cambiar el color de fondo mientras se desliza
    if (offsetX > 100) {
        card.classList.add('card-right-active'); // Verde para Derecha
        updateOptionStyles(false, true); // Seleccionar opción derecha
    } else if (offsetX < -100) {
        card.classList.add('card-left-active'); // Rojo para Izquierda
        updateOptionStyles(true, false); // Seleccionar opción izquierda
    } else {
        card.classList.remove('card-left-active', 'card-right-active'); // Blanco si no se ha deslizado lo suficiente
        updateOptionStyles(false, false); // Ninguna opción seleccionada
    }

    // Ocultar tutorial solo en la primera interacción
    if (!tutorial.classList.contains('hidden')) {
        tutorial.classList.add('hidden'); // Ocultar texto
        card.classList.remove('tutorial-active');// Detener animación
    }
}

// Eventos para el deslizamiento
card.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX; // Capturar posición inicial del clic
    card.style.transition = 'none'; // Desactiva la transición mientras se arrastra
});
card.addEventListener('mousemove', handleDragMove);

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
card.addEventListener('touchmove', handleDragMove);

card.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    handleSwipeEnd();
});


// Inicializar la primera tarjeta
updateCard();