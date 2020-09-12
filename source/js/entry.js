import './vendor/intersection-observer';
import './vendor/smooth-scroll';
import './vendor/fetch';

require('es6-promise/auto');

import SocialShare from './lib/social_share';
import Jarallax from './lib/jarallax';
import Payments from './lib/payments';
import Modal from './lib/payments';
import MenuBar from './lib/menu';



var kickoff = () => {

  new Jarallax().process();
  new SocialShare().process();
  new Payments().process();
  new Modal().process();
  
  MenuBar.process();
}



// We ensure we only do it once we have the DOM.
if (document.readyState !== 'loading') {
  kickoff();
} else if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', kickoff);
} else {
  document.attachEvent('onreadystatechange', function() {
    if (document.readyState !== 'loading')
      kickoff();
  });
}
