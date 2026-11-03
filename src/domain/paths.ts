export const basePath = '/erdenvaux-bags-next';
export const site = 'https://khalilbenali1.github.io';
export const asset = (path: string) => `${basePath}/${path.replace(/^\//, '')}`;
export const absoluteUrl = (path = '') => `${site}${asset(path)}`;
