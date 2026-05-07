"use client";

import ProfilePageContent from "@/components/profile/ProfilePageContent";

export default function PharmacyProfilePage() {
  return (
    <ProfilePageContent 
      userRole="Pharmacist" 
      userName="Alice Smith" 
      userId="PH-5011" 
      userDept="Pharmacy" 
    />
  );
}
