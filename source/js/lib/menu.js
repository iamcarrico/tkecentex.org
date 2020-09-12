

class MenuBar {


  static process() {
    var nav = document.getElementById('nav');

    var mobileMenuButtons = nav.getElementsByClassName('menu-mobile');

    for (var i = 0; i < mobileMenuButtons.length; i++) {
      mobileMenuButtons[i].addEventListener('click', (e) => {
        this.toggleNav();
      });
    }


    var internal = document.querySelectorAll('a[href^="#"]:not([href="#"])'), a;
    for(var i=internal.length; a=internal[--i];){
        a.addEventListener('click', (e) => {
          this.toggleNav(true);
        });
    }
  }

  static toggleNav(forceClose = false) {
    var nav = document.getElementById('nav');

    if (nav.className.indexOf('active') >= 1 || forceClose) {
      nav.className = nav.className.replace('active', '').trim();
    }
    else {
      nav.className += ' active';
    }
  }
}

export default MenuBar;
