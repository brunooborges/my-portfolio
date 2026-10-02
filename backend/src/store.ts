/** Persistence contract for the visitor counter. */
export interface VisitorStore {
  /**
   * Registers a visitor. Resolves `true` when this visitor is new (and was
   * counted), `false` when they had already been counted.
   */
  recordVisit: (visitorId: string) => Promise<boolean>;
  /** Total number of unique visitors counted so far. */
  getCount: () => Promise<number>;
}
