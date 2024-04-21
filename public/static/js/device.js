function getDeviceName() {
    var userAgent = navigator.userAgent.toLowerCase();
  
    if (userAgent.includes("mac")) {
      return "Mac";
    } else if (userAgent.includes("iphone")) {
      return "iPhone";
    } else if (userAgent.includes("ipad")) {
      return "iPad";
    } else if (userAgent.includes("android")) {
      return "Android";
    } else if (userAgent.includes("windows phone")) {
      return "Windows Phone";
    } else if (userAgent.includes("windows")) {
      return "Windows PC";
    } else if (userAgent.includes("linux")) {
      return "Linux PC";
    } else {
      return "Неизвестное устройство";
    }
}


document.addEventListener("DOMContentLoaded", function() {
    var deviceNameElements = document.querySelectorAll(".device-name");
    deviceNameElements.forEach(function(element) {
      element.textContent = getDeviceName();
    });
});