document.addEventListener('DOMContentLoaded', function () {
  const claimButtons = document.querySelectorAll('.claim-btn, .download-btn');
  const modal = document.getElementById('appPromoModal');
  const closeBtn = document.querySelector('.close-btn');

  claimButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      if (modal) {
        modal.style.display = 'flex';
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      if (modal) {
        modal.style.display = 'none';
      }
    });
  }

  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  window.closeModal = function () {
    if (modal) {
      modal.style.display = 'none';
    }
  };
});

