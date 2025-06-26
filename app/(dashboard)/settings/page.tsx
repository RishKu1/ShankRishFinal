"use client";

import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { 
  Bell, 
  CreditCard, 
  Globe, 
  HelpCircle, 
  Lock, 
  Mail, 
  Moon, 
  Shield, 
  User,
  Building2
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BankConnection } from "@/components/bank-connection";
import { useState } from "react";

const SettingsPage = () => {
  const { user } = useUser();
  const [isBankConnected, setIsBankConnected] = useState(false);

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-blue-700">Settings</h2>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences.
          </p>
        </div>
        <Separator />
        
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Manage your personal information and account settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-x-4">
              <div className="size-20">
                <UserButton afterSignOutUrl="/" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium">{user?.fullName}</h4>
                <p className="text-sm text-muted-foreground">{user?.emailAddresses[0].emailAddress}</p>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications about your account activity.
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account.
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>
              Customize your application experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark themes.
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Language</Label>
                  <p className="text-sm text-muted-foreground">
                    Select your preferred language.
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  English
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Manage your security preferences and connected devices.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Password</Label>
                  <p className="text-sm text-muted-foreground">
                    Change your account password.
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Connected Devices</Label>
                  <p className="text-sm text-muted-foreground">
                    Manage devices connected to your account.
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Billing */}
        <Card>
          <CardHeader>
            <CardTitle>Billing</CardTitle>
            <CardDescription>
              Manage your subscription and billing information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Current Plan</Label>
                  <p className="text-sm text-muted-foreground">
                    Free Plan
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Upgrade
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Payment Methods</Label>
                  <p className="text-sm text-muted-foreground">
                    Manage your payment methods.
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" size="sm">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage; 