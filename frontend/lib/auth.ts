const TOKEN_KEY = 'access_token';
const USER_KEY = 'user_info';

export const authStorage = {
  setToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    document.cookie = `access_token=${token}; path=/; max-age=86400`;
  },

  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),

  setUser: (user: object) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  getUser: () => {
    const u = localStorage.getItem(USER_KEY);
    return u ? JSON.parse(u) : null;
  },

  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    document.cookie = 'access_token=; path=/; max-age=0';
  },
};
