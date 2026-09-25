export interface NavItem {
  num: string;
  label: string;
  href: string;
}

export const NAV: NavItem[] = [
  { num: '01', label: 'Index', href: '/' },
  { num: '02', label: 'Work', href: '/work' },
  { num: '03', label: 'Writing', href: '/writing' },
  { num: '04', label: 'Log', href: '/log' },
  { num: '05', label: 'About', href: '/about' },
  { num: '06', label: 'Now', href: '/now' },
];
