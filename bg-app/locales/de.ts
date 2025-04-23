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
  gameBoardNoGameActive: 'Kein aktives Spiel',
  gameBoardWaitingForOpponent: 'Warten auf den Gegner …',
  gameBoardYourTurn: 'Dein Zug',
  gameBoardOpponentTurn: 'Zug des Gegners',
  gameBoardPlayAgainstBotButton: 'Gegen Bot spielen',
  gameBoardPlayButton: 'Spielen',
  gameBoardPlayAgainButton: 'Nochmal spielen',
  gameBoardOpponentOfflineText: 'Der Gegner ist offline! Du kannst warten, bis er zurückkommt, oder ein anderes Spiel beitreten, aber es wird keinen Gewinner oder Verlierer in diesem Spiel geben.',
  gameBoardAbandonGameButton: 'Spiel abbrechen',
  gameBoardScoreLabel: 'Score',
  gameBoardGameEnded: 'Das Spiel ist beendet',
  gameBoardOutcomeWin: 'Du hast gewonnen!',
  gameBoardOutcomeLose: 'Du hast verloren!',
  gameBoardOutcomeDraw: 'Das Spiel endet unentschieden!',
} satisfies typeof en
