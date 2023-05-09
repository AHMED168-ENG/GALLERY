const upperNavbare = document.querySelector(".upperNavbare");
const navbareLower = document.querySelector(".navbareLower");
const navbareMid = document.querySelector(".navbareMid");
window.onscroll = function () {
  if (window.scrollY > 220) {
    document.body.classList.add("padding");
    navbareMid.className =
      "row align-items-center bg-light px-xl-5 d-none navbareMid";
    upperNavbare.classList.add("active");
    navbareLower.classList.add("active");
  } else {
    document.body.classList.remove("padding");
    navbareMid.className =
      "row align-items-center bg-light px-xl-5 d-lg-flex navbareMid";
    upperNavbare.classList.remove("active");
    navbareLower.classList.remove("active");
  }
};
