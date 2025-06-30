"use client";

import { UserProfile } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SettingsPage = () => {
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl line-clamp-1">
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Clerk User Profile Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Manage Your Account</h3>
            <p className="text-muted-foreground mb-4">
              Update your profile information, password, and security settings.
            </p>
            <UserProfile routing="hash" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage; 