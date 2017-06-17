/*результат генерации bower Js*/
/* //= libs/_vendor.js    - если не хочетс подключать 2 файла, можно всё объединить */

var body, heroSwiper;

$(function () {

  body = $('body');

  body
    .delegate('.dropdownBtn', 'click', function () {
      var firedEl = $(this);
      firedEl.parent().toggleClass('opened');

      toggleOverlay(firedEl.parent(), firedEl.parent().hasClass('opened'));

      return false;
    })
    .delegate('.mobMenuBtn', 'click', function () {
      $('.mainNav').toggleClass('nav_opened');

      return false;
    })
    .delegate('.closeSubNav', 'click', function () {
      $('.subNav').removeClass('subnav_opened');

      return false;
    })
    .delegate('.openSubmenu', 'click', function () {
      var link = $(this), menu = link.next('ul');

      console.log(menu.html());
      
      $('.subNavMenu').html(menu.html());
      $('.subNavCaption').text(link.text());
      $('.subNav').toggleClass('subnav_opened');

      return false;
    });

  $(document).click(function (e) {
    if ($(e.target).parents().filter('.opened').length != 1) {
      hideDropDowns();
    }
  });

  $('.fancybox').fancybox();

  $('.autocomplete').each(function (ind) {
    var inp = $(this);

    inp.autocomplete({
      source: ['Лента конвейрная GR', 'Шевронная лента GR', 'Конвейерная лента резинотканевая Сибирь', 'Конвейерная лента морозостойкая GR', 'Конвейерная лента готовые изделия'],
      classes: {
        'ui-autocomplete': 'autocomplete_v1'
      },
      appendTo: inp.parent(),
      position: {my: "left top+5", at: "left bottom"},
      open: function () {
        toggleOverlay('.headerSearch', true);
      },
      close: function () {
        toggleOverlay('.headerSearch', false);
      }
    })

  });

  $('select').styler();

  initHeroSlider();

});

function toggleOverlay(target, show) {
  var ov = $('<div class="gl-overlay glOverlay"></div>');

  if (show) {
    if (!$(target).prev('.glOverlay').length) {
      $(target).addClass('hasOverlay').css('z-index', 20).before(ov);
    }
  } else {
    clearOverlay();
  }
}

function initHeroSlider() {

  if ($('.heroSlider').length) {
    heroSwiper = new Swiper('.heroSlider .swiper-container', {
      speed: 600,
      spaceBetween: 0,
      paginationClickable: !0,
      pagination: '.heroSlider .b-hero__slider-pagination',
      prevButton: '.heroSlider .b-hero__slider-prev',
      nextButton: '.heroSlider .b-hero__slider-next'
    });
  }
}

function clearOverlay() {
  $('.hasOverlay').css('z-index', '').removeClass('hasOverlay');
  $('.glOverlay').remove();
}

function hideDropDowns() {
  $('.opened').removeClass('opened');
  clearOverlay();
}

