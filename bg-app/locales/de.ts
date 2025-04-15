import type { en } from '~/locales/en'

export const de = {
  languagesGerman: 'Deutsch',
  languagesEnglish: 'Englisch',
  legalNotice: 'Impressum',
  aboutMe: 'Über mich',
  allRightsReserved: 'Alle Rechte vorbehalten von Bastian Ganze',
  impressumTitle: 'Impressum',
  impressumAddress: `<span class="font-bold">Bastian Ganze</span>
        Dinterstraße 28
        04157 Leipzig`,
  impressumContact: `Kontakt
        Telefon: <a aria-label="Anrufen" class="link link-info" href="tel:%{phoneTechnical}">%{phoneVisible}</a>
        E-Mail: <a aria-label="E-Mail senden" class="link link-info" href="mailto:%{email}">%{email}</a>`,
  underConstruction: 'In Arbeit',
  projectGetMoreInfoLink: 'Mehr Infos …',
} satisfies typeof en
