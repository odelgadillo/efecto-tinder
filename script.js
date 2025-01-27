const card = document.getElementById('card');
const counter = document.getElementById('counter');
let isDragging = false;
let startX, offsetX;

// Datos de ejemplo (preguntas e imágenes)
const questions = [
    { image: "https://picsum.photos/150", question: "¿Es esta persona un científico famoso?" },
    { image: "https://picsum.photos/150", question: "¿Es esta persona un artista reconocido?" },
    { image: "https://picsum.photos/150", question: "¿Es esta persona un político importante?" },
];
let currentIndex = 0;

// Función para actualizar la tarjeta
function updateCard() {
    const cardImage = card.querySelector('.card-image');
    const cardQuestion = card.querySelector('.card-question');
    cardImage.src = questions[currentIndex].image;
    cardQuestion.textContent = questions[currentIndex].question;
    counter.textContent = `Pregunta ${currentIndex + 1} de ${questions.length}`; // Actualizar contador
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
        if (offsetX > 0) {
            console.log("Verdadero");
            card.style.backgroundColor = '#d4edda'; // Fondo verde para "Verdadero"
        } else {
            console.log("Falso");
            card.style.backgroundColor = '#f8d7da'; // Fondo rojo para "Falso"
        }
        // Actualizar la tarjeta después de un breve retraso
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % questions.length;
            updateCard();
            resetCard();
        }, 300); // Esperar 300ms para que se vea el cambio de color
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