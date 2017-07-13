/*результат генерации bower Js*/
/* //= libs/_vendor.js    - если не хочетс подключать 2 файла, можно всё объединить */

var body, heroSwiper, menuSlider, popup_order_info;

$(function () {

  body = $('body');

  body
    .delegate('.openPhoneBlock', 'click', function () {
      //$(this).parent().hide();
      $('.phoneBlock').show();
      return false;
    })
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

      if (btn.hasClass('_desc')) {
        btn.removeClass('_desc').addClass('_asc');
      } else if (btn.hasClass('_asc')) {
        btn.removeClass('_asc');
      } else {
        btn.addClass('_desc');
      }

      list.find('.triggerBtn').not(btn).removeClass('_desc').removeClass('_asc');

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

    if (!$(e.target).parents('.skipOverlayClosing').length && $(e.target).parents().filter('.opened').length != 1) {
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
    });

  });

  //$('select').styler();


  initHeroSlider();

  initMenuSlider();

  initSelect2();

  initMask();

  initMap();

  initValidation();

  initEdit();

  initTabs();

  initOrderInfoPopup();

});

function initTabs() {
  var tabBlock = $('.tabBlock');

  tabBlock.each(function () {
    var tab = $(this);

    tab.tabs({
      active: 0,
      tabContext: tabBlock.data('tab-context'),
      activate: function (e, u) {

      },
      create: function (e, u) {


      }
    });
  });
}

function initEdit() {

  $.editable.addInputType('masked', {
    /* Create input element. */
    element: function (settings, original) {
      /* Create an input. Mask it using masked input plugin. Settings */
      /* for mask were passed with jEditable settings hash. Remember  */
      /* to return the created input!                                 */
      var input = $('<input>').mask(settings.mask);
      $(this).append(input);
      return (input);
    }
  });

  $('.editBtn').on('click', function () {
    var target = $(this).attr('data-target');

    var edit = $('.editMe').filter(function () {
      return $(this).attr('data-control') == target;
    });

    if (edit.find('form').length) {
      edit.find('form').submit();
      $(this).removeClass('_edit-mode');
    } else {
      edit.click();
    }

    return false;
  });

  $('.editFinish').on('click', function () {

    $('.editFinishBlock').hide();
    $('.editStartBlock').show();

    $('.editMe form').submit();

    return false;
  });

  $('.editStart').on('click', function () {
    var target = $(this).attr('data-target');

    $('.editStartBlock').hide();
    $('.editFinishBlock').show();

    $('.editMe').filter(function () {
      return $(this).attr('data-control') == target;
    }).click();

    return false;
  });

  $('.editMe').each(function (ind) {
    var el = $(this), el_edit = el.attr('data-edit');

    el.on('click', function () {
      var firedEl = $(this), el_control = $(firedEl.attr('data-trigger'));

      if (!firedEl.find('form').length && el_control.length) {
        el_control.toggleClass('_edit-mode');
      }
    });

    el.editable('php/save.php', {
      onblur: el.attr('data-blur') || 'cancel',
      blurcallback: function (e, i) {
        var trigger = $($(e).attr('data-trigger'));

        if (trigger && trigger.length) {
          trigger.removeClass('_edit-mode');
        }
      },
      type: 'textarea',
      tooltip: '',
      autoheight: true,
      style: 'inherit',
      height: el.outerHeight() + 'px',
      width: '100%',
      cssclass: 'f-edit__form',
      submitdata: function (q, w) {
        console.log(q, w);

        el.text(q);
      }
    });
  });
}

function init() {

  $('.map').each(function (ind) {
    var myMap = new ymaps.Map($(this).attr('id'), {
      center: [55.76, 37.64],
      zoom: 9
    });
  });
}

function initMap() {
  if ($('.map').length) {
    ymaps.ready(init);
  }
}


function initSelect2() {
  var resize_timer;

  $('body').delegate('.selectTrigger', 'click', function () {
    var firedEl = $(this), target = $(firedEl.attr('data-trigger-for'));

    if (target.length) {
      if (firedEl.hasClass('opened')) {
        firedEl.removeClass('opened');
        target.select2('close');
        target.parent().removeClass('opened');

        toggleOverlay(firedEl.parent(), false);
      } else {
        firedEl.addClass('opened');
        target.select2('open');
        target.parent().addClass('opened');

        toggleOverlay(firedEl.parent(), true, 'dt_vis');
      }
    }

    return false;
  });

  $('.select2').each(function (ind) {
    var slct = $(this),
      close_on_select = $(window).width() <= 1200 && (slct.attr('data-close-on-select') == 'true'),
      keep_open = $(window).width() >= 992 && slct.attr('data-keep-open') == 'true';

    slct
      .on("select2:closing", function (evt) {
        var slct = $(this),
          close_on_select = $(window).width() <= 1200 && (slct.attr('data-close-on-select') == 'true'),
          keep_open = slct.attr('data-keep-open') == 'true';


        if (close_on_select) {

        } else {
          keep_open && evt.preventDefault();
        }

      })
      .on("select2:closed", function (evt) {
        var slct = $(this),
          close_on_select = $(window).width() <= 1200 && (slct.attr('data-close-on-select') == 'true'),
          keep_open = slct.attr('data-keep-open') == 'true';

        (close_on_select || keep_open) && $(evt.currentTarget).select2("open");
      })
      .on('select2:close', function (evt) {
        var slct = $(this),
          close_on_select = $(window).width() <= 1200 && (slct.attr('data-close-on-select') == 'true'),
          keep_open = slct.attr('data-keep-open') == 'true';


        (!close_on_select || keep_open) && toggleOverlay(slct.nextAll('.select2'), false);

        var target = $('*[data-trigger-for="#' + slct.attr('id') + '"]');

        if (target && target.length) {
          target.removeClass('opened');
        }
      })
      .on('select2:open', function (evt) {
        var slct = $(this),
          close_on_select = $(window).width() <= 1200 && (slct.attr('data-close-on-select') == 'true'),
          keep_open = slct.attr('data-keep-open') == 'true';

        !(close_on_select || keep_open) && toggleOverlay(slct.nextAll('.select2'), true);
      })
      .on('change', function (evt) {
        var slct = $(this),
          close_on_select = $(window).width() <= 1200 && (slct.attr('data-close-on-select') == 'true'),
          data_doubling = $(slct.attr('data-doubling'));


        if (data_doubling && data_doubling.length) {
          data_doubling.text(slct.val());
        }
      })
      .select2({
        minimumResultsForSearch: -1,
        dropdownParent: slct.parent(),
        closeOnSelect: close_on_select || !keep_open,
        width: '100%',
        templateResult: function (d) {
          var multi = $(d.element).closest('select').attr('multiple');

          return $('<span class="option-item"/>').html(d.text).addClass(multi ? '_remove-item' : '');
        }
      });

    var data_doubling = $(slct.attr('data-doubling'));

    if (data_doubling && data_doubling.length) {
      data_doubling.text(slct.val());
    }


    keep_open && slct.select2("open");

  });

  $(window).resize(function () {

    clearTimeout(resize_timer);

    resize_timer = setTimeout(function () {
      $('.select2').filter(function () {
        var slct = $(this);


        return slct.attr('data-close-on-select') == 'true' || slct.attr('data-keep-open') == 'true';
      }).select2('open');
    }, 1);
  });
}

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

function toggleOverlay(target, show, cls) {
  var ov = $('<div class="gl-overlay glOverlay"></div>');

  if (show) {
    if (!$(target).prev('.glOverlay').length) {
      $(target).addClass('hasOverlay').css('z-index', 20).before(ov.addClass(cls || ''));
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


function initValidation() {
  $('.validateMe').each(function (ind) {
    var f = $(this);

    f.validationEngine({
      //binded: false,
      scroll: false,
      showPrompts: false,
      showArrow: false,
      addSuccessCssClassToField: 'success',
      addFailureCssClassToField: 'error',
      parentFieldClass: '.formCell',
      // parentFormClass: '.order_block',
      promptPosition: "centerRight",
      //doNotShowAllErrosOnSubmit: true,
      //focusFirstField          : false,
      autoHidePrompt: false,
      autoHideDelay: 2000,
      autoPositionUpdate: false,
      prettySelect: true,
      //useSuffix                : "_VE_field",
      addPromptClass: 'relative_mode one_msg',
      showOneMessage: false
    });
  });
}

function initOrderInfoPopup() {

  if ($('#popup_order_info').length) {
    popup_order_info = $('#popup_order_info').dialog({
      autoOpen: false,
      modal: true,
      closeOnEscape: true,
      closeText: '',
      dialogClass: 'dialog_g_size_1',
      //appendTo: '.wrapper',
      width: 800,
      draggable: true,
      collision: "fit",
      //position: {my: "top center", at: "top center", of: window},
      open: function (event, ui) {
        body.addClass('modal_opened overlay_v1');

        console.log(event, ui);
        
      },
      close: function (event, ui) {
        body.removeClass('modal_opened overlay_v1');
      }
    });

    $('.orderInfoBtn').on('click', function () {

      popup_order_info.dialog('open');

      return false;
    });
  }

}

function all_dialog_close() {
  body.on('click', '.ui-widget-overlay, .popupClose', all_dialog_close_gl);
}

function all_dialog_close_gl() {
  $(".ui-dialog-content").each(function () {
    var $this = $(this);
    if (!$this.parent().hasClass('always_open')) {
      $this.dialog("close");
    }
  });
}
