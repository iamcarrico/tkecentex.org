
let _modalCloseProcessed = false;

class Modal {

  static process() {
    var closeModal = document.getElementsByClassName('close-modal');
    for (var i = 0; i < closeModal.length; i++) {
      closeModal[i].addEventListener('click', function(e) {
        document.getElementById('modal-window').style.display = "none";

        var bodyClasses = document.body.className;
        bodyClasses = bodyClasses.replace('modal-active', '');
        bodyClasses = bodyClasses.replace('modal-open', '');

        document.body.className = bodyClasses;

        // Get it ready for the next open.
        setTimeout(function() {
          document.getElementById('modal-window').style.display = "block";
        }, 500);
      });
    }
  }

  static openModal(success = true) {

    if (!_modalCloseProcessed) {
      this.process();
      _modalCloseProcessed = true;
    }

    var success_modal = document.getElementById('modal_success');
    var error_modal = document.getElementById('modal_error');

    if (success) {
      success_modal.style.display = "block";
      error_modal.style.display = "none";
    } else {
      success_modal.style.display = "none";
      error_modal.style.display = "block";
    }

    document.body.className += ' modal-active modal-open';
  }
}

export default Modal;
