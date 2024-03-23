import googleLogo from "../../assets/google.png";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  getAuth,
  signInWithRedirect,
} from "firebase/auth";
import { appFireBase } from "../../firebase/firebase.js";
import { useNavigate } from "react-router";
import { useData } from "../../context/userContext.js";
import { useEffect } from "react";

const auth = getAuth(appFireBase);

const GoogleButton: React.FC = () => {
  const { setUserSession } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const displayNameParts = user.displayName
          ? user.displayName.split(" ")
          : [];
        const googleUser = {
          firstName: displayNameParts[0] || "",
          id: user.uid,
          lastName: displayNameParts[1] || "",
          pictureUrl: user.photoURL || "",
        };
        setUserSession(googleUser);
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [auth, setUserSession, navigate]);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();

    try {
      signInWithRedirect(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm flex w-full items-center justify-center">
      <button
        type="submit"
        onClick={googleSignIn}
        className="h-12 flex w-full items-center justify-center bg-white rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm border border-gray-300 hover:bg-green-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-300 transition-colors duration-200 ease-in-out"
      >
        <>
          <img src={googleLogo} alt="Google Logo" className="w-6 h-6 mr-4" />
          Sign in with Google
        </>
      </button>
    </div>
  );
};

export default GoogleButton;
