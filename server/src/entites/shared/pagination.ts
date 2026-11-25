/** Clamp `first` (default 20, max 100). */
export function pageSize(first?: number | null) {
  return Math.min(Math.max(first ?? 20, 1), 100);
}

/** Build a connection from `limit + 1` rows. Cursor defaults to `id`. */
export function paginate<T>(
  rows: T[],
  first: number,
  cursor: (row: T) => string = (row) => (row as { id: string }).id,
) {
  const hasNextPage = rows.length > first;
  const nodes = hasNextPage ? rows.slice(0, first) : rows;
  const edges = nodes.map((node) => ({ cursor: cursor(node), node }));
  return {
    edges,
    pageInfo: {
      hasNextPage,
      endCursor: edges.at(-1)?.cursor ?? null,
    },
  };
}
