"use client";

import ProfilePageContent from "@/components/profile/ProfilePageContent";

export default function StaffProfilePage() {
  return (
    <ProfilePageContent 
      userRole="Staff" 
      userName="Nurse Emma" 
      userId="ST-4029" 
      userDept="Nursing" 
    />
  );
}
