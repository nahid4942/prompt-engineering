document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('navbar-toggle');
    const menu = document.querySelector('.navbar-menu');
    toggle.addEventListener('click', function() {
        menu.classList.toggle('open');
    });
});