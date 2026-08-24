import { Container } from "@/components/layout/container";
import { AccountPage } from "@/components/account/account-page";

import type {
  Metadata,
} from "next";

export const metadata: Metadata = {
  title: "My Account",

  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <main className="bg-[#f8f8fb] py-6 sm:py-10">
      <Container>
        <AccountPage />
      </Container>
    </main>
  );
}