import type { NextPage } from "next";
import Link from "next/link";
import { initFirebase } from "../firebase/firebaseApp";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { sign } from "crypto";
import { useAuthState } from "react-firebase-hooks/auth";

const Home: NextPage = () => {
  const app = initFirebase();
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  const signIn = async () => {
    const result = await signInWithPopup(auth, provider);
    console.log(result.user);
  };

  console.log("app", app);
  return (
    <div className="text-center flex flex-col gap-4 items-center">
      <div>Please sign in to continue</div>
      <Link href="/dashboard">
        <a
          onClick={signIn}
          className="bg-blue-600 text-white rounded-md p-2 w-48"
        >
          Sign In
        </a>
      </Link>
    </div>
  );
};

export default Home;
