import { apiSlice } from './apiSlice';

const USERS_STORAGE_KEY = 'users';

const getStoredUsers = () => {
  try {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    return storedUsers ? JSON.parse(storedUsers) : [];
  } catch (error) {
    localStorage.removeItem(USERS_STORAGE_KEY);
    return [];
  }
};

const saveStoredUsers = (users) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      queryFn: async ({ email, password }) => {
        const users = getStoredUsers();
        const user = users.find(
          (item) => item.email === email && item.password === password
        );

        if (!user) {
          return {
            error: {
              data: {
                message: 'Email ili lozinka nisu ispravni.',
              },
            },
          };
        }

        const { password: _password, ...userInfo } = user;

        return { data: userInfo };
      },
    }),
    register: builder.mutation({
      queryFn: async (data) => {
        const users = getStoredUsers();
        const userExists = users.some((user) => user.email === data.email);

        if (userExists) {
          return {
            error: {
              data: {
                message: 'Korisnik sa ovom email adresom vec postoji.',
              },
            },
          };
        }

        const newUser = {
          _id: Date.now().toString(),
          isAdmin: false,
          ...data,
        };

        saveStoredUsers([...users, newUser]);

        const { password: _password, ...userInfo } = newUser;

        return { data: userInfo };
      },
    }),
    logout: builder.mutation({
      queryFn: async () => ({ data: {} }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useRegisterMutation } =
  usersApiSlice;
