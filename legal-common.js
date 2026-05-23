(function () {

  var LANG_STORAGE_KEYS = ['svenskochbuch_lang', 'svensKochbuchLang', 'language', 'selectedLanguage', 'lang'];

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
      footerHome: 'Startseite',
      footerRecipes: 'Rezepte',
      footerAbout: 'Über mich',
      footerContact: 'Kontakt',
      footerImprint: 'Impressum',
      footerPrivacy: 'Datenschutz',
      footerClaim: '© 2026 Svenskochbuch.de | Mit Liebe gekocht.',
      footerNavAria: 'Fußnavigation',
      page_title_impressum: 'Impressum | Sven Kocht.',
      page_title_privacy: 'Datenschutzerklärung | Sven Kocht.',
      legal_contact_title: 'Kontakt',
      legal_imprint_title: 'Impressum',
      legal_ddg_info: 'Angaben gemäß § 5 DDG',
      legal_responsible_content: 'Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV',
      legal_content_liability: 'Haftung für Inhalte',
      legal_content_liability_text: 'Die Inhalte dieser Website wurden mit Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte wird jedoch keine Gewähr übernommen.',
      legal_country: 'Deutschland',
      privacy_title: 'Datenschutzerklärung',
      privacy_general: '1. Allgemeine Hinweise',
      privacy_general_text: 'Diese Website dient der Bereitstellung von Rezeptinhalten. Beim rein informatorischen Besuch werden nur die technisch erforderlichen Daten verarbeitet, die dein Browser an den Server übermittelt.',
      privacy_controller: '2. Verantwortliche Stelle',
      privacy_hosting: '3. Hosting und Server-Logfiles',
      privacy_hosting_text: 'Der Hosting-Anbieter kann Zugriffsdaten wie IP-Adresse, Datum und Uhrzeit des Abrufs, Browsertyp, Betriebssystem und besuchte Seiten in Server-Logfiles speichern. Diese Verarbeitung erfolgt zur technisch sicheren Bereitstellung der Website.',
      privacy_tracking: '4. Tracking und Analyse',
      privacy_tracking_text_1: 'Auf dieser Website sind derzeit keine externen Tracking- oder Analyse-Tools vorgesehen. Sofern zukünftig zusätzliche Dienste eingebunden werden, ist diese Erklärung entsprechend anzupassen.',
      privacy_tracking_text_2: 'Wenn du auf der Startseite die Funktion „Merken“ nutzt, werden die gewählten Rezept-IDs lokal in deinem Browser gespeichert (localStorage). Es werden dafür keine Daten zu Werbe- oder Analysezwecken an den Betreiber übermittelt.',
      privacy_rights: '5. Deine Rechte',
      privacy_rights_text: 'Du hast im Rahmen der gesetzlichen Vorschriften das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung sowie Beschwerde bei einer zuständigen Aufsichtsbehörde.',
      privacy_updated: '6. Stand',
      privacy_updated_text: 'Stand: Mai 2026'
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
      footerHome: 'Strona główna',
      footerRecipes: 'Przepisy',
      footerAbout: 'O mnie',
      footerContact: 'Kontakt',
      footerImprint: 'Nota prawna',
      footerPrivacy: 'Polityka prywatności',
      footerClaim: '© 2026 Svenskochbuch.de | Gotowane z miłością.',
      footerNavAria: 'Nawigacja stopki',
      page_title_impressum: 'Nota prawna | Sven Kocht.',
      page_title_privacy: 'Polityka prywatności | Sven Kocht.',
      legal_contact_title: 'Kontakt',
      legal_imprint_title: 'Nota prawna',
      legal_ddg_info: 'Informacje zgodnie z § 5 DDG',
      legal_responsible_content: 'Osoba odpowiedzialna za treść zgodnie z § 18 ust. 2 MStV',
      legal_content_liability: 'Odpowiedzialność za treści',
      legal_content_liability_text: 'Treści na tej stronie zostały przygotowane z należytą starannością. Nie ponosimy jednak odpowiedzialności za ich poprawność, kompletność i aktualność.',
      legal_country: 'Niemcy',
      privacy_title: 'Polityka prywatności',
      privacy_general: '1. Informacje ogólne',
      privacy_general_text: 'Ta strona internetowa służy do udostępniania treści z przepisami. Podczas czysto informacyjnego korzystania ze strony przetwarzane są wyłącznie technicznie niezbędne dane przekazywane przez Twoją przeglądarkę do serwera.',
      privacy_controller: '2. Administrator danych',
      privacy_hosting: '3. Hosting i logi serwera',
      privacy_hosting_text: 'Dostawca hostingu może zapisywać dane dostępu, takie jak adres IP, data i godzina wywołania strony, typ przeglądarki, system operacyjny oraz odwiedzone strony w logach serwera. Przetwarzanie to odbywa się w celu technicznie bezpiecznego udostępniania strony.',
      privacy_tracking: '4. Śledzenie i analiza',
      privacy_tracking_text_1: 'Na tej stronie obecnie nie są przewidziane zewnętrzne narzędzia śledzące ani analityczne. Jeśli w przyszłości zostaną dodane dodatkowe usługi, niniejsza informacja zostanie odpowiednio zaktualizowana.',
      privacy_tracking_text_2: 'Jeśli na stronie głównej korzystasz z funkcji „Ulubione”, wybrane identyfikatory przepisów są zapisywane lokalnie w Twojej przeglądarce (localStorage). Dane te nie są przekazywane operatorowi strony w celach reklamowych ani analitycznych.',
      privacy_rights: '5. Twoje prawa',
      privacy_rights_text: 'W ramach obowiązujących przepisów masz prawo do informacji, sprostowania, usunięcia, ograniczenia przetwarzania oraz złożenia skargi do właściwego organu nadzorczego.',
      privacy_updated: '6. Stan',
      privacy_updated_text: 'Stan: maj 2026'
    },
    en: {
      brand_home_aria: 'Go to home page',
      brand_subtitle: 'Recipes from Sven\'s cookbook',
      nav_home: 'Home',
      nav_recipes: 'Recipes',
      nav_favorites: 'Saved',
      nav_shopping: 'Shopping list',
      nav_about: 'About',
      nav_contact: 'Contact',
      footerHome: 'Home',
      footerRecipes: 'Recipes',
      footerAbout: 'About',
      footerContact: 'Contact',
      footerImprint: 'Legal notice',
      footerPrivacy: 'Privacy policy',
      footerClaim: '© 2026 Svenskochbuch.de | Cooked with love.',
      footerNavAria: 'Footer navigation',
      page_title_impressum: 'Legal notice | Sven Kocht.',
      page_title_privacy: 'Privacy policy | Sven Kocht.',
      legal_contact_title: 'Contact',
      legal_imprint_title: 'Legal notice',
      legal_ddg_info: 'Information according to § 5 DDG',
      legal_responsible_content: 'Responsible for content according to § 18 para. 2 MStV',
      legal_content_liability: 'Liability for content',
      legal_content_liability_text: 'The contents of this website have been created with care. However, no guarantee is given for the accuracy, completeness or timeliness of the content.',
      legal_country: 'Germany',
      privacy_title: 'Privacy policy',
      privacy_general: '1. General information',
      privacy_general_text: 'This website provides recipe content. When visiting the website for informational purposes only, only technically necessary data transmitted by your browser to the server is processed.',
      privacy_controller: '2. Controller',
      privacy_hosting: '3. Hosting and server log files',
      privacy_hosting_text: 'The hosting provider may store access data such as IP address, date and time of access, browser type, operating system and visited pages in server log files. This processing is carried out to provide the website securely from a technical perspective.',
      privacy_tracking: '4. Tracking and analytics',
      privacy_tracking_text_1: 'No external tracking or analytics tools are currently planned for this website. If additional services are integrated in the future, this privacy policy must be updated accordingly.',
      privacy_tracking_text_2: 'If you use the “Saved” function on the homepage, the selected recipe IDs are stored locally in your browser (localStorage). No data is transmitted to the website operator for advertising or analytics purposes.',
      privacy_rights: '5. Your rights',
      privacy_rights_text: 'Within the scope of legal requirements, you have the right to information, correction, deletion, restriction of processing and the right to lodge a complaint with a competent supervisory authority.',
      privacy_updated: '6. Last updated',
      privacy_updated_text: 'Last updated: May 2026'
    }
  };

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  function t(key) {
    var pack = I18N[currentLang] || I18N.de;
    return pack[key] != null ? pack[key] : (I18N.de[key] || key);
  }

  function readStoredLanguage() {
    for (var i = 0; i < LANG_STORAGE_KEYS.length; i++) {
      try {
        var stored = localStorage.getItem(LANG_STORAGE_KEYS[i]);
        if (stored && I18N[stored]) return stored;
      } catch (e) {}
    }
    return 'de';
  }

  function persistLanguage(lang) {
    for (var i = 0; i < LANG_STORAGE_KEYS.length; i++) {
      try { localStorage.setItem(LANG_STORAGE_KEYS[i], lang); } catch (e) {}
    }
  }

  function updateLanguageButtons(lang) {
    [].slice.call(document.querySelectorAll('.lang-btn[data-lang]')).forEach(function (btn) {
      var active = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('is-active', active);
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function applyDataI18n(root) {
    root = root || document;
    [].slice.call(root.querySelectorAll('[data-i18n]')).forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (key) el.textContent = t(key);
    });
    [].slice.call(root.querySelectorAll('[data-i18n-aria]')).forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria');
      if (key) el.setAttribute('aria-label', t(key));
    });
  }

  function updateLegalContent(lang) {
    var pack = I18N[lang] || I18N.de;
    [].slice.call(document.querySelectorAll('[data-legal-i18n]')).forEach(function (el) {
      var key = el.getAttribute('data-legal-i18n');
      if (!key) return;
      var value = pack[key];
      if (value != null) {
        el.textContent = value;
      } else {
        console.warn('Missing legal translation', lang, key);
      }
    });
  }

  function updateHeaderLabels() {
    [].slice.call(document.querySelectorAll('[data-nav-link]')).forEach(function (a) {
      var key = a.getAttribute('data-nav-link');
      if (key === 'home') a.textContent = t('nav_home');
      else if (key === 'recipes') a.textContent = t('nav_recipes');
      else if (key === 'favorites') a.textContent = t('nav_favorites');
      else if (key === 'shopping') a.textContent = t('nav_shopping');
      else if (key === 'about') a.textContent = t('nav_about');
      else if (key === 'contact') a.textContent = t('nav_contact');
    });

    var brandSub = document.getElementById('brandSubtitle');
    if (brandSub) brandSub.textContent = t('brand_subtitle');

    var brandLink = document.querySelector('.brand');
    if (brandLink) brandLink.setAttribute('aria-label', t('brand_home_aria'));
  }

  function updateFooterLabels() {
    applyDataI18n();
  }

  function updateActiveNav() {
    var path = window.location.pathname || '';
    var hash = (window.location.hash || '').toLowerCase();

    [].slice.call(document.querySelectorAll('[data-nav-link]')).forEach(function (link) {
      link.classList.remove('is-active');
    });

    if (hash === '#kontakt') {
      var contactLink = document.querySelector('[data-nav-link="contact"]');
      if (contactLink) contactLink.classList.add('is-active');
      return;
    }

    if (path.indexOf('impressum') !== -1) return;
    if (path.indexOf('datenschutz') !== -1) return;

    if (path.indexOf('kontakt') !== -1) {
      var kontaktPageLink = document.querySelector('[data-nav-link="contact"]');
      if (kontaktPageLink) kontaktPageLink.classList.add('is-active');
    }
  }

  function updateActiveFooter() {
    var path = window.location.pathname || '';
    var hash = (window.location.hash || '').toLowerCase();

    [].slice.call(document.querySelectorAll('[data-footer-link]')).forEach(function (link) {
      link.classList.remove('is-active');
    });

    if (path.indexOf('impressum') !== -1) {
      var legalLink = document.querySelector('[data-footer-link="legal"]');
      if (legalLink) legalLink.classList.add('is-active');
    }

    if (path.indexOf('datenschutz') !== -1) {
      var privacyLink = document.querySelector('[data-footer-link="privacy"]');
      if (privacyLink) privacyLink.classList.add('is-active');
    }

    if (hash === '#kontakt') {
      var footerContact = document.querySelector('[data-footer-link="contact"]');
      if (footerContact) footerContact.classList.add('is-active');
    }
  }

  function applyLegalLanguage(lang) {
    if (!I18N[lang]) lang = 'de';
    currentLang = lang;
    persistLanguage(lang);
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);

    updateLanguageButtons(lang);
    updateHeaderLabels();
    updateFooterLabels();
    updateLegalContent(lang);
    updateActiveNav();
    updateActiveFooter();

    var page = document.body.getAttribute('data-legal-page');
    if (page === 'impressum') document.title = t('page_title_impressum');
    if (page === 'privacy') document.title = t('page_title_privacy');
  }

  function scrollToLegalHash(hash) {
    var id = (hash || '').replace(/^#/, '');
    if (!id) return;
    var target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: 'auto', block: 'start' });
  }

  function handleInitialLegalScroll() {
    var path = window.location.pathname || '';
    if (path.indexOf('impressum') === -1 && path.indexOf('datenschutz') === -1) return;

    var hash = (window.location.hash || '').trim();
    if (hash) {
      requestAnimationFrame(function () {
        scrollToLegalHash(hash);
      });
      return;
    }

    requestAnimationFrame(function () {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
  }

  function syncHeaderOffset() {
    var topbar = document.querySelector('.site-topbar');
    if (!topbar) return;
    var h = topbar.offsetHeight;
    if (h > 0) {
      document.documentElement.style.setProperty('--header-offset', h + 'px');
    }
  }

  function initLanguage() {
    applyLegalLanguage(readStoredLanguage());

    var wrap = document.querySelector('.lang-switcher--top');
    if (wrap && wrap.dataset.bound !== '1') {
      wrap.dataset.bound = '1';
      wrap.addEventListener('click', function (e) {
        var b = e.target.closest('button.lang-btn[data-lang]');
        if (!b || !wrap.contains(b)) return;
        e.preventDefault();
        applyLegalLanguage(b.getAttribute('data-lang'));
      });
    }

    syncHeaderOffset();
    handleInitialLegalScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguage);
  } else {
    initLanguage();
  }

  window.addEventListener('load', function () {
    syncHeaderOffset();
    handleInitialLegalScroll();
  });

  window.addEventListener('hashchange', function () {
    updateActiveNav();
    updateActiveFooter();
    handleInitialLegalScroll();
  });

  window.addEventListener('resize', syncHeaderOffset);

  if (typeof ResizeObserver !== 'undefined') {
    var topbarEl = document.querySelector('.site-topbar');
    if (topbarEl) {
      var ro = new ResizeObserver(syncHeaderOffset);
      ro.observe(topbarEl);
    }
  }

})();
