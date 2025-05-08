const URL = "https://1557161b11d7db8e5bc5d84a492e2a9d.serveo.net/";
import axios, { AxiosError } from "axios";
import { ChatMessages, UserDetail, UserInList } from "./type";

type UserLogin = {
  password: string;
  email: string;
};

type UserSignup = {
  username: string;
  password: string;
  email: string;
};

interface ErrorResponse {
  message?: string;
}

export async function loginUser(currUser: UserLogin): Promise<boolean> {
  try {
    const res = await axios.post(`${URL}auth/login/admin`, currUser, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(res.data);

    localStorage.setItem("user_id", res.data.id);
    localStorage.setItem("access_token", res.data.access_token);
    localStorage.setItem("refresh_token", res.data.refresh_token);
    return true;
  } catch (err: unknown) {
    const error = err as AxiosError<ErrorResponse>;
    alert(error.response?.data?.message || "Login failed");
    return false;
  }
}

export async function deactivateUser(
  id: number,
  retried = false
): Promise<void> {
  try {
    await axios.delete(`${URL}users/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
  } catch (error: unknown) {
    const err = error as AxiosError<ErrorResponse>;
    if (err.response?.status === 401 && !retried) {
      const refreshed = await refreshingToken();
      if (refreshed) {
        return deactivateUser(id, true);
      } else {
        return;
      }
    }
    alert(err.response?.data?.message || "Ban failed");
  }
}

export async function signupUser(currUser: UserSignup): Promise<boolean> {
  try {
    const res = await axios.post(`${URL}auth/register`, currUser, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    localStorage.setItem("user_id", res.data.id);
    localStorage.setItem("access_token", res.data.access_token);
    localStorage.setItem("refresh_token", res.data.refresh_token);
    return true;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    alert(err.response?.data?.message || "Signup failed");
    return false;
  }
}

export async function refreshingToken(): Promise<boolean> {
  try {
    const res = await axios.post(`${URL}auth/refresh-token`, {
      refreshToken: localStorage.getItem("refresh_token"),
    });

    localStorage.setItem("access_token", res.data.access_token);
    return true;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    alert(err.response?.data?.message || "Failed to refresh token");
    logout();
    return false;
  }
}

export async function changeRoleUser(
  id: number,
  role: boolean,
  retried = false
): Promise<void> {
  try {
    await axios.patch(
      `${URL}users/${id}`,
      {
        role: role,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    if (err.response?.status === 401 && !retried) {
      const refreshed = await refreshingToken();
      if (refreshed) {
        return changeRoleUser(id, role, true);
      } else {
        return;
      }
    }
    alert(err.response?.data?.message || "Change role failed");
  }
}

export async function getUsers(
  id: number,
  retried = false
): Promise<UserDetail | undefined> {
  try {
    const res = await axios.get(`${URL}users/${id}`, {
      headers: {
        "ngrok-skip-browser-warning": true,
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    return res.data;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    if (err.response?.status === 401 && !retried) {
      const refreshed = await refreshingToken();
      if (refreshed) {
        return getUsers(id, true);
      } else {
        return;
      }
    }
  }
}

export function logout() {
  localStorage.removeItem("access_token");
  window.location.replace("/");
}

export async function getUserMessages(
  id: number,
  retried = false
): Promise<ChatMessages | undefined> {
  try {
    const res = await axios.get(`${URL}chat/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    return res.data;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    if (err.response?.status === 401 && !retried) {
      const refreshed = await refreshingToken();
      if (refreshed) {
        return getUserMessages(id, true);
      } else {
        return;
      }
    }
  }
}

export async function getUsersList(
  retried = false
): Promise<UserInList[] | undefined> {
  try {
    const res = await axios.get(`${URL}users`, {
      headers: {
        "ngrok-skip-browser-warning": true,
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    return res.data;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    if (err.response?.status === 401 && !retried) {
      const refreshed = await refreshingToken();
      if (refreshed) {
        return getUsersList(true);
      } else {
        return;
      }
    }
    alert(err.response?.data?.message || "Get all users failed");
  }
}
