"use client";

import ProfilePageContent from "@/components/profile/ProfilePageContent";

export default function RadiologyProfilePage() {
  return (
    <ProfilePageContent 
      userRole="Radiologist" 
      userName="Emily Davis" 
      userId="RAD-4091" 
      userDept="Radiology" 
    />
  );
}
