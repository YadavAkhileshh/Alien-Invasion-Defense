function toggleAnswer(element) {
    const answer = element.nextElementSibling;
    const arrow = element.querySelector('.arrow');

    // Toggle the visibility of the answer (paragraph or list)
    if (answer.style.display === 'block') {
        answer.style.display = 'none';
        arrow.classList.remove('rotate');
    } else {
        answer.style.display = 'block';
        arrow.classList.add('rotate');
    }
}