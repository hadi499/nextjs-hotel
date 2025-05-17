import { Metadata } from "next";
import { Suspense } from "react";
import HeaderSection from "@/components/header-section";
import Main from "@/components/main";
import RoomSkeleton from "@/components/skeletons/room-skeleton";

export const metadata: Metadata = {
  title: "Rooms & Rates",
  description: "Choese your best room today",
};
const RoomPage = () => {
  return (
    <div>
      <HeaderSection
        title="Rooms & Rates"
        subTitle="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
      />
      <Suspense fallback={<RoomSkeleton />}>
        <Main />
      </Suspense>
    </div>
  );
};

export default RoomPage;
