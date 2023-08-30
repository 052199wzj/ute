/*!
 * Bootstrap v3.3.5 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under the MIT license
 */
define(["../jquery-3.1.1"], function ($yang) {


  return function (jQuery) {
    if (typeof jQuery === 'undefined') {
      throw new Error('Bootstrap\'s JavaScript requires jQuery')
    }

    +function ($) {
      'use strict';
      var version = $.fn.jquery.split(' ')[0].split('.')
      if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1)) {
        throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher')
      }
    }(jQuery);

    /* ========================================================================
     * Bootstrap: transition.js v3.3.5
     * http://getbootstrap.com/javascript/#transitions
     * ========================================================================
     * Copyright 2011-2015 Twitter, Inc.
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
     * ======================================================================== */


    +function ($) {
      'use strict';

      // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
      // ============================================================

      function transitionEnd() {
        var el = document.createElement('bootstrap')

        var transEndEventNames = {
          WebkitTransition: 'webkitTransitionEnd',
          MozTransition: 'transitionend',
          OTransition: 'oTransitionEnd otransitionend',
          transition: 'transitionend'
        }

        for (var name in transEndEventNames) {
          if (el.style[name] !== undefined) {
            return { end: transEndEventNames[name] }
          }
        }

        return false // explicit for ie8 (  ._.)
      }

      // http://blog.alexmaccaw.com/css-transitions
      $.fn.emulateTransitionEnd = function (duration) {
        var called = false
        var $el = this
        $(this).one('bsTransitionEnd', function () { called = true })
        var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
        setTimeout(callback, duration)
        return this
      }

      $(function () {
        $.support.transition = transitionEnd()

        if (!$.support.transition) return

        $.event.special.bsTransitionEnd = {
          bindType: $.support.transition.end,
          delegateType: $.support.transition.end,
          handle: function (e) {
            if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
          }
        }
      })

    }(jQuery);

    /* ========================================================================
     * Bootstrap: alert.js v3.3.5
     * http://getbootstrap.com/javascript/#alerts
     * ========================================================================
     * Copyright 2011-2015 Twitter, Inc.
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
     * ======================================================================== */


    +function ($) {
      'use strict';

      // ALERT CLASS DEFINITION
      // ======================

      var dismiss = '[data-dismiss="alert"]'
      var Alert = function (el) {
        $(el).on('click', dismiss, this.close)
      }

      Alert.VERSION = '3.3.5'

      Alert.TRANSITION_DURATION = 150

      Alert.prototype.close = function (e) {
        var $this = $(this)
        var selector = $this.attr('data-target')

        if (!selector) {
          selector = $this.attr('href')
          selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
        }

        var $parent = $(selector)

        if (e) e.preventDefault()

        if (!$parent.length) {
          $parent = $this.closest('.alert')
        }

        $parent.trigger(e = $.Event('close.bs.alert'))

        if (e.isDefaultPrevented()) return

        $parent.removeClass('in')

        function removeElement() {
          // detach from parent, fire event then clean up data
          $parent.detach().trigger('closed.bs.alert').remove()
        }

        $.support.transition && $parent.hasClass('fade') ?
          $parent
            .one('bsTransitionEnd', removeElement)
            .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
          removeElement()
      }


      // ALERT PLUGIN DEFINITION
      // =======================

      function Plugin(option) {
        return this.each(function () {
          var $this = $(this)
          var data = $this.data('bs.alert')

          if (!data) $this.data('bs.alert', (data = new Alert(this)))
          if (typeof option == 'string') data[option].call($this)
        })
      }

      var old = $.fn.alert

      $.fn.alert = Plugin
      $.fn.alert.Constructor = Alert


      // ALERT NO CONFLICT
      // =================

      $.fn.alert.noConflict = function () {
        $.fn.alert = old
        return this
      }


      // ALERT DATA-API
      // ==============

      $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

    }(jQuery);

    /* ========================================================================
     * Bootstrap: button.js v3.3.5
     * http://getbootstrap.com/javascript/#buttons
     * ========================================================================
     * Copyright 2011-2015 Twitter, Inc.
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
     * ======================================================================== */


    +function ($) {
      'use strict';

      // BUTTON PUBLIC CLASS DEFINITION
      // ==============================

      var Button = function (element, options) {
        this.$element = $(element)
        this.options = $.extend({}, Button.DEFAULTS, options)
        this.isLoading = false
      }

      Button.VERSION = '3.3.5'

      Button.DEFAULTS = {
        loadingText: 'loading...'
      }

      Button.prototype.setState = function (state) {
        var d = 'disabled'
        var $el = this.$element
        var val = $el.is('input') ? 'val' : 'html'
        var data = $el.data()

        state += 'Text'

        if (data.resetText == null) $el.data('resetText', $el[val]())

        // push to event loop to allow forms to submit
        setTimeout($.proxy(function () {
          $el[val](data[state] == null ? this.options[state] : data[state])

          if (state == 'loadingText') {
            this.isLoading = true
            $el.addClass(d).attr(d, d)
          } else if (this.isLoading) {
            this.isLoading = false
            $el.removeClass(d).removeAttr(d)
          }
        }, this), 0)
      }

      Button.prototype.toggle = function () {
        var changed = true
        var $parent = this.$element.closest('[data-toggle="buttons"]')

        if ($parent.length) {
          var $input = this.$element.find('input')
          if ($input.prop('type') == 'radio') {
            if ($input.prop('checked')) changed = false
            $parent.find('.active').removeClass('active')
            this.$element.addClass('active')
          } else if ($input.prop('type') == 'checkbox') {
            if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
            this.$element.toggleClass('active')
          }
          $input.prop('checked', this.$element.hasClass('active'))
          if (changed) $input.trigger('change')
        } else {
          this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
          this.$element.toggleClass('active')
        }
      }


      // BUTTON PLUGIN DEFINITION
      // ========================

      function Plugin(option) {
        return this.each(function () {
          var $this = $(this)
          var data = $this.data('bs.button')
          var options = typeof option == 'object' && option

          if (!data) $this.data('bs.button', (data = new Button(this, options)))

          if (option == 'toggle') data.toggle()
          else if (option) data.setState(option)
        })
      }

      var old = $.fn.button

      $.fn.button = Plugin
      $.fn.button.Constructor = Button


      // BUTTON NO CONFLICT
      // ==================

      $.fn.button.noConflict = function () {
        $.fn.button = old
        return this
      }


      // BUTTON DATA-API
      // ===============

      $(document)
        .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
          var $btn = $(e.target)
          if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
          Plugin.call($btn, 'toggle')
          if (!($(e.target).is('input[type="radio"]') || $(e.target).is('input[type="checkbox"]'))) e.preventDefault()
        })
        .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
          $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
        })

    }(jQuery);

    /* ========================================================================
     * Bootstrap: carousel.js v3.3.5
     * http://getbootstrap.com/javascript/#carousel
     * ========================================================================
     * Copyright 2011-2015 Twitter, Inc.
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
     * ======================================================================== */


    +function ($) {
      'use strict';

      // CAROUSEL CLASS DEFINITION
      // =========================

      var Carousel = function (element, options) {
        this.$element = $(element)
        this.$indicators = this.$element.find('.carousel-indicators')
        this.options = options
        this.paused = null
        this.sliding = null
        this.interval = null
        this.$active = null
        this.$items = null

        this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

        this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
          .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
          .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
      }

      Carousel.VERSION = '3.3.5'

      Carousel.TRANSITION_DURATION = 600

      Carousel.DEFAULTS = {
        interval: 5000,
        pause: 'hover',
        wrap: true,
        keyboard: true
      }

      Carousel.prototype.keydown = function (e) {
        if (/input|textarea/i.test(e.target.tagName)) return
        switch (e.which) {
          case 37: this.prev(); break
          case 39: this.next(); break
          default: return
        }

        e.preventDefault()
      }

      Carousel.prototype.cycle = function (e) {
        e || (this.paused = false)

        this.interval && clearInterval(this.interval)

        this.options.interval
          && !this.paused
          && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

        return this
      }

      Carousel.prototype.getItemIndex = function (item) {
        this.$items = item.parent().children('.item')
        return this.$items.index(item || this.$active)
      }

      Carousel.prototype.getItemForDirection = function (direction, active) {
        var activeIndex = this.getItemIndex(active)
        var willWrap = (direction == 'prev' && activeIndex === 0)
          || (direction == 'next' && activeIndex == (this.$items.length - 1))
        if (willWrap && !this.options.wrap) return active
        var delta = direction == 'prev' ? -1 : 1
        var itemIndex = (activeIndex + delta) % this.$items.length
        return this.$items.eq(itemIndex)
      }

      Carousel.prototype.to = function (pos) {
        var that = this
        var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

        if (pos > (this.$items.length - 1) || pos < 0) return

        if (this.sliding) return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
        if (activeIndex == pos) return this.pause().cycle()

        return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
      }

      Carousel.prototype.pause = function (e) {
        e || (this.paused = true)

        if (this.$element.find('.next, .prev').length && $.support.transition) {
          this.$element.trigger($.support.transition.end)
          this.cycle(true)
        }

        this.interval = clearInterval(this.interval)

        return this
      }

      Carousel.prototype.next = function () {
        if (this.sliding) return
        return this.slide('next')
      }

      Carousel.prototype.prev = function () {
        if (this.sliding) return
        return this.slide('prev')
      }

      Carousel.prototype.slide = function (type, next) {
        var $active = this.$element.find('.item.active')
        var $next = next || this.getItemForDirection(type, $active)
        var isCycling = this.interval
        var direction = type == 'next' ? 'left' : 'right'
        var that = this

        if ($next.hasClass('active')) return (this.sliding = false)

        var relatedTarget = $next[0]
        var slideEvent = $.Event('slide.bs.carousel', {
          relatedTarget: relatedTarget,
          direction: direction
        })
        this.$element.trigger(slideEvent)
        if (slideEvent.isDefaultPrevented()) return

        this.sliding = true

        isCycling && this.pause()

        if (this.$indicators.length) {
          this.$indicators.find('.active').removeClass('active')
          var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
          $nextIndicator && $nextIndicator.addClass('active')
        }

        var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
        if ($.support.transition && this.$element.hasClass('slide')) {
          $next.addClass(type)
          $next[0].offsetWidth // force reflow
          $active.addClass(direction)
          $next.addClass(direction)
          $active
            .one('bsTransitionEnd', function () {
              $next.removeClass([type, direction].join(' ')).addClass('active')
              $active.removeClass(['active', direction].join(' '))
              that.sliding = false
              setTimeout(function () {
                that.$element.trigger(slidEvent)
              }, 0)
            })
            .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
        } else {
          $active.removeClass('active')
          $next.addClass('active')
          this.sliding = false
          this.$element.trigger(slidEvent)
        }

        isCycling && this.cycle()

        return this
      }


      // CAROUSEL PLUGIN DEFINITION
      // ==========================

      function Plugin(option) {
        return this.each(function () {
          var $this = $(this)
          var data = $this.data('bs.carousel')
          var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
          var action = typeof option == 'string' ? option : options.slide

          if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
          if (typeof option == 'number') data.to(option)
          else if (action) data[action]()
          else if (options.interval) data.pause().cycle()
        })
      }

      var old = $.fn.carousel

      $.fn.carousel = Plugin
      $.fn.carousel.Constructor = Carousel


      // CAROUSEL NO CONFLICT
      // ====================

      $.fn.carousel.noConflict = function () {
        $.fn.carousel = old
        return this
      }


      // CAROUSEL DATA-API
      // =================

      var clickHandler = function (e) {
        var href
        var $this = $(this)
        var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
        if (!$target.hasClass('carousel')) return
        var options = $.extend({}, $target.data(), $this.data())
        var slideIndex = $this.attr('data-slide-to')
        if (slideIndex) options.interval = false

        Plugin.call($target, options)

        if (slideIndex) {
          $target.data('bs.carousel').to(slideIndex)
        }

        e.preventDefault()
      }

      $(document)
        .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
        .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

      $(window).on('load', function () {
        $('[data-ride="carousel"]').each(function () {
          var $carousel = $(this)
          Plugin.call($carousel, $carousel.data())
        })
      })

    }(jQuery);

    /* ========================================================================
     * Bootstrap: collapse.js v3.3.5
     * http://getbootstrap.com/javascript/#collapse
     * ========================================================================
     * Copyright 2011-2015 Twitter, Inc.
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
     * ======================================================================== */


    +function ($) {
      'use strict';

      // COLLAPSE PUBLIC CLASS DEFINITION
      // ================================

      var Collapse = function (element, options) {
        this.$element = $(element)
        this.options = $.extend({}, Collapse.DEFAULTS, options)
        this.$trigger = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
          '[data-toggle="collapse"][data-target="#' + element.id + '"]')
        this.transitioning = null

        if (this.options.parent) {
          this.$parent = this.getParent()
        } else {
          this.addAriaAndCollapsedClass(this.$element, this.$trigger)
        }

        if (this.options.toggle) this.toggle()
      }

      Collapse.VERSION = '3.3.5'

      Collapse.TRANSITION_DURATION = 350

      Collapse.DEFAULTS = {
        toggle: true
      }

      Collapse.prototype.dimension = function () {
        var hasWidth = this.$element.hasClass('width')
        return hasWidth ? 'width' : 'height'
      }

      Collapse.prototype.show = function () {
        if (this.transitioning || this.$element.hasClass('in')) return

        var activesData
        var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

        if (actives && actives.length) {
          activesData = actives.data('bs.collapse')
          if (activesData && activesData.transitioning) return
        }

        var startEvent = $.Event('show.bs.collapse')
        this.$element.trigger(startEvent)
        if (startEvent.isDefaultPrevented()) return

        if (actives && actives.length) {
          Plugin.call(actives, 'hide')
          activesData || actives.data('bs.collapse', null)
        }

        var dimension = this.dimension()

        this.$element
          .removeClass('collapse')
          .addClass('collapsing')[dimension](0)
          .attr('aria-expanded', true)

        this.$trigger
          .removeClass('collapsed')
          .attr('aria-expanded', true)

        this.transitioning = 1

        var complete = function () {
          this.$element
            .removeClass('collapsing')
            .addClass('collapse in')[dimension]('')
          this.transitioning = 0
          this.$element
            .trigger('shown.bs.collapse')
        }

        if (!$.support.transition) return complete.call(this)

        var scrollSize = $.camelCase(['scroll', dimension].join('-'))

        this.$element
          .one('bsTransitionEnd', $.proxy(complete, this))
          .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
      }

      Collapse.prototype.hide = function () {
        if (this.transitioning || !this.$element.hasClass('in')) return

        var startEvent = $.Event('hide.bs.collapse')
        this.$element.trigger(startEvent)
        if (startEvent.isDefaultPrevented()) return

        var dimension = this.dimension()

        this.$element[dimension](this.$element[dimension]())[0].offsetHeight

        this.$element
          .addClass('collapsing')
          .removeClass('collapse in')
          .attr('aria-expanded', false)

        this.$trigger
          .addClass('collapsed')
          .attr('aria-expanded', false)

        this.transitioning = 1

        var complete = function () {
          this.transitioning = 0
          this.$element
            .removeClass('collapsing')
            .addClass('collapse')
            .trigger('hidden.bs.collapse')
        }

        if (!$.support.transition) return complete.call(this)

        this.$element
        [dimension](0)
          .one('bsTransitionEnd', $.proxy(complete, this))
          .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
      }

      Collapse.prototype.toggle = function () {
        this[this.$element.hasClass('in') ? 'hide' : 'show']()
      }

      Collapse.prototype.getParent = function () {
        return $(this.options.parent)
          .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
          .each($.proxy(function (i, element) {
            var $element = $(element)
            this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
          }, this))
          .end()
      }

      Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
        var isOpen = $element.hasClass('in')

        $element.attr('aria-expanded', isOpen)
        $trigger
          .toggleClass('collapsed', !isOpen)
          .attr('aria-expanded', isOpen)
      }

      function getTargetFromTrigger($trigger) {
        var href
        var target = $trigger.attr('data-target')
          || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

        return $(target)
      }


      // COLLAPSE PLUGIN DEFINITION
      // ==========================

      function Plugin(option) {
        return this.each(function () {
          var $this = $(this)
          var data = $this.data('bs.collapse')
          var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

          if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
          if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
          if (typeof option == 'string') data[option]()
        })
      }

      var old = $.fn.collapse

      $.fn.collapse = Plugin
      $.fn.collapse.Constructor = Collapse


      // COLLAPSE NO CONFLICT
      // ====================

      $.fn.collapse.noConflict = function () {
        $.fn.collapse = old
        return this
      }


      // COLLAPSE DATA-API
      // =================

      $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
        var $this = $(this)

        if (!$this.attr('data-target')) e.preventDefault()

        var $target = getTargetFromTrigger($this)
        var data = $target.data('bs.collapse')
        var option = data ? 'toggle' : $this.data()

        Plugin.call($target, option)
      })

    }(jQuery);

    /* ========================================================================
     * Bootstrap: dropdown.js v3.3.5
     * http://getbootstrap.com/javascript/#dropdowns
     * ========================================================================
     * Copyright 2011-2015 Twitter, Inc.
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
     * ======================================================================== */


    +function ($) {
      'use strict';

      // DROPDOWN CLASS DEFINITION
      // =========================

      var backdrop = '.dropdown-backdrop'
      var toggle = '[data-toggle="dropdown"]'
      var Dropdown = function (element) {
        $(element).on('click.bs.dropdown', this.toggle)
      }

      Dropdown.VERSION = '3.3.5'

      function getParent($this) {
        var selector = $this.attr('data-target')

        if (!selector) {
          selector = $this.attr('href')
          selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
        }

        var $parent = selector && $(selector)

        return $parent && $parent.length ? $parent : $this.parent()
      }

      function clearMenus(e) {
        if (e && e.which === 3) return
        $(backdrop).remove()
        $(toggle).each(function () {
          var $this = $(this)
          var $parent = getParent($this)
          var relatedTarget = { relatedTarget: this }

          if (!$parent.hasClass('open')) return

          if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

          $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

          if (e.isDefaultPrevented()) return

          $this.attr('aria-expanded', 'false')
          $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
        })
      }

      Dropdown.prototype.toggle = function (e) {
        var $this = $(this)

        if ($this.is('.disabled, :disabled')) return

        var $parent = getParent($this)
        var isActive = $parent.hasClass('open')

        clearMenus()

        if (!isActive) {
          if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
            // if mobile we use a backdrop because click events don't delegate
            $(document.createElement('div'))
              .addClass('dropdown-backdrop')
              .insertAfter($(this))
              .on('click', clearMenus)
          }

          var relatedTarget = { relatedTarget: this }
          $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

          if (e.isDefaultPrevented()) return

          $this
            .trigger('focus')
            .attr('aria-expanded', 'true')

          $parent
            .toggleClass('open')
            .trigger('shown.bs.dropdown', relatedTarget)
        }

        return false
      }

      Dropdown.prototype.keydown = function (e) {
        if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

        var $this = $(this)

        e.preventDefault()
        e.stopPropagation()

        if ($this.is('.disabled, :disabled')) return

        var $parent = getParent($this)
        var isActive = $parent.hasClass('open')

        if (!isActive && e.which != 27 || isActive && e.which == 27) {
          if (e.which == 27) $parent.find(toggle).trigger('focus')
          return $this.trigger('click')
        }

        var desc = ' li:not(.disabled):visible a'
        var $items = $parent.find('.dropdown-menu' + desc)

        if (!$items.length) return

        var index = $items.index(e.target)

        if (e.which == 38 && index > 0) index--         // up
        if (e.which == 40 && index < $items.length - 1) index++         // down
        if (!~index) index = 0

        $items.eq(index).trigger('focus')
      }


      // DROPDOWN PLUGIN DEFINITION
      // ==========================

      function Plugin(option) {
        return this.each(function () {
          var $this = $(this)
          var data = $this.data('bs.dropdown')

          if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
          if (typeof option == 'string') data[option].call($this)
        })
      }

      var old = $.fn.dropdown

      $.fn.dropdown = Plugin
      $.fn.dropdown.Constructor = Dropdown


      // DROPDOWN NO CONFLICT
      // ====================

      $.fn.dropdown.noConflict = function () {
        $.fn.dropdown = old
        return this
      }


      // APPLY TO STANDARD DROPDOWN ELEMENTS
      // ===================================

      $(document)
        .on('click.bs.dropdown.data-api', clearMenus)
        .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
        .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
        .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
        .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

    }(jQuery);

    /* ========================================================================
     * Bootstrap: modal.js v3.3.5
     * http://getbootstrap.com/javascript/#modals
     * ========================================================================
     * Copyright 2011-2015 Twitter, Inc.
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
     * ======================================================================== */


    +function ($) {
      'use strict';

      // MODAL CLASS DEFINITION
      // ======================

      var Modal = function (element, options) {
        this.options = options
        this.$body = $(document.body)
        this.$element = $(element)
        this.$dialog = this.$element.find('.modal-dialog')
        this.$backdrop = null
        this.isShown = null
        this.originalBodyPad = null
        this.scrollbarWidth = 0
        this.ignoreBackdropClick = false

        if (this.options.remote) {
          this.$element
            .find('.modal-content')
            .load(this.options.remote, $.proxy(function () {
              this.$element.trigger('loaded.bs.modal')
            }, this))
        }
      }

      Modal.VERSION = '3.3.5'

      Modal.TRANSITION_DURATION = 300
      Modal.BACKDROP_TRANSITION_DURATION = 150

      Modal.DEFAULTS = {
        backdrop: true,
        keyboard: true,
        show: true
      }

      Modal.prototype.toggle = function (_relatedTarget) {
        return this.isShown ? this.hide() : this.show(_relatedTarget)
      }

      Modal.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.checkScrollbar()
        this.setScrollbar()
        this.$body.addClass('modal-open')

        this.escape()
        this.resize()

        this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

        this.$dialog.on('mousedown.dismiss.bs.modal', function () {
          that.$element.one('mouseup.dismiss.bs.modal', function (e) {
            if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
          })
        })

        this.backdrop(function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(that.$body) // don't move modals dom position
          }

          that.$element
            .show()
            .scrollTop(0)

          that.adjustDialog()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element.addClass('in')

          that.enforceFocus()

          var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

          transition ?
            that.$dialog // wait for modal to slide in
              .one('bsTransitionEnd', function () {
                that.$element.trigger('focus').trigger(e)
              })
              .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
            that.$element.trigger('focus').trigger(e)
        })
      }

      Modal.prototype.hide = function (e) {
        if (e) e.preventDefault()

        e = $.Event('hide.bs.modal')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()
        this.resize()

        $(document).off('focusin.bs.modal')

        this.$element
          .removeClass('in')
          .off('click.dismiss.bs.modal')
          .off('mouseup.dismiss.bs.modal')

        this.$dialog.off('mousedown.dismiss.bs.modal')

        $.support.transition && this.$element.hasClass('fade') ?
          this.$element
            .one('bsTransitionEnd', $.proxy(this.hideModal, this))
            .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
          this.hideModal()
      }

      Modal.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
            if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
              this.$element.trigger('focus')
            }
          }, this))
      }

      Modal.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
          this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
            e.which == 27 && this.hide()
          }, this))
        } else if (!this.isShown) {
          this.$element.off('keydown.dismiss.bs.modal')
        }
      }

      Modal.prototype.resize = function () {
        if (this.isShown) {
          $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
        } else {
          $(window).off('resize.bs.modal')
        }
      }

      Modal.prototype.hideModal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
          that.$body.removeClass('modal-open')
          that.resetAdjustments()
          that.resetScrollbar()
          that.$element.trigger('hidden.bs.modal')
        })
      }

      Modal.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
      }

      Modal.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
          var doAnimate = $.support.transition && animate

          this.$backdrop = $(document.createElement('div'))
            .addClass('modal-backdrop ' + animate)
            .appendTo(this.$body)

          this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
            if (this.ignoreBackdropClick) {
              this.ignoreBackdropClick = false
              return
            }
            if (e.target !== e.currentTarget) return
            this.options.backdrop == 'static'
              ? this.$element[0].focus()
              : this.hide()
          }, this))

          if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

          this.$backdrop.addClass('in')

          if (!callback) return

          doAnimate ?
            this.$backdrop
              .one('bsTransitionEnd', callback)
              .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
            callback()

        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass('in')

          var callbackRemove = function () {
            that.removeBackdrop()
            callback && callback()
          }
          $.support.transition && this.$element.hasClass('fade') ?
            this.$backdrop
              .one('bsTransitionEnd', callbackRemove)
              .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
            callbackRemove()

        } else if (callback) {
          callback()
        }
      }

      // these following methods are used to handle overflowing modals

      Modal.prototype.handleUpdate = function () {
        this.adjustDialog()
      }

      Modal.prototype.adjustDialog = function () {
        var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

        this.$element.css({
          paddingLeft: !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
          paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
        })
      }

      Modal.prototype.resetAdjustments = function () {
        this.$element.css({
          paddingLeft: '',
          paddingRight: ''
        })
      }

      Modal.prototype.checkScrollbar = function () {
        var fullWindowWidth = window.innerWidth
        if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
          var documentElementRect = document.documentElement.getBoundingClientRect()
          fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
        }
        this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
        this.scrollbarWidth = this.measureScrollbar()
      }

      Modal.prototype.setScrollbar = function () {
        var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
        this.originalBodyPad = document.body.style.paddingRight || ''
        if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
      }

      Modal.prototype.resetScrollbar = function () {
        this.$body.css('padding-right', this.originalBodyPad)
      }

      Modal.prototype.measureScrollbar = function () { // thx walsh
        var scrollDiv = document.createElement('div')
        scrollDiv.className = 'modal-scrollbar-measure'
        this.$body.append(scrollDiv)
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
        this.$body[0].removeChild(scrollDiv)
        return scrollbarWidth
      }


      // MODAL PLUGIN DEFINITION
      // =======================

      function Plugin(option, _relatedTarget) {
        return this.each(function () {
          var $this = $(this)
          var data = $this.data('bs.modal')
          var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

          if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
          if (typeof option == 'string') data[option](_relatedTarget)
          else if (options.show) data.show(_relatedTarget)
        })
      }

      var old = $.fn.modal

      $.fn.modal = Plugin
      $.fn.modal.Constructor = Modal


      // MODAL NO CONFLICT
      // =================

      $.fn.modal.noConflict = function () {
        $.fn.modal = old
        return this
      }


      // MODAL DATA-API
      // ==============

      $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
        var option = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        if ($this.is('a')) e.preventDefault()

        $target.one('show.bs.modal', function (showEvent) {
          if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
          $target.one('hidden.bs.modal', function () {
            $this.is(':visible') && $this.trigger('focus')
          })
        })
        Plugin.call($target, option, this)
      })

    }(jQuery);

    /* ========================================================================
     * Bootstrap: tooltip.js v3.3.5
     * http://getbootstrap.com/javascript/#tooltip
     * Inspired by the original jQuery.tipsy by Jason Frame
     * ========================================================================
     * Copyright 2011-2015 Twitter, Inc.
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
     * ======================================================================== */


    +function ($) {
      'use strict';

      // TOOLTIP PUBLIC CLASS DEFINITION
      // ===============================

      var Tooltip = function (element, options) {
        this.type = null
        this.options = null
        this.enabled = null
        this.timeout = null
        this.hoverState = null
        this.$element = null
        this.inState = null

        this.init('tooltip', element, options)
      }

      Tooltip.VERSION = '3.3.5'

      Tooltip.TRANSITION_DURATION = 150

      Tooltip.DEFAULTS = {
        animation: true,
        placement: 'top',
        selector: false,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: 'hover focus',
        title: '',
        delay: 0,
        html: false,
        container: false,
        viewport: {
          selector: 'body',
          padding: 0
        }
      }

      Tooltip.prototype.init = function (type, element, options) {
        this.enabled = true
        this.type = type
        this.$element = $(element)
        this.options = this.getOptions(options)
        this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
        this.inState = { click: false, hover: false, focus: false }

        if (this.$element[0] instanceof document.constructor && !this.options.selector) {
          throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
        }

        var triggers = this.options.trigger.split(' ')

        for (var i = triggers.length; i--;) {
          var trigger = triggers[i]

          if (trigger == 'click') {
            this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
          } else if (trigger != 'manual') {
            var eventIn = trigger == 'hover' ? 'mouseenter' : 'focusin'
            var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

            this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
            this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
          }
        }

        this.options.selector ?
          (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
          this.fixTitle()
      }

      Tooltip.prototype.getDefaults = function () {
        return Tooltip.DEFAULTS
      }

      Tooltip.prototype.getOptions = function (options) {
        options = $.extend({}, this.getDefaults(), this.$element.data(), options)

        if (options.delay && typeof options.delay == 'number') {
          options.delay = {
            show: options.delay,
            hide: options.delay
          }
        }

        return options
      }

      Tooltip.prototype.getDelegateOptions = function () {
        var options = {}
        var defaults = this.getDefaults()

        this._options && $.each(this._options, function (key, value) {
          if (defaults[key] != value) options[key] = value
        })

        return options
      }

      Tooltip.prototype.enter = function (obj) {
        var self = obj instanceof this.constructor ?
          obj : $(obj.currentTarget).data('bs.' + this.type)

        if (!self) {
          self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
          $(obj.currentTarget).data('bs.' + this.type, self)
        }

        if (obj instanceof $.Event) {
          self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
        }

        if (self.tip().hasClass('in') || self.hoverState == 'in') {
          self.hoverState = 'in'
          return
        }

        clearTimeout(self.timeout)

        self.hoverState = 'in'

        if (!self.options.delay || !self.options.delay.show) return self.show()

        self.timeout = setTimeout(function () {
          if (self.hoverState == 'in') self.show()
        }, self.options.delay.show)
      }

      Tooltip.prototype.isInStateTrue = function () {
        for (var key in this.inState) {
          if (this.inState[key]) return true
        }

        return false
      }

      Tooltip.prototype.leave = function (obj) {
        var self = obj instanceof this.constructor ?
          obj : $(obj.currentTarget).data('bs.' + this.type)

        if (!self) {
          self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
          $(obj.currentTarget).data('bs.' + this.type, self)
        }

        if (obj instanceof $.Event) {
          self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
        }

        if (self.isInStateTrue()) return

        clearTimeout(self.timeout)

        self.hoverState = 'out'

        if (!self.options.delay || !self.options.delay.hide) return self.hide()

        self.timeout = setTimeout(function () {
          if (self.hoverState == 'out') self.hide()
        }, self.options.delay.hide)
      }

      Tooltip.prototype.show = function () {
        var e = $.Event('show.bs.' + this.type)

        if (this.hasContent() && this.enabled) {
          this.$element.trigger(e)

          var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
          if (e.isDefaultPrevented() || !inDom) return
          var that = this

          var $tip = this.tip()

          var tipId = this.getUID(this.type)

          this.setContent()
          $tip.attr('id', tipId)
          this.$element.attr('aria-describedby', tipId)

          if (this.options.animation) $tip.addClass('fade')

          var placement = typeof this.options.placement == 'function' ?
            this.options.placement.call(this, $tip[0], this.$element[0]) :
            this.options.placement

          var autoToken = /\s?auto?\s?/i
          var autoPlace = autoToken.test(placement)
          if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

          $tip
            .detach()
            .css({ top: 0, left: 0, display: 'block' })
            .addClass(placement)
            .data('bs.' + this.type, this)

          this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
          this.$element.trigger('inserted.bs.' + this.type)

          var pos = this.getPosition()
          var actualWidth = $tip[0].offsetWidth
          var actualHeight = $tip[0].offsetHeight

          if (autoPlace) {
            var orgPlacement = placement
            var viewportDim = this.getPosition(this.$viewport)

            placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top' :
              placement == 'top' && pos.top - actualHeight < viewportDim.top ? 'bottom' :
                placement == 'right' && pos.right + actualWidth > viewportDim.width ? 'left' :
                  placement == 'left' && pos.left - actualWidth < viewportDim.left ? 'right' :
                    placement

            $tip
              .removeClass(orgPlacement)
              .addClass(placement)
          }

          var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

          this.applyPlacement(calculatedOffset, placement)

          var complete = function () {
            var prevHoverState = that.hoverState
            that.$element.trigger('shown.bs.' + that.type)
            that.hoverState = null

            if (prevHoverState == 'out') that.leave(that)
          }

          $.support.transition && this.$tip.hasClass('fade') ?
            $tip
              .one('bsTransitionEnd', complete)
              .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
            complete()
        }
      }

      Tooltip.prototype.applyPlacement = function (offset, placement) {
        var $tip = this.tip()
        var width = $tip[0].offsetWidth
        var height = $tip[0].offsetHeight

        // manually read margins because getBoundingClientRect includes difference
        var marginTop = parseInt($tip.css('margin-top'), 10)
        var marginLeft = parseInt($tip.css('margin-left'), 10)

        // we must check for NaN for ie 8/9
        if (isNaN(marginTop)) marginTop = 0
        if (isNaN(marginLeft)) marginLeft = 0

        offset.top += marginTop
        offset.left += marginLeft

        // $.fn.offset doesn't round pixel values
        // so we use setOffset directly with our own function B-0
        $.offset.setOffset($tip[0], $.extend({
          using: function (props) {
            $tip.css({
              top: Math.round(props.top),
              left: Math.round(props.left)
            })
          }
        }, offset), 0)

        $tip.addClass('in')

        // check to see if placing tip in new offset caused the tip to resize itself
        var actualWidth = $tip[0].offsetWidth
        var actualHeight = $tip[0].offsetHeight

        if (placement == 'top' && actualHeight != height) {
          offset.top = offset.top + height - actualHeight
        }

        var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

        if (delta.left) offset.left += delta.left
        else offset.top += delta.top

        var isVertical = /top|bottom/.test(placement)
        var arrowDelta = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
        var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

        $tip.offset(offset)
        this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
      }

      Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
        this.arrow()
          .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
          .css(isVertical ? 'top' : 'left', '')
      }

      Tooltip.prototype.setContent = function () {
        var $tip = this.tip()
        var title = this.getTitle()

        $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
        $tip.removeClass('fade in top bottom left right')
      }

      Tooltip.prototype.hide = function (callback) {
        var that = this
        var $tip = $(this.$tip)
        var e = $.Event('hide.bs.' + this.type)

        function complete() {
          if (that.hoverState != 'in') $tip.detach()
          that.$element
            .removeAttr('aria-describedby')
            .trigger('hidden.bs.' + that.type)
          callback && callback()
        }

        this.$element.trigger(e)

        if (e.isDefaultPrevented()) return

        $tip.removeClass('in')

        $.support.transition && $tip.hasClass('fade') ?
          $tip
            .one('bsTransitionEnd', complete)
            .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
          complete()

        this.hoverState = null

        return this
      }

      Tooltip.prototype.fixTitle = function () {
        var $e = this.$element
        if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
          $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
        }
      }

      Tooltip.prototype.hasContent = function () {
        return this.getTitle()
      }

      Tooltip.prototype.getPosition = function ($element) {
        $element = $element || this.$element

        var el = $element[0]
        var isBody = el.tagName == 'BODY'

        var elRect = el.getBoundingClientRect()
        if (elRect.width == null) {
          // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
          elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
        }
        var elOffset = isBody ? { top: 0, left: 0 } : $element.offset()
        var scroll = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
        var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

        return $.extend({}, elRect, scroll, outerDims, elOffset)
      }

      Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
        return placement == 'bottom' ? { top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2 } :
          placement == 'top' ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
            placement == 'left' ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
                    /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

      }

      Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
        var delta = { top: 0, left: 0 }
        if (!this.$viewport) return delta

        var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
        var viewportDimensions = this.getPosition(this.$viewport)

        if (/right|left/.test(placement)) {
          var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll
          var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
          if (topEdgeOffset < viewportDimensions.top) { // top overflow
            delta.top = viewportDimensions.top - topEdgeOffset
          } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
            delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
          }
        } else {
          var leftEdgeOffset = pos.left - viewportPadding
          var rightEdgeOffset = pos.left + viewportPadding + actualWidth
          if (leftEdgeOffset < viewportDimensions.left) { // left overflow
            delta.left = viewportDimensions.left - leftEdgeOffset
          } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
            delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
          }
        }

        return delta
      }

      Tooltip.prototype.getTitle = function () {
        var title
        var $e = this.$element
        var o = this.options

        title = $e.attr('data-original-title')
          || (typeof o.title == 'function' ? o.title.call($e[0]) : o.title)

        return title
      }

      Tooltip.prototype.getUID = function (prefix) {
        do prefix += ~~(Math.random() * 1000000)
        while (document.getElementById(prefix))
        return prefix
      }

      Tooltip.prototype.tip = function () {
        if (!this.$tip) {
          this.$tip = $(this.options.template)
          if (this.$tip.length != 1) {
            throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
          }
        }
        return this.$tip
      }

      Tooltip.prototype.arrow = function () {
        return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
      }

      Tooltip.prototype.enable = function () {
        this.enabled = true
      }

      Tooltip.prototype.disable = function () {
        this.enabled = false
      }

      Tooltip.prototype.toggleEnabled = function () {
        this.enabled = !this.enabled
      }

      Tooltip.prototype.toggle = function (e) {
        var self = this
        if (e) {
          self = $(e.currentTarget).data('bs.' + this.type)
          if (!self) {
            self = new this.constructor(e.currentTarget, this.getDelegateOptions())
            $(e.currentTarget).data('bs.' + this.type, self)
          }
        }

        if (e) {
          self.inState.click = !self.inState.click
          if (self.isInStateTrue()) self.enter(self)
          else self.leave(self)
        } else {
          self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
        }
      }

      Tooltip.prototype.destroy = function () {
        var that = this
        clearTimeout(this.timeout)
        this.hide(function () {
          that.$element.off('.' + that.type).removeData('bs.' + that.type)
          if (that.$tip) {
            that.$tip.detach()
          }
          that.$tip = null
          that.$arrow = null
          that.$viewport = null
        })
      }


      // TOOLTIP PLUGIN DEFINITION
      // =========================

      function Plugin(option) {
        return this.each(function () {
          var $this = $(this)
          var data = $this.data('bs.tooltip')
          var options = typeof option == 'object' && option

          if (!data && /destroy|hide/.test(option)) return
          if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
          if (typeof option == 'string') data[option]()
        })
      }

      var old = $.fn.tooltip

      $.fn.tooltip = Plugin
      $.fn.tooltip.Constructor = Tooltip


      // TOOLTIP NO CONFLICT
      // ===================

      $.fn.tooltip.noConflict = function () {
        $.fn.tooltip = old
        return this
      }

    }(jQuery);

    /* ========================================================================
     * Bootstrap: popover.js v3.3.5
     * http://getbootstrap.com/javascript/#popovers
     * ========================================================================
     * Copyright 2011-2015 Twitter, Inc.
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
     * ======================================================================== */


    +function ($) {
      'use strict';

      // POPOVER PUBLIC CLASS DEFINITION
      // ===============================

      var Popover = function (element, options) {
        this.init('popover', element, options)
      }

      if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

      Popover.VERSION = '3.3.5'

      Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
        placement: 'right',
        trigger: 'click',
        content: '',
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
      })


      // NOTE: POPOVER EXTENDS tooltip.js
      // ================================

      Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

      Popover.prototype.constructor = Popover

      Popover.prototype.getDefaults = function () {
        return Popover.DEFAULTS
      }

      Popover.prototype.setContent = function () {
        var $tip = this.tip()
        var title = this.getTitle()
        var content = this.getContent()

        $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
        $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
          this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
        ](content)

        $tip.removeClass('fade top bottom left right in')

        // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
        // this manually by checking the contents.
        if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
      }

      Popover.prototype.hasContent = function () {
        return this.getTitle() || this.getContent()
      }

      Popover.prototype.getContent = function () {
        var $e = this.$element
        var o = this.options

        return $e.attr('data-content')
          || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
      }

      Popover.prototype.arrow = function () {
        return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
      }


      // POPOVER PLUGIN DEFINITION
      // =========================

      function Plugin(option) {
        return this.each(function () {
          var $this = $(this)
          var data = $this.data('bs.popover')
          var options = typeof option == 'object' && option

          if (!data && /destroy|hide/.test(option)) return
          if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
          if (typeof option == 'string') data[option]()
        })
      }

      var old = $.fn.popover

      $.fn.popover = Plugin
      $.fn.popover.Constructor = Popover


      // POPOVER NO CONFLICT
      // ===================

      $.fn.popover.noConflict = function () {
        $.fn.popover = old
        return this
      }

    }(jQuery);

    /* ========================================================================
     * Bootstrap: scrollspy.js v3.3.5
     * http://getbootstrap.com/javascript/#scrollspy
     * ========================================================================
     * Copyright 2011-2015 Twitter, Inc.
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
     * ======================================================================== */


    +function ($) {
      'use strict';

      // SCROLLSPY CLASS DEFINITION
      // ==========================

      function ScrollSpy(element, options) {
        this.$body = $(document.body)
        this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
        this.options = $.extend({}, ScrollSpy.DEFAULTS, options)
        this.selector = (this.options.target || '') + ' .nav li > a'
        this.offsets = []
        this.targets = []
        this.activeTarget = null
        this.scrollHeight = 0

        this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
        this.refresh()
        this.process()
      }

      ScrollSpy.VERSION = '3.3.5'

      ScrollSpy.DEFAULTS = {
        offset: 10
      }

      ScrollSpy.prototype.getScrollHeight = function () {
        return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
      }

      ScrollSpy.prototype.refresh = function () {
        var that = this
        var offsetMethod = 'offset'
        var offsetBase = 0

        this.offsets = []
        this.targets = []
        this.scrollHeight = this.getScrollHeight()

        if (!$.isWindow(this.$scrollElement[0])) {
          offsetMethod = 'position'
          offsetBase = this.$scrollElement.scrollTop()
        }

        this.$body
          .find(this.selector)
          .map(function () {
            var $el = $(this)
            var href = $el.data('target') || $el.attr('href')
            var $href = /^#./.test(href) && $(href)

            return ($href
              && $href.length
              && $href.is(':visible')
              && [[$href[offsetMethod]().top + offsetBase, href]]) || null
          })
          .sort(function (a, b) { return a[0] - b[0] })
          .each(function () {
            that.offsets.push(this[0])
            that.targets.push(this[1])
          })
      }

      ScrollSpy.prototype.process = function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
        var scrollHeight = this.getScrollHeight()
        var maxScroll = this.options.offset + scrollHeight - this.$scrollElement.height()
        var offsets = this.offsets
        var targets = this.targets
        var activeTarget = this.activeTarget
        var i

        if (this.scrollHeight != scrollHeight) {
          this.refresh()
        }

        if (scrollTop >= maxScroll) {
          return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
        }

        if (activeTarget && scrollTop < offsets[0]) {
          this.activeTarget = null
          return this.clear()
        }

        for (i = offsets.length; i--;) {
          activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
            && this.activate(targets[i])
        }
      }

      ScrollSpy.prototype.activate = function (target) {
        this.activeTarget = target

        this.clear()

        var selector = this.selector +
          '[data-target="' + target + '"],' +
          this.selector + '[href="' + target + '"]'

        var active = $(selector)
          .parents('li')
          .addClass('active')

        if (active.parent('.dropdown-menu').length) {
          active = active
            .closest('li.dropdown')
            .addClass('active')
        }

        active.trigger('activate.bs.scrollspy')
      }

      ScrollSpy.prototype.clear = function () {
        $(this.selector)
          .parentsUntil(this.options.target, '.active')
          .removeClass('active')
      }


      // SCROLLSPY PLUGIN DEFINITION
      // ===========================

      function Plugin(option) {
        return this.each(function () {
          var $this = $(this)
          var data = $this.data('bs.scrollspy')
          var options = typeof option == 'object' && option

          if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
          if (typeof option == 'string') data[option]()
        })
      }

      var old = $.fn.scrollspy

      $.fn.scrollspy = Plugin
      $.fn.scrollspy.Constructor = ScrollSpy


      // SCROLLSPY NO CONFLICT
      // =====================

      $.fn.scrollspy.noConflict = function () {
        $.fn.scrollspy = old
        return this
      }


      // SCROLLSPY DATA-API
      // ==================

      $(window).on('load.bs.scrollspy.data-api', function () {
        $('[data-spy="scroll"]').each(function () {
          var $spy = $(this)
          Plugin.call($spy, $spy.data())
        })
      })

    }(jQuery);

    /* ========================================================================
     * Bootstrap: tab.js v3.3.5
     * http://getbootstrap.com/javascript/#tabs
     * ========================================================================
     * Copyright 2011-2015 Twitter, Inc.
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
     * ======================================================================== */


    +function ($) {
      'use strict';

      // TAB CLASS DEFINITION
      // ====================

      var Tab = function (element) {
        // jscs:disable requireDollarBeforejQueryAssignment
        this.element = $(element)
        // jscs:enable requireDollarBeforejQueryAssignment
      }

      Tab.VERSION = '3.3.5'

      Tab.TRANSITION_DURATION = 150

      Tab.prototype.show = function () {
        var $this = this.element
        var $ul = $this.closest('ul:not(.dropdown-menu)')
        var selector = $this.data('target')

        if (!selector) {
          selector = $this.attr('href')
          selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
        }

        if ($this.parent('li').hasClass('active')) return

        var $previous = $ul.find('.active:last a')
        var hideEvent = $.Event('hide.bs.tab', {
          relatedTarget: $this[0]
        })
        var showEvent = $.Event('show.bs.tab', {
          relatedTarget: $previous[0]
        })

        $previous.trigger(hideEvent)
        $this.trigger(showEvent)

        if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

        var $target = $(selector)

        this.activate($this.closest('li'), $ul)
        this.activate($target, $target.parent(), function () {
          $previous.trigger({
            type: 'hidden.bs.tab',
            relatedTarget: $this[0]
          })
          $this.trigger({
            type: 'shown.bs.tab',
            relatedTarget: $previous[0]
          })
        })
      }

      Tab.prototype.activate = function (element, container, callback) {
        var $active = container.find('> .active')
        var transition = callback
          && $.support.transition
          && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

        function next() {
          $active
            .removeClass('active')
            .find('> .dropdown-menu > .active')
            .removeClass('active')
            .end()
            .find('[data-toggle="tab"]')
            .attr('aria-expanded', false)

          element
            .addClass('active')
            .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)

          if (transition) {
            element[0].offsetWidth // reflow for transition
            element.addClass('in')
          } else {
            element.removeClass('fade')
          }

          if (element.parent('.dropdown-menu').length) {
            element
              .closest('li.dropdown')
              .addClass('active')
              .end()
              .find('[data-toggle="tab"]')
              .attr('aria-expanded', true)
          }

          callback && callback()
        }

        $active.length && transition ?
          $active
            .one('bsTransitionEnd', next)
            .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
          next()

        $active.removeClass('in')
      }


      // TAB PLUGIN DEFINITION
      // =====================

      function Plugin(option) {
        return this.each(function () {
          var $this = $(this)
          var data = $this.data('bs.tab')

          if (!data) $this.data('bs.tab', (data = new Tab(this)))
          if (typeof option == 'string') data[option]()
        })
      }

      var old = $.fn.tab

      $.fn.tab = Plugin
      $.fn.tab.Constructor = Tab


      // TAB NO CONFLICT
      // ===============

      $.fn.tab.noConflict = function () {
        $.fn.tab = old
        return this
      }


      // TAB DATA-API
      // ============

      var clickHandler = function (e) {
        e.preventDefault()
        Plugin.call($(this), 'show')
      }

      $(document)
        .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
        .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

    }(jQuery);

    /* ========================================================================
     * Bootstrap: affix.js v3.3.5
     * http://getbootstrap.com/javascript/#affix
     * ========================================================================
     * Copyright 2011-2015 Twitter, Inc.
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
     * ======================================================================== */


    +function ($) {
      'use strict';

      // AFFIX CLASS DEFINITION
      // ======================

      var Affix = function (element, options) {
        this.options = $.extend({}, Affix.DEFAULTS, options)

        this.$target = $(this.options.target)
          .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
          .on('click.bs.affix.data-api', $.proxy(this.checkPositionWithEventLoop, this))

        this.$element = $(element)
        this.affixed = null
        this.unpin = null
        this.pinnedOffset = null

        this.checkPosition()
      }

      Affix.VERSION = '3.3.5'

      Affix.RESET = 'affix affix-top affix-bottom'

      Affix.DEFAULTS = {
        offset: 0,
        target: window
      }

      Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
        var scrollTop = this.$target.scrollTop()
        var position = this.$element.offset()
        var targetHeight = this.$target.height()

        if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

        if (this.affixed == 'bottom') {
          if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
          return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
        }

        var initializing = this.affixed == null
        var colliderTop = initializing ? scrollTop : position.top
        var colliderHeight = initializing ? targetHeight : height

        if (offsetTop != null && scrollTop <= offsetTop) return 'top'
        if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

        return false
      }

      Affix.prototype.getPinnedOffset = function () {
        if (this.pinnedOffset) return this.pinnedOffset
        this.$element.removeClass(Affix.RESET).addClass('affix')
        var scrollTop = this.$target.scrollTop()
        var position = this.$element.offset()
        return (this.pinnedOffset = position.top - scrollTop)
      }

      Affix.prototype.checkPositionWithEventLoop = function () {
        setTimeout($.proxy(this.checkPosition, this), 1)
      }

      Affix.prototype.checkPosition = function () {
        if (!this.$element.is(':visible')) return

        var height = this.$element.height()
        var offset = this.options.offset
        var offsetTop = offset.top
        var offsetBottom = offset.bottom
        var scrollHeight = Math.max($(document).height(), $(document.body).height())

        if (typeof offset != 'object') offsetBottom = offsetTop = offset
        if (typeof offsetTop == 'function') offsetTop = offset.top(this.$element)
        if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

        var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

        if (this.affixed != affix) {
          if (this.unpin != null) this.$element.css('top', '')

          var affixType = 'affix' + (affix ? '-' + affix : '')
          var e = $.Event(affixType + '.bs.affix')

          this.$element.trigger(e)

          if (e.isDefaultPrevented()) return

          this.affixed = affix
          this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

          this.$element
            .removeClass(Affix.RESET)
            .addClass(affixType)
            .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
        }

        if (affix == 'bottom') {
          this.$element.offset({
            top: scrollHeight - height - offsetBottom
          })
        }
      }


      // AFFIX PLUGIN DEFINITION
      // =======================

      function Plugin(option) {
        return this.each(function () {
          var $this = $(this)
          var data = $this.data('bs.affix')
          var options = typeof option == 'object' && option

          if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
          if (typeof option == 'string') data[option]()
        })
      }

      var old = $.fn.affix

      $.fn.affix = Plugin
      $.fn.affix.Constructor = Affix


      // AFFIX NO CONFLICT
      // =================

      $.fn.affix.noConflict = function () {
        $.fn.affix = old
        return this
      }


      // AFFIX DATA-API
      // ==============

      $(window).on('load', function () {
        $('[data-spy="affix"]').each(function () {
          var $spy = $(this)
          var data = $spy.data()

          data.offset = data.offset || {}

          if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
          if (data.offsetTop != null) data.offset.top = data.offsetTop

          Plugin.call($spy, data)
        })
      })

    }(jQuery);

    /* ========================================================================
     * Bootstrap: table.js v3.3.5
     * http://getbootstrap.com/javascript/#affix
     * ========================================================================
     * Copyright 2011-2015 Twitter, Inc.
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
     * ======================================================================== */


    +(function ($) {
      'use strict';

      // TOOLS DEFINITION
      // ======================

      var cachedWidth = null;

      // it only does '%s', and return '' when arguments are undefined
      var sprintf = function (str) {
        var args = arguments,
          flag = true,
          i = 1;

        str = str.replace(/%s/g, function () {
          var arg = args[i++];

          if (typeof arg === 'undefined') {
            flag = false;
            return '';
          }
          return arg;
        });
        return flag ? str : '';
      };

      var getPropertyFromOther = function (list, from, to, value) {
        var result = '';
        $.each(list, function (i, item) {
          if (item[from] === value) {
            result = item[to];
            return false;
          }
          return true;
        });
        return result;
      };

      // http://jsfiddle.net/wenyi/47nz7ez9/3/
      var setFieldIndex = function (columns) {
        var i, j, k,
          totalCol = 0,
          flag = [];

        for (i = 0; i < columns[0].length; i++) {
          totalCol += columns[0][i].colspan || 1;
        }

        for (i = 0; i < columns.length; i++) {
          flag[i] = [];
          for (j = 0; j < totalCol; j++) {
            flag[i][j] = false;
          }
        }

        for (i = 0; i < columns.length; i++) {
          for (j = 0; j < columns[i].length; j++) {
            var r = columns[i][j],
              rowspan = r.rowspan || 1,
              colspan = r.colspan || 1,
              index = $.inArray(false, flag[i]);

            if (colspan === 1) {
              r.fieldIndex = index;
              // when field is undefined, use index instead
              if (typeof r.field === 'undefined') {
                r.field = index;
              }
            }

            for (k = 0; k < rowspan; k++) {
              flag[i + k][index] = true;
            }
            for (k = 0; k < colspan; k++) {
              flag[i][index + k] = true;
            }
          }
        }
      };

      var getScrollBarWidth = function () {
        if (cachedWidth === null) {
          var inner = $('<p/>').addClass('fixed-table-scroll-inner'),
            outer = $('<div/>').addClass('fixed-table-scroll-outer'),
            w1, w2;

          outer.append(inner);
          $('body').append(outer);

          w1 = inner[0].offsetWidth;
          outer.css('overflow', 'scroll');
          w2 = inner[0].offsetWidth;

          if (w1 === w2) {
            w2 = outer[0].clientWidth;
          }

          outer.remove();
          cachedWidth = w1 - w2;
        }
        return cachedWidth;
      };

      var calculateObjectValue = function (self, name, args, defaultValue) {
        var func = name;

        if (typeof name === 'string') {
          // support obj.func1.func2
          var names = name.split('.');

          if (names.length > 1) {
            func = window;
            $.each(names, function (i, f) {
              func = func[f];
            });
          } else {
            func = window[name];
          }
        }
        if (typeof func === 'object') {
          return func;
        }
        if (typeof func === 'function') {
          return func.apply(self, args || []);
        }
        if (!func && typeof name === 'string' && sprintf.apply(this, [name].concat(args))) {
          return sprintf.apply(this, [name].concat(args));
        }
        return defaultValue;
      };

      var compareObjects = function (objectA, objectB, compareLength) {
        // Create arrays of property names
        var objectAProperties = Object.getOwnPropertyNames(objectA),
          objectBProperties = Object.getOwnPropertyNames(objectB),
          propName = '';

        if (compareLength) {
          // If number of properties is different, objects are not equivalent
          if (objectAProperties.length !== objectBProperties.length) {
            return false;
          }
        }

        for (var i = 0; i < objectAProperties.length; i++) {
          propName = objectAProperties[i];

          // If the property is not in the object B properties, continue with the next property
          if ($.inArray(propName, objectBProperties) > -1) {
            // If values of same property are not equal, objects are not equivalent
            if (objectA[propName] !== objectB[propName]) {
              return false;
            }
          }
        }

        // If we made it this far, objects are considered equivalent
        return true;
      };

      var escapeHTML = function (text) {
        if (typeof text === 'string') {
          return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
            .replace(/`/g, '&#x60;');
        }
        return text;
      };

      var getRealDataAttr = function (dataAttr) {
        for (var attr in dataAttr) {
          var auxAttr = attr.split(/(?=[A-Z])/).join('-').toLowerCase();
          if (auxAttr !== attr) {
            dataAttr[auxAttr] = dataAttr[attr];
            delete dataAttr[attr];
          }
        }

        return dataAttr;
      };

      var getItemField = function (item, field, escape) {
        var value = item;

        if (typeof field !== 'string' || item.hasOwnProperty(field)) {
          return escape ? escapeHTML(item[field]) : item[field];
        }
        var props = field.split('.');
        for (var p in props) {
          if (props.hasOwnProperty(p)) {
            value = value && value[props[p]];
          }
        }
        return escape ? escapeHTML(value) : value;
      };

      var isIEBrowser = function () {
        return !!(navigator.userAgent.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./));
      };

      var objectKeys = function () {
        // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
        if (!Object.keys) {
          Object.keys = (function () {
            var hasOwnProperty = Object.prototype.hasOwnProperty,
              hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
              dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
              ],
              dontEnumsLength = dontEnums.length;

            return function (obj) {
              if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                throw new TypeError('Object.keys called on non-object');
              }

              var result = [], prop, i;

              for (prop in obj) {
                if (hasOwnProperty.call(obj, prop)) {
                  result.push(prop);
                }
              }

              if (hasDontEnumBug) {
                for (i = 0; i < dontEnumsLength; i++) {
                  if (hasOwnProperty.call(obj, dontEnums[i])) {
                    result.push(dontEnums[i]);
                  }
                }
              }
              return result;
            };
          }());
        }
      };

      // BOOTSTRAP TABLE CLASS DEFINITION
      // ======================

      var BootstrapTable = function (el, options) {
        this.options = options;
        this.$el = $(el);
        this.$el_ = this.$el.clone();
        this.timeoutId_ = 0;
        this.timeoutFooter_ = 0;

        this.init();
      };

      BootstrapTable.DEFAULTS = {
        classes: 'table table-hover',
        sortClass: undefined,
        locale: undefined,
        height: undefined,
        undefinedText: '-',
        sortName: undefined,
        sortOrder: 'asc',
        sortStable: false,
        rememberOrder: false,
        striped: false,
        columns: [[]],
        data: [],
        totalField: 'total',
        dataField: 'rows',
        method: 'get',
        url: undefined,
        ajax: undefined,
        cache: true,
        contentType: 'application/json',
        dataType: 'json',
        ajaxOptions: {},
        queryParams: function (params) {
          return params;
        },
        queryParamsType: 'limit', // undefined
        responseHandler: function (res) {
          return res;
        },
        pagination: false,
        onlyInfoPagination: false,
        paginationLoop: true,
        sidePagination: 'client', // client or server
        totalRows: 0, // server side need to set
        pageNumber: 1,
        pageSize: 10,
        pageList: [10, 25, 50, 100],
        paginationHAlign: 'right', //right, left
        paginationVAlign: 'bottom', //bottom, top, both
        paginationDetailHAlign: 'left', //right, left
        paginationPreText: '&lsaquo;',
        paginationNextText: '&rsaquo;',
        search: false,
        searchOnEnterKey: false,
        strictSearch: false,
        searchAlign: 'right',
        selectItemName: 'btSelectItem',
        showHeader: true,
        showFooter: false,
        showColumns: false,
        showPaginationSwitch: false,
        showRefresh: false,
        showToggle: false,
        buttonsAlign: 'right',
        smartDisplay: true,
        escape: false,
        minimumCountColumns: 1,
        idField: undefined,
        uniqueId: undefined,
        cardView: false,
        detailView: false,
        detailFormatter: function (index, row) {
          return '';
        },
        detailFilter: function (index, row) {
          return true;
        },
        trimOnSearch: true,
        clickToSelect: false,
        singleSelect: false,
        toolbar: undefined,
        toolbarAlign: 'left',
        checkboxHeader: true,
        sortable: true,
        silentSort: true,
        maintainSelected: false,
        searchTimeOut: 500,
        searchText: '',
        iconSize: undefined,
        buttonsClass: 'default',
        iconsPrefix: 'glyphicon', // glyphicon of fa (font awesome)
        icons: {
          paginationSwitchDown: 'glyphicon-collapse-down icon-chevron-down',
          paginationSwitchUp: 'glyphicon-collapse-up icon-chevron-up',
          refresh: 'glyphicon-refresh icon-refresh',
          toggle: 'glyphicon-list-alt icon-list-alt',
          columns: 'glyphicon-th icon-th',
          detailOpen: 'glyphicon-plus icon-plus',
          detailClose: 'glyphicon-minus icon-minus'
        },

        customSearch: $.noop,

        customSort: $.noop,

        rowStyle: function (row, index) {
          return {};
        },

        rowAttributes: function (row, index) {
          return {};
        },

        footerStyle: function (row, index) {
          return {};
        },

        onAll: function (name, args) {
          return false;
        },
        onClickCell: function (field, value, row, $element) {
          return false;
        },
        onDblClickCell: function (field, value, row, $element) {
          return false;
        },
        onClickRow: function (item, $element) {
          return false;
        },
        onDblClickRow: function (item, $element) {
          return false;
        },
        onSort: function (name, order) {
          return false;
        },
        onCheck: function (row) {
          return false;
        },
        onUncheck: function (row) {
          return false;
        },
        onCheckAll: function (rows) {
          return false;
        },
        onUncheckAll: function (rows) {
          return false;
        },
        onCheckSome: function (rows) {
          return false;
        },
        onUncheckSome: function (rows) {
          return false;
        },
        onLoadSuccess: function (data) {
          return false;
        },
        onLoadError: function (status) {
          return false;
        },
        onColumnSwitch: function (field, checked) {
          return false;
        },
        onPageChange: function (number, size) {
          return false;
        },
        onSearch: function (text) {
          return false;
        },
        onToggle: function (cardView) {
          return false;
        },
        onPreBody: function (data) {
          return false;
        },
        onPostBody: function () {
          return false;
        },
        onPostHeader: function () {
          return false;
        },
        onExpandRow: function (index, row, $detail) {
          return false;
        },
        onCollapseRow: function (index, row) {
          return false;
        },
        onRefreshOptions: function (options) {
          return false;
        },
        onRefresh: function (params) {
          return false;
        },
        onResetView: function () {
          return false;
        }
      };

      BootstrapTable.LOCALES = {};

      BootstrapTable.LOCALES['en-US'] = BootstrapTable.LOCALES.en = {
        formatLoadingMessage: function () {
          return 'Loading, please wait...';
        },
        formatRecordsPerPage: function (pageNumber) {
          return sprintf('%s rows per page', pageNumber);
        },
        formatShowingRows: function (pageFrom, pageTo, totalRows) {
          return sprintf('Showing %s to %s of %s rows', pageFrom, pageTo, totalRows);
        },
        formatDetailPagination: function (totalRows) {
          return sprintf('Showing %s rows', totalRows);
        },
        formatSearch: function () {
          return 'Search';
        },
        formatNoMatches: function () {
          return 'No matching records found';
        },
        formatPaginationSwitch: function () {
          return 'Hide/Show pagination';
        },
        formatRefresh: function () {
          return 'Refresh';
        },
        formatToggle: function () {
          return 'Toggle';
        },
        formatColumns: function () {
          return 'Columns';
        },
        formatAllRows: function () {
          return 'All';
        }
      };

      $.extend(BootstrapTable.DEFAULTS, BootstrapTable.LOCALES['en-US']);

      BootstrapTable.COLUMN_DEFAULTS = {
        radio: false,
        checkbox: false,
        checkboxEnabled: true,
        field: undefined,
        title: undefined,
        titleTooltip: undefined,
        'class': undefined,
        align: undefined, // left, right, center
        halign: undefined, // left, right, center
        falign: undefined, // left, right, center
        valign: undefined, // top, middle, bottom
        width: undefined,
        sortable: false,
        order: 'asc', // asc, desc
        visible: true,
        switchable: true,
        clickToSelect: true,
        formatter: undefined,
        footerFormatter: undefined,
        events: undefined,
        sorter: undefined,
        sortName: undefined,
        cellStyle: undefined,
        searchable: true,
        searchFormatter: true,
        cardVisible: true,
        escape: false
      };

      BootstrapTable.EVENTS = {
        'all.bs.table': 'onAll',
        'click-cell.bs.table': 'onClickCell',
        'dbl-click-cell.bs.table': 'onDblClickCell',
        'click-row.bs.table': 'onClickRow',
        'dbl-click-row.bs.table': 'onDblClickRow',
        'sort.bs.table': 'onSort',
        'check.bs.table': 'onCheck',
        'uncheck.bs.table': 'onUncheck',
        'check-all.bs.table': 'onCheckAll',
        'uncheck-all.bs.table': 'onUncheckAll',
        'check-some.bs.table': 'onCheckSome',
        'uncheck-some.bs.table': 'onUncheckSome',
        'load-success.bs.table': 'onLoadSuccess',
        'load-error.bs.table': 'onLoadError',
        'column-switch.bs.table': 'onColumnSwitch',
        'page-change.bs.table': 'onPageChange',
        'search.bs.table': 'onSearch',
        'toggle.bs.table': 'onToggle',
        'pre-body.bs.table': 'onPreBody',
        'post-body.bs.table': 'onPostBody',
        'post-header.bs.table': 'onPostHeader',
        'expand-row.bs.table': 'onExpandRow',
        'collapse-row.bs.table': 'onCollapseRow',
        'refresh-options.bs.table': 'onRefreshOptions',
        'reset-view.bs.table': 'onResetView',
        'refresh.bs.table': 'onRefresh'
      };

      BootstrapTable.prototype.init = function () {
        this.initLocale();
        this.initContainer();
        this.initTable();
        this.initHeader();
        this.initData();
        this.initHiddenRows();
        this.initFooter();
        this.initToolbar();
        this.initPagination();
        this.initBody();
        this.initSearchText();
        this.initServer();
      };

      BootstrapTable.prototype.initLocale = function () {
        if (this.options.locale) {
          var parts = this.options.locale.split(/-|_/);
          parts[0].toLowerCase();
          if (parts[1]) parts[1].toUpperCase();
          if ($.fn.bootstrapTable.locales[this.options.locale]) {
            // locale as requested
            $.extend(this.options, $.fn.bootstrapTable.locales[this.options.locale]);
          } else if ($.fn.bootstrapTable.locales[parts.join('-')]) {
            // locale with sep set to - (in case original was specified with _)
            $.extend(this.options, $.fn.bootstrapTable.locales[parts.join('-')]);
          } else if ($.fn.bootstrapTable.locales[parts[0]]) {
            // short locale language code (i.e. 'en')
            $.extend(this.options, $.fn.bootstrapTable.locales[parts[0]]);
          }
        }
      };

      BootstrapTable.prototype.initContainer = function () {
        this.$container = $([
          '<div class="bootstrap-table">',
          '<div class="fixed-table-toolbar"></div>',
          this.options.paginationVAlign === 'top' || this.options.paginationVAlign === 'both' ?
            '<div class="fixed-table-pagination" style="clear: both;"></div>' :
            '',
          '<div class="fixed-table-container">',
          '<div class="fixed-table-header"><table></table></div>',
          '<div class="fixed-table-body">',
          '<div class="fixed-table-loading">',
          this.options.formatLoadingMessage(),
          '</div>',
          '</div>',
          '<div class="fixed-table-footer"><table><tr></tr></table></div>',
          this.options.paginationVAlign === 'bottom' || this.options.paginationVAlign === 'both' ?
            '<div class="fixed-table-pagination"></div>' :
            '',
          '</div>',
          '</div>'
        ].join(''));

        this.$container.insertAfter(this.$el);
        this.$tableContainer = this.$container.find('.fixed-table-container');
        this.$tableHeader = this.$container.find('.fixed-table-header');
        this.$tableBody = this.$container.find('.fixed-table-body');
        this.$tableLoading = this.$container.find('.fixed-table-loading');
        this.$tableFooter = this.$container.find('.fixed-table-footer');
        this.$toolbar = this.$container.find('.fixed-table-toolbar');
        this.$pagination = this.$container.find('.fixed-table-pagination');

        this.$tableBody.append(this.$el);
        this.$container.after('<div class="clearfix"></div>');

        this.$el.addClass(this.options.classes);
        if (this.options.striped) {
          this.$el.addClass('table-striped');
        }
        if ($.inArray('table-no-bordered', this.options.classes.split(' ')) !== -1) {
          this.$tableContainer.addClass('table-no-bordered');
        }
      };

      BootstrapTable.prototype.initTable = function () {
        var that = this,
          columns = [],
          data = [];

        this.$header = this.$el.find('>thead');
        if (!this.$header.length) {
          this.$header = $('<thead></thead>').appendTo(this.$el);
        }
        this.$header.find('tr').each(function () {
          var column = [];

          $(this).find('th').each(function () {
            // Fix #2014 - getFieldIndex and elsewhere assume this is string, causes issues if not
            if (typeof $(this).data('field') !== 'undefined') {
              $(this).data('field', $(this).data('field') + '');
            }
            column.push($.extend({}, {
              title: $(this).html(),
              'class': $(this).attr('class'),
              titleTooltip: $(this).attr('title'),
              rowspan: $(this).attr('rowspan') ? +$(this).attr('rowspan') : undefined,
              colspan: $(this).attr('colspan') ? +$(this).attr('colspan') : undefined
            }, $(this).data()));
          });
          columns.push(column);
        });
        if (!$.isArray(this.options.columns[0])) {
          this.options.columns = [this.options.columns];
        }
        this.options.columns = $.extend(true, [], columns, this.options.columns);
        this.columns = [];
        this.fieldsColumnsIndex = [];

        setFieldIndex(this.options.columns);
        $.each(this.options.columns, function (i, columns) {
          $.each(columns, function (j, column) {
            column = $.extend({}, BootstrapTable.COLUMN_DEFAULTS, column);

            if (typeof column.fieldIndex !== 'undefined') {
              that.columns[column.fieldIndex] = column;
              that.fieldsColumnsIndex[column.field] = column.fieldIndex;
            }

            that.options.columns[i][j] = column;
          });
        });

        // if options.data is setting, do not process tbody data
        if (this.options.data.length) {
          return;
        }

        var m = [];
        this.$el.find('>tbody>tr').each(function (y) {
          var row = {};

          // save tr's id, class and data-* attributes
          row._id = $(this).attr('id');
          row._class = $(this).attr('class');
          row._data = getRealDataAttr($(this).data());

          $(this).find('>td').each(function (x) {
            var $this = $(this),
              cspan = +$this.attr('colspan') || 1,
              rspan = +$this.attr('rowspan') || 1,
              tx, ty;

            for (; m[y] && m[y][x]; x++); //skip already occupied cells in current row

            for (tx = x; tx < x + cspan; tx++) { //mark matrix elements occupied by current cell with true
              for (ty = y; ty < y + rspan; ty++) {
                if (!m[ty]) { //fill missing rows
                  m[ty] = [];
                }
                m[ty][tx] = true;
              }
            }

            var field = that.columns[x].field;

            row[field] = $(this).html();
            // save td's id, class and data-* attributes
            row['_' + field + '_id'] = $(this).attr('id');
            row['_' + field + '_class'] = $(this).attr('class');
            row['_' + field + '_rowspan'] = $(this).attr('rowspan');
            row['_' + field + '_colspan'] = $(this).attr('colspan');
            row['_' + field + '_title'] = $(this).attr('title');
            row['_' + field + '_data'] = getRealDataAttr($(this).data());
          });
          data.push(row);
        });
        this.options.data = data;
        if (data.length) this.fromHtml = true;
      };

      BootstrapTable.prototype.initHeader = function () {
        var that = this,
          visibleColumns = {},
          html = [];

        this.header = {
          fields: [],
          styles: [],
          classes: [],
          formatters: [],
          events: [],
          sorters: [],
          sortNames: [],
          cellStyles: [],
          searchables: []
        };

        $.each(this.options.columns, function (i, columns) {
          html.push('<tr>');

          if (i === 0 && !that.options.cardView && that.options.detailView) {
            html.push(sprintf('<th class="detail" rowspan="%s"><div class="fht-cell"></div></th>',
              that.options.columns.length));
          }

          $.each(columns, function (j, column) {
            var text = '',
              halign = '', // header align style
              align = '', // body align style
              style = '',
              class_ = sprintf(' class="%s"', column['class']),
              order = that.options.sortOrder || column.order,
              unitWidth = 'px',
              width = column.width;

            if (column.width !== undefined && (!that.options.cardView)) {
              if (typeof column.width === 'string') {
                if (column.width.indexOf('%') !== -1) {
                  unitWidth = '%';
                }
              }
            }
            if (column.width && typeof column.width === 'string') {
              width = column.width.replace('%', '').replace('px', '');
            }

            halign = sprintf('text-align: %s; ', column.halign ? column.halign : column.align);
            align = sprintf('text-align: %s; ', column.align);
            style = sprintf('vertical-align: %s; ', column.valign);
            style += sprintf('width: %s; ', (column.checkbox || column.radio) && !width ?
              '36px' : (width ? width + unitWidth : undefined));

            if (typeof column.fieldIndex !== 'undefined') {
              that.header.fields[column.fieldIndex] = column.field;
              that.header.styles[column.fieldIndex] = align + style;
              that.header.classes[column.fieldIndex] = class_;
              that.header.formatters[column.fieldIndex] = column.formatter;
              that.header.events[column.fieldIndex] = column.events;
              that.header.sorters[column.fieldIndex] = column.sorter;
              that.header.sortNames[column.fieldIndex] = column.sortName;
              that.header.cellStyles[column.fieldIndex] = column.cellStyle;
              that.header.searchables[column.fieldIndex] = column.searchable;

              if (!column.visible) {
                return;
              }

              if (that.options.cardView && (!column.cardVisible)) {
                return;
              }

              visibleColumns[column.field] = column;
            }

            html.push('<th' + sprintf(' title="%s"', column.titleTooltip),
              column.checkbox || column.radio ?
                sprintf(' class="bs-checkbox %s"', column['class'] || '') :
                class_,
              sprintf(' style="%s"', halign + style),
              sprintf(' rowspan="%s"', column.rowspan),
              sprintf(' colspan="%s"', column.colspan),
              sprintf(' data-field="%s"', column.field),
              '>');

            html.push(sprintf('<div class="th-inner %s">', that.options.sortable && column.sortable ?
              'sortable both' : ''));

            text = that.options.escape ? escapeHTML(column.title) : column.title;

            if (column.checkbox) {
              if (!that.options.singleSelect && that.options.checkboxHeader) {
                text = '<input name="btSelectAll" type="checkbox" />';
              }
              that.header.stateField = column.field;
            }
            if (column.radio) {
              text = '';
              that.header.stateField = column.field;
              that.options.singleSelect = true;
            }

            html.push(text);
            html.push('</div>');
            html.push('<div class="fht-cell"></div>');
            html.push('</div>');
            html.push('</th>');
          });
          html.push('</tr>');
        });

        this.$header.html(html.join(''));
        this.$header.find('th[data-field]').each(function (i) {
          $(this).data(visibleColumns[$(this).data('field')]);
        });
        this.$container.off('click', '.th-inner').on('click', '.th-inner', function (event) {
          var target = $(this);

          if (that.options.detailView) {
            if (target.closest('.bootstrap-table')[0] !== that.$container[0])
              return false;
          }

          if (that.options.sortable && target.parent().data().sortable) {
            that.onSort(event);
          }
        });

        this.$header.children().children().off('keypress').on('keypress', function (event) {
          if (that.options.sortable && $(this).data().sortable) {
            var code = event.keyCode || event.which;
            if (code == 13) { //Enter keycode
              that.onSort(event);
            }
          }
        });

        $(window).off('resize.bootstrap-table');
        if (!this.options.showHeader || this.options.cardView) {
          this.$header.hide();
          this.$tableHeader.hide();
          this.$tableLoading.css('top', 0);
        } else {
          this.$header.show();
          this.$tableHeader.show();
          this.$tableLoading.css('top', this.$header.outerHeight() + 1);
          // Assign the correct sortable arrow
          this.getCaret();
          $(window).on('resize.bootstrap-table', $.proxy(this.resetWidth, this));
        }

        this.$selectAll = this.$header.find('[name="btSelectAll"]');
        this.$selectAll.off('click').on('click', function () {
          var checked = $(this).prop('checked');
          that[checked ? 'checkAll' : 'uncheckAll']();
          that.updateSelected();
        });
      };

      BootstrapTable.prototype.initFooter = function () {
        if (!this.options.showFooter || this.options.cardView) {
          this.$tableFooter.hide();
        } else {
          this.$tableFooter.show();
        }
      };

      /**
       * @param data
       * @param type: append / prepend
       */
      BootstrapTable.prototype.initData = function (data, type) {
        if (type === 'append') {
          this.data = this.data.concat(data);
        } else if (type === 'prepend') {
          this.data = [].concat(data).concat(this.data);
        } else {
          this.data = data || this.options.data;
        }

        // Fix #839 Records deleted when adding new row on filtered table
        if (type === 'append') {
          this.options.data = this.options.data.concat(data);
        } else if (type === 'prepend') {
          this.options.data = [].concat(data).concat(this.options.data);
        } else {
          this.options.data = this.data;
        }

        if (this.options.sidePagination === 'server') {
          return;
        }
        this.initSort();
      };

      BootstrapTable.prototype.initSort = function () {
        var that = this,
          name = this.options.sortName,
          order = this.options.sortOrder === 'desc' ? -1 : 1,
          index = $.inArray(this.options.sortName, this.header.fields),
          timeoutId = 0;

        if (this.options.customSort !== $.noop) {
          this.options.customSort.apply(this, [this.options.sortName, this.options.sortOrder]);
          return;
        }

        if (index !== -1) {
          if (this.options.sortStable) {
            $.each(this.data, function (i, row) {
              row._position = i;
            });
          }

          this.data.sort(function (a, b) {
            if (that.header.sortNames[index]) {
              name = that.header.sortNames[index];
            }
            var aa = getItemField(a, name, that.options.escape),
              bb = getItemField(b, name, that.options.escape),
              value = calculateObjectValue(that.header, that.header.sorters[index], [aa, bb]);

            if (value !== undefined) {
              if (that.options.sortStable && value === 0) {
                return a._position - b._position;
              }
              return order * value;
            }

            // Fix #161: undefined or null string sort bug.
            if (aa === undefined || aa === null) {
              aa = '';
            }
            if (bb === undefined || bb === null) {
              bb = '';
            }

            if (that.options.sortStable && aa === bb) {
              aa = a._position;
              bb = b._position;
              return a._position - b._position;
            }

            // IF both values are numeric, do a numeric comparison
            if ($.isNumeric(aa) && $.isNumeric(bb)) {
              // Convert numerical values form string to float.
              aa = parseFloat(aa);
              bb = parseFloat(bb);
              if (aa < bb) {
                return order * -1;
              }
              return order;
            }

            if (aa === bb) {
              return 0;
            }

            // If value is not a string, convert to string
            if (typeof aa !== 'string') {
              aa = aa.toString();
            }

            if (aa.localeCompare(bb) === -1) {
              return order * -1;
            }

            return order;
          });

          if (this.options.sortClass !== undefined) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(function () {
              that.$el.removeClass(that.options.sortClass);
              var index = that.$header.find(sprintf('[data-field="%s"]',
                that.options.sortName).index() + 1);
              that.$el.find(sprintf('tr td:nth-child(%s)', index))
                .addClass(that.options.sortClass);
            }, 250);
          }
        }
      };

      BootstrapTable.prototype.onSort = function (event) {
        var $this = event.type === "keypress" ? $(event.currentTarget) : $(event.currentTarget).parent(),
          $this_ = this.$header.find('th').eq($this.index());

        this.$header.add(this.$header_).find('span.order').remove();

        if (this.options.sortName === $this.data('field')) {
          this.options.sortOrder = this.options.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
          this.options.sortName = $this.data('field');
          if (this.options.rememberOrder) {
            this.options.sortOrder = $this.data('order') === 'asc' ? 'desc' : 'asc';
          } else {
            this.options.sortOrder = this.options.columns[0].filter(function (option) {
              return option.field === $this.data('field');
            })[0].order;
          }
        }
        this.trigger('sort', this.options.sortName, this.options.sortOrder);

        $this.add($this_).data('order', this.options.sortOrder);

        // Assign the correct sortable arrow
        this.getCaret();

        if (this.options.sidePagination === 'server') {
          this.initServer(this.options.silentSort);
          return;
        }

        this.initSort();
        this.initBody();
      };

      BootstrapTable.prototype.initToolbar = function () {
        var that = this,
          html = [],
          timeoutId = 0,
          $keepOpen,
          $search,
          switchableCount = 0;

        if (this.$toolbar.find('.bs-bars').children().length) {
          $('body').append($(this.options.toolbar));
        }
        this.$toolbar.html('');

        if (typeof this.options.toolbar === 'string' || typeof this.options.toolbar === 'object') {
          $(sprintf('<div class="bs-bars pull-%s"></div>', this.options.toolbarAlign))
            .appendTo(this.$toolbar)
            .append($(this.options.toolbar));
        }

        // showColumns, showToggle, showRefresh
        html = [sprintf('<div class="columns columns-%s btn-group pull-%s">',
          this.options.buttonsAlign, this.options.buttonsAlign)];

        if (typeof this.options.icons === 'string') {
          this.options.icons = calculateObjectValue(null, this.options.icons);
        }

        if (this.options.showPaginationSwitch) {
          html.push(sprintf('<button class="btn' +
            sprintf(' btn-%s', this.options.buttonsClass) +
            sprintf(' btn-%s', this.options.iconSize) +
            '" type="button" name="paginationSwitch" aria-label="pagination Switch" title="%s">',
            this.options.formatPaginationSwitch()),
            sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.paginationSwitchDown),
            '</button>');
        }

        if (this.options.showRefresh) {
          html.push(sprintf('<button class="btn' +
            sprintf(' btn-%s', this.options.buttonsClass) +
            sprintf(' btn-%s', this.options.iconSize) +
            '" type="button" name="refresh" aria-label="refresh" title="%s">',
            this.options.formatRefresh()),
            sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.refresh),
            '</button>');
        }

        if (this.options.showToggle) {
          html.push(sprintf('<button class="btn' +
            sprintf(' btn-%s', this.options.buttonsClass) +
            sprintf(' btn-%s', this.options.iconSize) +
            '" type="button" name="toggle" aria-label="toggle" title="%s">',
            this.options.formatToggle()),
            sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.toggle),
            '</button>');
        }

        if (this.options.showColumns) {
          html.push(sprintf('<div class="keep-open btn-group" title="%s">',
            this.options.formatColumns()),
            '<button type="button" aria-label="columns" class="btn' +
            sprintf(' btn-%s', this.options.buttonsClass) +
            sprintf(' btn-%s', this.options.iconSize) +
            ' dropdown-toggle" data-toggle="dropdown">',
            sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.columns),
            ' <span class="caret"></span>',
            '</button>',
            '<ul class="dropdown-menu" role="menu">');

          $.each(this.columns, function (i, column) {
            if (column.radio || column.checkbox) {
              return;
            }

            if (that.options.cardView && !column.cardVisible) {
              return;
            }

            var checked = column.visible ? ' checked="checked"' : '';

            if (column.switchable) {
              html.push(sprintf('<li role="menuitem">' +
                '<label><input type="checkbox" data-field="%s" value="%s"%s> %s</label>' +
                '</li>', column.field, i, checked, column.title));
              switchableCount++;
            }
          });
          html.push('</ul>',
            '</div>');
        }

        html.push('</div>');

        // Fix #188: this.showToolbar is for extensions
        if (this.showToolbar || html.length > 2) {
          this.$toolbar.append(html.join(''));
        }

        if (this.options.showPaginationSwitch) {
          this.$toolbar.find('button[name="paginationSwitch"]')
            .off('click').on('click', $.proxy(this.togglePagination, this));
        }

        if (this.options.showRefresh) {
          this.$toolbar.find('button[name="refresh"]')
            .off('click').on('click', $.proxy(this.refresh, this));
        }

        if (this.options.showToggle) {
          this.$toolbar.find('button[name="toggle"]')
            .off('click').on('click', function () {
              that.toggleView();
            });
        }

        if (this.options.showColumns) {
          $keepOpen = this.$toolbar.find('.keep-open');

          if (switchableCount <= this.options.minimumCountColumns) {
            $keepOpen.find('input').prop('disabled', true);
          }

          $keepOpen.find('li').off('click').on('click', function (event) {
            event.stopImmediatePropagation();
          });
          $keepOpen.find('input').off('click').on('click', function () {
            var $this = $(this);

            that.toggleColumn($(this).val(), $this.prop('checked'), false);
            that.trigger('column-switch', $(this).data('field'), $this.prop('checked'));
          });
        }

        if (this.options.search) {
          html = [];
          html.push(
            '<div class="pull-' + this.options.searchAlign + ' search">',
            sprintf('<input class="form-control' +
              sprintf(' input-%s', this.options.iconSize) +
              '" type="text" placeholder="%s">',
              this.options.formatSearch()),
            '</div>');

          this.$toolbar.append(html.join(''));
          $search = this.$toolbar.find('.search input');
          $search.off('keyup drop blur').on('keyup drop blur', function (event) {
            if (that.options.searchOnEnterKey && event.keyCode !== 13) {
              return;
            }

            if ($.inArray(event.keyCode, [37, 38, 39, 40]) > -1) {
              return;
            }

            clearTimeout(timeoutId); // doesn't matter if it's 0
            timeoutId = setTimeout(function () {
              that.onSearch(event);
            }, that.options.searchTimeOut);
          });

          if (isIEBrowser()) {
            $search.off('mouseup').on('mouseup', function (event) {
              clearTimeout(timeoutId); // doesn't matter if it's 0
              timeoutId = setTimeout(function () {
                that.onSearch(event);
              }, that.options.searchTimeOut);
            });
          }
        }
      };

      BootstrapTable.prototype.onSearch = function (event) {
        var text = $.trim($(event.currentTarget).val());

        // trim search input
        if (this.options.trimOnSearch && $(event.currentTarget).val() !== text) {
          $(event.currentTarget).val(text);
        }

        if (text === this.searchText) {
          return;
        }
        this.searchText = text;
        this.options.searchText = text;

        this.options.pageNumber = 1;
        this.initSearch();
        this.updatePagination();
        this.trigger('search', text);
      };

      BootstrapTable.prototype.initSearch = function () {
        var that = this;

        if (this.options.sidePagination !== 'server') {
          if (this.options.customSearch !== $.noop) {
            window[this.options.customSearch].apply(this, [this.searchText]);
            return;
          }

          var s = this.searchText && (this.options.escape ?
            escapeHTML(this.searchText) : this.searchText).toLowerCase();
          var f = $.isEmptyObject(this.filterColumns) ? null : this.filterColumns;

          // Check filter
          this.data = f ? $.grep(this.options.data, function (item, i) {
            for (var key in f) {
              if ($.isArray(f[key]) && $.inArray(item[key], f[key]) === -1 ||
                !$.isArray(f[key]) && item[key] !== f[key]) {
                return false;
              }
            }
            return true;
          }) : this.options.data;

          this.data = s ? $.grep(this.data, function (item, i) {
            for (var j = 0; j < that.header.fields.length; j++) {

              if (!that.header.searchables[j]) {
                continue;
              }

              var key = $.isNumeric(that.header.fields[j]) ? parseInt(that.header.fields[j], 10) : that.header.fields[j];
              var column = that.columns[that.fieldsColumnsIndex[key]];
              var value;

              if (typeof key === 'string') {
                value = item;
                var props = key.split('.');
                for (var prop_index = 0; prop_index < props.length; prop_index++) {
                  value = value[props[prop_index]];
                }

                // Fix #142: respect searchForamtter boolean
                if (column && column.searchFormatter) {
                  value = calculateObjectValue(column,
                    that.header.formatters[j], [value, item, i], value);
                }
              } else {
                value = item[key];
              }

              if (typeof value === 'string' || typeof value === 'number') {
                if (that.options.strictSearch) {
                  if ((value + '').toLowerCase() === s) {
                    return true;
                  }
                } else {
                  if ((value + '').toLowerCase().indexOf(s) !== -1) {
                    return true;
                  }
                }
              }
            }
            return false;
          }) : this.data;
        }
      };

      BootstrapTable.prototype.initPagination = function () {
        if (!this.options.pagination) {
          this.$pagination.hide();
          return;
        } else {
          this.$pagination.show();
        }

        var that = this,
          html = [],
          $allSelected = false,
          i, from, to,
          $pageList,
          $first, $pre,
          $next, $last,
          $number,
          data = this.getData(),
          pageList = this.options.pageList;

        if (this.options.sidePagination !== 'server') {
          this.options.totalRows = data.length;
        }

        this.totalPages = 0;
        if (this.options.totalRows) {
          if (this.options.pageSize === this.options.formatAllRows()) {
            this.options.pageSize = this.options.totalRows;
            $allSelected = true;
          } else if (this.options.pageSize === this.options.totalRows) {
            // Fix #667 Table with pagination,
            // multiple pages and a search that matches to one page throws exception
            var pageLst = typeof this.options.pageList === 'string' ?
              this.options.pageList.replace('[', '').replace(']', '')
                .replace(/ /g, '').toLowerCase().split(',') : this.options.pageList;
            if ($.inArray(this.options.formatAllRows().toLowerCase(), pageLst) > -1) {
              $allSelected = true;
            }
          }

          this.totalPages = ~~((this.options.totalRows - 1) / this.options.pageSize) + 1;

          this.options.totalPages = this.totalPages;
        }
        if (this.totalPages > 0 && this.options.pageNumber > this.totalPages) {
          this.options.pageNumber = this.totalPages;
        }

        this.pageFrom = (this.options.pageNumber - 1) * this.options.pageSize + 1;
        this.pageTo = this.options.pageNumber * this.options.pageSize;
        if (this.pageTo > this.options.totalRows) {
          this.pageTo = this.options.totalRows;
        }

        html.push(
          '<div class="pull-' + this.options.paginationDetailHAlign + ' pagination-detail">',
          '<span class="pagination-info">',
          this.options.onlyInfoPagination ? this.options.formatDetailPagination(this.options.totalRows) :
            this.options.formatShowingRows(this.pageFrom, this.pageTo, this.options.totalRows),
          '</span>');

        if (!this.options.onlyInfoPagination) {
          html.push('<span class="page-list">');

          var pageNumber = [
            sprintf('<span class="btn-group %s">',
              this.options.paginationVAlign === 'top' || this.options.paginationVAlign === 'both' ?
                'dropdown' : 'dropup'),
            '<button type="button" class="btn' +
            sprintf(' btn-%s', this.options.buttonsClass) +
            sprintf(' btn-%s', this.options.iconSize) +
            ' dropdown-toggle" data-toggle="dropdown">',
            '<span class="page-size">',
            $allSelected ? this.options.formatAllRows() : this.options.pageSize,
            '</span>',
            ' <span class="caret"></span>',
            '</button>',
            '<ul class="dropdown-menu" role="menu">'
          ];

          if (typeof this.options.pageList === 'string') {
            var list = this.options.pageList.replace('[', '').replace(']', '')
              .replace(/ /g, '').split(',');

            pageList = [];
            $.each(list, function (i, value) {
              pageList.push((value.toUpperCase() === that.options.formatAllRows().toUpperCase() || value.toUpperCase() === "UNLIMITED") ?
                that.options.formatAllRows() : +value);
            });
          }

          $.each(pageList, function (i, page) {
            if (!that.options.smartDisplay || i === 0 || pageList[i - 1] < that.options.totalRows) {
              var active;
              if ($allSelected) {
                active = page === that.options.formatAllRows() ? ' class="active"' : '';
              } else {
                active = page === that.options.pageSize ? ' class="active"' : '';
              }
              pageNumber.push(sprintf('<li role="menuitem"%s><a href="#">%s</a></li>', active, page));
            }
          });
          pageNumber.push('</ul></span>');

          html.push(this.options.formatRecordsPerPage(pageNumber.join('')));
          html.push('</span>');

          html.push('</div>',
            '<div class="pull-' + this.options.paginationHAlign + ' pagination">',
            '<ul class="pagination' + sprintf(' pagination-%s', this.options.iconSize) + '">',
            '<li class="page-pre"><a href="#">' + this.options.paginationPreText + '</a></li>');

          if (this.totalPages < 5) {
            from = 1;
            to = this.totalPages;
          } else {
            from = this.options.pageNumber - 2;
            to = from + 4;
            if (from < 1) {
              from = 1;
              to = 5;
            }
            if (to > this.totalPages) {
              to = this.totalPages;
              from = to - 4;
            }
          }

          if (this.totalPages >= 6) {
            if (this.options.pageNumber >= 3) {
              html.push('<li class="page-first' + (1 === this.options.pageNumber ? ' active' : '') + '">',
                '<a href="#">', 1, '</a>',
                '</li>');

              from++;
            }

            if (this.options.pageNumber >= 4) {
              if (this.options.pageNumber == 4 || this.totalPages == 6 || this.totalPages == 7) {
                from--;
              } else {
                html.push('<li class="page-first-separator disabled">',
                  '<a href="#">...</a>',
                  '</li>');
              }

              to--;
            }
          }

          if (this.totalPages >= 7) {
            if (this.options.pageNumber >= (this.totalPages - 2)) {
              from--;
            }
          }

          if (this.totalPages == 6) {
            if (this.options.pageNumber >= (this.totalPages - 2)) {
              to++;
            }
          } else if (this.totalPages >= 7) {
            if (this.totalPages == 7 || this.options.pageNumber >= (this.totalPages - 3)) {
              to++;
            }
          }

          for (i = from; i <= to; i++) {
            html.push('<li class="page-number' + (i === this.options.pageNumber ? ' active' : '') + '">',
              '<a href="#">', i, '</a>',
              '</li>');
          }

          if (this.totalPages >= 8) {
            if (this.options.pageNumber <= (this.totalPages - 4)) {
              html.push('<li class="page-last-separator disabled">',
                '<a href="#">...</a>',
                '</li>');
            }
          }

          if (this.totalPages >= 6) {
            if (this.options.pageNumber <= (this.totalPages - 3)) {
              html.push('<li class="page-last' + (this.totalPages === this.options.pageNumber ? ' active' : '') + '">',
                '<a href="#">', this.totalPages, '</a>',
                '</li>');
            }
          }

          html.push(
            '<li class="page-next"><a href="#">' + this.options.paginationNextText + '</a></li>',
            '</ul>',
            '</div>');
        }
        this.$pagination.html(html.join(''));

        if (!this.options.onlyInfoPagination) {
          $pageList = this.$pagination.find('.page-list a');
          $first = this.$pagination.find('.page-first');
          $pre = this.$pagination.find('.page-pre');
          $next = this.$pagination.find('.page-next');
          $last = this.$pagination.find('.page-last');
          $number = this.$pagination.find('.page-number');

          if (this.options.smartDisplay) {
            if (this.totalPages <= 1) {
              this.$pagination.find('div.pagination').hide();
            }
            if (pageList.length < 2 || this.options.totalRows <= pageList[0]) {
              this.$pagination.find('span.page-list').hide();
            }

            // when data is empty, hide the pagination
            this.$pagination[this.getData().length ? 'show' : 'hide']();
          }

          if (!this.options.paginationLoop) {
            if (this.options.pageNumber === 1) {
              $pre.addClass('disabled');
            }
            if (this.options.pageNumber === this.totalPages) {
              $next.addClass('disabled');
            }
          }

          if ($allSelected) {
            this.options.pageSize = this.options.formatAllRows();
          }
          $pageList.off('click').on('click', $.proxy(this.onPageListChange, this));
          $first.off('click').on('click', $.proxy(this.onPageFirst, this));
          $pre.off('click').on('click', $.proxy(this.onPagePre, this));
          $next.off('click').on('click', $.proxy(this.onPageNext, this));
          $last.off('click').on('click', $.proxy(this.onPageLast, this));
          $number.off('click').on('click', $.proxy(this.onPageNumber, this));
        }
      };

      BootstrapTable.prototype.updatePagination = function (event) {
        // Fix #171: IE disabled button can be clicked bug.
        if (event && $(event.currentTarget).hasClass('disabled')) {
          return;
        }

        if (!this.options.maintainSelected) {
          this.resetRows();
        }

        this.initPagination();
        if (this.options.sidePagination === 'server') {
          this.initServer();
        } else {
          this.initBody();
        }

        this.trigger('page-change', this.options.pageNumber, this.options.pageSize);
      };

      BootstrapTable.prototype.onPageListChange = function (event) {
        var $this = $(event.currentTarget);

        $this.parent().addClass('active').siblings().removeClass('active');
        this.options.pageSize = $this.text().toUpperCase() === this.options.formatAllRows().toUpperCase() ?
          this.options.formatAllRows() : +$this.text();
        this.$toolbar.find('.page-size').text(this.options.pageSize);

        this.updatePagination(event);
        return false;
      };

      BootstrapTable.prototype.onPageFirst = function (event) {
        this.options.pageNumber = 1;
        this.updatePagination(event);
        return false;
      };

      BootstrapTable.prototype.onPagePre = function (event) {
        if ((this.options.pageNumber - 1) === 0) {
          this.options.pageNumber = this.options.totalPages;
        } else {
          this.options.pageNumber--;
        }
        this.updatePagination(event);
        return false;
      };

      BootstrapTable.prototype.onPageNext = function (event) {
        if ((this.options.pageNumber + 1) > this.options.totalPages) {
          this.options.pageNumber = 1;
        } else {
          this.options.pageNumber++;
        }
        this.updatePagination(event);
        return false;
      };

      BootstrapTable.prototype.onPageLast = function (event) {
        this.options.pageNumber = this.totalPages;
        this.updatePagination(event);
        return false;
      };

      BootstrapTable.prototype.onPageNumber = function (event) {
        if (this.options.pageNumber === +$(event.currentTarget).text()) {
          return;
        }
        this.options.pageNumber = +$(event.currentTarget).text();
        this.updatePagination(event);
        return false;
      };

      BootstrapTable.prototype.initRow = function (item, i, data, parentDom) {
        var that = this,
          key,
          html = [],
          style = {},
          csses = [],
          data_ = '',
          attributes = {},
          htmlAttributes = [];

        if ($.inArray(item, this.hiddenRows) > -1) {
          return;
        }

        style = calculateObjectValue(this.options, this.options.rowStyle, [item, i], style);

        if (style && style.css) {
          for (key in style.css) {
            csses.push(key + ': ' + style.css[key]);
          }
        }

        attributes = calculateObjectValue(this.options,
          this.options.rowAttributes, [item, i], attributes);

        if (attributes) {
          for (key in attributes) {
            htmlAttributes.push(sprintf('%s="%s"', key, escapeHTML(attributes[key])));
          }
        }

        if (item._data && !$.isEmptyObject(item._data)) {
          $.each(item._data, function (k, v) {
            // ignore data-index
            if (k === 'index') {
              return;
            }
            data_ += sprintf(' data-%s="%s"', k, v);
          });
        }

        html.push('<tr',
          sprintf(' %s', htmlAttributes.join(' ')),
          sprintf(' id="%s"', $.isArray(item) ? undefined : item._id),
          sprintf(' class="%s"', style.classes || ($.isArray(item) ? undefined : item._class)),
          sprintf(' data-index="%s"', i),
          sprintf(' data-uniqueid="%s"', item[this.options.uniqueId]),
          sprintf('%s', data_),
          '>'
        );

        if (this.options.cardView) {
          html.push(sprintf('<td colspan="%s"><div class="card-views">', this.header.fields.length));
        }

        if (!this.options.cardView && this.options.detailView) {
          html.push('<td>');

          if (calculateObjectValue(null, this.options.detailFilter, [i, item])) {
            html.push('<a class="detail-icon" href="javascript:">',
              sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.detailOpen),
              '</a>');
          }

          html.push('</td>');
        }

        $.each(this.header.fields, function (j, field) {
          var text = '',
            value_ = getItemField(item, field, that.options.escape),
            value = '',
            type = '',
            cellStyle = {},
            id_ = '',
            class_ = that.header.classes[j],
            data_ = '',
            rowspan_ = '',
            colspan_ = '',
            title_ = '',
            column = that.columns[j];

          if (that.fromHtml && typeof value_ === 'undefined') {
            if ((!column.checkbox) && (!column.radio)) {
              return;
            }
          }

          if (!column.visible) {
            return;
          }

          if (that.options.cardView && (!column.cardVisible)) {
            return;
          }

          if (column.escape) {
            value_ = escapeHTML(value_);
          }

          style = sprintf('style="%s"', csses.concat(that.header.styles[j]).join('; '));

          // handle td's id and class
          if (item['_' + field + '_id']) {
            id_ = sprintf(' id="%s"', item['_' + field + '_id']);
          }
          if (item['_' + field + '_class']) {
            class_ = sprintf(' class="%s"', item['_' + field + '_class']);
          }
          if (item['_' + field + '_rowspan']) {
            rowspan_ = sprintf(' rowspan="%s"', item['_' + field + '_rowspan']);
          }
          if (item['_' + field + '_colspan']) {
            colspan_ = sprintf(' colspan="%s"', item['_' + field + '_colspan']);
          }
          if (item['_' + field + '_title']) {
            title_ = sprintf(' title="%s"', item['_' + field + '_title']);
          }
          cellStyle = calculateObjectValue(that.header,
            that.header.cellStyles[j], [value_, item, i, field], cellStyle);
          if (cellStyle.classes) {
            class_ = sprintf(' class="%s"', cellStyle.classes);
          }
          if (cellStyle.css) {
            var csses_ = [];
            for (var key in cellStyle.css) {
              csses_.push(key + ': ' + cellStyle.css[key]);
            }
            style = sprintf('style="%s"', csses_.concat(that.header.styles[j]).join('; '));
          }

          value = calculateObjectValue(column,
            that.header.formatters[j], [value_, item, i, field], value_);

          if (item['_' + field + '_data'] && !$.isEmptyObject(item['_' + field + '_data'])) {
            $.each(item['_' + field + '_data'], function (k, v) {
              // ignore data-index
              if (k === 'index') {
                return;
              }
              data_ += sprintf(' data-%s="%s"', k, v);
            });
          }

          if (column.checkbox || column.radio) {
            type = column.checkbox ? 'checkbox' : type;
            type = column.radio ? 'radio' : type;

            text = [sprintf(that.options.cardView ?
              '<div class="card-view %s">' : '<td class="bs-checkbox %s">', column['class'] || ''),
            '<input' +
            sprintf(' data-index="%s"', i) +
            sprintf(' name="%s"', that.options.selectItemName) +
            sprintf(' type="%s"', type) +
            sprintf(' value="%s"', item[that.options.idField]) +
            sprintf(' checked="%s"', value === true ||
              (value_ || value && value.checked) ? 'checked' : undefined) +
            sprintf(' disabled="%s"', !column.checkboxEnabled ||
              (value && value.disabled) ? 'disabled' : undefined) +
            ' />',
            that.header.formatters[j] && typeof value === 'string' ? value : '',
            that.options.cardView ? '</div>' : '</td>'
            ].join('');

            item[that.header.stateField] = value === true || (value && value.checked);
          } else {
            value = typeof value === 'undefined' || value === null ?
              that.options.undefinedText : value;

            text = that.options.cardView ? ['<div class="card-view">',
              that.options.showHeader ? sprintf('<span class="title" %s>%s</span>', style,
                getPropertyFromOther(that.columns, 'field', 'title', field)) : '',
              sprintf('<span class="value">%s</span>', value),
              '</div>'
            ].join('') : [sprintf('<td%s %s %s %s %s %s %s>',
              id_, class_, style, data_, rowspan_, colspan_, title_),
              value,
              '</td>'
            ].join('');

            // Hide empty data on Card view when smartDisplay is set to true.
            if (that.options.cardView && that.options.smartDisplay && value === '') {
              // Should set a placeholder for event binding correct fieldIndex
              text = '<div class="card-view"></div>';
            }
          }

          html.push(text);
        });

        if (this.options.cardView) {
          html.push('</div></td>');
        }
        html.push('</tr>');

        return html.join(' ');
      };

      BootstrapTable.prototype.initBody = function (fixedScroll) {
        var that = this,
          html = [],
          data = this.getData();

        this.trigger('pre-body', data);

        this.$body = this.$el.find('>tbody');
        if (!this.$body.length) {
          this.$body = $('<tbody></tbody>').appendTo(this.$el);
        }

        //Fix #389 Bootstrap-table-flatJSON is not working

        if (!this.options.pagination || this.options.sidePagination === 'server') {
          this.pageFrom = 1;
          this.pageTo = data.length;
        }

        var trFragments = $(document.createDocumentFragment());
        var hasTr;

        for (var i = this.pageFrom - 1; i < this.pageTo; i++) {
          var item = data[i];
          var tr = this.initRow(item, i, data, trFragments);
          hasTr = hasTr || !!tr;
          if (tr && tr !== true) {
            trFragments.append(tr);
          }
        }

        // show no records
        if (!hasTr) {
          trFragments.append('<tr class="no-records-found">' +
            sprintf('<td colspan="%s">%s</td>',
              this.$header.find('th').length,
              this.options.formatNoMatches()) +
            '</tr>');
        }

        this.$body.html(trFragments);

        if (!fixedScroll) {
          this.scrollTo(0);
        }

        // click to select by column
        this.$body.find('> tr[data-index] > td').off('click dblclick').on('click dblclick', function (e) {
          var $td = $(this),
            $tr = $td.parent(),
            item = that.data[$tr.data('index')],
            index = $td[0].cellIndex,
            fields = that.getVisibleFields(),
            field = fields[that.options.detailView && !that.options.cardView ? index - 1 : index],
            column = that.columns[that.fieldsColumnsIndex[field]],
            value = getItemField(item, field, that.options.escape);

          if ($td.find('.detail-icon').length) {
            return;
          }

          that.trigger(e.type === 'click' ? 'click-cell' : 'dbl-click-cell', field, value, item, $td);
          that.trigger(e.type === 'click' ? 'click-row' : 'dbl-click-row', item, $tr, field);

          // if click to select - then trigger the checkbox/radio click
          if (e.type === 'click' && that.options.clickToSelect && column.clickToSelect) {
            var $selectItem = $tr.find(sprintf('[name="%s"]', that.options.selectItemName));
            if ($selectItem.length) {
              $selectItem[0].click(); // #144: .trigger('click') bug
            }
          }
        });

        this.$body.find('> tr[data-index] > td > .detail-icon').off('click').on('click', function () {
          var $this = $(this),
            $tr = $this.parent().parent(),
            index = $tr.data('index'),
            row = data[index]; // Fix #980 Detail view, when searching, returns wrong row

          // remove and update
          if ($tr.next().is('tr.detail-view')) {
            $this.find('i').attr('class', sprintf('%s %s', that.options.iconsPrefix, that.options.icons.detailOpen));
            that.trigger('collapse-row', index, row);
            $tr.next().remove();
          } else {
            $this.find('i').attr('class', sprintf('%s %s', that.options.iconsPrefix, that.options.icons.detailClose));
            $tr.after(sprintf('<tr class="detail-view"><td colspan="%s"></td></tr>', $tr.find('td').length));
            var $element = $tr.next().find('td');
            var content = calculateObjectValue(that.options, that.options.detailFormatter, [index, row, $element], '');
            if ($element.length === 1) {
              $element.append(content);
            }
            that.trigger('expand-row', index, row, $element);
          }
          that.resetView();
          return false;
        });

        this.$selectItem = this.$body.find(sprintf('[name="%s"]', this.options.selectItemName));
        this.$selectItem.off('click').on('click', function (event) {
          event.stopImmediatePropagation();

          var $this = $(this),
            checked = $this.prop('checked'),
            row = that.data[$this.data('index')];

          if (that.options.maintainSelected && $(this).is(':radio')) {
            $.each(that.options.data, function (i, row) {
              row[that.header.stateField] = false;
            });
          }

          row[that.header.stateField] = checked;

          if (that.options.singleSelect) {
            that.$selectItem.not(this).each(function () {
              that.data[$(this).data('index')][that.header.stateField] = false;
            });
            that.$selectItem.filter(':checked').not(this).prop('checked', false);
          }

          that.updateSelected();
          that.trigger(checked ? 'check' : 'uncheck', row, $this);
        });

        $.each(this.header.events, function (i, events) {
          if (!events) {
            return;
          }
          // fix bug, if events is defined with namespace
          if (typeof events === 'string') {
            events = calculateObjectValue(null, events);
          }

          var field = that.header.fields[i],
            fieldIndex = $.inArray(field, that.getVisibleFields());

          if (that.options.detailView && !that.options.cardView) {
            fieldIndex += 1;
          }

          for (var key in events) {
            that.$body.find('>tr:not(.no-records-found)').each(function () {
              var $tr = $(this),
                $td = $tr.find(that.options.cardView ? '.card-view' : 'td').eq(fieldIndex),
                index = key.indexOf(' '),
                name = key.substring(0, index),
                el = key.substring(index + 1),
                func = events[key];

              $td.find(el).off(name).on(name, function (e) {
                var index = $tr.data('index'),
                  row = that.data[index],
                  value = row[field];

                func.apply(this, [e, value, row, index]);
              });
            });
          }
        });

        this.updateSelected();
        this.resetView();

        this.trigger('post-body', data);
      };

      BootstrapTable.prototype.initServer = function (silent, query, url) {
        var that = this,
          data = {},
          params = {
            searchText: this.searchText,
            sortName: this.options.sortName,
            sortOrder: this.options.sortOrder
          },
          request;

        if (this.options.pagination) {
          params.pageSize = this.options.pageSize === this.options.formatAllRows() ?
            this.options.totalRows : this.options.pageSize;
          params.pageNumber = this.options.pageNumber;
        }

        if (!(url || this.options.url) && !this.options.ajax) {
          return;
        }

        if (this.options.queryParamsType === 'limit') {
          params = {
            search: params.searchText,
            sort: params.sortName,
            order: params.sortOrder
          };

          if (this.options.pagination) {
            params.offset = this.options.pageSize === this.options.formatAllRows() ?
              0 : this.options.pageSize * (this.options.pageNumber - 1);
            params.limit = this.options.pageSize === this.options.formatAllRows() ?
              this.options.totalRows : this.options.pageSize;
          }
        }

        if (!($.isEmptyObject(this.filterColumnsPartial))) {
          params.filter = JSON.stringify(this.filterColumnsPartial, null);
        }

        data = calculateObjectValue(this.options, this.options.queryParams, [params], data);

        $.extend(data, query || {});

        // false to stop request
        if (data === false) {
          return;
        }

        if (!silent) {
          this.$tableLoading.show();
        }
        request = $.extend({}, calculateObjectValue(null, this.options.ajaxOptions), {
          type: this.options.method,
          url: url || this.options.url,
          data: this.options.contentType === 'application/json' && this.options.method === 'post' ?
            JSON.stringify(data) : data,
          cache: this.options.cache,
          contentType: this.options.contentType,
          dataType: this.options.dataType,
          success: function (res) {
            res = calculateObjectValue(that.options, that.options.responseHandler, [res], res);

            that.load(res);
            that.trigger('load-success', res);
            if (!silent) that.$tableLoading.hide();
          },
          error: function (res) {
            that.trigger('load-error', res.status, res);
            if (!silent) that.$tableLoading.hide();
          }
        });

        if (this.options.ajax) {
          calculateObjectValue(this, this.options.ajax, [request], null);
        } else {
          if (this._xhr && this._xhr.readyState !== 4) {
            this._xhr.abort();
          }
          this._xhr = $.ajax(request);
        }
      };

      BootstrapTable.prototype.initSearchText = function () {
        if (this.options.search) {
          if (this.options.searchText !== '') {
            var $search = this.$toolbar.find('.search input');
            $search.val(this.options.searchText);
            this.onSearch({ currentTarget: $search });
          }
        }
      };

      BootstrapTable.prototype.getCaret = function () {
        var that = this;

        $.each(this.$header.find('th'), function (i, th) {
          $(th).find('.sortable').removeClass('desc asc').addClass($(th).data('field') === that.options.sortName ? that.options.sortOrder : 'both');
        });
      };

      BootstrapTable.prototype.updateSelected = function () {
        var checkAll = this.$selectItem.filter(':enabled').length &&
          this.$selectItem.filter(':enabled').length ===
          this.$selectItem.filter(':enabled').filter(':checked').length;

        this.$selectAll.add(this.$selectAll_).prop('checked', checkAll);

        this.$selectItem.each(function () {
          $(this).closest('tr')[$(this).prop('checked') ? 'addClass' : 'removeClass']('selected');
        });
      };

      BootstrapTable.prototype.updateRows = function () {
        var that = this;

        this.$selectItem.each(function () {
          that.data[$(this).data('index')][that.header.stateField] = $(this).prop('checked');
        });
      };

      BootstrapTable.prototype.resetRows = function () {
        var that = this;

        $.each(this.data, function (i, row) {
          that.$selectAll.prop('checked', false);
          that.$selectItem.prop('checked', false);
          if (that.header.stateField) {
            row[that.header.stateField] = false;
          }
        });
        this.initHiddenRows();
      };

      BootstrapTable.prototype.trigger = function (name) {
        var args = Array.prototype.slice.call(arguments, 1);

        name += '.bs.table';
        this.options[BootstrapTable.EVENTS[name]].apply(this.options, args);
        this.$el.trigger($.Event(name), args);

        this.options.onAll(name, args);
        this.$el.trigger($.Event('all.bs.table'), [name, args]);
      };

      BootstrapTable.prototype.resetHeader = function () {
        // fix #61: the hidden table reset header bug.
        // fix bug: get $el.css('width') error sometime (height = 500)
        clearTimeout(this.timeoutId_);
        this.timeoutId_ = setTimeout($.proxy(this.fitHeader, this), this.$el.is(':hidden') ? 100 : 0);
      };

      BootstrapTable.prototype.fitHeader = function () {
        var that = this,
          fixedBody,
          scrollWidth,
          focused,
          focusedTemp;

        if (that.$el.is(':hidden')) {
          that.timeoutId_ = setTimeout($.proxy(that.fitHeader, that), 100);
          return;
        }
        fixedBody = this.$tableBody.get(0);

        scrollWidth = fixedBody.scrollWidth > fixedBody.clientWidth &&
          fixedBody.scrollHeight > fixedBody.clientHeight + this.$header.outerHeight() ?
          getScrollBarWidth() : 0;

        this.$el.css('margin-top', -this.$header.outerHeight());

        focused = $(':focus');
        if (focused.length > 0) {
          var $th = focused.parents('th');
          if ($th.length > 0) {
            var dataField = $th.attr('data-field');
            if (dataField !== undefined) {
              var $headerTh = this.$header.find("[data-field='" + dataField + "']");
              if ($headerTh.length > 0) {
                $headerTh.find(":input").addClass("focus-temp");
              }
            }
          }
        }

        this.$header_ = this.$header.clone(true, true);
        this.$selectAll_ = this.$header_.find('[name="btSelectAll"]');
        this.$tableHeader.css({
          'margin-right': scrollWidth
        }).find('table').css('width', this.$el.outerWidth())
          .html('').attr('class', this.$el.attr('class'))
          .append(this.$header_);

        focusedTemp = $('.focus-temp:visible:eq(0)');
        if (focusedTemp.length > 0) {
          focusedTemp.focus();
          this.$header.find('.focus-temp').removeClass('focus-temp');
        }

        // fix bug: $.data() is not working as expected after $.append()
        this.$header.find('th[data-field]').each(function (i) {
          that.$header_.find(sprintf('th[data-field="%s"]', $(this).data('field'))).data($(this).data());
        });

        var visibleFields = this.getVisibleFields(),
          $ths = this.$header_.find('th');

        this.$body.find('>tr:first-child:not(.no-records-found) > *').each(function (i) {
          var $this = $(this),
            index = i;

          if (that.options.detailView && !that.options.cardView) {
            if (i === 0) {
              that.$header_.find('th.detail').find('.fht-cell').width($this.innerWidth());
            }
            index = i - 1;
          }

          var $th = that.$header_.find(sprintf('th[data-field="%s"]', visibleFields[index]));
          if ($th.length > 1) {
            $th = $($ths[$this[0].cellIndex]);
          }

          $th.find('.fht-cell').width($this.innerWidth());
        });

        this.horizontalScroll();
        this.trigger('post-header');
      };

      BootstrapTable.prototype.resetFooter = function () {
        var that = this,
          data = that.getData(),
          html = [];

        if (!this.options.showFooter || this.options.cardView) { //do nothing
          return;
        }

        if (!this.options.cardView && this.options.detailView) {
          html.push('<td><div class="th-inner">&nbsp;</div><div class="fht-cell"></div></td>');
        }

        $.each(this.columns, function (i, column) {
          var key,
            falign = '', // footer align style
            valign = '',
            csses = [],
            style = {},
            class_ = sprintf(' class="%s"', column['class']);

          if (!column.visible) {
            return;
          }

          if (that.options.cardView && (!column.cardVisible)) {
            return;
          }

          falign = sprintf('text-align: %s; ', column.falign ? column.falign : column.align);
          valign = sprintf('vertical-align: %s; ', column.valign);

          style = calculateObjectValue(null, that.options.footerStyle);

          if (style && style.css) {
            for (key in style.css) {
              csses.push(key + ': ' + style.css[key]);
            }
          }

          html.push('<td', class_, sprintf(' style="%s"', falign + valign + csses.concat().join('; ')), '>');
          html.push('<div class="th-inner">');

          html.push(calculateObjectValue(column, column.footerFormatter, [data], '&nbsp;') || '&nbsp;');

          html.push('</div>');
          html.push('<div class="fht-cell"></div>');
          html.push('</div>');
          html.push('</td>');
        });

        this.$tableFooter.find('tr').html(html.join(''));
        this.$tableFooter.show();
        clearTimeout(this.timeoutFooter_);
        this.timeoutFooter_ = setTimeout($.proxy(this.fitFooter, this),
          this.$el.is(':hidden') ? 100 : 0);
      };

      BootstrapTable.prototype.fitFooter = function () {
        var that = this,
          $footerTd,
          elWidth,
          scrollWidth;

        clearTimeout(this.timeoutFooter_);
        if (this.$el.is(':hidden')) {
          this.timeoutFooter_ = setTimeout($.proxy(this.fitFooter, this), 100);
          return;
        }

        elWidth = this.$el.css('width');
        scrollWidth = elWidth > this.$tableBody.width() ? getScrollBarWidth() : 0;

        this.$tableFooter.css({
          'margin-right': scrollWidth
        }).find('table').css('width', elWidth)
          .attr('class', this.$el.attr('class'));

        $footerTd = this.$tableFooter.find('td');

        this.$body.find('>tr:first-child:not(.no-records-found) > *').each(function (i) {
          var $this = $(this);

          $footerTd.eq(i).find('.fht-cell').width($this.innerWidth());
        });

        this.horizontalScroll();
      };

      BootstrapTable.prototype.horizontalScroll = function () {
        var that = this;
        // horizontal scroll event
        // TODO: it's probably better improving the layout than binding to scroll event
        this.$tableBody.off('scroll').on('scroll', function () {
          if (that.options.showHeader && that.options.height) {
            that.$tableHeader.scrollLeft($(this).scrollLeft());
          }

          if (that.options.showFooter && !that.options.cardView) {
            that.$tableFooter.scrollLeft($(this).scrollLeft());
          }
        });
      };

      BootstrapTable.prototype.toggleColumn = function (index, checked, needUpdate) {
        if (index === -1) {
          return;
        }
        this.columns[index].visible = checked;
        this.initHeader();
        this.initSearch();
        this.initPagination();
        this.initBody();

        if (this.options.showColumns) {
          var $items = this.$toolbar.find('.keep-open input').prop('disabled', false);

          if (needUpdate) {
            $items.filter(sprintf('[value="%s"]', index)).prop('checked', checked);
          }

          if ($items.filter(':checked').length <= this.options.minimumCountColumns) {
            $items.filter(':checked').prop('disabled', true);
          }
        }
      };

      BootstrapTable.prototype.getVisibleFields = function () {
        var that = this,
          visibleFields = [];

        $.each(this.header.fields, function (j, field) {
          var column = that.columns[that.fieldsColumnsIndex[field]];

          if (!column.visible) {
            return;
          }
          visibleFields.push(field);
        });
        return visibleFields;
      };

      // PUBLIC FUNCTION DEFINITION
      // =======================

      BootstrapTable.prototype.resetView = function (params) {
        var padding = 0;

        if (params && params.height) {
          this.options.height = params.height;
        }

        this.$selectAll.prop('checked', this.$selectItem.length > 0 &&
          this.$selectItem.length === this.$selectItem.filter(':checked').length);

        if (this.options.height) {
          var toolbarHeight = this.$toolbar.outerHeight(true),
            paginationHeight = this.$pagination.outerHeight(true),
            height = this.options.height - toolbarHeight - paginationHeight;

          this.$tableContainer.css('height', height + 'px');
        }

        if (this.options.cardView) {
          // remove the element css
          this.$el.css('margin-top', '0');
          this.$tableContainer.css('padding-bottom', '0');
          this.$tableFooter.hide();
          return;
        }

        if (this.options.showHeader && this.options.height) {
          this.$tableHeader.show();
          this.resetHeader();
          padding += this.$header.outerHeight();
        } else {
          this.$tableHeader.hide();
          this.trigger('post-header');
        }

        if (this.options.showFooter) {
          this.resetFooter();
          if (this.options.height) {
            padding += this.$tableFooter.outerHeight() + 1;
          }
        }

        // Assign the correct sortable arrow
        this.getCaret();
        this.$tableContainer.css('padding-bottom', padding + 'px');
        this.trigger('reset-view');
      };

      BootstrapTable.prototype.getData = function (useCurrentPage) {
        var data = this.options.data;
        if (this.searchText || this.options.sortName || !$.isEmptyObject(this.filterColumns) || !$.isEmptyObject(this.filterColumnsPartial)) {
          data = this.data;
        }

        if (useCurrentPage) {
          return data.slice(this.pageFrom - 1, this.pageTo);
        }

        return data;
      };

      BootstrapTable.prototype.load = function (data) {
        var fixedScroll = false;

        // #431: support pagination
        if (this.options.sidePagination === 'server') {
          this.options.totalRows = data[this.options.totalField];
          fixedScroll = data.fixedScroll;
          data = data[this.options.dataField];
        } else if (!$.isArray(data)) { // support fixedScroll
          fixedScroll = data.fixedScroll;
          data = data.data;
        }

        this.initData(data);
        this.initSearch();
        this.initPagination();
        this.initBody(fixedScroll);
      };

      BootstrapTable.prototype.append = function (data) {
        this.initData(data, 'append');
        this.initSearch();
        this.initPagination();
        this.initSort();
        this.initBody(true);
      };

      BootstrapTable.prototype.prepend = function (data) {
        this.initData(data, 'prepend');
        this.initSearch();
        this.initPagination();
        this.initSort();
        this.initBody(true);
      };

      BootstrapTable.prototype.remove = function (params) {
        var len = this.options.data.length,
          i, row;

        if (!params.hasOwnProperty('field') || !params.hasOwnProperty('values')) {
          return;
        }

        for (i = len - 1; i >= 0; i--) {
          row = this.options.data[i];

          if (!row.hasOwnProperty(params.field)) {
            continue;
          }
          if ($.inArray(row[params.field], params.values) !== -1) {
            this.options.data.splice(i, 1);
            if (this.options.sidePagination === 'server') {
              this.options.totalRows -= 1;
            }
          }
        }

        if (len === this.options.data.length) {
          return;
        }

        this.initSearch();
        this.initPagination();
        this.initSort();
        this.initBody(true);
      };

      BootstrapTable.prototype.removeAll = function () {
        if (this.options.data.length > 0) {
          this.options.data.splice(0, this.options.data.length);
          this.initSearch();
          this.initPagination();
          this.initBody(true);
        }
      };

      BootstrapTable.prototype.getRowByUniqueId = function (id) {
        var uniqueId = this.options.uniqueId,
          len = this.options.data.length,
          dataRow = null,
          i, row, rowUniqueId;

        for (i = len - 1; i >= 0; i--) {
          row = this.options.data[i];

          if (row.hasOwnProperty(uniqueId)) { // uniqueId is a column
            rowUniqueId = row[uniqueId];
          } else if (row._data.hasOwnProperty(uniqueId)) { // uniqueId is a row data property
            rowUniqueId = row._data[uniqueId];
          } else {
            continue;
          }

          if (typeof rowUniqueId === 'string') {
            id = id.toString();
          } else if (typeof rowUniqueId === 'number') {
            if ((Number(rowUniqueId) === rowUniqueId) && (rowUniqueId % 1 === 0)) {
              id = parseInt(id);
            } else if ((rowUniqueId === Number(rowUniqueId)) && (rowUniqueId !== 0)) {
              id = parseFloat(id);
            }
          }

          if (rowUniqueId === id) {
            dataRow = row;
            break;
          }
        }

        return dataRow;
      };

      BootstrapTable.prototype.removeByUniqueId = function (id) {
        var len = this.options.data.length,
          row = this.getRowByUniqueId(id);

        if (row) {
          this.options.data.splice(this.options.data.indexOf(row), 1);
        }

        if (len === this.options.data.length) {
          return;
        }

        this.initSearch();
        this.initPagination();
        this.initBody(true);
      };

      BootstrapTable.prototype.updateByUniqueId = function (params) {
        var that = this;
        var allParams = $.isArray(params) ? params : [params];

        $.each(allParams, function (i, params) {
          var rowId;

          if (!params.hasOwnProperty('id') || !params.hasOwnProperty('row')) {
            return;
          }

          rowId = $.inArray(that.getRowByUniqueId(params.id), that.options.data);

          if (rowId === -1) {
            return;
          }
          $.extend(that.options.data[rowId], params.row);
        });

        this.initSearch();
        this.initPagination();
        this.initSort();
        this.initBody(true);
      };

      BootstrapTable.prototype.refreshColumnTitle = function (params) {
        if (!params.hasOwnProperty('field') || !params.hasOwnProperty('title')) {
          return;
        }

        this.columns[this.fieldsColumnsIndex[params.field]].title = this.options.escape
          ? escapeHTML(params.title)
          : params.title;

        if (this.columns[this.fieldsColumnsIndex[params.field]].visible) {
          var header = this.options.height !== undefined ? this.$tableHeader : this.$header;
          header.find('th[data-field]').each(function (i) {
            if ($(this).data('field') === params.field) {
              $($(this).find(".th-inner")[0]).text(params.title);
              return false;
            }
          });
        }
      };

      BootstrapTable.prototype.insertRow = function (params) {
        if (!params.hasOwnProperty('index') || !params.hasOwnProperty('row')) {
          return;
        }
        this.options.data.splice(params.index, 0, params.row);
        this.initSearch();
        this.initPagination();
        this.initSort();
        this.initBody(true);
      };

      BootstrapTable.prototype.updateRow = function (params) {
        var that = this;
        var allParams = $.isArray(params) ? params : [params];

        $.each(allParams, function (i, params) {
          if (!params.hasOwnProperty('index') || !params.hasOwnProperty('row')) {
            return;
          }
          $.extend(that.options.data[params.index], params.row);
        });

        this.initSearch();
        this.initPagination();
        this.initSort();
        this.initBody(true);
      };

      BootstrapTable.prototype.initHiddenRows = function () {
        this.hiddenRows = [];
      };

      BootstrapTable.prototype.showRow = function (params) {
        this.toggleRow(params, true);
      };

      BootstrapTable.prototype.hideRow = function (params) {
        this.toggleRow(params, false);
      };

      BootstrapTable.prototype.toggleRow = function (params, visible) {
        var row, index;

        if (params.hasOwnProperty('index')) {
          row = this.getData()[params.index];
        } else if (params.hasOwnProperty('uniqueId')) {
          row = this.getRowByUniqueId(params.uniqueId);
        }

        if (!row) {
          return;
        }

        index = $.inArray(row, this.hiddenRows);

        if (!visible && index === -1) {
          this.hiddenRows.push(row);
        } else if (visible && index > -1) {
          this.hiddenRows.splice(index, 1);
        }
        this.initBody(true);
      };

      BootstrapTable.prototype.getHiddenRows = function (show) {
        var that = this,
          data = this.getData(),
          rows = [];

        $.each(data, function (i, row) {
          if ($.inArray(row, that.hiddenRows) > -1) {
            rows.push(row);
          }
        });
        this.hiddenRows = rows;
        return rows;
      };

      BootstrapTable.prototype.mergeCells = function (options) {
        var row = options.index,
          col = $.inArray(options.field, this.getVisibleFields()),
          rowspan = options.rowspan || 1,
          colspan = options.colspan || 1,
          i, j,
          $tr = this.$body.find('>tr'),
          $td;

        if (this.options.detailView && !this.options.cardView) {
          col += 1;
        }

        $td = $tr.eq(row).find('>td').eq(col);

        if (row < 0 || col < 0 || row >= this.data.length) {
          return;
        }

        for (i = row; i < row + rowspan; i++) {
          for (j = col; j < col + colspan; j++) {
            $tr.eq(i).find('>td').eq(j).hide();
          }
        }

        $td.attr('rowspan', rowspan).attr('colspan', colspan).show();
      };

      BootstrapTable.prototype.updateCell = function (params) {
        if (!params.hasOwnProperty('index') ||
          !params.hasOwnProperty('field') ||
          !params.hasOwnProperty('value')) {
          return;
        }
        this.data[params.index][params.field] = params.value;

        if (params.reinit === false) {
          return;
        }
        this.initSort();
        this.initBody(true);
      };

      BootstrapTable.prototype.updateCellById = function (params) {
        var that = this;
        if (!params.hasOwnProperty('id') ||
          !params.hasOwnProperty('field') ||
          !params.hasOwnProperty('value')) {
          return;
        }
        var allParams = $.isArray(params) ? params : [params];

        $.each(allParams, function (i, params) {
          var rowId;

          rowId = $.inArray(that.getRowByUniqueId(params.id), that.options.data);

          if (rowId === -1) {
            return;
          }
          that.data[rowId][params.field] = params.value
        });

        if (params.reinit === false) {
          return;
        }
        this.initSort();
        this.initBody(true);
      };

      BootstrapTable.prototype.getOptions = function () {
        //Deep copy
        return $.extend(true, {}, this.options);
      };

      BootstrapTable.prototype.getSelections = function () {
        var that = this;

        return $.grep(this.options.data, function (row) {
          // fix #2424: from html with checkbox
          return row[that.header.stateField] === true;
        });
      };

      BootstrapTable.prototype.getAllSelections = function () {
        var that = this;

        return $.grep(this.options.data, function (row) {
          return row[that.header.stateField];
        });
      };

      BootstrapTable.prototype.checkAll = function () {
        this.checkAll_(true);
      };

      BootstrapTable.prototype.uncheckAll = function () {
        this.checkAll_(false);
      };

      BootstrapTable.prototype.checkInvert = function () {
        var that = this;
        var rows = that.$selectItem.filter(':enabled');
        var checked = rows.filter(':checked');
        rows.each(function () {
          $(this).prop('checked', !$(this).prop('checked'));
        });
        that.updateRows();
        that.updateSelected();
        that.trigger('uncheck-some', checked);
        checked = that.getSelections();
        that.trigger('check-some', checked);
      };

      BootstrapTable.prototype.checkAll_ = function (checked) {
        var rows;
        if (!checked) {
          rows = this.getSelections();
        }
        this.$selectAll.add(this.$selectAll_).prop('checked', checked);
        this.$selectItem.filter(':enabled').prop('checked', checked);
        this.updateRows();
        if (checked) {
          rows = this.getSelections();
        }
        this.trigger(checked ? 'check-all' : 'uncheck-all', rows);
      };

      BootstrapTable.prototype.check = function (index) {
        this.check_(true, index);
      };

      BootstrapTable.prototype.uncheck = function (index) {
        this.check_(false, index);
      };

      BootstrapTable.prototype.check_ = function (checked, index) {
        var $el = this.$selectItem.filter(sprintf('[data-index="%s"]', index)).prop('checked', checked);
        this.data[index][this.header.stateField] = checked;
        this.updateSelected();
        this.trigger(checked ? 'check' : 'uncheck', this.data[index], $el);
      };

      BootstrapTable.prototype.checkBy = function (obj) {
        this.checkBy_(true, obj);
      };

      BootstrapTable.prototype.uncheckBy = function (obj) {
        this.checkBy_(false, obj);
      };

      BootstrapTable.prototype.checkBy_ = function (checked, obj) {
        if (!obj.hasOwnProperty('field') || !obj.hasOwnProperty('values')) {
          return;
        }

        var that = this,
          rows = [];
        $.each(this.options.data, function (index, row) {
          if (!row.hasOwnProperty(obj.field)) {
            return false;
          }
          if ($.inArray(row[obj.field], obj.values) !== -1) {
            var $el = that.$selectItem.filter(':enabled')
              .filter(sprintf('[data-index="%s"]', index)).prop('checked', checked);
            row[that.header.stateField] = checked;
            rows.push(row);
            that.trigger(checked ? 'check' : 'uncheck', row, $el);
          }
        });
        this.updateSelected();
        this.trigger(checked ? 'check-some' : 'uncheck-some', rows);
      };

      BootstrapTable.prototype.destroy = function () {
        this.$el.insertBefore(this.$container);
        $(this.options.toolbar).insertBefore(this.$el);
        this.$container.next().remove();
        this.$container.remove();
        this.$el.html(this.$el_.html())
          .css('margin-top', '0')
          .attr('class', this.$el_.attr('class') || ''); // reset the class
      };

      BootstrapTable.prototype.showLoading = function () {
        this.$tableLoading.show();
      };

      BootstrapTable.prototype.hideLoading = function () {
        this.$tableLoading.hide();
      };

      BootstrapTable.prototype.togglePagination = function () {
        this.options.pagination = !this.options.pagination;
        var button = this.$toolbar.find('button[name="paginationSwitch"] i');
        if (this.options.pagination) {
          button.attr("class", this.options.iconsPrefix + " " + this.options.icons.paginationSwitchDown);
        } else {
          button.attr("class", this.options.iconsPrefix + " " + this.options.icons.paginationSwitchUp);
        }
        this.updatePagination();
      };

      BootstrapTable.prototype.refresh = function (params) {
        if (params && params.url) {
          this.options.url = params.url;
        }
        if (params && params.pageNumber) {
          this.options.pageNumber = params.pageNumber;
        }
        if (params && params.pageSize) {
          this.options.pageSize = params.pageSize;
        }
        this.initServer(params && params.silent,
          params && params.query, params && params.url);
        this.trigger('refresh', params);
      };

      BootstrapTable.prototype.resetWidth = function () {
        if (this.options.showHeader && this.options.height) {
          this.fitHeader();
        }
        if (this.options.showFooter && !that.options.cardView) {
          this.fitFooter();
        }
      };

      BootstrapTable.prototype.showColumn = function (field) {
        this.toggleColumn(this.fieldsColumnsIndex[field], true, true);
      };

      BootstrapTable.prototype.hideColumn = function (field) {
        this.toggleColumn(this.fieldsColumnsIndex[field], false, true);
      };

      BootstrapTable.prototype.getHiddenColumns = function () {
        return $.grep(this.columns, function (column) {
          return !column.visible;
        });
      };

      BootstrapTable.prototype.getVisibleColumns = function () {
        return $.grep(this.columns, function (column) {
          return column.visible;
        });
      };

      BootstrapTable.prototype.toggleAllColumns = function (visible) {
        var that = this;
        $.each(this.columns, function (i, column) {
          that.columns[i].visible = visible;
        });

        this.initHeader();
        this.initSearch();
        this.initPagination();
        this.initBody();
        if (this.options.showColumns) {
          var $items = this.$toolbar.find('.keep-open input').prop('disabled', false);

          if ($items.filter(':checked').length <= this.options.minimumCountColumns) {
            $items.filter(':checked').prop('disabled', true);
          }
        }
      };

      BootstrapTable.prototype.showAllColumns = function () {
        this.toggleAllColumns(true);
      };

      BootstrapTable.prototype.hideAllColumns = function () {
        this.toggleAllColumns(false);
      };

      BootstrapTable.prototype.filterBy = function (columns) {
        this.filterColumns = $.isEmptyObject(columns) ? {} : columns;
        this.options.pageNumber = 1;
        this.initSearch();
        this.updatePagination();
      };

      BootstrapTable.prototype.scrollTo = function (value) {
        if (typeof value === 'string') {
          value = value === 'bottom' ? this.$tableBody[0].scrollHeight : 0;
        }
        if (typeof value === 'number') {
          this.$tableBody.scrollTop(value);
        }
        if (typeof value === 'undefined') {
          return this.$tableBody.scrollTop();
        }
      };

      BootstrapTable.prototype.getScrollPosition = function () {
        return this.scrollTo();
      };

      BootstrapTable.prototype.selectPage = function (page) {
        if (page > 0 && page <= this.options.totalPages) {
          this.options.pageNumber = page;
          this.updatePagination();
        }
      };

      BootstrapTable.prototype.prevPage = function () {
        if (this.options.pageNumber > 1) {
          this.options.pageNumber--;
          this.updatePagination();
        }
      };

      BootstrapTable.prototype.nextPage = function () {
        if (this.options.pageNumber < this.options.totalPages) {
          this.options.pageNumber++;
          this.updatePagination();
        }
      };

      BootstrapTable.prototype.toggleView = function () {
        this.options.cardView = !this.options.cardView;
        this.initHeader();
        // Fixed remove toolbar when click cardView button.
        //that.initToolbar();
        this.initBody();
        this.trigger('toggle', this.options.cardView);
      };

      BootstrapTable.prototype.refreshOptions = function (options) {
        //If the objects are equivalent then avoid the call of destroy / init methods
        if (compareObjects(this.options, options, true)) {
          return;
        }
        this.options = $.extend(this.options, options);
        this.trigger('refresh-options', this.options);
        this.destroy();
        this.init();
      };

      BootstrapTable.prototype.resetSearch = function (text) {
        var $search = this.$toolbar.find('.search input');
        $search.val(text || '');
        this.onSearch({ currentTarget: $search });
      };

      BootstrapTable.prototype.expandRow_ = function (expand, index) {
        var $tr = this.$body.find(sprintf('> tr[data-index="%s"]', index));
        if ($tr.next().is('tr.detail-view') === (expand ? false : true)) {
          $tr.find('> td > .detail-icon').click();
        }
      };

      BootstrapTable.prototype.expandRow = function (index) {
        this.expandRow_(true, index);
      };

      BootstrapTable.prototype.collapseRow = function (index) {
        this.expandRow_(false, index);
      };

      BootstrapTable.prototype.expandAllRows = function (isSubTable) {
        if (isSubTable) {
          var $tr = this.$body.find(sprintf('> tr[data-index="%s"]', 0)),
            that = this,
            detailIcon = null,
            executeInterval = false,
            idInterval = -1;

          if (!$tr.next().is('tr.detail-view')) {
            $tr.find('> td > .detail-icon').click();
            executeInterval = true;
          } else if (!$tr.next().next().is('tr.detail-view')) {
            $tr.next().find(".detail-icon").click();
            executeInterval = true;
          }

          if (executeInterval) {
            try {
              idInterval = setInterval(function () {
                detailIcon = that.$body.find("tr.detail-view").last().find(".detail-icon");
                if (detailIcon.length > 0) {
                  detailIcon.click();
                } else {
                  clearInterval(idInterval);
                }
              }, 1);
            } catch (ex) {
              clearInterval(idInterval);
            }
          }
        } else {
          var trs = this.$body.children();
          for (var i = 0; i < trs.length; i++) {
            this.expandRow_(true, $(trs[i]).data("index"));
          }
        }
      };

      BootstrapTable.prototype.collapseAllRows = function (isSubTable) {
        if (isSubTable) {
          this.expandRow_(false, 0);
        } else {
          var trs = this.$body.children();
          for (var i = 0; i < trs.length; i++) {
            this.expandRow_(false, $(trs[i]).data("index"));
          }
        }
      };

      BootstrapTable.prototype.updateFormatText = function (name, text) {
        if (this.options[sprintf('format%s', name)]) {
          if (typeof text === 'string') {
            this.options[sprintf('format%s', name)] = function () {
              return text;
            };
          } else if (typeof text === 'function') {
            this.options[sprintf('format%s', name)] = text;
          }
        }
        this.initToolbar();
        this.initPagination();
        this.initBody();
      };

      // BOOTSTRAP TABLE PLUGIN DEFINITION
      // =======================

      var allowedMethods = [
        'getOptions',
        'getSelections', 'getAllSelections', 'getData',
        'load', 'append', 'prepend', 'remove', 'removeAll',
        'insertRow', 'updateRow', 'updateCell', 'updateByUniqueId', 'removeByUniqueId',
        'getRowByUniqueId', 'showRow', 'hideRow', 'getHiddenRows',
        'mergeCells', 'refreshColumnTitle',
        'checkAll', 'uncheckAll', 'checkInvert',
        'check', 'uncheck',
        'checkBy', 'uncheckBy',
        'refresh',
        'resetView',
        'resetWidth',
        'destroy',
        'showLoading', 'hideLoading',
        'showColumn', 'hideColumn', 'getHiddenColumns', 'getVisibleColumns',
        'showAllColumns', 'hideAllColumns',
        'filterBy',
        'scrollTo',
        'getScrollPosition',
        'selectPage', 'prevPage', 'nextPage',
        'togglePagination',
        'toggleView',
        'refreshOptions',
        'resetSearch',
        'expandRow', 'collapseRow', 'expandAllRows', 'collapseAllRows',
        'updateFormatText', 'updateCellById'
      ];

      $.fn.bootstrapTable = function (option) {
        var value,
          args = Array.prototype.slice.call(arguments, 1);

        this.each(function () {
          var $this = $(this),
            data = $this.data('bootstrap.table'),
            options = $.extend({}, BootstrapTable.DEFAULTS, $this.data(),
              typeof option === 'object' && option);

          if (typeof option === 'string') {
            if ($.inArray(option, allowedMethods) < 0) {
              throw new Error("Unknown method: " + option);
            }

            if (!data) {
              return;
            }

            value = data[option].apply(data, args);

            if (option === 'destroy') {
              $this.removeData('bootstrap.table');
            }
          }

          if (!data) {
            $this.data('bootstrap.table', (data = new BootstrapTable(this, options)));
          }
        });

        return typeof value === 'undefined' ? this : value;
      };

      $.fn.bootstrapTable.Constructor = BootstrapTable;
      $.fn.bootstrapTable.defaults = BootstrapTable.DEFAULTS;
      $.fn.bootstrapTable.columnDefaults = BootstrapTable.COLUMN_DEFAULTS;
      $.fn.bootstrapTable.locales = BootstrapTable.LOCALES;
      $.fn.bootstrapTable.methods = allowedMethods;
      $.fn.bootstrapTable.utils = {
        sprintf: sprintf,
        compareObjects: compareObjects,
        calculateObjectValue: calculateObjectValue,
        getItemField: getItemField,
        objectKeys: objectKeys,
        isIEBrowser: isIEBrowser
      };

      // BOOTSTRAP TABLE INIT
      // =======================

      $(function () {
        $('[data-toggle="table"]').bootstrapTable();
      });
    })(jQuery);


    /* ========================================================================
     * Bootstrap: table.zh.cn.js v3.3.5
     * http://getbootstrap.com/javascript/#affix
     * ========================================================================
     * Copyright 2011-2015 Twitter, Inc.
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
     * ======================================================================== */
    +(function ($) {
      'use strict';

      $.fn.bootstrapTable.locales['zh-CN'] = {
        formatLoadingMessage: function () {
          return '正在努力地加载数据中，请稍候……';
        },
        formatRecordsPerPage: function (pageNumber) {
          return '每页显示 ' + pageNumber + ' 条记录';
        },
        formatShowingRows: function (pageFrom, pageTo, totalRows) {
          return '显示第 ' + pageFrom + ' 到第 ' + pageTo + ' 条记录，总共 ' + totalRows + ' 条记录';
        },
        formatSearch: function () {
          return '搜索';
        },
        formatNoMatches: function () {
          return '没有找到匹配的记录';
        },
        formatPaginationSwitch: function () {
          return '隐藏/显示分页';
        },
        formatRefresh: function () {
          return '刷新';
        },
        formatToggle: function () {
          return '切换';
        },
        formatColumns: function () {
          return '列';
        },
        formatExport: function () {
          return '导出';
        },
        formatClearFilters: function () {
          return '清空过滤';
        }
      };

      $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales['zh-CN']);

    })(jQuery);



    /* ==========================================================================
    *  bootstrap-select v1.4.3
    *  http://silviomoreto.github.io/bootstrap-select/
    *
    *  Copyright 2013 bootstrap-select
    *  Licensed under the MIT license
    *  ==========================================================================*/
    +function ($) {

      'use strict';

      $.expr[':'].icontains = function (obj, index, meta) {
        return $(obj).text().toUpperCase().indexOf(meta[3].toUpperCase()) >= 0;
      };

      var Selectpicker = function (element, options, e) {
        if (e) {
          e.stopPropagation();
          e.preventDefault();
        }
        this.$element = $(element);
        this.$newElement = null;
        this.$button = null;
        this.$menu = null;
        this.$lis = null;

        //Merge defaults, options and data-attributes to make our options
        this.options = $.extend({}, $.fn.selectpicker.defaults, this.$element.data(), typeof options == 'object' && options);

        //If we have no title yet, check the attribute 'title' (this is missed by jq as its not a data-attribute
        if (this.options.title === null) {
          this.options.title = this.$element.attr('title');
        }

        //Expose public methods
        this.val = Selectpicker.prototype.val;
        this.render = Selectpicker.prototype.render;
        this.refresh = Selectpicker.prototype.refresh;
        this.setStyle = Selectpicker.prototype.setStyle;
        this.selectAll = Selectpicker.prototype.selectAll;
        this.deselectAll = Selectpicker.prototype.deselectAll;
        this.init();
      };

      Selectpicker.prototype = {
        constructor: Selectpicker,

        init: function () {
          var that = this,
            id = this.$element.attr('id');

          this.$element.hide();
          this.multiple = this.$element.prop('multiple');
          this.autofocus = this.$element.prop('autofocus');
          this.$newElement = this.createView();
          this.$element.after(this.$newElement);
          this.$menu = this.$newElement.find('> .dropdown-menu');
          this.$button = this.$newElement.find('> button');
          this.$searchbox = this.$newElement.find('input');

          if (id !== undefined) {
            this.$button.attr('data-id', id);
            $('label[for="' + id + '"]').click(function (e) {
              e.preventDefault();
              that.$button.focus();
            });
          }

          this.checkDisabled();
          this.clickListener();
          if (this.options.liveSearch) this.liveSearchListener();
          this.render();
          this.liHeight();
          this.setStyle();
          this.setWidth();
          if (this.options.container) this.selectPosition();
          this.$menu.data('this', this);
          this.$newElement.data('this', this);
        },

        createDropdown: function () {
          //If we are multiple, then add the show-tick class by default
          var multiple = this.multiple ? ' show-tick' : '';
          var autofocus = this.autofocus ? ' autofocus' : '';
          var header = this.options.header ? '<div class="popover-title"><button type="button" class="close" aria-hidden="true">&times;</button>' + this.options.header + '</div>' : '';
          var searchbox = this.options.liveSearch ? '<div class="bootstrap-select-searchbox"><input type="text" class="input-block-level form-control" /></div>' : '';
          var drop = '<div class="btn-group bootstrap-select' + multiple + '">' +
            '<button type="button" class="btn dropdown-toggle selectpicker" data-toggle="dropdown"' + autofocus + '>' +
            '<span class="filter-option pull-left"></span>&nbsp;' +
            '<span class="caret"></span>' +
            '</button>' +
            '<div class="dropdown-menu open">' +
            header +
            searchbox +
            '<ul class="dropdown-menu inner selectpicker" role="menu">' +
            '</ul>' +
            '</div>' +
            '</div>';

          return $(drop);
        },

        createView: function () {
          var $drop = this.createDropdown();
          var $li = this.createLi();
          $drop.find('ul').append($li);
          return $drop;
        },

        reloadLi: function () {
          //Remove all children.
          this.destroyLi();
          //Re build
          var $li = this.createLi();
          this.$menu.find('ul').append($li);
        },

        destroyLi: function () {
          this.$menu.find('li').remove();
        },

        createLi: function () {
          var that = this,
            _liA = [],
            _liHtml = '';

          this.$element.find('option').each(function () {
            var $this = $(this);

            //Get the class and text for the option
            var optionClass = $this.attr('class') || '';
            var inline = $this.attr('style') || '';
            var text = $this.data('content') ? $this.data('content') : $this.html();
            var subtext = $this.data('subtext') !== undefined ? '<small class="muted text-muted">' + $this.data('subtext') + '</small>' : '';
            var icon = $this.data('icon') !== undefined ? '<i class="' + that.options.iconBase + ' ' + $this.data('icon') + '"></i> ' : '';
            if (icon !== '' && ($this.is(':disabled') || $this.parent().is(':disabled'))) {
              icon = '<span>' + icon + '</span>';
            }

            if (!$this.data('content')) {
              //Prepend any icon and append any subtext to the main text.
              text = icon + '<span class="text">' + text + subtext + '</span>';
            }

            if (that.options.hideDisabled && ($this.is(':disabled') || $this.parent().is(':disabled'))) {
              _liA.push('<a style="min-height: 0; padding: 0"></a>');
            } else if ($this.parent().is('optgroup') && $this.data('divider') !== true) {
              if ($this.index() === 0) {
                //Get the opt group label
                var label = $this.parent().attr('label');
                var labelSubtext = $this.parent().data('subtext') !== undefined ? '<small class="muted text-muted">' + $this.parent().data('subtext') + '</small>' : '';
                var labelIcon = $this.parent().data('icon') ? '<i class="' + $this.parent().data('icon') + '"></i> ' : '';
                label = labelIcon + '<span class="text">' + label + labelSubtext + '</span>';

                if ($this[0].index !== 0) {
                  _liA.push(
                    '<div class="div-contain"><div class="divider"></div></div>' +
                    '<dt>' + label + '</dt>' +
                    that.createA(text, 'opt ' + optionClass, inline)
                  );
                } else {
                  _liA.push(
                    '<dt>' + label + '</dt>' +
                    that.createA(text, 'opt ' + optionClass, inline));
                }
              } else {
                _liA.push(that.createA(text, 'opt ' + optionClass, inline));
              }
            } else if ($this.data('divider') === true) {
              _liA.push('<div class="div-contain"><div class="divider"></div></div>');
            } else if ($(this).data('hidden') === true) {
              _liA.push('');
            } else {
              _liA.push(that.createA(text, optionClass, inline));
            }
          });

          $.each(_liA, function (i, item) {
            _liHtml += '<li rel=' + i + '>' + item + '</li>';
          });

          //If we are not multiple, and we dont have a selected item, and we dont have a title, select the first element so something is set in the button
          if (!this.multiple && this.$element.find('option:selected').length === 0 && !this.options.title) {
            this.$element.find('option').eq(0).prop('selected', true).attr('selected', 'selected');
          }

          return $(_liHtml);
        },

        createA: function (text, classes, inline) {
          return '<a tabindex="0" class="' + classes + '" style="' + inline + '">' +
            text +
            '<i class="' + this.options.iconBase + ' ' + this.options.tickIcon + ' icon-ok check-mark"></i>' +
            '</a>';
        },

        render: function (updateLi) {
          var that = this;

          //Update the LI to match the SELECT
          if (updateLi !== false) {
            this.$element.find('option').each(function (index) {
              that.setDisabled(index, $(this).is(':disabled') || $(this).parent().is(':disabled'));
              that.setSelected(index, $(this).is(':selected'));
            });
          }

          this.tabIndex();

          var selectedItems = this.$element.find('option:selected').map(function () {
            var $this = $(this);
            var icon = $this.data('icon') && that.options.showIcon ? '<i class="' + that.options.iconBase + ' ' + $this.data('icon') + '"></i> ' : '';
            var subtext;
            if (that.options.showSubtext && $this.attr('data-subtext') && !that.multiple) {
              subtext = ' <small class="muted text-muted">' + $this.data('subtext') + '</small>';
            } else {
              subtext = '';
            }
            if ($this.data('content') && that.options.showContent) {
              return $this.data('content');
            } else if ($this.attr('title') !== undefined) {
              return $this.attr('title');
            } else {
              return icon + $this.html() + subtext;
            }
          }).toArray();

          //Fixes issue in IE10 occurring when no default option is selected and at least one option is disabled
          //Convert all the values into a comma delimited string
          var title = !this.multiple ? selectedItems[0] : selectedItems.join(this.options.multipleSeparator);

          //If this is multi select, and the selectText type is count, the show 1 of 2 selected etc..
          if (this.multiple && this.options.selectedTextFormat.indexOf('count') > -1) {
            var max = this.options.selectedTextFormat.split('>');
            var notDisabled = this.options.hideDisabled ? ':not([disabled])' : '';
            if ((max.length > 1 && selectedItems.length > max[1]) || (max.length == 1 && selectedItems.length >= 2)) {
              title = this.options.countSelectedText.replace('{0}', selectedItems.length).replace('{1}', this.$element.find('option:not([data-divider="true"]):not([data-hidden="true"])' + notDisabled).length);
            }
          }

          //If we dont have a title, then use the default, or if nothing is set at all, use the not selected text
          if (!title) {
            title = this.options.title !== undefined ? this.options.title : this.options.noneSelectedText;
          }

          this.$button.attr('title', $.trim(title));
          this.$newElement.find('.filter-option').html(title);
        },

        setStyle: function (style, status) {
          if (this.$element.attr('class')) {
            this.$newElement.addClass(this.$element.attr('class').replace(/selectpicker|mobile-device/gi, ''));
          }

          var buttonClass = style ? style : this.options.style;

          if (status == 'add') {
            this.$button.addClass(buttonClass);
          } else if (status == 'remove') {
            this.$button.removeClass(buttonClass);
          } else {
            this.$button.removeClass(this.options.style);
            this.$button.addClass(buttonClass);
          }
        },

        liHeight: function () {
          var $selectClone = this.$menu.parent().clone().find('> .dropdown-toggle').prop('autofocus', false).end().appendTo('body'),
            $menuClone = $selectClone.addClass('open').find('> .dropdown-menu'),
            liHeight = $menuClone.find('li > a').outerHeight(),
            headerHeight = this.options.header ? $menuClone.find('.popover-title').outerHeight() : 0,
            searchHeight = this.options.liveSearch ? $menuClone.find('.bootstrap-select-searchbox').outerHeight() : 0;

          $selectClone.remove();

          this.$newElement
            .data('liHeight', liHeight)
            .data('headerHeight', headerHeight)
            .data('searchHeight', searchHeight);
        },

        setSize: function () {
          var that = this,
            menu = this.$menu,
            menuInner = menu.find('.inner'),
            selectHeight = this.$newElement.outerHeight(),
            liHeight = this.$newElement.data('liHeight'),
            headerHeight = this.$newElement.data('headerHeight'),
            searchHeight = this.$newElement.data('searchHeight'),
            divHeight = menu.find('li .divider').outerHeight(true),
            menuPadding = parseInt(menu.css('padding-top')) +
              parseInt(menu.css('padding-bottom')) +
              parseInt(menu.css('border-top-width')) +
              parseInt(menu.css('border-bottom-width')),
            notDisabled = this.options.hideDisabled ? ':not(.disabled)' : '',
            $window = $(window),
            menuExtras = menuPadding + parseInt(menu.css('margin-top')) + parseInt(menu.css('margin-bottom')) + 2,
            menuHeight,
            selectOffsetTop,
            selectOffsetBot,
            posVert = function () {
              selectOffsetTop = that.$newElement.offset().top - $window.scrollTop();
              selectOffsetBot = $window.height() - selectOffsetTop - selectHeight;
            };
          posVert();
          if (this.options.header) menu.css('padding-top', 0);

          if (this.options.size == 'auto') {
            var getSize = function () {
              var minHeight;
              posVert();
              menuHeight = selectOffsetBot - menuExtras;
              if (that.options.dropupAuto) {
                that.$newElement.toggleClass('dropup', (selectOffsetTop > selectOffsetBot) && ((menuHeight - menuExtras) < menu.height()));
              }
              if (that.$newElement.hasClass('dropup')) {
                menuHeight = selectOffsetTop - menuExtras;
              }
              if ((menu.find('li').length + menu.find('dt').length) > 3) {
                minHeight = liHeight * 3 + menuExtras - 2;
              } else {
                minHeight = 0;
              }
              menu.css({
                'max-height': menuHeight + 'px',
                'overflow': 'hidden',
                'min-height': minHeight + 'px'
              });
              menuInner.css({
                'max-height': menuHeight - headerHeight - searchHeight - menuPadding + 'px',
                'overflow-y': 'auto',
                'min-height': minHeight - menuPadding + 'px'
              });
            };
            getSize();
            $(window).resize(getSize);
            $(window).scroll(getSize);
          } else if (this.options.size && this.options.size != 'auto' && menu.find('li' + notDisabled).length > this.options.size) {
            var optIndex = menu.find('li' + notDisabled + ' > *').filter(':not(.div-contain)').slice(0, this.options.size).last().parent().index();
            var divLength = menu.find('li').slice(0, optIndex + 1).find('.div-contain').length;
            menuHeight = liHeight * this.options.size + divLength * divHeight + menuPadding;
            if (that.options.dropupAuto) {
              this.$newElement.toggleClass('dropup', (selectOffsetTop > selectOffsetBot) && (menuHeight < menu.height()));
            }
            menu.css({
              'max-height': menuHeight + headerHeight + searchHeight + 'px',
              'overflow': 'hidden'
            });
            menuInner.css({
              'max-height': menuHeight - menuPadding + 'px',
              'overflow-y': 'auto'
            });
          }
        },

        setWidth: function () {
          if (this.options.width == 'auto') {
            this.$menu.css('min-width', '0');

            // Get correct width if element hidden
            var selectClone = this.$newElement.clone().appendTo('body');
            var ulWidth = selectClone.find('> .dropdown-menu').css('width');
            selectClone.remove();

            this.$newElement.css('width', ulWidth);
          } else if (this.options.width == 'fit') {
            // Remove inline min-width so width can be changed from 'auto'
            this.$menu.css('min-width', '');
            this.$newElement.css('width', '').addClass('fit-width');
          } else if (this.options.width) {
            // Remove inline min-width so width can be changed from 'auto'
            this.$menu.css('min-width', '');
            this.$newElement.css('width', this.options.width);
          } else {
            // Remove inline min-width/width so width can be changed
            this.$menu.css('min-width', '');
            this.$newElement.css('width', '');
          }
          // Remove fit-width class if width is changed programmatically
          if (this.$newElement.hasClass('fit-width') && this.options.width !== 'fit') {
            this.$newElement.removeClass('fit-width');
          }
        },

        selectPosition: function () {
          var that = this,
            drop = '<div />',
            $drop = $(drop),
            pos,
            actualHeight,
            getPlacement = function ($element) {
              $drop.addClass($element.attr('class')).toggleClass('dropup', $element.hasClass('dropup'));
              pos = $element.offset();
              actualHeight = $element.hasClass('dropup') ? 0 : $element[0].offsetHeight;
              $drop.css({
                'top': pos.top + actualHeight,
                'left': pos.left,
                'width': $element[0].offsetWidth,
                'position': 'absolute'
              });
            };
          this.$newElement.on('click', function () {
            getPlacement($(this));
            $drop.appendTo(that.options.container);
            $drop.toggleClass('open', !$(this).hasClass('open'));
            $drop.append(that.$menu);
          });
          $(window).resize(function () {
            getPlacement(that.$newElement);
          });
          $(window).on('scroll', function () {
            getPlacement(that.$newElement);
          });
          $('html').on('click', function (e) {
            if ($(e.target).closest(that.$newElement).length < 1) {
              $drop.removeClass('open');
            }
          });
        },

        mobile: function () {
          this.$element.addClass('mobile-device').appendTo(this.$newElement);
          if (this.options.container) this.$menu.hide();
        },

        refresh: function () {
          this.$lis = null;
          this.reloadLi();
          this.render();
          this.setWidth();
          this.setStyle();
          this.checkDisabled();
          this.liHeight();
        },

        update: function () {
          this.reloadLi();
          this.setWidth();
          this.setStyle();
          this.checkDisabled();
          this.liHeight();
        },

        setSelected: function (index, selected) {
          if (this.$lis == null)
            this.$lis = this.$menu.find('li');
          $(this.$lis[index]).toggleClass('selected', selected);
        },

        setDisabled: function (index, disabled) {
          if (this.$lis == null)
            this.$lis = this.$menu.find('li');
          if (disabled) {
            $(this.$lis[index]).addClass('disabled').find('a').attr('href', '#').attr('tabindex', -1);
          } else {
            $(this.$lis[index]).removeClass('disabled').find('a').removeAttr('href').attr('tabindex', 0);
          }
        },

        isDisabled: function () {
          return this.$element.is(':disabled');
        },

        checkDisabled: function () {
          var that = this;

          if (this.isDisabled()) {
            this.$button.addClass('disabled').attr('tabindex', -1);
          } else {
            if (this.$button.hasClass('disabled')) {
              this.$button.removeClass('disabled');
            }

            if (this.$button.attr('tabindex') == -1) {
              if (!this.$element.data('tabindex')) this.$button.removeAttr('tabindex');
            }
          }

          this.$button.click(function () {
            return !that.isDisabled();
          });
        },

        tabIndex: function () {
          if (this.$element.is('[tabindex]')) {
            this.$element.data('tabindex', this.$element.attr('tabindex'));
            this.$button.attr('tabindex', this.$element.data('tabindex'));
          }
        },

        clickListener: function () {
          var that = this;

          $('body').on('touchstart.dropdown', '.dropdown-menu', function (e) {
            e.stopPropagation();
          });

          this.$newElement.on('click', function () {
            that.setSize();
            if (!that.options.liveSearch && !that.multiple) {
              setTimeout(function () {
                that.$menu.find('.selected a').focus();
              }, 10);
            }
          });

          this.$menu.on('click', 'li a', function (e) {
            var clickedIndex = $(this).parent().index(),
              prevValue = that.$element.val(),
              prevIndex = that.$element.prop('selectedIndex');

            //Dont close on multi choice menu
            if (that.multiple) {
              e.stopPropagation();
            }

            e.preventDefault();

            //Dont run if we have been disabled
            if (!that.isDisabled() && !$(this).parent().hasClass('disabled')) {
              var $options = that.$element.find('option'),
                $option = $options.eq(clickedIndex),
                state = $option.prop('selected');

              //Deselect all others if not multi select box
              if (!that.multiple) {
                $options.prop('selected', false);
                $option.prop('selected', true);
                that.$menu.find('.selected').removeClass('selected');
                that.setSelected(clickedIndex, true);
              }
              //Else toggle the one we have chosen if we are multi select.
              else {
                $option.prop('selected', !state);
                that.setSelected(clickedIndex, !state);
              }

              if (!that.multiple) {
                that.$button.focus();
              } else if (that.options.liveSearch) {
                that.$searchbox.focus();
              }

              // Trigger select 'change'
              if ((prevValue != that.$element.val() && that.multiple) || (prevIndex != that.$element.prop('selectedIndex') && !that.multiple)) {
                that.$element.change();
              }
            }
          });

          this.$menu.on('click', 'li.disabled a, li dt, li .div-contain, .popover-title, .popover-title :not(.close)', function (e) {
            if (e.target == this) {
              e.preventDefault();
              e.stopPropagation();
              if (!that.options.liveSearch) {
                that.$button.focus();
              } else {
                that.$searchbox.focus();
              }
            }
          });

          this.$menu.on('click', '.popover-title .close', function () {
            that.$button.focus();
          });

          this.$searchbox.on('click', function (e) {
            e.stopPropagation();
          });

          this.$element.change(function () {
            that.render(false);
          });
        },

        liveSearchListener: function () {
          var that = this,
            no_results = $('<li class="no-results"></li>');

          this.$newElement.on('click.dropdown.data-api', function () {
            that.$menu.find('.active').removeClass('active');
            if (!!that.$searchbox.val()) {
              that.$searchbox.val('');
              that.$menu.find('li').show();
              if (!!no_results.parent().length) no_results.remove();
            }
            if (!that.multiple) that.$menu.find('.selected').addClass('active');
            setTimeout(function () {
              that.$searchbox.focus();
            }, 10);
          });

          this.$searchbox.on('input propertychange', function () {
            if (that.$searchbox.val()) {
              that.$menu.find('li').show().not(':icontains(' + that.$searchbox.val() + ')').hide();

              if (!that.$menu.find('li').filter(':visible:not(.no-results)').length) {
                if (!!no_results.parent().length) no_results.remove();
                no_results.html(that.options.noneResultsText + ' "' + that.$searchbox.val() + '"').show();
                that.$menu.find('li').last().after(no_results);
              } else if (!!no_results.parent().length) {
                no_results.remove();
              }

            } else {
              that.$menu.find('li').show();
              if (!!no_results.parent().length) no_results.remove();
            }

            that.$menu.find('li.active').removeClass('active');
            that.$menu.find('li').filter(':visible:not(.divider)').eq(0).addClass('active').find('a').focus();
            $(this).focus();
          });

          this.$menu.on('mouseenter', 'a', function (e) {
            that.$menu.find('.active').removeClass('active');
            $(e.currentTarget).parent().not('.disabled').addClass('active');
          });

          this.$menu.on('mouseleave', 'a', function () {
            that.$menu.find('.active').removeClass('active');
          });
        },

        val: function (value) {

          if (value !== undefined) {
            this.$element.val(value);

            this.$element.change();
            return this.$element;
          } else {
            return this.$element.val();
          }
        },

        selectAll: function () {
          this.$element.find('option').prop('selected', true).attr('selected', 'selected');
          this.render();
        },

        deselectAll: function () {
          this.$element.find('option').prop('selected', false).removeAttr('selected');
          this.render();
        },

        keydown: function (e) {
          var $this,
            $items,
            $parent,
            index,
            next,
            first,
            last,
            prev,
            nextPrev,
            that,
            prevIndex,
            isActive,
            keyCodeMap = {
              32: ' ',
              48: '0',
              49: '1',
              50: '2',
              51: '3',
              52: '4',
              53: '5',
              54: '6',
              55: '7',
              56: '8',
              57: '9',
              59: ';',
              65: 'a',
              66: 'b',
              67: 'c',
              68: 'd',
              69: 'e',
              70: 'f',
              71: 'g',
              72: 'h',
              73: 'i',
              74: 'j',
              75: 'k',
              76: 'l',
              77: 'm',
              78: 'n',
              79: 'o',
              80: 'p',
              81: 'q',
              82: 'r',
              83: 's',
              84: 't',
              85: 'u',
              86: 'v',
              87: 'w',
              88: 'x',
              89: 'y',
              90: 'z',
              96: '0',
              97: '1',
              98: '2',
              99: '3',
              100: '4',
              101: '5',
              102: '6',
              103: '7',
              104: '8',
              105: '9'
            };

          $this = $(this);

          $parent = $this.parent();

          if ($this.is('input'))
            $parent = $this.parent().parent();

          that = $parent.data('this');

          if (that.options.liveSearch)
            $parent = $this.parent().parent();

          if (that.options.container)
            $parent = that.$menu;

          $items = $('[role=menu] li:not(.divider) a', $parent);

          isActive = that.$menu.parent().hasClass('open');

          if (!isActive && /([0-9]|[A-z])/.test(String.fromCharCode(e.keyCode))) {
            that.setSize();
            that.$menu.parent().addClass('open');
            isActive = that.$menu.parent().hasClass('open');
            that.$searchbox.focus();
          }

          if (that.options.liveSearch) {
            if (/(^9$|27)/.test(e.keyCode) && isActive && that.$menu.find('.active').length === 0) {
              e.preventDefault();
              that.$menu.parent().removeClass('open');
              that.$button.focus();
            }
            $items = $('[role=menu] li:not(.divider):visible', $parent);
            if (!$this.val() && !/(38|40)/.test(e.keyCode)) {
              if ($items.filter('.active').length === 0) {
                $items = that.$newElement.find('li').filter(':icontains(' + keyCodeMap[e.keyCode] + ')');
              }
            }
          }

          if (!$items.length) return;

          if (/(38|40)/.test(e.keyCode)) {

            index = $items.index($items.filter(':focus'));
            first = $items.parent(':not(.disabled):visible').first().index();
            last = $items.parent(':not(.disabled):visible').last().index();
            next = $items.eq(index).parent().nextAll(':not(.disabled):visible').eq(0).index();
            prev = $items.eq(index).parent().prevAll(':not(.disabled):visible').eq(0).index();
            nextPrev = $items.eq(next).parent().prevAll(':not(.disabled):visible').eq(0).index();

            if (that.options.liveSearch) {
              $items.each(function (i) {
                if ($(this).is(':not(.disabled)')) {
                  $(this).data('index', i);
                }
              });
              index = $items.index($items.filter('.active'));
              first = $items.filter(':not(.disabled):visible').first().data('index');
              last = $items.filter(':not(.disabled):visible').last().data('index');
              next = $items.eq(index).nextAll(':not(.disabled):visible').eq(0).data('index');
              prev = $items.eq(index).prevAll(':not(.disabled):visible').eq(0).data('index');
              nextPrev = $items.eq(next).prevAll(':not(.disabled):visible').eq(0).data('index');
            }

            prevIndex = $this.data('prevIndex');

            if (e.keyCode == 38) {
              if (that.options.liveSearch)
                index -= 1;
              if (index != nextPrev && index > prev)
                index = prev;
              if (index < first)
                index = first;
              if (index == prevIndex)
                index = last;
            }

            if (e.keyCode == 40) {
              if (that.options.liveSearch)
                index += 1;
              if (index == -1)
                index = 0;
              if (index != nextPrev && index < next)
                index = next;
              if (index > last)
                index = last;
              if (index == prevIndex)
                index = first;
            }

            $this.data('prevIndex', index);

            if (!that.options.liveSearch) {
              $items.eq(index).focus();
            } else {
              e.preventDefault();
              if (!$this.is('.dropdown-toggle')) {
                $items.removeClass('active');
                $items.eq(index).addClass('active').find('a').focus();
                $this.focus();
              }
            }

          } else if (!$this.is('input')) {

            var keyIndex = [],
              count,
              prevKey;

            $items.each(function () {
              if ($(this).parent().is(':not(.disabled)')) {
                if ($.trim($(this).text().toLowerCase()).substring(0, 1) == keyCodeMap[e.keyCode]) {
                  keyIndex.push($(this).parent().index());
                }
              }
            });

            count = $(document).data('keycount');
            count++;
            $(document).data('keycount', count);

            prevKey = $.trim($(':focus').text().toLowerCase()).substring(0, 1);

            if (prevKey != keyCodeMap[e.keyCode]) {
              count = 1;
              $(document).data('keycount', count);
            } else if (count >= keyIndex.length) {
              $(document).data('keycount', 0);
              if (count > keyIndex.length)
                count = 1;
            }

            $items.eq(keyIndex[count - 1]).focus();
          }

          // Select focused option if "Enter", "Spacebar", "Tab" are pressed inside the menu.
          if (/(13|32|^9$)/.test(e.keyCode) && isActive) {
            if (!/(32)/.test(e.keyCode)) e.preventDefault();
            if (!that.options.liveSearch) {
              $(':focus').click();
            } else if (!/(32)/.test(e.keyCode)) {
              that.$menu.find('.active a').click();
              $this.focus();
            }
            $(document).data('keycount', 0);
          }

          if ((/(^9$|27)/.test(e.keyCode) && isActive && (that.multiple || that.options.liveSearch)) || (/(27)/.test(e.keyCode) && !isActive)) {
            that.$menu.parent().removeClass('open');
            that.$button.focus();
          }

        },

        hide: function () {
          this.$newElement.hide();
        },

        show: function () {
          this.$newElement.show();
        },

        destroy: function () {
          this.$newElement.remove();
          this.$element.remove();
        }
      };

      $.fn.selectpicker = function (option, event) {
        //get the args of the outer function..
        var args = arguments;
        var value;
        var chain = this.each(function () {
          if ($(this).is('select')) {
            var $this = $(this),
              data = $this.data('selectpicker'),
              options = typeof option == 'object' && option;

            if (!data) {
              $this.data('selectpicker', (data = new Selectpicker(this, options, event)));
            } else if (options) {
              for (var i in options) {
                data.options[i] = options[i];
              }
            }

            if (typeof option == 'string') {
              //Copy the value of option, as once we shift the arguments
              //it also shifts the value of option.
              var property = option;
              if (data[property] instanceof Function) {
                [].shift.apply(args);
                value = data[property].apply(data, args);
              } else {
                value = data.options[property];
              }
            }
          }
        });

        if (value !== undefined) {
          return value;
        } else {
          return chain;
        }
      };

      $.fn.selectpicker.defaults = {
        style: 'btn-default',
        size: 'auto',
        title: null,
        selectedTextFormat: 'values',
        noneSelectedText: '请选择',
        noneResultsText: 'No results match',
        countSelectedText: '{0} of {1} selected',
        width: false,
        container: false,
        hideDisabled: false,
        showSubtext: false,
        showIcon: true,
        showContent: true,
        dropupAuto: true,
        header: false,
        liveSearch: false,
        multipleSeparator: ', ',
        iconBase: 'glyphicon',
        tickIcon: 'glyphicon-ok'
      };

      $(document)
        .data('keycount', 0)
        .on('keydown', '.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role=menu], .bootstrap-select-searchbox input', Selectpicker.prototype.keydown)
        .on('focusin.modal', '.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role=menu], .bootstrap-select-searchbox input', function (e) {
          e.stopPropagation();
        });

    }(jQuery);


    /* =========================================================
     * bootstrap-datetimepicker.js
     * =========================================================
     * Copyright 2012 Stefan Petre
     *
     * Improvements by Andrew Rowls
     * Improvements by Sébastien Malot
     * Improvements by Yun Lai
     * Improvements by Kenneth Henderick
     * Improvements by CuGBabyBeaR
     * Improvements by Christian Vaas <auspex@auspex.eu>
     *
     * Project URL : http://www.malot.fr/bootstrap-datetimepicker
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     * ========================================================= */

    +(function ($, undefined) {

      // Add ECMA262-5 Array methods if not supported natively (IE8)
      if (!('indexOf' in Array.prototype)) {
        Array.prototype.indexOf = function (find, i) {
          if (i === undefined) i = 0;
          if (i < 0) i += this.length;
          if (i < 0) i = 0;
          for (var n = this.length; i < n; i++) {
            if (i in this && this[i] === find) {
              return i;
            }
          }
          return -1;
        }
      }

      // Add timezone abbreviation support for ie6+, Chrome, Firefox
      function timeZoneAbbreviation() {
        var abbreviation, date, formattedStr, i, len, matchedStrings, ref, str;
        date = (new Date()).toString();
        formattedStr = ((ref = date.split('(')[1]) != null ? ref.slice(0, -1) : 0) || date.split(' ');
        if (formattedStr instanceof Array) {
          matchedStrings = [];
          for (var i = 0, len = formattedStr.length; i < len; i++) {
            str = formattedStr[i];
            if ((abbreviation = (ref = str.match(/\b[A-Z]+\b/)) !== null) ? ref[0] : 0) {
              matchedStrings.push(abbreviation);
            }
          }
          formattedStr = matchedStrings.pop();
        }
        return formattedStr;
      }

      function UTCDate() {
        return new Date(Date.UTC.apply(Date, arguments));
      }

      // Picker object
      var Datetimepicker = function (element, options) {
        var that = this;

        this.element = $(element);

        // add container for single page application
        // when page switch the datetimepicker div will be removed also.
        this.container = options.container || 'body';

        this.language = options.language || this.element.data('date-language') || 'en';
        this.language = this.language in dates ? this.language : this.language.split('-')[0]; // fr-CA fallback to fr
        this.language = this.language in dates ? this.language : 'en';
        this.isRTL = dates[this.language].rtl || false;
        this.formatType = options.formatType || this.element.data('format-type') || 'standard';
        this.format = DPGlobal.parseFormat(options.format || this.element.data('date-format') || dates[this.language].format || DPGlobal.getDefaultFormat(this.formatType, 'input'), this.formatType);
        this.isInline = false;
        this.isVisible = false;
        this.isInput = this.element.is('input');
        this.fontAwesome = options.fontAwesome || this.element.data('font-awesome') || false;

        this.bootcssVer = options.bootcssVer || (this.isInput ? (this.element.is('.form-control') ? 3 : 2) : (this.bootcssVer = this.element.is('.input-group') ? 3 : 2));

        this.component = this.element.is('.date') ? (this.bootcssVer === 3 ? this.element.find('.input-group-addon .glyphicon-th, .input-group-addon .glyphicon-time, .input-group-addon .glyphicon-remove, .input-group-addon .glyphicon-calendar, .input-group-addon .fa-calendar, .input-group-addon .fa-clock-o').parent() : this.element.find('.add-on .icon-th, .add-on .icon-time, .add-on .icon-calendar, .add-on .fa-calendar, .add-on .fa-clock-o').parent()) : false;
        this.componentReset = this.element.is('.date') ? (this.bootcssVer === 3 ? this.element.find('.input-group-addon .glyphicon-remove, .input-group-addon .fa-times').parent() : this.element.find('.add-on .icon-remove, .add-on .fa-times').parent()) : false;
        this.hasInput = this.component && this.element.find('input').length;
        if (this.component && this.component.length === 0) {
          this.component = false;
        }
        this.linkField = options.linkField || this.element.data('link-field') || false;
        this.linkFormat = DPGlobal.parseFormat(options.linkFormat || this.element.data('link-format') || DPGlobal.getDefaultFormat(this.formatType, 'link'), this.formatType);
        this.minuteStep = options.minuteStep || this.element.data('minute-step') || 5;
        this.pickerPosition = options.pickerPosition || this.element.data('picker-position') || 'bottom-right';
        this.showMeridian = options.showMeridian || this.element.data('show-meridian') || false;
        this.initialDate = options.initialDate || new Date();
        this.zIndex = options.zIndex || this.element.data('z-index') || undefined;
        this.title = typeof options.title === 'undefined' ? false : options.title;
        this.timezone = options.timezone || timeZoneAbbreviation();

        this.icons = {
          leftArrow: this.fontAwesome ? 'fa-arrow-left' : (this.bootcssVer === 3 ? 'glyphicon-arrow-left' : 'icon-arrow-left'),
          rightArrow: this.fontAwesome ? 'fa-arrow-right' : (this.bootcssVer === 3 ? 'glyphicon-arrow-right' : 'icon-arrow-right')
        }
        this.icontype = this.fontAwesome ? 'fa' : 'glyphicon';

        this._attachEvents();

        this.clickedOutside = function (e) {
          // Clicked outside the datetimepicker, hide it
          if ($(e.target).closest('.datetimepicker').length === 0) {
            that.hide();
          }
        }

        this.formatViewType = 'datetime';
        if ('formatViewType' in options) {
          this.formatViewType = options.formatViewType;
        } else if ('formatViewType' in this.element.data()) {
          this.formatViewType = this.element.data('formatViewType');
        }

        this.minView = 0;
        if ('minView' in options) {
          this.minView = options.minView;
        } else if ('minView' in this.element.data()) {
          this.minView = this.element.data('min-view');
        }
        this.minView = DPGlobal.convertViewMode(this.minView);

        this.maxView = DPGlobal.modes.length - 1;
        if ('maxView' in options) {
          this.maxView = options.maxView;
        } else if ('maxView' in this.element.data()) {
          this.maxView = this.element.data('max-view');
        }
        this.maxView = DPGlobal.convertViewMode(this.maxView);

        this.wheelViewModeNavigation = false;
        if ('wheelViewModeNavigation' in options) {
          this.wheelViewModeNavigation = options.wheelViewModeNavigation;
        } else if ('wheelViewModeNavigation' in this.element.data()) {
          this.wheelViewModeNavigation = this.element.data('view-mode-wheel-navigation');
        }

        this.wheelViewModeNavigationInverseDirection = false;

        if ('wheelViewModeNavigationInverseDirection' in options) {
          this.wheelViewModeNavigationInverseDirection = options.wheelViewModeNavigationInverseDirection;
        } else if ('wheelViewModeNavigationInverseDirection' in this.element.data()) {
          this.wheelViewModeNavigationInverseDirection = this.element.data('view-mode-wheel-navigation-inverse-dir');
        }

        this.wheelViewModeNavigationDelay = 100;
        if ('wheelViewModeNavigationDelay' in options) {
          this.wheelViewModeNavigationDelay = options.wheelViewModeNavigationDelay;
        } else if ('wheelViewModeNavigationDelay' in this.element.data()) {
          this.wheelViewModeNavigationDelay = this.element.data('view-mode-wheel-navigation-delay');
        }

        this.startViewMode = 2;
        if ('startView' in options) {
          this.startViewMode = options.startView;
        } else if ('startView' in this.element.data()) {
          this.startViewMode = this.element.data('start-view');
        }
        this.startViewMode = DPGlobal.convertViewMode(this.startViewMode);
        this.viewMode = this.startViewMode;

        this.viewSelect = this.minView;
        if ('viewSelect' in options) {
          this.viewSelect = options.viewSelect;
        } else if ('viewSelect' in this.element.data()) {
          this.viewSelect = this.element.data('view-select');
        }
        this.viewSelect = DPGlobal.convertViewMode(this.viewSelect);

        this.forceParse = true;
        if ('forceParse' in options) {
          this.forceParse = options.forceParse;
        } else if ('dateForceParse' in this.element.data()) {
          this.forceParse = this.element.data('date-force-parse');
        }
        var template = this.bootcssVer === 3 ? DPGlobal.templateV3 : DPGlobal.template;
        while (template.indexOf('{iconType}') !== -1) {
          template = template.replace('{iconType}', this.icontype);
        }
        while (template.indexOf('{leftArrow}') !== -1) {
          template = template.replace('{leftArrow}', this.icons.leftArrow);
        }
        while (template.indexOf('{rightArrow}') !== -1) {
          template = template.replace('{rightArrow}', this.icons.rightArrow);
        }
        this.picker = $(template)
          .appendTo(this.isInline ? this.element : this.container) // 'body')
          .on({
            click: $.proxy(this.click, this),
            mousedown: $.proxy(this.mousedown, this)
          });

        if (this.wheelViewModeNavigation) {
          if ($.fn.mousewheel) {
            this.picker.on({ mousewheel: $.proxy(this.mousewheel, this) });
          } else {
            console.log('Mouse Wheel event is not supported. Please include the jQuery Mouse Wheel plugin before enabling this option');
          }
        }

        if (this.isInline) {
          this.picker.addClass('datetimepicker-inline');
        } else {
          this.picker.addClass('datetimepicker-dropdown-' + this.pickerPosition + ' dropdown-menu');
        }
        if (this.isRTL) {
          this.picker.addClass('datetimepicker-rtl');
          var selector = this.bootcssVer === 3 ? '.prev span, .next span' : '.prev i, .next i';
          this.picker.find(selector).toggleClass(this.icons.leftArrow + ' ' + this.icons.rightArrow);
        }

        $(document).on('mousedown touchend', this.clickedOutside);

        this.autoclose = false;
        if ('autoclose' in options) {
          this.autoclose = options.autoclose;
        } else if ('dateAutoclose' in this.element.data()) {
          this.autoclose = this.element.data('date-autoclose');
        }

        this.keyboardNavigation = true;
        if ('keyboardNavigation' in options) {
          this.keyboardNavigation = options.keyboardNavigation;
        } else if ('dateKeyboardNavigation' in this.element.data()) {
          this.keyboardNavigation = this.element.data('date-keyboard-navigation');
        }

        this.todayBtn = (options.todayBtn || this.element.data('date-today-btn') || false);
        this.clearBtn = (options.clearBtn || this.element.data('date-clear-btn') || false);
        this.todayHighlight = (options.todayHighlight || this.element.data('date-today-highlight') || false);

        this.weekStart = 0;
        if (typeof options.weekStart !== 'undefined') {
          this.weekStart = options.weekStart;
        } else if (typeof this.element.data('date-weekstart') !== 'undefined') {
          this.weekStart = this.element.data('date-weekstart');
        } else if (typeof dates[this.language].weekStart !== 'undefined') {
          this.weekStart = dates[this.language].weekStart;
        }
        this.weekStart = this.weekStart % 7;
        this.weekEnd = ((this.weekStart + 6) % 7);
        this.onRenderDay = function (date) {
          var render = (options.onRenderDay || function () { return []; })(date);
          if (typeof render === 'string') {
            render = [render];
          }
          var res = ['day'];
          return res.concat((render ? render : []));
        };
        this.onRenderHour = function (date) {
          var render = (options.onRenderHour || function () { return []; })(date);
          var res = ['hour'];
          if (typeof render === 'string') {
            render = [render];
          }
          return res.concat((render ? render : []));
        };
        this.onRenderMinute = function (date) {
          var render = (options.onRenderMinute || function () { return []; })(date);
          var res = ['minute'];
          if (typeof render === 'string') {
            render = [render];
          }
          if (date < this.startDate || date > this.endDate) {
            res.push('disabled');
          } else if (Math.floor(this.date.getUTCMinutes() / this.minuteStep) === Math.floor(date.getUTCMinutes() / this.minuteStep)) {
            res.push('active');
          }
          return res.concat((render ? render : []));
        };
        this.onRenderYear = function (date) {
          var render = (options.onRenderYear || function () { return []; })(date);
          var res = ['year'];
          if (typeof render === 'string') {
            render = [render];
          }
          if (this.date.getUTCFullYear() === date.getUTCFullYear()) {
            res.push('active');
          }
          var currentYear = date.getUTCFullYear();
          var endYear = this.endDate.getUTCFullYear();
          if (date < this.startDate || currentYear > endYear) {
            res.push('disabled');
          }
          return res.concat((render ? render : []));
        }
        this.onRenderMonth = function (date) {
          var render = (options.onRenderMonth || function () { return []; })(date);
          var res = ['month'];
          if (typeof render === 'string') {
            render = [render];
          }
          return res.concat((render ? render : []));
        }
        this.startDate = new Date(-8639968443048000);
        this.endDate = new Date(8639968443048000);
        this.datesDisabled = [];
        this.daysOfWeekDisabled = [];
        this.setStartDate(options.startDate || this.element.data('date-startdate'));
        this.setEndDate(options.endDate || this.element.data('date-enddate'));
        this.setDatesDisabled(options.datesDisabled || this.element.data('date-dates-disabled'));
        this.setDaysOfWeekDisabled(options.daysOfWeekDisabled || this.element.data('date-days-of-week-disabled'));
        this.setMinutesDisabled(options.minutesDisabled || this.element.data('date-minute-disabled'));
        this.setHoursDisabled(options.hoursDisabled || this.element.data('date-hour-disabled'));
        this.fillDow();
        this.fillMonths();
        this.update();
        this.showMode();

        if (this.isInline) {
          this.show();
        }
      };

      Datetimepicker.prototype = {
        constructor: Datetimepicker,

        _events: [],
        _attachEvents: function () {
          this._detachEvents();
          if (this.isInput) { // single input
            this._events = [
              [this.element, {
                focus: $.proxy(this.show, this),
                keyup: $.proxy(this.update, this),
                keydown: $.proxy(this.keydown, this)
              }]
            ];
          }
          else if (this.component && this.hasInput) { // component: input + button
            this._events = [
              // For components that are not readonly, allow keyboard nav
              [this.element.find('input'), {
                focus: $.proxy(this.show, this),
                keyup: $.proxy(this.update, this),
                keydown: $.proxy(this.keydown, this)
              }],
              [this.component, {
                click: $.proxy(this.show, this)
              }]
            ];
            if (this.componentReset) {
              this._events.push([
                this.componentReset,
                { click: $.proxy(this.reset, this) }
              ]);
            }
          }
          else if (this.element.is('div')) {  // inline datetimepicker
            this.isInline = true;
          }
          else {
            this._events = [
              [this.element, {
                click: $.proxy(this.show, this)
              }]
            ];
          }
          for (var i = 0, el, ev; i < this._events.length; i++) {
            el = this._events[i][0];
            ev = this._events[i][1];
            el.on(ev);
          }
        },

        _detachEvents: function () {
          for (var i = 0, el, ev; i < this._events.length; i++) {
            el = this._events[i][0];
            ev = this._events[i][1];
            el.off(ev);
          }
          this._events = [];
        },

        show: function (e) {
          this.picker.show();
          this.height = this.component ? this.component.outerHeight() : this.element.outerHeight();
          if (this.forceParse) {
            this.update();
          }
          this.place();
          $(window).on('resize', $.proxy(this.place, this));
          if (e) {
            e.stopPropagation();
            e.preventDefault();
          }
          this.isVisible = true;
          this.element.trigger({
            type: 'show',
            date: this.date
          });
        },

        hide: function () {
          if (!this.isVisible) return;
          if (this.isInline) return;
          this.picker.hide();
          $(window).off('resize', this.place);
          this.viewMode = this.startViewMode;
          this.showMode();
          if (!this.isInput) {
            $(document).off('mousedown', this.hide);
          }

          if (
            this.forceParse &&
            (
              this.isInput && this.element.val() ||
              this.hasInput && this.element.find('input').val()
            )
          )
            this.setValue();
          this.isVisible = false;
          /* this.element.trigger({
             type: 'hide',
             date: this.date
           });*/
        },

        remove: function () {
          this._detachEvents();
          $(document).off('mousedown', this.clickedOutside);
          this.picker.remove();
          delete this.picker;
          delete this.element.data().datetimepicker;
        },

        getDate: function () {
          var d = this.getUTCDate();
          if (!d || d === null) {
            return null;
          }
          return new Date(d.getTime() + (d.getTimezoneOffset() * 60000));
        },

        getUTCDate: function () {
          return this.date ? this.date : new Date();
        },

        getInitialDate: function () {
          return this.initialDate
        },

        setInitialDate: function (initialDate) {
          this.initialDate = initialDate;
        },

        setDate: function (d) {
          this.setUTCDate(new Date(d.getTime() - (d.getTimezoneOffset() * 60000)));
        },

        setUTCDate: function (d) {
          if (d >= this.startDate && d <= this.endDate) {
            this.date = d;
            this.setValue();
            this.viewDate = this.date;
            this.fill();
          } else {
            this.element.trigger({
              type: 'outOfRange',
              date: d,
              startDate: this.startDate,
              endDate: this.endDate
            });
          }
        },

        setFormat: function (format) {
          this.format = DPGlobal.parseFormat(format, this.formatType);
          var element;
          if (this.isInput) {
            element = this.element;
          } else if (this.component) {
            element = this.element.find('input');
          }
          if (element && element.val()) {
            this.setValue();
          }
        },

        setValue: function () {
          var formatted = this.getFormattedDate();
          if (!this.isInput) {
            if (this.component) {
              this.element.find('input').val(formatted);
            }
            this.element.data('date', formatted);
          } else {
            this.element.val(formatted);
          }
          if (this.linkField) {
            $('#' + this.linkField).val(this.getFormattedDate(this.linkFormat));
          }
        },

        getFormattedDate: function (format) {
          format = format || this.format;
          return DPGlobal.formatDate(this.date, format, this.language, this.formatType, this.timezone);
        },

        setStartDate: function (startDate) {
          this.startDate = startDate || this.startDate;
          if (this.startDate.valueOf() !== 8639968443048000) {
            this.startDate = DPGlobal.parseDate(this.startDate, this.format, this.language, this.formatType, this.timezone);
          }
          this.update();
          this.updateNavArrows();
        },

        setEndDate: function (endDate) {
          this.endDate = endDate || this.endDate;
          if (this.endDate.valueOf() !== 8639968443048000) {
            this.endDate = DPGlobal.parseDate(this.endDate, this.format, this.language, this.formatType, this.timezone);
          }
          this.update();
          this.updateNavArrows();
        },

        setDatesDisabled: function (datesDisabled) {
          this.datesDisabled = datesDisabled || [];
          if (!$.isArray(this.datesDisabled)) {
            this.datesDisabled = this.datesDisabled.split(/,\s*/);
          }
          var mThis = this;
          this.datesDisabled = $.map(this.datesDisabled, function (d) {
            return DPGlobal.parseDate(d, mThis.format, mThis.language, mThis.formatType, mThis.timezone).toDateString();
          });
          this.update();
          this.updateNavArrows();
        },

        setTitle: function (selector, value) {
          return this.picker.find(selector)
            .find('th:eq(1)')
            .text(this.title === false ? value : this.title);
        },

        setDaysOfWeekDisabled: function (daysOfWeekDisabled) {
          this.daysOfWeekDisabled = daysOfWeekDisabled || [];
          if (!$.isArray(this.daysOfWeekDisabled)) {
            this.daysOfWeekDisabled = this.daysOfWeekDisabled.split(/,\s*/);
          }
          this.daysOfWeekDisabled = $.map(this.daysOfWeekDisabled, function (d) {
            return parseInt(d, 10);
          });
          this.update();
          this.updateNavArrows();
        },

        setMinutesDisabled: function (minutesDisabled) {
          this.minutesDisabled = minutesDisabled || [];
          if (!$.isArray(this.minutesDisabled)) {
            this.minutesDisabled = this.minutesDisabled.split(/,\s*/);
          }
          this.minutesDisabled = $.map(this.minutesDisabled, function (d) {
            return parseInt(d, 10);
          });
          this.update();
          this.updateNavArrows();
        },

        setHoursDisabled: function (hoursDisabled) {
          this.hoursDisabled = hoursDisabled || [];
          if (!$.isArray(this.hoursDisabled)) {
            this.hoursDisabled = this.hoursDisabled.split(/,\s*/);
          }
          this.hoursDisabled = $.map(this.hoursDisabled, function (d) {
            return parseInt(d, 10);
          });
          this.update();
          this.updateNavArrows();
        },

        place: function () {
          if (this.isInline) return;

          if (!this.zIndex) {
            var index_highest = 0;
            $('div').each(function () {
              var index_current = parseInt($(this).css('zIndex'), 10);
              if (index_current > index_highest) {
                index_highest = index_current;
              }
            });
            this.zIndex = index_highest + 10;
          }

          var offset, top, left, containerOffset;
          if (this.container instanceof $) {
            containerOffset = this.container.offset();
          } else {
            containerOffset = $(this.container).offset();
          }

          if (this.component) {
            offset = this.component.offset();
            left = offset.left;
            if (this.pickerPosition === 'bottom-left' || this.pickerPosition === 'top-left') {
              left += this.component.outerWidth() - this.picker.outerWidth();
            }
          } else {
            offset = this.element.offset();
            left = offset.left;
            if (this.pickerPosition === 'bottom-left' || this.pickerPosition === 'top-left') {
              left += this.element.outerWidth() - this.picker.outerWidth();
            }
          }

          var bodyWidth = document.body.clientWidth || window.innerWidth;
          if (left + 220 > bodyWidth) {
            left = bodyWidth - 220;
          }

          if (this.pickerPosition === 'top-left' || this.pickerPosition === 'top-right') {
            top = offset.top - this.picker.outerHeight();
          } else {
            top = offset.top + this.height;
          }

          top = top - containerOffset.top;
          left = left - containerOffset.left;

          this.picker.css({
            top: top,
            left: left,
            zIndex: this.zIndex
          });
        },

        hour_minute: "^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]",

        update: function () {
          var date, fromArgs = false;
          if (arguments && arguments.length && (typeof arguments[0] === 'string' || arguments[0] instanceof Date)) {
            date = arguments[0];
            fromArgs = true;
          } else {
            date = (this.isInput ? this.element.val() : this.element.find('input').val()) || this.element.data('date') || this.initialDate;
            if (typeof date === 'string') {
              date = date.replace(/^\s+|\s+$/g, '');
            }
          }

          if (!date) {
            date = new Date();
            fromArgs = false;
          }

          if (typeof date === "string") {
            if (new RegExp(this.hour_minute).test(date) || new RegExp(this.hour_minute + ":[0-5][0-9]").test(date)) {
              date = this.getDate()
            }
          }

          this.date = DPGlobal.parseDate(date, this.format, this.language, this.formatType, this.timezone);

          if (fromArgs) this.setValue();

          if (this.date < this.startDate) {
            this.viewDate = new Date(this.startDate);
          } else if (this.date > this.endDate) {
            this.viewDate = new Date(this.endDate);
          } else {
            this.viewDate = new Date(this.date);
          }
          this.fill();
        },

        fillDow: function () {
          var dowCnt = this.weekStart,
            html = '<tr>';
          while (dowCnt < this.weekStart + 7) {
            html += '<th class="dow">' + dates[this.language].daysMin[(dowCnt++) % 7] + '</th>';
          }
          html += '</tr>';
          this.picker.find('.datetimepicker-days thead').append(html);
        },

        fillMonths: function () {
          var html = '';
          var d = new Date(this.viewDate);
          for (var i = 0; i < 12; i++) {
            d.setUTCMonth(i);
            var classes = this.onRenderMonth(d);
            html += '<span class="' + classes.join(' ') + '">' + dates[this.language].monthsShort[i] + '</span>';
          }
          this.picker.find('.datetimepicker-months td').html(html);
        },

        fill: function () {
          if (!this.date || !this.viewDate) {
            return;
          }
          var d = new Date(this.viewDate),
            year = d.getUTCFullYear(),
            month = d.getUTCMonth(),
            dayMonth = d.getUTCDate(),
            hours = d.getUTCHours(),
            startYear = this.startDate.getUTCFullYear(),
            startMonth = this.startDate.getUTCMonth(),
            endYear = this.endDate.getUTCFullYear(),
            endMonth = this.endDate.getUTCMonth() + 1,
            currentDate = (new UTCDate(this.date.getUTCFullYear(), this.date.getUTCMonth(), this.date.getUTCDate())).valueOf(),
            today = new Date();
          this.setTitle('.datetimepicker-days', dates[this.language].months[month] + ' ' + year)
          if (this.formatViewType === 'time') {
            var formatted = this.getFormattedDate();
            this.setTitle('.datetimepicker-hours', formatted);
            this.setTitle('.datetimepicker-minutes', formatted);
          } else {
            this.setTitle('.datetimepicker-hours', dayMonth + ' ' + dates[this.language].months[month] + ' ' + year);
            this.setTitle('.datetimepicker-minutes', dayMonth + ' ' + dates[this.language].months[month] + ' ' + year);
          }
          this.picker.find('tfoot th.today')
            .text(dates[this.language].today || dates['en'].today)
            .toggle(this.todayBtn !== false);
          this.picker.find('tfoot th.clear')
            .text(dates[this.language].clear || dates['en'].clear)
            .toggle(this.clearBtn !== false);
          this.updateNavArrows();
          this.fillMonths();
          var prevMonth = UTCDate(year, month - 1, 28, 0, 0, 0, 0),
            day = DPGlobal.getDaysInMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
          prevMonth.setUTCDate(day);
          prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.weekStart + 7) % 7);
          var nextMonth = new Date(prevMonth);
          nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
          nextMonth = nextMonth.valueOf();
          var html = [];
          var classes;
          while (prevMonth.valueOf() < nextMonth) {
            if (prevMonth.getUTCDay() === this.weekStart) {
              html.push('<tr>');
            }
            classes = this.onRenderDay(prevMonth);
            if (prevMonth.getUTCFullYear() < year || (prevMonth.getUTCFullYear() === year && prevMonth.getUTCMonth() < month)) {
              classes.push('old');
            } else if (prevMonth.getUTCFullYear() > year || (prevMonth.getUTCFullYear() === year && prevMonth.getUTCMonth() > month)) {
              classes.push('new');
            }
            // Compare internal UTC date with local today, not UTC today
            if (this.todayHighlight &&
              prevMonth.getUTCFullYear() === today.getFullYear() &&
              prevMonth.getUTCMonth() === today.getMonth() &&
              prevMonth.getUTCDate() === today.getDate()) {
              classes.push('today');
            }
            if (prevMonth.valueOf() === currentDate) {
              classes.push('active');
            }
            if ((prevMonth.valueOf() + 86400000) <= this.startDate || prevMonth.valueOf() > this.endDate ||
              $.inArray(prevMonth.getUTCDay(), this.daysOfWeekDisabled) !== -1 ||
              $.inArray(prevMonth.toDateString(), this.datesDisabled) !== -1) {
              classes.push('disabled');
            }
            html.push('<td class="' + classes.join(' ') + '">' + prevMonth.getUTCDate() + '</td>');
            if (prevMonth.getUTCDay() === this.weekEnd) {
              html.push('</tr>');
            }
            prevMonth.setUTCDate(prevMonth.getUTCDate() + 1);
          }
          this.picker.find('.datetimepicker-days tbody').empty().append(html.join(''));

          html = [];
          var txt = '', meridian = '', meridianOld = '';
          var hoursDisabled = this.hoursDisabled || [];
          d = new Date(this.viewDate)
          for (var i = 0; i < 24; i++) {
            d.setUTCHours(i);
            classes = this.onRenderHour(d);
            if (hoursDisabled.indexOf(i) !== -1) {
              classes.push('disabled');
            }
            var actual = UTCDate(year, month, dayMonth, i);
            // We want the previous hour for the startDate
            if ((actual.valueOf() + 3600000) <= this.startDate || actual.valueOf() > this.endDate) {
              classes.push('disabled');
            } else if (hours === i) {
              classes.push('active');
            }
            if (this.showMeridian && dates[this.language].meridiem.length === 2) {
              meridian = (i < 12 ? dates[this.language].meridiem[0] : dates[this.language].meridiem[1]);
              if (meridian !== meridianOld) {
                if (meridianOld !== '') {
                  html.push('</fieldset>');
                }
                html.push('<fieldset class="hour"><legend>' + meridian.toUpperCase() + '</legend>');
              }
              meridianOld = meridian;
              txt = (i % 12 ? i % 12 : 12);
              if (i < 12) {
                classes.push('hour_am');
              } else {
                classes.push('hour_pm');
              }
              html.push('<span class="' + classes.join(' ') + '">' + txt + '</span>');
              if (i === 23) {
                html.push('</fieldset>');
              }
            } else {
              txt = i + ':00';
              html.push('<span class="' + classes.join(' ') + '">' + txt + '</span>');
            }
          }
          this.picker.find('.datetimepicker-hours td').html(html.join(''));

          html = [];
          txt = '';
          meridian = '';
          meridianOld = '';
          var minutesDisabled = this.minutesDisabled || [];
          d = new Date(this.viewDate);
          for (var i = 0; i < 60; i += this.minuteStep) {
            if (minutesDisabled.indexOf(i) !== -1) continue;
            d.setUTCMinutes(i);
            d.setUTCSeconds(0);
            classes = this.onRenderMinute(d);
            if (this.showMeridian && dates[this.language].meridiem.length === 2) {
              meridian = (hours < 12 ? dates[this.language].meridiem[0] : dates[this.language].meridiem[1]);
              if (meridian !== meridianOld) {
                if (meridianOld !== '') {
                  html.push('</fieldset>');
                }
                html.push('<fieldset class="minute"><legend>' + meridian.toUpperCase() + '</legend>');
              }
              meridianOld = meridian;
              txt = (hours % 12 ? hours % 12 : 12);
              html.push('<span class="' + classes.join(' ') + '">' + txt + ':' + (i < 10 ? '0' + i : i) + '</span>');
              if (i === 59) {
                html.push('</fieldset>');
              }
            } else {
              txt = i + ':00';
              html.push('<span class="' + classes.join(' ') + '">' + hours + ':' + (i < 10 ? '0' + i : i) + '</span>');
            }
          }
          this.picker.find('.datetimepicker-minutes td').html(html.join(''));

          var currentYear = this.date.getUTCFullYear();
          var months = this.setTitle('.datetimepicker-months', year)
            .end()
            .find('.month').removeClass('active');
          if (currentYear === year) {
            // getUTCMonths() returns 0 based, and we need to select the next one
            // To cater bootstrap 2 we don't need to select the next one
            months.eq(this.date.getUTCMonth()).addClass('active');
          }
          if (year < startYear || year > endYear) {
            months.addClass('disabled');
          }
          if (year === startYear) {
            months.slice(0, startMonth).addClass('disabled');
          }
          if (year === endYear) {
            months.slice(endMonth).addClass('disabled');
          }

          html = '';
          year = parseInt(year / 10, 10) * 10;
          var yearCont = this.setTitle('.datetimepicker-years', year + '-' + (year + 9))
            .end()
            .find('td');
          year -= 1;
          d = new Date(this.viewDate);
          for (var i = -1; i < 11; i++) {
            d.setUTCFullYear(year);
            classes = this.onRenderYear(d);
            if (i === -1 || i === 10) {
              classes.push(old);
            }
            html += '<span class="' + classes.join(' ') + '">' + year + '</span>';
            year += 1;
          }
          yearCont.html(html);
          this.place();
        },

        updateNavArrows: function () {
          var d = new Date(this.viewDate),
            year = d.getUTCFullYear(),
            month = d.getUTCMonth(),
            day = d.getUTCDate(),
            hour = d.getUTCHours();
          switch (this.viewMode) {
            case 0:
              if (year <= this.startDate.getUTCFullYear()
                && month <= this.startDate.getUTCMonth()
                && day <= this.startDate.getUTCDate()
                && hour <= this.startDate.getUTCHours()) {
                this.picker.find('.prev').css({ visibility: 'hidden' });
              } else {
                this.picker.find('.prev').css({ visibility: 'visible' });
              }
              if (year >= this.endDate.getUTCFullYear()
                && month >= this.endDate.getUTCMonth()
                && day >= this.endDate.getUTCDate()
                && hour >= this.endDate.getUTCHours()) {
                this.picker.find('.next').css({ visibility: 'hidden' });
              } else {
                this.picker.find('.next').css({ visibility: 'visible' });
              }
              break;
            case 1:
              if (year <= this.startDate.getUTCFullYear()
                && month <= this.startDate.getUTCMonth()
                && day <= this.startDate.getUTCDate()) {
                this.picker.find('.prev').css({ visibility: 'hidden' });
              } else {
                this.picker.find('.prev').css({ visibility: 'visible' });
              }
              if (year >= this.endDate.getUTCFullYear()
                && month >= this.endDate.getUTCMonth()
                && day >= this.endDate.getUTCDate()) {
                this.picker.find('.next').css({ visibility: 'hidden' });
              } else {
                this.picker.find('.next').css({ visibility: 'visible' });
              }
              break;
            case 2:
              if (year <= this.startDate.getUTCFullYear()
                && month <= this.startDate.getUTCMonth()) {
                this.picker.find('.prev').css({ visibility: 'hidden' });
              } else {
                this.picker.find('.prev').css({ visibility: 'visible' });
              }
              if (year >= this.endDate.getUTCFullYear()
                && month >= this.endDate.getUTCMonth()) {
                this.picker.find('.next').css({ visibility: 'hidden' });
              } else {
                this.picker.find('.next').css({ visibility: 'visible' });
              }
              break;
            case 3:
            case 4:
              if (year <= this.startDate.getUTCFullYear()) {
                this.picker.find('.prev').css({ visibility: 'hidden' });
              } else {
                this.picker.find('.prev').css({ visibility: 'visible' });
              }
              if (year >= this.endDate.getUTCFullYear()) {
                this.picker.find('.next').css({ visibility: 'hidden' });
              } else {
                this.picker.find('.next').css({ visibility: 'visible' });
              }
              break;
          }
        },

        mousewheel: function (e) {

          e.preventDefault();
          e.stopPropagation();

          if (this.wheelPause) {
            return;
          }

          this.wheelPause = true;

          var originalEvent = e.originalEvent;

          var delta = originalEvent.wheelDelta;

          var mode = delta > 0 ? 1 : (delta === 0) ? 0 : -1;

          if (this.wheelViewModeNavigationInverseDirection) {
            mode = -mode;
          }

          this.showMode(mode);

          setTimeout($.proxy(function () {

            this.wheelPause = false

          }, this), this.wheelViewModeNavigationDelay);

        },

        click: function (e) {
          e.stopPropagation();
          e.preventDefault();
          var target = $(e.target).closest('span, td, th, legend');
          if (target.is('.' + this.icontype)) {
            target = $(target).parent().closest('span, td, th, legend');
          }
          if (target.length === 1) {
            if (target.is('.disabled')) {
              this.element.trigger({
                type: 'outOfRange',
                date: this.viewDate,
                startDate: this.startDate,
                endDate: this.endDate
              });
              return;
            }
            switch (target[0].nodeName.toLowerCase()) {
              case 'th':
                switch (target[0].className) {
                  case 'switch':
                    this.showMode(1);
                    break;
                  case 'prev':
                  case 'next':
                    var dir = DPGlobal.modes[this.viewMode].navStep * (target[0].className === 'prev' ? -1 : 1);
                    switch (this.viewMode) {
                      case 0:
                        this.viewDate = this.moveHour(this.viewDate, dir);
                        break;
                      case 1:
                        this.viewDate = this.moveDate(this.viewDate, dir);
                        break;
                      case 2:
                        this.viewDate = this.moveMonth(this.viewDate, dir);
                        break;
                      case 3:
                      case 4:
                        this.viewDate = this.moveYear(this.viewDate, dir);
                        break;
                    }
                    this.fill();
                    this.element.trigger({
                      type: target[0].className + ':' + this.convertViewModeText(this.viewMode),
                      date: this.viewDate,
                      startDate: this.startDate,
                      endDate: this.endDate
                    });
                    break;
                  case 'clear':
                    this.reset();
                    if (this.autoclose) {
                      this.hide();
                    }
                    break;
                  case 'today':
                    var date = new Date();
                    date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), 0);

                    // Respect startDate and endDate.
                    if (date < this.startDate) date = this.startDate;
                    else if (date > this.endDate) date = this.endDate;

                    this.viewMode = this.startViewMode;
                    this.showMode(0);
                    this._setDate(date);
                    this.fill();
                    if (this.autoclose) {
                      this.hide();
                    }
                    break;
                }
                break;
              case 'span':
                if (!target.is('.disabled')) {
                  var year = this.viewDate.getUTCFullYear(),
                    month = this.viewDate.getUTCMonth(),
                    day = this.viewDate.getUTCDate(),
                    hours = this.viewDate.getUTCHours(),
                    minutes = this.viewDate.getUTCMinutes(),
                    seconds = this.viewDate.getUTCSeconds();

                  if (target.is('.month')) {
                    this.viewDate.setUTCDate(1);
                    month = target.parent().find('span').index(target);
                    day = this.viewDate.getUTCDate();
                    this.viewDate.setUTCMonth(month);
                    this.element.trigger({
                      type: 'changeMonth',
                      date: this.viewDate
                    });
                    if (this.viewSelect >= 3) {
                      this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
                    }
                  } else if (target.is('.year')) {
                    this.viewDate.setUTCDate(1);
                    year = parseInt(target.text(), 10) || 0;
                    this.viewDate.setUTCFullYear(year);
                    this.element.trigger({
                      type: 'changeYear',
                      date: this.viewDate
                    });
                    if (this.viewSelect >= 4) {
                      this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
                    }
                  } else if (target.is('.hour')) {
                    hours = parseInt(target.text(), 10) || 0;
                    if (target.hasClass('hour_am') || target.hasClass('hour_pm')) {
                      if (hours === 12 && target.hasClass('hour_am')) {
                        hours = 0;
                      } else if (hours !== 12 && target.hasClass('hour_pm')) {
                        hours += 12;
                      }
                    }
                    this.viewDate.setUTCHours(hours);
                    this.element.trigger({
                      type: 'changeHour',
                      date: this.viewDate
                    });
                    if (this.viewSelect >= 1) {
                      this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
                    }
                  } else if (target.is('.minute')) {
                    minutes = parseInt(target.text().substr(target.text().indexOf(':') + 1), 10) || 0;
                    this.viewDate.setUTCMinutes(minutes);
                    this.element.trigger({
                      type: 'changeMinute',
                      date: this.viewDate
                    });
                    if (this.viewSelect >= 0) {
                      this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
                    }
                  }
                  if (this.viewMode !== 0) {
                    var oldViewMode = this.viewMode;
                    this.showMode(-1);
                    this.fill();
                    if (oldViewMode === this.viewMode && this.autoclose) {
                      this.hide();
                    }
                  } else {
                    this.fill();
                    if (this.autoclose) {
                      this.hide();
                    }
                  }
                }
                break;
              case 'td':
                if (target.is('.day') && !target.is('.disabled')) {
                  var day = parseInt(target.text(), 10) || 1;
                  var year = this.viewDate.getUTCFullYear(),
                    month = this.viewDate.getUTCMonth(),
                    hours = this.viewDate.getUTCHours(),
                    minutes = this.viewDate.getUTCMinutes(),
                    seconds = this.viewDate.getUTCSeconds();
                  if (target.is('.old')) {
                    if (month === 0) {
                      month = 11;
                      year -= 1;
                    } else {
                      month -= 1;
                    }
                  } else if (target.is('.new')) {
                    if (month === 11) {
                      month = 0;
                      year += 1;
                    } else {
                      month += 1;
                    }
                  }
                  this.viewDate.setUTCFullYear(year);
                  this.viewDate.setUTCMonth(month, day);
                  this.element.trigger({
                    type: 'changeDay',
                    date: this.viewDate
                  });
                  if (this.viewSelect >= 2) {
                    this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
                  }
                }
                var oldViewMode = this.viewMode;
                this.showMode(-1);
                this.fill();
                if (oldViewMode === this.viewMode && this.autoclose) {
                  this.hide();
                }
                break;
            }
          }
        },

        _setDate: function (date, which) {
          if (!which || which === 'date')
            this.date = date;
          if (!which || which === 'view')
            this.viewDate = date;
          this.fill();
          this.setValue();
          var element;
          if (this.isInput) {
            element = this.element;
          } else if (this.component) {
            element = this.element.find('input');
          }
          if (element) {
            element.change();
          }
          this.element.trigger({
            type: 'changeDate',
            date: this.getDate()
          });
          if (date === null)
            this.date = this.viewDate;
        },

        moveMinute: function (date, dir) {
          if (!dir) return date;
          var new_date = new Date(date.valueOf());
          //dir = dir > 0 ? 1 : -1;
          new_date.setUTCMinutes(new_date.getUTCMinutes() + (dir * this.minuteStep));
          return new_date;
        },

        moveHour: function (date, dir) {
          if (!dir) return date;
          var new_date = new Date(date.valueOf());
          //dir = dir > 0 ? 1 : -1;
          new_date.setUTCHours(new_date.getUTCHours() + dir);
          return new_date;
        },

        moveDate: function (date, dir) {
          if (!dir) return date;
          var new_date = new Date(date.valueOf());
          //dir = dir > 0 ? 1 : -1;
          new_date.setUTCDate(new_date.getUTCDate() + dir);
          return new_date;
        },

        moveMonth: function (date, dir) {
          if (!dir) return date;
          var new_date = new Date(date.valueOf()),
            day = new_date.getUTCDate(),
            month = new_date.getUTCMonth(),
            mag = Math.abs(dir),
            new_month, test;
          dir = dir > 0 ? 1 : -1;
          if (mag === 1) {
            test = dir === -1
              // If going back one month, make sure month is not current month
              // (eg, Mar 31 -> Feb 31 === Feb 28, not Mar 02)
              ? function () {
                return new_date.getUTCMonth() === month;
              }
              // If going forward one month, make sure month is as expected
              // (eg, Jan 31 -> Feb 31 === Feb 28, not Mar 02)
              : function () {
                return new_date.getUTCMonth() !== new_month;
              };
            new_month = month + dir;
            new_date.setUTCMonth(new_month);
            // Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
            if (new_month < 0 || new_month > 11)
              new_month = (new_month + 12) % 12;
          } else {
            // For magnitudes >1, move one month at a time...
            for (var i = 0; i < mag; i++)
              // ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
              new_date = this.moveMonth(new_date, dir);
            // ...then reset the day, keeping it in the new month
            new_month = new_date.getUTCMonth();
            new_date.setUTCDate(day);
            test = function () {
              return new_month !== new_date.getUTCMonth();
            };
          }
          // Common date-resetting loop -- if date is beyond end of month, make it
          // end of month
          while (test()) {
            new_date.setUTCDate(--day);
            new_date.setUTCMonth(new_month);
          }
          return new_date;
        },

        moveYear: function (date, dir) {
          return this.moveMonth(date, dir * 12);
        },

        dateWithinRange: function (date) {
          return date >= this.startDate && date <= this.endDate;
        },

        keydown: function (e) {
          if (this.picker.is(':not(:visible)')) {
            if (e.keyCode === 27) // allow escape to hide and re-show picker
              this.show();
            return;
          }
          var dateChanged = false,
            dir, newDate, newViewDate;
          switch (e.keyCode) {
            case 27: // escape
              this.hide();
              e.preventDefault();
              break;
            case 37: // left
            case 39: // right
              if (!this.keyboardNavigation) break;
              dir = e.keyCode === 37 ? -1 : 1;
              var viewMode = this.viewMode;
              if (e.ctrlKey) {
                viewMode += 2;
              } else if (e.shiftKey) {
                viewMode += 1;
              }
              if (viewMode === 4) {
                newDate = this.moveYear(this.date, dir);
                newViewDate = this.moveYear(this.viewDate, dir);
              } else if (viewMode === 3) {
                newDate = this.moveMonth(this.date, dir);
                newViewDate = this.moveMonth(this.viewDate, dir);
              } else if (viewMode === 2) {
                newDate = this.moveDate(this.date, dir);
                newViewDate = this.moveDate(this.viewDate, dir);
              } else if (viewMode === 1) {
                newDate = this.moveHour(this.date, dir);
                newViewDate = this.moveHour(this.viewDate, dir);
              } else if (viewMode === 0) {
                newDate = this.moveMinute(this.date, dir);
                newViewDate = this.moveMinute(this.viewDate, dir);
              }
              if (this.dateWithinRange(newDate)) {
                this.date = newDate;
                this.viewDate = newViewDate;
                this.setValue();
                this.update();
                e.preventDefault();
                dateChanged = true;
              }
              break;
            case 38: // up
            case 40: // down
              if (!this.keyboardNavigation) break;
              dir = e.keyCode === 38 ? -1 : 1;
              viewMode = this.viewMode;
              if (e.ctrlKey) {
                viewMode += 2;
              } else if (e.shiftKey) {
                viewMode += 1;
              }
              if (viewMode === 4) {
                newDate = this.moveYear(this.date, dir);
                newViewDate = this.moveYear(this.viewDate, dir);
              } else if (viewMode === 3) {
                newDate = this.moveMonth(this.date, dir);
                newViewDate = this.moveMonth(this.viewDate, dir);
              } else if (viewMode === 2) {
                newDate = this.moveDate(this.date, dir * 7);
                newViewDate = this.moveDate(this.viewDate, dir * 7);
              } else if (viewMode === 1) {
                if (this.showMeridian) {
                  newDate = this.moveHour(this.date, dir * 6);
                  newViewDate = this.moveHour(this.viewDate, dir * 6);
                } else {
                  newDate = this.moveHour(this.date, dir * 4);
                  newViewDate = this.moveHour(this.viewDate, dir * 4);
                }
              } else if (viewMode === 0) {
                newDate = this.moveMinute(this.date, dir * 4);
                newViewDate = this.moveMinute(this.viewDate, dir * 4);
              }
              if (this.dateWithinRange(newDate)) {
                this.date = newDate;
                this.viewDate = newViewDate;
                this.setValue();
                this.update();
                e.preventDefault();
                dateChanged = true;
              }
              break;
            case 13: // enter
              if (this.viewMode !== 0) {
                var oldViewMode = this.viewMode;
                this.showMode(-1);
                this.fill();
                if (oldViewMode === this.viewMode && this.autoclose) {
                  this.hide();
                }
              } else {
                this.fill();
                if (this.autoclose) {
                  this.hide();
                }
              }
              e.preventDefault();
              break;
            case 9: // tab
              this.hide();
              break;
          }
          if (dateChanged) {
            var element;
            if (this.isInput) {
              element = this.element;
            } else if (this.component) {
              element = this.element.find('input');
            }
            if (element) {
              element.change();
            }
            this.element.trigger({
              type: 'changeDate',
              date: this.getDate()
            });
          }
        },

        showMode: function (dir) {
          if (dir) {
            var newViewMode = Math.max(0, Math.min(DPGlobal.modes.length - 1, this.viewMode + dir));
            if (newViewMode >= this.minView && newViewMode <= this.maxView) {
              this.element.trigger({
                type: 'changeMode',
                date: this.viewDate,
                oldViewMode: this.viewMode,
                newViewMode: newViewMode
              });

              this.viewMode = newViewMode;
            }
          }
          /*
           vitalets: fixing bug of very special conditions:
           jquery 1.7.1 + webkit + show inline datetimepicker in bootstrap popover.
           Method show() does not set display css correctly and datetimepicker is not shown.
           Changed to .css('display', 'block') solve the problem.
           See https://github.com/vitalets/x-editable/issues/37

           In jquery 1.7.2+ everything works fine.
           */
          //this.picker.find('>div').hide().filter('.datetimepicker-'+DPGlobal.modes[this.viewMode].clsName).show();
          this.picker.find('>div').hide().filter('.datetimepicker-' + DPGlobal.modes[this.viewMode].clsName).css('display', 'block');
          this.updateNavArrows();
        },

        reset: function () {
          this._setDate(null, 'date');
        },

        convertViewModeText: function (viewMode) {
          switch (viewMode) {
            case 4:
              return 'decade';
            case 3:
              return 'year';
            case 2:
              return 'month';
            case 1:
              return 'day';
            case 0:
              return 'hour';
          }
        }
      };

      var old = $.fn.datetimepicker;
      $.fn.datetimepicker = function (option) {
        var args = Array.apply(null, arguments);
        args.shift();
        var internal_return;
        this.each(function () {
          var $this = $(this),
            data = $this.data('datetimepicker'),
            options = typeof option === 'object' && option;
          if (!data) {
            $this.data('datetimepicker', (data = new Datetimepicker(this, $.extend({}, $.fn.datetimepicker.defaults, options))));
          }
          if (typeof option === 'string' && typeof data[option] === 'function') {
            internal_return = data[option].apply(data, args);
            if (internal_return !== undefined) {
              return false;
            }
          }
        });
        if (internal_return !== undefined)
          return internal_return;
        else
          return this;
      };

      $.fn.datetimepicker.defaults = {
      };
      $.fn.datetimepicker.Constructor = Datetimepicker;
      var dates = $.fn.datetimepicker.dates = {
        /*     en: {
               days:        ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
               daysShort:   ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
               daysMin:     ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
               months:      ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
               monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
               meridiem:    ['am', 'pm'],
               suffix:      ['st', 'nd', 'rd', 'th'],
               today:       'Today',
               clear:       'Clear'
             },*/
        en: {
          days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
          daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
          daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
          months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
          monthsShort: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
          today: "今天",
          suffix: [],
          meridiem: ["上午", "下午"]
        }
      };

      var DPGlobal = {
        modes: [
          {
            clsName: 'minutes',
            navFnc: 'Hours',
            navStep: 1
          },
          {
            clsName: 'hours',
            navFnc: 'Date',
            navStep: 1
          },
          {
            clsName: 'days',
            navFnc: 'Month',
            navStep: 1
          },
          {
            clsName: 'months',
            navFnc: 'FullYear',
            navStep: 1
          },
          {
            clsName: 'years',
            navFnc: 'FullYear',
            navStep: 10
          }
        ],
        isLeapYear: function (year) {
          return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0))
        },
        getDaysInMonth: function (year, month) {
          return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
        },
        getDefaultFormat: function (type, field) {
          if (type === 'standard') {
            if (field === 'input')
              return 'yyyy-mm-dd hh:ii';
            else
              return 'yyyy-mm-dd hh:ii:ss';
          } else if (type === 'php') {
            if (field === 'input')
              return 'Y-m-d H:i';
            else
              return 'Y-m-d H:i:s';
          } else {
            throw new Error('Invalid format type.');
          }
        },
        validParts: function (type) {
          if (type === 'standard') {
            return /t|hh?|HH?|p|P|z|Z|ii?|ss?|dd?|DD?|mm?|MM?|yy(?:yy)?/g;
          } else if (type === 'php') {
            return /[dDjlNwzFmMnStyYaABgGhHis]/g;
          } else {
            throw new Error('Invalid format type.');
          }
        },
        nonpunctuation: /[^ -\/:-@\[-`{-~\t\n\rTZ]+/g,
        parseFormat: function (format, type) {
          // IE treats \0 as a string end in inputs (truncating the value),
          // so it's a bad format delimiter, anyway
          var separators = format.replace(this.validParts(type), '\0').split('\0'),
            parts = format.match(this.validParts(type));
          if (!separators || !separators.length || !parts || parts.length === 0) {
            throw new Error('Invalid date format.');
          }
          return { separators: separators, parts: parts };
        },
        parseDate: function (date, format, language, type, timezone) {
          if (date instanceof Date) {
            var dateUTC = new Date(date.valueOf() - date.getTimezoneOffset() * 60000);
            dateUTC.setMilliseconds(0);
            return dateUTC;
          }
          if (/^\d{4}\-\d{1,2}\-\d{1,2}$/.test(date)) {
            format = this.parseFormat('yyyy-mm-dd', type);
          }
          if (/^\d{4}\-\d{1,2}\-\d{1,2}[T ]\d{1,2}\:\d{1,2}$/.test(date)) {
            format = this.parseFormat('yyyy-mm-dd hh:ii', type);
          }
          if (/^\d{4}\-\d{1,2}\-\d{1,2}[T ]\d{1,2}\:\d{1,2}\:\d{1,2}[Z]{0,1}$/.test(date)) {
            format = this.parseFormat('yyyy-mm-dd hh:ii:ss', type);
          }
          if (/^[-+]\d+[dmwy]([\s,]+[-+]\d+[dmwy])*$/.test(date)) {
            var part_re = /([-+]\d+)([dmwy])/,
              parts = date.match(/([-+]\d+)([dmwy])/g),
              part, dir;
            date = new Date();
            for (var i = 0; i < parts.length; i++) {
              part = part_re.exec(parts[i]);
              dir = parseInt(part[1]);
              switch (part[2]) {
                case 'd':
                  date.setUTCDate(date.getUTCDate() + dir);
                  break;
                case 'm':
                  date = Datetimepicker.prototype.moveMonth.call(Datetimepicker.prototype, date, dir);
                  break;
                case 'w':
                  date.setUTCDate(date.getUTCDate() + dir * 7);
                  break;
                case 'y':
                  date = Datetimepicker.prototype.moveYear.call(Datetimepicker.prototype, date, dir);
                  break;
              }
            }
            return UTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), 0);
          }
          var parts = date && date.toString().match(this.nonpunctuation) || [],
            date = new Date(0, 0, 0, 0, 0, 0, 0),
            parsed = {},
            setters_order = ['hh', 'h', 'ii', 'i', 'ss', 's', 'yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'D', 'DD', 'd', 'dd', 'H', 'HH', 'p', 'P', 'z', 'Z'],
            setters_map = {
              hh: function (d, v) {
                return d.setUTCHours(v);
              },
              h: function (d, v) {
                return d.setUTCHours(v);
              },
              HH: function (d, v) {
                return d.setUTCHours(v === 12 ? 0 : v);
              },
              H: function (d, v) {
                return d.setUTCHours(v === 12 ? 0 : v);
              },
              ii: function (d, v) {
                return d.setUTCMinutes(v);
              },
              i: function (d, v) {
                return d.setUTCMinutes(v);
              },
              ss: function (d, v) {
                return d.setUTCSeconds(v);
              },
              s: function (d, v) {
                return d.setUTCSeconds(v);
              },
              yyyy: function (d, v) {
                return d.setUTCFullYear(v);
              },
              yy: function (d, v) {
                return d.setUTCFullYear(2000 + v);
              },
              m: function (d, v) {
                v -= 1;
                while (v < 0) v += 12;
                v %= 12;
                d.setUTCMonth(v);
                while (d.getUTCMonth() !== v)
                  if (isNaN(d.getUTCMonth()))
                    return d;
                  else
                    d.setUTCDate(d.getUTCDate() - 1);
                return d;
              },
              d: function (d, v) {
                return d.setUTCDate(v);
              },
              p: function (d, v) {
                return d.setUTCHours(v === 1 ? d.getUTCHours() + 12 : d.getUTCHours());
              },
              z: function () {
                return timezone
              }
            },
            val, filtered, part;
          setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
          setters_map['dd'] = setters_map['d'];
          setters_map['P'] = setters_map['p'];
          setters_map['Z'] = setters_map['z'];
          date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
          if (parts.length === format.parts.length) {
            for (var i = 0, cnt = format.parts.length; i < cnt; i++) {
              val = parseInt(parts[i], 10);
              part = format.parts[i];
              if (isNaN(val)) {
                switch (part) {
                  case 'MM':
                    filtered = $(dates[language].months).filter(function () {
                      var m = this.slice(0, parts[i].length),
                        p = parts[i].slice(0, m.length);
                      return m === p;
                    });
                    val = $.inArray(filtered[0], dates[language].months) + 1;
                    break;
                  case 'M':
                    filtered = $(dates[language].monthsShort).filter(function () {
                      var m = this.slice(0, parts[i].length),
                        p = parts[i].slice(0, m.length);
                      return m.toLowerCase() === p.toLowerCase();
                    });
                    val = $.inArray(filtered[0], dates[language].monthsShort) + 1;
                    break;
                  case 'p':
                  case 'P':
                    val = $.inArray(parts[i].toLowerCase(), dates[language].meridiem);
                    break;
                  case 'z':
                  case 'Z':
                    timezone;
                    break;

                }
              }
              parsed[part] = val;
            }
            for (var i = 0, s; i < setters_order.length; i++) {
              s = setters_order[i];
              if (s in parsed && !isNaN(parsed[s]))
                setters_map[s](date, parsed[s])
            }
          }
          return date;
        },
        formatDate: function (date, format, language, type, timezone) {
          if (date === null) {
            return '';
          }
          var val;
          if (type === 'standard') {
            val = {
              t: date.getTime(),
              // year
              yy: date.getUTCFullYear().toString().substring(2),
              yyyy: date.getUTCFullYear(),
              // month
              m: date.getUTCMonth() + 1,
              M: dates[language].monthsShort[date.getUTCMonth()],
              MM: dates[language].months[date.getUTCMonth()],
              // day
              d: date.getUTCDate(),
              D: dates[language].daysShort[date.getUTCDay()],
              DD: dates[language].days[date.getUTCDay()],
              p: (dates[language].meridiem.length === 2 ? dates[language].meridiem[date.getUTCHours() < 12 ? 0 : 1] : ''),
              // hour
              h: date.getUTCHours(),
              // minute
              i: date.getUTCMinutes(),
              // second
              s: date.getUTCSeconds(),
              // timezone
              z: timezone
            };

            if (dates[language].meridiem.length === 2) {
              val.H = (val.h % 12 === 0 ? 12 : val.h % 12);
            }
            else {
              val.H = val.h;
            }
            val.HH = (val.H < 10 ? '0' : '') + val.H;
            val.P = val.p.toUpperCase();
            val.Z = val.z;
            val.hh = (val.h < 10 ? '0' : '') + val.h;
            val.ii = (val.i < 10 ? '0' : '') + val.i;
            val.ss = (val.s < 10 ? '0' : '') + val.s;
            val.dd = (val.d < 10 ? '0' : '') + val.d;
            val.mm = (val.m < 10 ? '0' : '') + val.m;
          } else if (type === 'php') {
            // php format
            val = {
              // year
              y: date.getUTCFullYear().toString().substring(2),
              Y: date.getUTCFullYear(),
              // month
              F: dates[language].months[date.getUTCMonth()],
              M: dates[language].monthsShort[date.getUTCMonth()],
              n: date.getUTCMonth() + 1,
              t: DPGlobal.getDaysInMonth(date.getUTCFullYear(), date.getUTCMonth()),
              // day
              j: date.getUTCDate(),
              l: dates[language].days[date.getUTCDay()],
              D: dates[language].daysShort[date.getUTCDay()],
              w: date.getUTCDay(), // 0 -> 6
              N: (date.getUTCDay() === 0 ? 7 : date.getUTCDay()),       // 1 -> 7
              S: (date.getUTCDate() % 10 <= dates[language].suffix.length ? dates[language].suffix[date.getUTCDate() % 10 - 1] : ''),
              // hour
              a: (dates[language].meridiem.length === 2 ? dates[language].meridiem[date.getUTCHours() < 12 ? 0 : 1] : ''),
              g: (date.getUTCHours() % 12 === 0 ? 12 : date.getUTCHours() % 12),
              G: date.getUTCHours(),
              // minute
              i: date.getUTCMinutes(),
              // second
              s: date.getUTCSeconds()
            };
            val.m = (val.n < 10 ? '0' : '') + val.n;
            val.d = (val.j < 10 ? '0' : '') + val.j;
            val.A = val.a.toString().toUpperCase();
            val.h = (val.g < 10 ? '0' : '') + val.g;
            val.H = (val.G < 10 ? '0' : '') + val.G;
            val.i = (val.i < 10 ? '0' : '') + val.i;
            val.s = (val.s < 10 ? '0' : '') + val.s;
          } else {
            throw new Error('Invalid format type.');
          }
          var date = [],
            seps = $.extend([], format.separators);
          for (var i = 0, cnt = format.parts.length; i < cnt; i++) {
            if (seps.length) {
              date.push(seps.shift());
            }
            date.push(val[format.parts[i]]);
          }
          if (seps.length) {
            date.push(seps.shift());
          }
          return date.join('');
        },
        convertViewMode: function (viewMode) {
          switch (viewMode) {
            case 4:
            case 'decade':
              viewMode = 4;
              break;
            case 3:
            case 'year':
              viewMode = 3;
              break;
            case 2:
            case 'month':
              viewMode = 2;
              break;
            case 1:
            case 'day':
              viewMode = 1;
              break;
            case 0:
            case 'hour':
              viewMode = 0;
              break;
          }

          return viewMode;
        },
        headTemplate: '<thead>' +
          '<tr>' +
          '<th class="prev"><i class="{iconType} {leftArrow}"/></th>' +
          '<th colspan="5" class="switch"></th>' +
          '<th class="next"><i class="{iconType} {rightArrow}"/></th>' +
          '</tr>' +
          '</thead>',
        headTemplateV3: '<thead>' +
          '<tr>' +
          '<th class="prev"><span class="{iconType} {leftArrow}"></span> </th>' +
          '<th colspan="5" class="switch"></th>' +
          '<th class="next"><span class="{iconType} {rightArrow}"></span> </th>' +
          '</tr>' +
          '</thead>',
        contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
        footTemplate: '<tfoot>' +
          '<tr><th colspan="7" class="today"></th></tr>' +
          '<tr><th colspan="7" class="clear"></th></tr>' +
          '</tfoot>'
      };
      DPGlobal.template = '<div class="datetimepicker">' +
        '<div class="datetimepicker-minutes">' +
        '<table class=" table-condensed">' +
        DPGlobal.headTemplate +
        DPGlobal.contTemplate +
        DPGlobal.footTemplate +
        '</table>' +
        '</div>' +
        '<div class="datetimepicker-hours">' +
        '<table class=" table-condensed">' +
        DPGlobal.headTemplate +
        DPGlobal.contTemplate +
        DPGlobal.footTemplate +
        '</table>' +
        '</div>' +
        '<div class="datetimepicker-days">' +
        '<table class=" table-condensed">' +
        DPGlobal.headTemplate +
        '<tbody></tbody>' +
        DPGlobal.footTemplate +
        '</table>' +
        '</div>' +
        '<div class="datetimepicker-months">' +
        '<table class="table-condensed">' +
        DPGlobal.headTemplate +
        DPGlobal.contTemplate +
        DPGlobal.footTemplate +
        '</table>' +
        '</div>' +
        '<div class="datetimepicker-years">' +
        '<table class="table-condensed">' +
        DPGlobal.headTemplate +
        DPGlobal.contTemplate +
        DPGlobal.footTemplate +
        '</table>' +
        '</div>' +
        '</div>';
      DPGlobal.templateV3 = '<div class="datetimepicker">' +
        '<div class="datetimepicker-minutes">' +
        '<table class=" table-condensed">' +
        DPGlobal.headTemplateV3 +
        DPGlobal.contTemplate +
        DPGlobal.footTemplate +
        '</table>' +
        '</div>' +
        '<div class="datetimepicker-hours">' +
        '<table class=" table-condensed">' +
        DPGlobal.headTemplateV3 +
        DPGlobal.contTemplate +
        DPGlobal.footTemplate +
        '</table>' +
        '</div>' +
        '<div class="datetimepicker-days">' +
        '<table class=" table-condensed">' +
        DPGlobal.headTemplateV3 +
        '<tbody></tbody>' +
        DPGlobal.footTemplate +
        '</table>' +
        '</div>' +
        '<div class="datetimepicker-months">' +
        '<table class="table-condensed">' +
        DPGlobal.headTemplateV3 +
        DPGlobal.contTemplate +
        DPGlobal.footTemplate +
        '</table>' +
        '</div>' +
        '<div class="datetimepicker-years">' +
        '<table class="table-condensed">' +
        DPGlobal.headTemplateV3 +
        DPGlobal.contTemplate +
        DPGlobal.footTemplate +
        '</table>' +
        '</div>' +
        '</div>';
      $.fn.datetimepicker.DPGlobal = DPGlobal;

      /* DATETIMEPICKER NO CONFLICT
       * =================== */

      $.fn.datetimepicker.noConflict = function () {
        $.fn.datetimepicker = old;
        return this;
      };

      /* DATETIMEPICKER DATA-API
       * ================== */

      $(document).on(
        'focus.datetimepicker.data-api click.datetimepicker.data-api',
        '[data-provide="datetimepicker"]',
        function (e) {
          var $this = $(this);
          if ($this.data('datetimepicker')) return;
          e.preventDefault();
          // component click requires us to explicitly show it
          $this.datetimepicker('show');
        }
      );
      $(function () {
        $('[data-provide="datetimepicker-inline"]').datetimepicker();
      });

    })(jQuery);


  }
});