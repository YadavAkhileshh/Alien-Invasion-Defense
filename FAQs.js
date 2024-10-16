document.querySelectorAll('details').forEach((detail) => {
    detail.addEventListener('toggle', function() {
        let arrowIcon = this.querySelector('.arrow');
        if (this.open) {
            arrowIcon.style.transform = 'rotate(180deg)';
        } else {
            arrowIcon.style.transform = 'rotate(0deg)';
        }
    });
});
