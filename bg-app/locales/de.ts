import type { en } from '~/locales/en'

export const de = {
  languagesGerman: 'Deutsch',
  languagesEnglish: 'Englisch',
  legalNotice: 'Impressum',
  contact: 'Kontakt',
  allRightsReserved: 'Alle Rechte vorbehalten von Bastian Ganze',
  impressumTitle: 'Impressum',
  impressumAddress: `<span class="font-bold">Bastian Ganze</span>
        Dinterstraße 28
        04157 Leipzig`,
  impressumContact: `Kontakt
        Telefon: <a class="link link-info" href="tel:%{phoneTechnical}">%{phoneVisible}</a>
        E-Mail: <a class="link link-info" href="mailto:%{email}">%{email}</a>`,
} satisfies typeof en
