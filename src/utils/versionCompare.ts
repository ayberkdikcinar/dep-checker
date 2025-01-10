function versionCompare(versionA: string, versionB: string): number {
  const normalize = (ver: string) => ver.split('.').map(Number);
  const [a, b] = [normalize(versionA), normalize(versionB)];

  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const diff = (a[i] || 0) - (b[i] || 0);
    if (diff !== 0) return diff > 0 ? 1 : -1;
  }
  return 0;
}

export { versionCompare };
