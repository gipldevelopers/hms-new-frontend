"use client";

import ProfilePageContent from "@/components/profile/ProfilePageContent";

export default function ReceptionProfilePage() {
  return (
    <ProfilePageContent 
      userRole="Receptionist" 
      userName="John Doe" 
      userId="REC-1022" 
      userDept="Front Desk" 
    />
  );
}
