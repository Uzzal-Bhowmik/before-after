import { getBackendBaseUrl } from "@/config/envConfig";
import SellerProfileContainer from "./_components/SellerProfileContainer";

export async function generateMetadata({ params }) {
  const id = (await params).id;

  const sellerProfileRes = await fetch(getBackendBaseUrl() + `/users/${id}`);
  const sellerProfile = await sellerProfileRes.json();

  return {
    title: sellerProfile?.data?.name + " - " + sellerProfile?.data?.serviceType,
    description: "Profile page of " + sellerProfile?.data?.name,
  };
}
export default async function SellerProfilePage({ params }) {
  const { id } = await params;

  return <SellerProfileContainer id={id} />;
}
