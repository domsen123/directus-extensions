<script lang="ts" setup>
import 'vanilla-cookieconsent'
import 'vanilla-cookieconsent/dist/cookieconsent.css'

useHead({
  templateParams: {
    site: 'holzbau-erbach.de',
    separator: '-',
  },
  title: 'Willkommen bei den Erbacher Holzbauprofis!',
  titleTemplate: '%s %separator %site',
  meta: [
    { name: 'description', content: 'Die Erbacher Holzbauprofis!' },
    { name: 'keywords', content: 'Zimmerei, Energiesparhäuser, Zimmererarbeiten, Montagebau, Holzbau, Dachdeckung, Neubau, Dachsanierung, Komplettsanierung, Innenausbau, Treppenbau, Gewerbebau, Kommunalbau, Wintergarten' },
    { name: 'og:title', content: 'Holzbau Erbach' },
    { name: 'og:description', content: 'Die Erbacher Holzbauprofis!' },
    { name: 'og:url', content: 'https://holzbau-erbach.de' },
    { name: 'og:image', content: 'https://holzbau-erbach.de/img/ogimg.webp' },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: () => '/favicon.svg',
    },
  ],
})

onMounted(() => {
  const cookieConsent = initCookieConsent()

  cookieConsent.run({
    current_lang: 'de',
    force_consent: true,
    autoclear_cookies: false, // default: false
    page_scripts: true, // default: false

    onFirstAction(user_preferences, cookie) {
      console.log(user_preferences, cookie)
    },

    onAccept(cookie) {
      console.log(cookie)
    },

    onChange(cookie, changed_preferences) {
      console.log(cookie, changed_preferences)
    },
    gui_options: {
      consent_modal: {
        layout: 'cloud',
        position: 'bottom center',
        transition: 'slide',
        swap_buttons: false,
      },
      settings_modal: {
        layout: 'box',
        transition: 'slide',
      },
    },
    languages: {
      de: {
        consent_modal: {
          title: 'Wir verwenden cookies!',
          description: 'Diese Website verwendet Cookies, um ihre ordnungsgemäße Funktion sicherzustellen, sowie Tracking-Cookies um zu analysieren, wie die Website verwendet wird. Letztere werden nur nach Ihrer Zustimmung gesetzt. <button type="button" data-cc="c-settings" class="cc-link">Cookies auswählen</button>',
          primary_btn: {
            text: 'Alle akzeptieren',
            role: 'accept_all',
          },
          secondary_btn: {
            text: 'Einstellungen',
            role: 'settings',
          },
        },
        settings_modal: {
          title: 'Cookie Einstellungen',
          save_settings_btn: 'Einstellungen speichern',
          accept_all_btn: 'Alle akzeptieren',
          reject_all_btn: 'Alle ablehnen',
          close_btn_label: 'Schließen',
          cookie_table_headers: [
            { col1: 'Name' },
            { col2: 'Domain' },
            { col3: 'Verfallsdatum' },
            { col4: 'Beschreibung' },
          ],
          blocks: [
            {
              title: 'Verwendung von Cookies 📢',
              description: 'Wir verwenden Cookies, um grundlegende Funktionen der Website bereitzustellen und Ihr Online-Erlebnis zu verbessern. Für jede Kategorie können Sie sich entscheiden, ob Sie sie verwenden möchten oder nicht. Für weitere Einzelheiten über Cookies und andere sensible Daten lesen Sie bitte die vollständige <a href="/datenschutz" class="cc-link">Datenschutzerklärung</a>.',
            },
            {
              title: 'Notwendige Cookies',
              description: 'Diese Cookies sind für das ordnungsgemäße Funktionieren dieser Website unerlässlich. Ohne diese Cookies würde die Website nicht richtig funktionieren',
              toggle: {
                value: 'necessary',
                enabled: true,
                readonly: true,
              },
            },
            {
              title: 'Analytische Cookies',
              description: 'Diese Cookies sammeln Informationen darüber, wie Sie die Website nutzen, welche Seiten Sie besuchen und welche Links Sie angeklickt haben. Alle Daten sind anonymisiert und können nicht verwendet werden, um Sie zu identifizieren',
              toggle: {
                value: 'targeting',
                enabled: false,
                readonly: false,
              },
            },
            {
              title: 'Weitere Informationen',
              description: 'Wenn Sie Fragen zu unserer Cookie-Politik und Ihren Wahlmöglichkeiten haben, wenden Sie sich bitte an unseren <a class="cc-link" href="/impressum">Kontakt</a>.',
            },
          ],
        },
      },
    },
  })
})
</script>

<template>
  <router-view />
</template>
