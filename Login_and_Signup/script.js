const signInBtnLink = document.querySelector('.signInBtn-link');
const signUpBtnLink = document.querySelector('.signUpBtn-link');
const wrapper = document.querySelector('.wrapper');

signUpBtnLink.addEventListener('click', () => {
    wrapper.classList.toggle('active');
});

signInBtnLink.addEventListener('click', () => {
    wrapper.classList.toggle('active');
});

document.querySelector('.form-wrapper.sign-in form').onsubmit = function(e) {
    e.preventDefault();
    // Perform login validation or any additional steps here
    window.location.href ="/"; // Redirect after login
  };
  
  document.querySelector('.form-wrapper.sign-up form').onsubmit = function(e) {
    e.preventDefault();
    // Perform signup validation or any additional steps here
    window.location.href = '/'; // Redirect after signup
  };
  