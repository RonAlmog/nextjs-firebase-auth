import type { NextPage } from "next";
import Link from "next/link";
import { initFirebase } from "../firebase/firebaseApp";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  initFirebase();
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const signIn = async () => {
    const result = await signInWithPopup(auth, provider);
    // console.log(result.user);
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (user) {
    router.push("/dashboard");
  }
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
