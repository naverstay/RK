/*результат генерации bower Js*/
/* //= libs/_vendor.js    - если не хочетс подключать 2 файла, можно всё объединить */

var body, heroSwiper, menuSlider;

$(function () {

  body = $('body');

  body
    .delegate('.valPlus', 'click', function () {
      var valCell = $(this).closest('.valCell'),
        inp = valCell.find('input'),
        val = parseInt(inp.val().replace(/\D/g, '')),
        min_val = 1 * inp.attr('data-min'),
        max_val = 1 * inp.attr('data-max'),
        new_val = val + (1 * inp.attr('data-step'));

      inp.val(new_val <= max_val ? (new_val >= min_val ? new_val : min_val) : max_val).focus();

      return false;
    })
    .delegate('.valMinus', 'click', function () {
      var valCell = $(this).closest('.valCell'),
        inp = valCell.find('input'),
        val = parseInt(inp.val().replace(/\D/g, '')),
        min_val = 1 * inp.attr('data-min'),
        max_val = 1 * inp.attr('data-max'),
        new_val = val - (1 * inp.attr('data-step'));

      inp.val(new_val >= min_val ? (new_val <= max_val ? new_val : max_val) : min_val).focus();

      return false;
    })
    .delegate('.dropdownBtn', 'click', function () {
      var firedEl = $(this);
      firedEl.parent().toggleClass('opened');

      toggleOverlay(firedEl.parent(), firedEl.parent().hasClass('opened'));

      return false;
    })
    .delegate('.triggerBtn', 'click', function () {
      var btn = $(this), list = btn.closest('.triggerList');

      if (btn.hasClass('_asc')) {
        btn.removeClass('_asc').addClass('_desc');
      } else if (btn.hasClass('_desc')) {
        btn.removeClass('_desc').addClass('_asc');
      } else {
        btn.addClass('_desc');
      }

      list.find('.triggerBtn').not(btn).removeClass('_desc').removeClass('_ssc');

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

  initMenuSlider();

  initMask();

});

function initMask(el) {

  if (el == void 0) {
    el = $("input");
  }

  el.each(function (i, el) {
    var inp = $(el), param = {};

    if (inp.attr('data-inputmask') != void 0) {
      inp.inputmask();
    }

    if (inp.attr('data-inputmask-email') != void 0) {
      param.regex = inp.attr('data-inputmask-email');
      param.placeholder = '_';

      inp.inputmask('Regex', param);
    }

    if (inp.attr('data-inputmask-regex') != void 0) {
      inp.inputmask('Regex', param);
    }

    if (inp.attr('data-inputmask-custom') != void 0) {
      inp.inputmask(JSON.parse('{' + inp.attr('data-inputmask-custom').replace(/'/g, '"') + '}'));
    }

  });
}

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

function initMenuSlider() {

  if ($('.menuSlider').length) {
    menuSlider = new Swiper('.menuSlider .swiper-container', {
      speed: 600,
      spaceBetween: 0,
      freeMode: !0,
      slidesPerView: 'auto',
      prevButton: '.menuSlider .b-header__menu-butt._prev',
      nextButton: '.menuSlider .b-header__menu-butt._next'
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

