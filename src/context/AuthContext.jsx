import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { accounts } from "../data/mock/accounts";
import { patients } from "../data/mock/patients";
import { doctors } from "../data/mock/doctors";
import { admins } from "../data/mock/admins";

const AuthContext = createContext(null);

const STORAGE_KEY = "hms_auth";

function getProfileForAccount(account) {
  if (!account) return null;

  if (account.role === "patient") {
    return patients.find(
      (p) => p.account_id === account.account_id
    );
  }

  if (account.role === "doctor") {
    return doctors.find(
      (d) => d.account_id === account.account_id
    );
  }

  if (account.role === "admin") {
    return admins.find(
      (a) => a.account_id === account.account_id
    );
  }

  return null;
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Restore login session
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        setAuthState(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }

    setInitializing(false);
  }, []);

  // Login
  const login = useCallback(
    ({ email, password, role }) => {
      const account = accounts.find(
        (a) =>
          a.email.toLowerCase() === email.toLowerCase() &&
          a.role === role
      );

      if (!account) {
        return {
          success: false,
          message:
            "No account found for this email and role.",
        };
      }

      // Mock authentication only
      if (account.password !== password) {
        return {
          success: false,
          message: "Incorrect password.",
        };
      }

      const profile = getProfileForAccount(account);

      const nextState = {
        account,
        profile,
      };

      setAuthState(nextState);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(nextState)
      );

      localStorage.setItem(
        "hms_token",
        `mock-token-${account.account_id}`
      );

      return {
        success: true,
      };
    },
    []
  );

  // Patient registration
  const registerPatient = useCallback(
    ({
      name,
      email,
      password,
      age,
      gender,
      address,
      phone_no,
    }) => {
      const existing = accounts.find(
        (a) =>
          a.email.toLowerCase() === email.toLowerCase()
      );

      if (existing) {
        return {
          success: false,
          message:
            "An account with this email already exists.",
        };
      }

      const account_id = accounts.length
        ? Math.max(
            ...accounts.map((a) => a.account_id)
          ) + 1
        : 1;

      const patient_id = patients.length
        ? Math.max(
            ...patients.map((p) => p.patient_id)
          ) + 1
        : 1;

      const newAccount = {
        account_id,
        email,
        password,
        role: "patient",
      };

      const newPatient = {
        patient_id,
        name,
        age,
        gender,
        address,
        phone_no,
        account_id,
      };

      // Mock data only
      accounts.push(newAccount);
      patients.push(newPatient);

      const nextState = {
        account: newAccount,
        profile: newPatient,
      };

      setAuthState(nextState);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(nextState)
      );

      localStorage.setItem(
        "hms_token",
        `mock-token-${newAccount.account_id}`
      );

      return {
        success: true,
      };
    },
    []
  );

  // Logout
  const logout = useCallback(() => {
    setAuthState(null);

    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("hms_token");
  }, []);

  const value = {
    isAuthenticated: !!authState,
    account: authState?.account || null,
    profile: authState?.profile || null,
    role: authState?.account?.role || null,
    initializing,
    login,
    registerPatient,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return ctx;
}