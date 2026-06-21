export type TabVariant = 'line' | 'pill';
export type TabSize = 'sm' | 'md' | 'lg';

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  badge?: string | number;
}
