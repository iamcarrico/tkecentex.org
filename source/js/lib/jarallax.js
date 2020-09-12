import DeviceHelper from './device_helper';


class Jarallax {
  constructor() {
    var device = new DeviceHelper();

    this.enable = (!device.isMicrosoftBrowser() && !device.isIos() && window.innerWidth >= 728);

    this.className = 'jarallax';


    return this;
  }

  observerCallback(entries, observer) {
    entries.forEach((entry) => {
      var imageElement = entry.target.getElementsByClassName('jarallax-img')[0];
      // IntersectionObserver returns all the entries for every observation
      // But we only want to show ones that are intersecting
      // I AM SORRY:`isIntersecting` is something safari/webkit supports :(((
      if (entry.intersectionRatio > 0.0 || entry.isIntersecting) {
        imageElement.style.zIndex = -40;
      } else {
        imageElement.style.zIndex = -100;
      }
    });
  }

  process() {
    if (!this.enable) { return; }

    this.allElements = document.getElementsByClassName(this.className);

    document.documentElement.className += ` ${this.className}-enabled`;

    var observer = new IntersectionObserver(this.observerCallback, {
      rootMargin: '20px 0px 10px 0px'
    });

    for (var i = 0; i < this.allElements.length; i++) {
      observer.observe(this.allElements[i]);
    }
  }
}

export default Jarallax;
