"use strict";

// fullPage.js
$(document).ready(function () {
  $('#fullpage').fullpage({
    // custom class
    menu: '#menu',
    anchor: ['slide-1', 'slide-2', 'slide-3', 'slide-4'],
    lockAnchor: true,
    sectionSelector: '.section',
    slideSelector: '.slide',
    navigation: true,
    navigationPosition: 'right',
    slideNavigation: false,
    css3: true,
    autoScrolling: true,
    scrollHorizontally: false,
    parallax: true,
    parallaxOptions: {
      type: 'reveal',
      percentage: 62,
      property: 'translate'
    }
  });
});
$(document).ready(function () {
  $(window).scroll(function () {
    var scroll = $(window).scrollTop();

    if (scroll > 300) {
      $('.menuWrap').addClass('scrolled');
    } else {
      $('.menuWrap').removeClass('scrolled');
    }
  });
});