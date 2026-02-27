import { useState, useEffect } from "react";
import { Sidebar, MobileHeader, MobileMenu } from "../components/Sidebar";
import axios from "axios";
import API from "../apis/apis";

// pages
import BookingPage from "./BookingPage";
import TicketsPage from "./TicketsPage";
import ProfilePage from "./ProfilePage";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("booking");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(API.common.verify, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrentUser(res.data.result);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const renderPage = () => {
    switch (activeTab) {
      case "booking":
        return <BookingPage currentUser={currentUser} />;
      case "tickets":
        return <TicketsPage />;
      case "profile":
        return <ProfilePage currentUser={currentUser} />;
      default:
        return <BookingPage currentUser={currentUser} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#161826] text-yellow-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#161826]">
      {/* sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
      />

      {/* mobite top menu bar */}
      <MobileHeader
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* mobile drawer */}
      {mobileMenuOpen && (
        <MobileMenu
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUser={currentUser}
        />
      )}

      {/* main content */}
      <main className="md:ml-64 pt-16 md:pt-0 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 md:px-10 py-8 md:py-10">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
