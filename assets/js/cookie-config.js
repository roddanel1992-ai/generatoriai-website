/*!
 * Cookie Consent configuration for tavogeneratorius.lt
 * Supports LT / EN / RU based on <html lang="..."> attribute
 *
 * Categories:
 *  - necessary  (always on, no consent required)
 *  - analytics  (Google Analytics – currently disabled in code)
 *  - functional (YouTube embeds, etc.)
 */
(function () {
	'use strict';

	// Define the public helper FIRST so that footer / policy-page links work
	// even if something else goes wrong below.
	window.openCookieSettings = function (e) {
		if (e && e.preventDefault) e.preventDefault();
		if (window.CookieConsent && typeof window.CookieConsent.showPreferences === 'function') {
			window.CookieConsent.showPreferences();
		} else {
			console.warn('[cookie-config] CookieConsent not ready yet');
			// Retry once the library finishes loading
			var tries = 0;
			var iv = setInterval(function () {
				tries++;
				if (window.CookieConsent && typeof window.CookieConsent.showPreferences === 'function') {
					clearInterval(iv);
					window.CookieConsent.showPreferences();
				} else if (tries > 20) {
					clearInterval(iv);
					console.error('[cookie-config] CookieConsent library failed to load');
				}
			}, 100);
		}
		return false;
	};

	if (typeof CookieConsent === 'undefined') {
		console.warn('[cookie-config] CookieConsent library not yet defined; openCookieSettings still bound for later.');
		return;
	}

	// Detect site language from <html lang="...">
	var lang = (document.documentElement.lang || 'lt').toLowerCase().split('-')[0];
	if (['lt', 'en', 'ru'].indexOf(lang) === -1) lang = 'lt';

	// Path prefix for policy pages depending on language and depth
	var path = window.location.pathname;
	var depth = (path.match(/\//g) || []).length - 1;
	var inSubdir = /\/(en|ru)\//.test(path);
	var inServices = /\/paslaugos\//.test(path);

	var prefix = '';
	if (inServices && inSubdir) prefix = '../../' + lang + '/';
	else if (inServices) prefix = '../';
	else if (inSubdir) prefix = '';
	else prefix = '';

	function policyUrl(slug) {
		if (lang === 'lt') {
			return (inServices ? '../' : '') + slug + '.html';
		}
		return (inServices ? '../../' + lang + '/' : '') + slug + '.html';
	}

	var privacySlug = lang === 'lt' ? 'privatumo-politika' : (lang === 'en' ? 'privacy-policy' : 'politika-konfidencialnosti');
	var cookiesSlug = lang === 'lt' ? 'slapuku-politika' : (lang === 'en' ? 'cookies-policy' : 'politika-cookies');

	var privacyHref = policyUrl(privacySlug);
	var cookiesHref = policyUrl(cookiesSlug);

	CookieConsent.run({
		guiOptions: {
			consentModal: {
				layout: 'box inline',
				position: 'bottom right',
				equalWeightButtons: true,
				flipButtons: false
			},
			preferencesModal: {
				layout: 'box',
				position: 'right',
				equalWeightButtons: true,
				flipButtons: false
			}
		},

		categories: {
			necessary: {
				readOnly: true,
				enabled: true
			},
			analytics: {
				autoClear: {
					cookies: [
						{ name: /^_ga/ },
						{ name: '_gid' },
						{ name: '_gat' }
					]
				}
			},
			functional: {}
		},

		language: {
			default: lang,
			autoDetect: 'document',
			translations: {
				lt: {
					consentModal: {
						title: 'Mes naudojame slapukus 🍪',
						description: 'Šioje svetainėje naudojame slapukus, kad pagerintume Jūsų naršymo patirtį ir analizuotume lankomumą. Būtini slapukai įjungti visada, kitus galite priimti arba atmesti. Daugiau informacijos – <a href="' + cookiesHref + '" target="_self">slapukų politikoje</a>.',
						acceptAllBtn: 'Sutinku su visais',
						acceptNecessaryBtn: 'Atmesti viską',
						showPreferencesBtn: 'Nustatymai',
						footer: '<a href="' + privacyHref + '">Privatumo politika</a>\n<a href="' + cookiesHref + '">Slapukų politika</a>'
					},
					preferencesModal: {
						title: 'Slapukų nustatymai',
						acceptAllBtn: 'Sutinku su visais',
						acceptNecessaryBtn: 'Atmesti viską',
						savePreferencesBtn: 'Išsaugoti nustatymus',
						closeIconLabel: 'Uždaryti',
						sections: [
							{
								title: 'Slapukų naudojimas',
								description: 'Naudojame slapukus, kad svetainė veiktų sklandžiai ir kad galėtume tobulinti jos turinį. Galite valdyti, kokias slapukų kategorijas priimate. Daugiau – <a href="' + cookiesHref + '">slapukų politikoje</a> ir <a href="' + privacyHref + '">privatumo politikoje</a>.'
							},
							{
								title: 'Būtini slapukai <span class="pm__badge">Visada įjungti</span>',
								description: 'Šie slapukai reikalingi svetainės techniniam veikimui (kalbos pasirinkimui, sesijai, apsaugai nuo botų). Be jų svetainė neveiks tinkamai.',
								linkedCategory: 'necessary'
							},
							{
								title: 'Statistiniai slapukai',
								description: 'Padeda mums suprasti, kaip lankytojai naudojasi svetaine (puslapių peržiūros, šaltinis, įrenginys). Duomenys naudojami anoniminiu suvestiniu pavidalu.',
								linkedCategory: 'analytics'
							},
							{
								title: 'Funkciniai slapukai',
								description: 'Įgalina papildomas funkcijas, pvz., YouTube video peržiūrą. Šie tretinių šalių slapukai nustatomi tik gavus Jūsų sutikimą.',
								linkedCategory: 'functional'
							},
							{
								title: 'Daugiau informacijos',
								description: 'Klausimų dėl slapukų ar duomenų apsaugos – <a href="mailto:tavogeneratorius@gmail.com">tavogeneratorius@gmail.com</a>.'
							}
						]
					}
				},
				en: {
					consentModal: {
						title: 'We use cookies 🍪',
						description: 'This website uses cookies to improve your browsing experience and analyse traffic. Necessary cookies are always on; you can accept or reject the others. More info in our <a href="' + cookiesHref + '" target="_self">cookies policy</a>.',
						acceptAllBtn: 'Accept all',
						acceptNecessaryBtn: 'Reject all',
						showPreferencesBtn: 'Settings',
						footer: '<a href="' + privacyHref + '">Privacy Policy</a>\n<a href="' + cookiesHref + '">Cookies Policy</a>'
					},
					preferencesModal: {
						title: 'Cookie settings',
						acceptAllBtn: 'Accept all',
						acceptNecessaryBtn: 'Reject all',
						savePreferencesBtn: 'Save settings',
						closeIconLabel: 'Close',
						sections: [
							{
								title: 'Cookie usage',
								description: 'We use cookies to ensure the site works correctly and to improve content. You can manage which categories you accept. More – <a href="' + cookiesHref + '">cookies policy</a> and <a href="' + privacyHref + '">privacy policy</a>.'
							},
							{
								title: 'Strictly necessary <span class="pm__badge">Always on</span>',
								description: 'Required for the technical operation of the website (language selection, session, bot protection). Without them the site will not function properly.',
								linkedCategory: 'necessary'
							},
							{
								title: 'Analytics cookies',
								description: 'Help us understand how visitors use the website (page views, source, device). Data is used in anonymous aggregate form.',
								linkedCategory: 'analytics'
							},
							{
								title: 'Functional cookies',
								description: 'Enable additional features such as YouTube video playback. These third-party cookies are set only with your consent.',
								linkedCategory: 'functional'
							},
							{
								title: 'More information',
								description: 'Questions about cookies or data protection – <a href="mailto:tavogeneratorius@gmail.com">tavogeneratorius@gmail.com</a>.'
							}
						]
					}
				},
				ru: {
					consentModal: {
						title: 'Мы используем файлы cookie 🍪',
						description: 'Этот сайт использует файлы cookie для улучшения работы и анализа посещаемости. Необходимые cookie включены всегда, остальные вы можете принять или отклонить. Подробнее – <a href="' + cookiesHref + '" target="_self">политика cookie</a>.',
						acceptAllBtn: 'Принять все',
						acceptNecessaryBtn: 'Отклонить все',
						showPreferencesBtn: 'Настройки',
						footer: '<a href="' + privacyHref + '">Политика конфиденциальности</a>\n<a href="' + cookiesHref + '">Политика cookie</a>'
					},
					preferencesModal: {
						title: 'Настройки cookie',
						acceptAllBtn: 'Принять все',
						acceptNecessaryBtn: 'Отклонить все',
						savePreferencesBtn: 'Сохранить настройки',
						closeIconLabel: 'Закрыть',
						sections: [
							{
								title: 'Использование cookie',
								description: 'Мы используем cookie для корректной работы сайта и улучшения контента. Вы можете управлять категориями. Подробнее – <a href="' + cookiesHref + '">политика cookie</a> и <a href="' + privacyHref + '">политика конфиденциальности</a>.'
							},
							{
								title: 'Необходимые <span class="pm__badge">Всегда включены</span>',
								description: 'Требуются для технической работы сайта (выбор языка, сессия, защита от ботов). Без них сайт не будет работать корректно.',
								linkedCategory: 'necessary'
							},
							{
								title: 'Статистические cookie',
								description: 'Помогают понять, как посетители используют сайт (просмотры, источник, устройство). Данные используются в анонимном агрегированном виде.',
								linkedCategory: 'analytics'
							},
							{
								title: 'Функциональные cookie',
								description: 'Включают дополнительные возможности, например, воспроизведение YouTube видео. Эти cookie третьих сторон устанавливаются только с вашего согласия.',
								linkedCategory: 'functional'
							},
							{
								title: 'Дополнительная информация',
								description: 'Вопросы о cookie или защите данных – <a href="mailto:tavogeneratorius@gmail.com">tavogeneratorius@gmail.com</a>.'
							}
						]
					}
				}
			}
		},

		onConsent: function (cookie) {
			// Google Consent Mode v2 update (active only when gtag is loaded)
			if (typeof gtag === 'function') {
				gtag('consent', 'update', {
					ad_storage: 'denied',
					ad_user_data: 'denied',
					ad_personalization: 'denied',
					analytics_storage: CookieConsent.acceptedCategory('analytics') ? 'granted' : 'denied',
					functionality_storage: CookieConsent.acceptedCategory('functional') ? 'granted' : 'denied',
					security_storage: 'granted'
				});
			}
		},

		onChange: function (cookie, changedCategories) {
			if (typeof gtag === 'function') {
				gtag('consent', 'update', {
					analytics_storage: CookieConsent.acceptedCategory('analytics') ? 'granted' : 'denied',
					functionality_storage: CookieConsent.acceptedCategory('functional') ? 'granted' : 'denied'
				});
			}
		}
	});

})();
