import DashboardNavbar from "@/layouts/DashboardNavbar";
import ProfileSection from "./Components/ProfileSection";
import BadgesSection from "./Components/BadgesSection";
import ReportsSection from "./Components/ReportsSection";
import PreferencesSection from "./Components/PreferencesSection";
import FeedbackSection from "./Components/FeedbackSection";

export default function ProfilePage() {
  return (
    <>
      <DashboardNavbar />
      <div className="p-6 text-white space-y-8 bg-gray-900 min-h-screen">
        <ProfileSection />
        <BadgesSection />
        <ReportsSection />
        <PreferencesSection />
        <FeedbackSection/>
      </div>
    </>
  );
}
