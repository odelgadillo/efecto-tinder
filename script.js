const card = document.getElementById('card');
const counter = document.getElementById('counter');
const scoreElement = document.getElementById('score');
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
            currentIndex = (currentIndex + 1) % questions.length;
            updateCard();

            // Restablecer la tarjeta al centro sin animación
            card.style.transition = 'none'; // Desactivar transición
            card.style.transform = 'translate(0, 0) rotate(0deg)';
            card.style.opacity = '1';

            // Reactivar la transición después de un breve retraso
            setTimeout(() => {
                card.style.transition = 'transform 0.3s ease, background-color 0.3s ease';
            }, 10); // Breve retraso para reactivar la transición
        }, 500); // Esperar 500ms para que termine la animación
    } else {
        resetCard();
    }
}

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

// Inicializar la primera tarjeta
updateCard();