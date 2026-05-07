"use client";

import ProfilePageContent from "@/components/profile/ProfilePageContent";

export default function SuperAdminProfilePage() {
  return (
    <ProfilePageContent 
      userRole="Super Admin" 
      userName="Vraj Darji" 
      userId="SA-0001" 
      userDept="Administration" 
    />
  );
}
