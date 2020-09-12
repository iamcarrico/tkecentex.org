


class SocialShare {
  /**
   * Open Social share buttons in a new window.
   */
  process() {
    this.elements = document.querySelectorAll('.twitter-intent, .facebook-share');

    for (var i = 0; i < this.elements.length; i++) {
      this.elements[i].addEventListener('click', function (e) {
        e.preventDefault();

        window.open(
          e.target.href,
          'targetWindow',
          'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=550,height=420'
        );
      });
    };
  }
}

export default SocialShare;
