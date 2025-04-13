import DashboardNavbar from "@/layouts/DashboardNavbar";
import ProfileSection from "./Components/ProfileSection";
import BadgesSection from "./Components/BadgesSection";
import ReportsSection from "./Components/ReportsSection";
import StatisticsSections from "./Components/StatisticsSections";
import FeedbackSection from "./Components/FeedbackSection";
import FavoritesRoutesSection from "./Components/FavoritesRoutesSection";
import RideHistorySection from "./Components/RideHistorySection";

export default function ProfilePage() {
  return (
    <>
      <DashboardNavbar />
      <div className="p-8 md:p-24 text-white space-y-8 bg-gray-900 min-h-screen">
        <ProfileSection />
        <BadgesSection />
        <FavoritesRoutesSection />
        <StatisticsSections />
        <RideHistorySection/>
        <ReportsSection />
        <FeedbackSection/>
      </div>
    </>
  );
}
