/**
 * A simple UA sniffer to get what kind of device we are on.
 */


class DeviceHelper {
  constructor(_navigator) {
    this.navigator = _navigator || window.navigator;

    return this;
  }

  isIE() {
    if (!this.navigator.userAgent) {
      return false;
    }

    var IE10 = Boolean(this.navigator.userAgent.match(/(MSIE)/i)),
        IE11 = Boolean(this.navigator.userAgent.match(/(Trident)/i));
    return IE10 || IE11;
  }

  isEdge() {
    return !!this.navigator.userAgent && this.navigator.userAgent.indexOf("Edge") > -1;
  }

  isMicrosoftBrowser() {
    return this.isEdge() || this.isIE();
  };

  isIos() {
    return /iPad|iPhone|iPod/.test(this.navigator.userAgent) && !window.MSStream;
  }
}

export default DeviceHelper;
