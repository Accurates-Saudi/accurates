(function () {
  var mobileQuery = window.matchMedia('(max-width: 1050px)');
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav');

  function setHeaderState() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 4 || header.classList.contains('nav-open'));
  }

  function closeMenus(except) {
    document.querySelectorAll('.nav-menu-item.is-open').forEach(function (item) {
      if (item !== except) {
        item.classList.remove('is-open');
        var trigger = item.querySelector('.nav-menu-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function closeMobileNav() {
    if (!header || !toggle) return;
    header.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    closeMenus();
    setHeaderState();
  }

  function makeDropdown(anchor, items) {
    if (!anchor || anchor.closest('.nav-menu-item')) return;

    var wrapper = document.createElement('div');
    wrapper.className = 'nav-menu-item';
    var menu = document.createElement('div');
    menu.className = 'nav-dropdown';
    menu.setAttribute('role', 'menu');

    items.forEach(function (item) {
      var link = document.createElement('a');
      link.href = item.href;
      link.textContent = item.label;
      link.setAttribute('role', 'menuitem');
      menu.appendChild(link);
    });

    anchor.classList.add('nav-menu-trigger');
    anchor.setAttribute('aria-haspopup', 'true');
    anchor.setAttribute('aria-expanded', 'false');

    anchor.parentNode.insertBefore(wrapper, anchor);
    wrapper.appendChild(anchor);
    wrapper.appendChild(menu);

    anchor.addEventListener('click', function (event) {
      if (!mobileQuery.matches && anchor.getAttribute('href') !== '#language') return;
      event.preventDefault();
      var isOpen = wrapper.classList.toggle('is-open');
      anchor.setAttribute('aria-expanded', String(isOpen));
      closeMenus(wrapper);
    });
  }

  function enhanceNavigation() {
    if (!nav) return;

    var productLink = Array.from(nav.querySelectorAll('.nav-links > a')).find(function (link) {
      return link.textContent.trim().indexOf('Products') === 0;
    });
    makeDropdown(productLink, [
      { label: 'Raqeem - ZATCA E-Invoicing', href: 'zatca.html' },
      { label: 'Tareeq - Bayan Waybill', href: 'bayan.html' },
      { label: 'Jawab - WhatsApp Automation', href: 'whatsapp.html' }
    ]);

    var resourceLink = Array.from(nav.querySelectorAll('.nav-links > a')).find(function (link) {
      return link.textContent.trim().indexOf('Resources') === 0;
    });
    makeDropdown(resourceLink, [
      { label: 'Pricing', href: 'pricing.html' },
      { label: 'Help Center', href: 'contact.html' },
      { label: 'Contact Support', href: 'contact.html' }
    ]);

    var languageLink = nav.querySelector('.language-link');
    makeDropdown(languageLink, [
      { label: 'English', href: '#language' },
      { label: 'Arabic', href: '#language' }
    ]);
  }

  function normalizeUtilityLinks() {
    var demoTarget = document.querySelector('.form-card, .contact-form');
    if (demoTarget && !demoTarget.id) demoTarget.id = 'demo';

    document.querySelectorAll('a[href="#demo"]').forEach(function (link) {
      if (!document.getElementById('demo')) link.href = 'contact.html#demo';
    });

    document.querySelectorAll('a[href="#faqs"]').forEach(function (link) {
      var faq = document.querySelector('.contact-faq, .product-faq-list');
      if (faq && !faq.id) faq.id = 'faqs';
    });

    document.querySelectorAll('a[href="#whatsapp"]').forEach(function (link) {
      link.href = 'whatsapp.html';
    });
  }

  enhanceNavigation();
  normalizeUtilityLinks();
  setHeaderState();

  if (toggle && header) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', function () {
      var isOpen = header.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
      setHeaderState();
    });
  }

  window.addEventListener('scroll', setHeaderState, { passive: true });

  document.addEventListener('click', function (event) {
    if (!event.target.closest('.nav-menu-item')) closeMenus();
    if (header && header.classList.contains('nav-open') && !event.target.closest('.site-header')) {
      closeMobileNav();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeMobileNav();
  });

  document.querySelectorAll('.site-header a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (!link.classList.contains('nav-menu-trigger')) closeMobileNav();
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      var hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      var target = document.querySelector(hash);
      if (!target) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
