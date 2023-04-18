import type { NextPage } from "next";
import { faker } from "@faker-js/faker";
import Item, { ItemProps } from "../components/item";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import cert from "../firebase/cert";

const Dashboard: NextPage = () => {
  const [itemData, setItemData] = useState<ItemProps[]>([]);
  const userName: string = "Blah";
  const auth = getAuth();
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  // Generate some fake items.
  useEffect(() => {
    const items: ItemProps[] = [];
    for (let i = 0; i < 3; i++) {
      items.push({
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
        seller: faker.name.findName(),
      });
    }
    setItemData(items);
  }, []);

  const itemElements = [];
  for (let i = 0; i < itemData.length; i++) {
    const item = <Item key={i} {...itemData[i]} />;
    itemElements.push(item);
  }

  const callApi = async () => {
    const token = await user?.getIdToken();
    console.log(token);
    const echoEndpoint: string = "https://jwtecho.pixegami.io";
    const certStr: string = cert;
    console.log("cert", cert);
    const encodedCertStr = encodeURIComponent(certStr);
    const audience: string = "origami-store-a8de3";
    const verficatonEndpoint: string = `${echoEndpoint}/verify?audience=${audience}&cert_str=${encodedCertStr}`;
    const requestInfo = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(verficatonEndpoint, requestInfo);
    const responseBody = await response.json();
    console.log("body", responseBody);
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    router.push("/");
    return <div>Please sign in to continue</div>;
  }
  return (
    <div>
      <div className="text-left mb-6 text-sm bg-sky-100 p-3">
        <div className="mb-1 text-blue-500">Signed in as: {userName}</div>
        <Link href="/" className="hover:underline">
          <a onClick={() => auth.signOut()} href="/">
            Sign Out
          </a>
        </Link>
      </div>
      <div className="text-center flex flex-col gap-6 items-center">
        {itemElements}
      </div>
      <div className="mt-8 w-full flex">
        <button
          onClick={callApi}
          className="text-center bg-blue-600 text-white rounded-md p-2 w-48"
        >
          Add Item
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
