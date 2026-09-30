import { getVisitorId } from './visitorId';

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe('getVisitorId', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('creates a v4 UUID on the first visit and stores it', () => {
    const id = getVisitorId();

    expect(id).toMatch(UUID_V4);
    expect(window.localStorage.getItem('visitorId')).toBe(id);
  });

  it('returns the same id on later visits', () => {
    const first = getVisitorId();

    expect(getVisitorId()).toBe(first);
    expect(getVisitorId()).toBe(first);
  });

  it('reuses an id that was stored earlier', () => {
    window.localStorage.setItem('visitorId', '3f0c1a52-8d7e-4b1a-9c55-2d1f6e7a8b90');

    expect(getVisitorId()).toBe('3f0c1a52-8d7e-4b1a-9c55-2d1f6e7a8b90');
  });

  it.each(['', 'not-a-uuid', '<script>alert(1)</script>', '3f0c1a52-8d7e-1b1a-9c55-2d1f6e7a8b90'])(
    'replaces a tampered or invalid stored value (%j)',
    (stored) => {
      window.localStorage.setItem('visitorId', stored);

      const id = getVisitorId();

      expect(id).toMatch(UUID_V4);
      expect(id).not.toBe(stored);
      expect(window.localStorage.getItem('visitorId')).toBe(id);
    },
  );

  it('returns null when storage cannot be read', () => {
    vi.spyOn(window.localStorage, 'getItem').mockImplementation(() => {
      throw new Error('storage blocked');
    });

    expect(getVisitorId()).toBeNull();
  });

  it('returns null when the id cannot be persisted, so a visit is never counted twice', () => {
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });

    expect(getVisitorId()).toBeNull();
  });

  it('returns null when random UUIDs are unavailable', () => {
    vi.stubGlobal('crypto', {});

    expect(getVisitorId()).toBeNull();
  });
});
