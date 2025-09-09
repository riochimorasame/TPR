document.addEventListener('DOMContentLoaded', () => {

    // Gestion du mode nuit
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    darkModeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    });

    // Gestion des soumissions (témoignages et requêtes de prière)
    document.getElementById('submit-testimonial').addEventListener('click', () => {
        const name = document.getElementById('testimonial-name').value;
        const text = document.getElementById('testimonial-text').value;
        if (name && text) {
            const subject = `Nouveau témoignage de ${name}`;
            const body = `Nom: ${name}\n\nTémoignage:\n${text}`;
            window.location.href = `mailto:riochimourasam@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        } else {
            alert('Veuillez remplir tous les champs.');
        }
    });

    document.getElementById('submit-prayer-request').addEventListener('click', () => {
        const name = document.getElementById('prayer-request-name').value;
        const text = document.getElementById('prayer-request-text').value;
        if (name && text) {
            const subject = `Nouvelle requête de prière de ${name}`;
            const body = `Nom: ${name}\n\nRequête:\n${text}`;
            window.location.href = `mailto:riochimourasam@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        } else {
            alert('Veuillez remplir tous les champs.');
        }
    });

    let quizData = [];
    let currentQuizIndex = 0;
    let score = 0;
    const quizContainer = document.getElementById('quiz-container');
    const quizQuestion = document.getElementById('quiz-question');
    const quizOptions = document.getElementById('quiz-options');
    const quizResult = document.getElementById('quiz-result');
    const quizScore = document.getElementById('quiz-score');

    function fetchQuizQuestions() {
        fetch('quizzes.json')
            .then(response => response.json())
            .then(data => {
                quizData = shuffleArray(data);
                displayQuizQuestion();
            })
            .catch(error => console.error('Erreur de chargement du quiz:', error));
    }

    function displayQuizQuestion() {
        if (currentQuizIndex < quizData.length) {
            const currentQuestion = quizData[currentQuizIndex];
            quizQuestion.textContent = currentQuestion.question;
            quizOptions.innerHTML = '';
            quizResult.textContent = '';
            currentQuestion.options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option;
                button.classList.add('btn', 'btn-outline-primary', 'mb-2');
                button.addEventListener('click', () => checkAnswer(option, currentQuestion.answer));
                quizOptions.appendChild(button);
            });
        } else {
            quizContainer.innerHTML = `<h5 class="text-center">Quiz terminé !</h5><p>Votre score final est de **${score}** sur **${quizData.length}**.</p>`;
            quizScore.style.display = 'block';
        }
    }

    function checkAnswer(selectedOption, correctAnswer) {
        const buttons = quizOptions.querySelectorAll('button');
        buttons.forEach(button => {
            button.disabled = true;
            if (button.textContent === correctAnswer) {
                button.classList.remove('btn-outline-primary');
                button.classList.add('btn-success');
            } else if (button.textContent === selectedOption) {
                button.classList.remove('btn-outline-primary');
                button.classList.add('btn-danger');
            }
        });

        if (selectedOption === correctAnswer) {
            quizResult.textContent = "Bonne réponse !";
            quizResult.style.color = 'green';
            score++;
        } else {
            quizResult.textContent = `Mauvaise réponse. La bonne réponse était : "${correctAnswer}".`;
            quizResult.style.color = 'red';
        }

        setTimeout(() => {
            currentQuizIndex++;
            displayQuizQuestion();
        }, 2000);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }


    const events = {
        '2025-08-09': {
            title: 'Séminaire des Jeunes',
            description: 'Thème : Le jeune chrétien face aux défis du 21ᵉ siècle. Une journée complète de conférences et d\'ateliers sur la foi, la gestion financière et les nouvelles technologies.',
            location: 'Hôtel Muget',
            time: '08h00 - 18h00'
        },
        '2024-07-28': {
            title: 'Réunion mensuelle',
            description: 'Réunion mensuelle de prière et d\'échanges pour les jeunes. Venez nombreux pour partager, louer et grandir ensemble dans la foi !',
            location: 'Église TPR',
            time: '14h00 - 16h00'
        },
        '2024-08-30': {
            title: 'Soirée de Louange',
            description: 'Une soirée spéciale dédiée à l\'adoration et à la louange. Ouvert à tous les jeunes.',
            location: 'Église TPR',
            time: '18h30 - 20h00'
        }
    };
    const calendarEl = document.getElementById('calendar');
    const monthLabelEl = document.getElementById('month-label');
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    function generateCalendar(year, month) {
        calendarEl.innerHTML = '';
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay();
        const firstDayOfWeekAdjusted = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

        const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        daysOfWeek.forEach(day => {
            const header = document.createElement('div');
            header.className = 'calendar-day-header';
            header.textContent = day;
            calendarEl.appendChild(header);
        });

        for (let i = 0; i < firstDayOfWeekAdjusted; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            calendarEl.appendChild(emptyCell);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const cell = document.createElement('div');
            cell.className = 'calendar-day';
            cell.textContent = i;
            const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
            if (events[dateStr]) {
                cell.classList.add('event-day');
                cell.setAttribute('data-date', dateStr);
                cell.addEventListener('click', () => showEventModal(dateStr));
            }
            if (
                i === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear()
            ) {
                cell.classList.add('today');
            }
            calendarEl.appendChild(cell);
        }
    }

    function updateMonthLabel() {
        const date = new Date(currentYear, currentMonth);
        monthLabelEl.textContent = date.toLocaleString('fr-FR', {
            month: 'long',
            year: 'numeric'
        });
    }

    window.changeMonth = function(direction) {
        currentMonth += direction;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        } else if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentYear, currentMonth);
        updateMonthLabel();
    };


    function showEventModal(dateStr) {
        const event = events[dateStr];
        if (event) {
            const modal = document.getElementById("eventModal");
            document.getElementById("event-title").textContent = event.title;
            document.getElementById("event-date-time").textContent = `Date et heure : ${dateStr} - ${event.time}`;
            document.getElementById("event-location").textContent = `Lieu : ${event.location}`;
            document.getElementById("event-description").textContent = event.description;
            modal.style.display = "block";
        }
    }
    const modal = document.getElementById("eventModal");
    if (modal) {
        const closeBtn = document.querySelector(".close-btn");
        closeBtn.addEventListener('click', () => {
            modal.style.display = "none";
        });
        window.addEventListener('click', (event) => {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        });
    }

    function startSlider() {
        const images = document.querySelectorAll('.slider-image');
        let currentIndex = 0;
        setInterval(() => {
            images[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % images.length;
            images[currentIndex].classList.add('active');
        }, 5000);
    }

    const quotes = [
        "Jésus-Christ est le même hier, aujourd'hui et éternellement.",
        "Mets en l'Éternel ta confiance, et fais le bien.",
        "Le Seigneur est ma lumière et mon salut.",
        "Car c’est par la grâce que vous êtes sauvés, par le moyen de la foi.",
        "Le fruit de l’Esprit, c’est l’amour, la joie, la paix, la patience, la bonté, la bienveillance, la fidélité, la douceur, la maîtrise de soi."
    ];

    function showDailyQuote() {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const quoteEl = document.getElementById('daily-quote');
        quoteEl.textContent = quotes[dayOfYear % quotes.length];
    }

    generateCalendar(currentYear, currentMonth);
    updateMonthLabel();
    fetchQuizQuestions();
    startSlider();
    showDailyQuote();
});