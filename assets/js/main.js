// fullPage.js
$(document).ready(function () {
  $("#fullpage").fullpage({
    // custom class
    menu: "#menu",
    anchor: ["slide-1", "slide-2", "slide-3", "slide-4"],
    lockAnchor: true,
    sectionSelector: ".section",
    slideSelector: ".slide",
    navigation: false,
    navigationPosition: "left",
    slideNavigation: false,
    // css3: true,
    autoScrolling: true,
    scrollHorizontally: false,
    parallax: false,
    parallaxOptions: { type: "reveal", percentage: 62, property: "translate" }
  });
});

window.addEventListener(
  "scroll",
  () => {
    document.body.style.setProperty(
      "--scroll",
      window.pageYOffset / (document.body.offsetHeight - window.innerHeight)
    );
  },
  false
);
