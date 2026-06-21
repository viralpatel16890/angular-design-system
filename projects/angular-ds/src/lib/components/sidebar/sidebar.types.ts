export interface SidebarItem {
  id: string;
  label: string;
  icon?: string;       // inline SVG string
  active?: boolean;
  disabled?: boolean;
  badge?: string | number;
  children?: SidebarItem[];
}

export interface SidebarGroup {
  label?: string;      // undefined = no group heading (ungrouped)
  items: SidebarItem[];
}
