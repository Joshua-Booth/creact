const API_ROOT_URL = import.meta.env.VITE_API_ROOT_URL || '';

export async function fetchUserFromApi(token: string) {
  const response = await fetch(`${API_ROOT_URL}auth/user/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
}
