import ptBR from '../class/pt-BR';

export function recoveryI18nStrings(code: string): IAppI18n {
  switch (code) {
    case 'pt-BR':
      return ptBR;
    default:
      return ptBR;
  }
}
