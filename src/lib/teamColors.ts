const NBA: Record<string, string> = {
  ATL: '#E03A3E', BOS: '#007A33', BKN: '#AAAAAA', CHA: '#00788C',
  CHI: '#CE1141', CLE: '#860038', DAL: '#00538C', DEN: '#0E2240',
  DET: '#C8102E', GSW: '#1D428A', HOU: '#CE1141', IND: '#002D62',
  LAC: '#C8102E', LAL: '#552583', MEM: '#5D76A9', MIA: '#98002E',
  MIL: '#00471B', MIN: '#0C2340', NOP: '#0C2340', NYK: '#006BB6',
  OKC: '#007AC1', ORL: '#0077C0', PHI: '#006BB6', PHX: '#E56020',
  POR: '#E03A3E', SAC: '#5A2D81', SAS: '#8A9DB8', TOR: '#CE1141',
  UTA: '#002B5C', WAS: '#E31837',
}

const NFL: Record<string, string> = {
  ARI: '#97233F', ATL: '#A71930', BAL: '#241773', BUF: '#00338D',
  CAR: '#0085CA', CHI: '#0B162A', CIN: '#FB4F14', CLE: '#FF3C00',
  DAL: '#003594', DEN: '#FB4F14', DET: '#0076B6', GB:  '#203731',
  HOU: '#03202F', IND: '#002C5F', JAX: '#006778', KC:  '#E31837',
  LA:  '#003594', LAC: '#0080C6', LV:  '#A5ACAF', MIA: '#008E97',
  MIN: '#4F2683', NE:  '#002244', NO:  '#B3995D', NYG: '#0B2265',
  NYJ: '#125740', PHI: '#004C54', PIT: '#FFB612', SEA: '#002244',
  SF:  '#AA0000', TB:  '#D50A0A', TEN: '#0C2340', WAS: '#5A1414',
}

export function teamColor(abbreviation: string, league: 'NBA' | 'NFL'): string {
  const map = league === 'NBA' ? NBA : NFL
  return map[abbreviation.toUpperCase()] ?? '#334155'
}
