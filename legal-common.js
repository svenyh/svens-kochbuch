(function () {
  var LANG_STORAGE_KEY = 'svenskochbuch_lang';
  var currentLang = 'de';

  var I18N = {
    de: {
      brand_home_aria: 'Zur Startseite',
      brand_subtitle: 'Rezepte aus Svens Kochbuch',
      nav_home: 'Startseite',
      nav_recipes: 'Rezepte',
      nav_favorites: 'Merkliste',
      nav_shopping: 'Einkaufsliste',
      nav_about: 'Über mich',
      nav_contact: 'Kontakt',
      footer_home: 'Startseite',
      footer_recipes: 'Rezepte',
      footer_about: 'Über mich',
      footer_contact: 'Kontakt',
      footer_legal: 'Impressum',
      footer_privacy: 'Datenschutz',
      footer_copy: '© 2026 Svenskochbuch.de | Mit Liebe gekocht.',
      page_title_impressum: 'Impressum | Sven Kocht.',
      page_title_privacy: 'Datenschutz | Sven Kocht.',
      legal_contact_title: 'Kontakt',
      legal_imprint_title: 'Impressum',
      legal_ddg_info: 'Angaben gemäß § 5 DDG',
      legal_responsible_content: 'Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV',
      legal_content_liability: 'Haftung für Inhalte',
      privacy_title: 'Datenschutzerklärung',
      privacy_general: '1. Allgemeine Hinweise',
      privacy_controller: '2. Verantwortliche Stelle',
      privacy_hosting: '3. Hosting und Server-Logfiles',
      privacy_tracking: '4. Tracking und Analyse',
      privacy_rights: '5. Deine Rechte',
      privacy_updated: '6. Stand'
    },
    pl: {
      brand_home_aria: 'Do strony głównej',
      brand_subtitle: 'Przepisy z książki kucharskiej Svena',
      nav_home: 'Strona główna',
      nav_recipes: 'Przepisy',
      nav_favorites: 'Ulubione',
      nav_shopping: 'Lista zakupów',
      nav_about: 'O mnie',
      nav_contact: 'Kontakt',
      footer_home: 'Strona główna',
      footer_recipes: 'Przepisy',
      footer_about: 'O mnie',
      footer_contact: 'Kontakt',
      footer_legal: 'Nota prawna',
      footer_privacy: 'Polityka prywatności',
      footer_copy: '© 2026 Svenskochbuch.de | Gotowane z miłością.',
      page_title_impressum: 'Nota prawna | Sven Kocht.',
      page_title_privacy: 'Polityka prywatności | Sven Kocht.',
      legal_contact_title: 'Kontakt',
      legal_imprint_title: 'Nota prawna',
      legal_ddg_info: 'Informacje zgodnie z § 5 DDG',
      legal_responsible_content: 'Osoba odpowiedzialna za treść zgodnie z § 18 ust. 2 MStV',
      legal_content_liability: 'Odpowiedzialność za treści',
      privacy_title: 'Polityka prywatności',
      privacy_general: '1. Informacje ogólne',
      privacy_controller: '2. Administrator danych',
      privacy_hosting: '3. Hosting i logi serwera',
      privacy_tracking: '4. Śledzenie i analiza',
      privacy_rights: '5. Twoje prawa',
      privacy_updated: '6. Stan'
    },
    en: {
      brand_home_aria: 'Go to home page',
      brand_subtitle: 'Recipes from Sven\'s cookbook',
      nav_home: 'Home',
      nav_recipes: 'Recipes',
      nav_favorites: 'Favorites',
      nav_shopping: 'Shopping list',
      nav_about: 'About me',
      nav_contact: 'Contact',
      footer_home: 'Home',
      footer_recipes: 'Recipes',
      footer_about: 'About me',
      footer_contact: 'Contact',
      footer_legal: 'Legal notice',
      footer_privacy: 'Privacy policy',
      footer_copy: '© 2026 Svenskochbuch.de | Cooked with love.',
      page_title_impressum: 'Legal notice | Sven Kocht.',
      page_title_privacy: 'Privacy policy | Sven Kocht.',
      legal_contact_title: 'Contact',
      legal_imprint_title: 'Legal notice',
      legal_ddg_info: 'Information according to § 5 DDG',
      legal_responsible_content: 'Responsible for content according to § 18 para. 2 MStV',
      legal_content_liability: 'Liability for content',
      privacy_title: 'Privacy policy',
      privacy_general: '1. General information',
      privacy_controller: '2. Controller',
      privacy_hosting: '3. Hosting and server log files',
      privacy_tracking: '4. Tracking and analytics',
      privacy_rights: '5. Your rights',
      privacy_updated: '6. Last updated'
    }
  };

  function t(key) {
    var pack = I18N[currentLang] || I18N.de;
    return pack[key] != null ? pack[key] : (I18N.de[key] || key);
  }

  function setLanguage(lang) {
    if (!I18N[lang]) lang = 'de';
    currentLang = lang;
    try { localStorage.setItem(LANG_STORAGE_KEY, lang); } catch (e) {}
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);
    applyLegalTranslations();
    [].slice.call(document.querySelectorAll('.lang-btn[data-lang]')).forEach(function (btn) {
      var active = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('is-active', active);
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function applyLegalTranslations() {
    [].slice.call(document.querySelectorAll('[data-legal-i18n]')).forEach(function (el) {
      var key = el.getAttribute('data-legal-i18n');
      if (key) el.textContent = t(key);
    });

    [].slice.call(document.querySelectorAll('[data-nav-link]')).forEach(function (a) {
      var key = a.getAttribute('data-nav-link');
      if (key === 'home') a.textContent = t('nav_home');
      else if (key === 'recipes') a.textContent = t('nav_recipes');
      else if (key === 'favorites') a.textContent = t('nav_favorites');
      else if (key === 'shopping') a.textContent = t('nav_shopping');
      else if (key === 'about') a.textContent = t('nav_about');
      else if (key === 'contact') a.textContent = t('nav_contact');
    });

    [].slice.call(document.querySelectorAll('[data-footer-link]')).forEach(function (a) {
      var key = a.getAttribute('data-footer-link');
      if (key === 'home') a.textContent = t('footer_home');
      else if (key === 'recipes') a.textContent = t('footer_recipes');
      else if (key === 'about') a.textContent = t('footer_about');
      else if (key === 'contact') a.textContent = t('footer_contact');
      else if (key === 'legal') a.textContent = t('footer_legal');
      else if (key === 'privacy') a.textContent = t('footer_privacy');
    });

    var brandSub = document.getElementById('brandSubtitle');
    if (brandSub) brandSub.textContent = t('brand_subtitle');
    var brandLink = document.querySelector('.brand');
    if (brandLink) brandLink.setAttribute('aria-label', t('brand_home_aria'));

    var footerCopy = document.querySelector('.footer-copy');
    if (footerCopy) footerCopy.textContent = t('footer_copy');

    var page = document.body.getAttribute('data-legal-page');
    if (page === 'impressum') document.title = t('page_title_impressum');
    if (page === 'privacy') document.title = t('page_title_privacy');
  }

  function initLanguage() {
    var stored = null;
    try { stored = localStorage.getItem(LANG_STORAGE_KEY); } catch (e) {}
    setLanguage(stored && I18N[stored] ? stored : 'de');
    var wrap = document.querySelector('.lang-switcher--top');
    if (wrap && wrap.dataset.bound !== '1') {
      wrap.dataset.bound = '1';
      wrap.addEventListener('click', function (e) {
        var b = e.target.closest('button.lang-btn[data-lang]');
        if (!b || !wrap.contains(b)) return;
        e.preventDefault();
        setLanguage(b.getAttribute('data-lang'));
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguage);
  } else {
    initLanguage();
  }
})();
