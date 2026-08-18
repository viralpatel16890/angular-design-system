export type PaginationSize = 'sm' | 'md' | 'lg';

/** A single entry in the rendered page list: a page number or an ellipsis marker. */
export type PaginationItem =
  | { type: 'page'; page: number }
  | { type: 'ellipsis'; key: 'start' | 'end' };
