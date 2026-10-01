import {
createContext,
useContext,
useEffect,
useState,
useCallback,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

const STORAGE_KEY = "hms_auth";

export function AuthProvider({ children }) {
const [authState, setAuthState] = useState(null);
const [initializing, setInitializing] = useState(true);

// ============================
// RESTORE LOGIN AFTER REFRESH
// ============================
useEffect(() => {
try {
const stored = localStorage.getItem(STORAGE_KEY);


  if (stored) {
    setAuthState(JSON.parse(stored));
  }
} catch {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("hms_token");
}

setInitializing(false);


}, []);

// ============================
// LOGIN
// ============================
const login = useCallback(
async ({ email, password, role }) => {
try {
const response = await api.post("/auth/login", {
email,
password,
});


    const data = response.data;

    if (!data.success) {
      return {
        success: false,
        message: data.message || "Login failed",
      };
    }

    // ============================
    // CHECK SELECTED ROLE
    // ============================
    if (data.user.role !== role) {
      return {
        success: false,
        message: `This account is registered as ${data.user.role}.`,
      };
    }

    // ============================
    // SAVE JWT
    // ============================
    localStorage.setItem("hms_token", data.token);

    let profile = null;

    // ============================
    // PATIENT PROFILE
    // ============================
    if (data.user.role === "patient") {
      try {
        const profileResponse = await api.get(
          "/patients/profile"
        );

        if (profileResponse.data.success) {
          profile = profileResponse.data.patient;
        }
      } catch (error) {
        console.error(
          "Patient profile could not be loaded:",
          error.response?.data || error.message
        );
      }
    }

    // ============================
    // DOCTOR PROFILE
    // ============================
    if (data.user.role === "doctor") {
      try {
        // First try the logged-in doctor's profile
        const doctorResponse = await api.get(
          "/doctors/profile"
        );

        if (doctorResponse.data.success) {
          profile = doctorResponse.data.doctor;
        }
      } catch (error) {
        console.error(
          "Doctor profile endpoint failed. Trying doctor list...",
          error.response?.data || error.message
        );

        // ============================
        // FALLBACK:
        // GET ALL DOCTORS
        // ============================
        try {
          const doctorsResponse = await api.get(
            "/doctors"
          );

          if (doctorsResponse.data.success) {
            const doctors = doctorsResponse.data.doctors || [];

            const loggedInDoctor = doctors.find((doctor) => {
              const accountId =
                doctor.account_id?._id ||
                doctor.account_id;

              return (
                accountId?.toString() ===
                data.user.id?.toString()
              );
            });

            if (loggedInDoctor) {
              profile = {
                doctor_id: loggedInDoctor._id,
                name: loggedInDoctor.name,
                specialization:
                  loggedInDoctor.specialization,
                department:
                  loggedInDoctor.department,
                phone_no: loggedInDoctor.phone_no,
                account_id: loggedInDoctor.account_id,
              };
            }
          }
        } catch (fallbackError) {
          console.error(
            "Doctor fallback profile loading failed:",
            fallbackError.response?.data ||
              fallbackError.message
          );
        }
      }
    }

    // ============================
    // SAVE AUTH STATE
    // ============================
    const nextState = {
      account: data.user,
      profile,
    };

    setAuthState(nextState);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(nextState)
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error("Login Error:", error);

    localStorage.removeItem("hms_token");
    localStorage.removeItem(STORAGE_KEY);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Unable to connect to the server.",
    };
  }
},
[]


);

// ============================
// REGISTER USER
// ============================
const registerUser = useCallback(
async ({
name,
email,
password,
age,
gender,
address,
phone_no,
role,
specialization,
department,
}) => {
try {
const response = await api.post(
"/auth/register",
{
name,
email,
password,
age,
gender,
address,
phone_no,
role,
specialization,
department,
}
);


    const data = response.data;

    if (!data.success) {
      return {
        success: false,
        message:
          data.message || "Registration failed",
      };
    }

    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Unable to connect to the server.",
    };
  }
},
[]


);

// ============================
// LOGOUT
// ============================
const logout = useCallback(() => {
setAuthState(null);


localStorage.removeItem(STORAGE_KEY);
localStorage.removeItem("hms_token");


}, []);

// ============================
// CONTEXT VALUE
// ============================
const value = {
isAuthenticated: !!authState,
account: authState?.account || null,
profile: authState?.profile || null,
role: authState?.account?.role || null,
initializing,
login,
registerUser,
logout,
};

return (
<AuthContext.Provider value={value}>
{children}
</AuthContext.Provider>
);
}

// ============================
// USE AUTH HOOK
// ============================
export function useAuth() {
const ctx = useContext(AuthContext);

if (!ctx) {
throw new Error(
"useAuth must be used within an AuthProvider"
);
}

return ctx;
}
