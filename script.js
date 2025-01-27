const card = document.getElementById('card');
let isDragging = false;
let startX, startY, offsetX, offsetY;

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
}

// Eventos para el deslizamiento
card.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
});

card.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;
    card.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${offsetX * 0.1}deg)`;
});

card.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;

    // Determinar si la tarjeta se deslizó lo suficiente
    if (Math.abs(offsetX) > 100) {
        if (offsetX > 0) {
            console.log("Verdadero");
        } else {
            console.log("Falso");
        }
        // Actualizar la tarjeta
        currentIndex = (currentIndex + 1) % questions.length;
        updateCard();
    }

    // Restablecer la posición de la tarjeta
    card.style.transform = 'translate(0, 0) rotate(0deg)';
});

// Inicializar la primera tarjeta
updateCard();