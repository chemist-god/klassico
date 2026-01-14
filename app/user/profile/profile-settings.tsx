"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

type ProfileUser = {
  id?: string;
  username: string;
  email: string;
};

interface ProfileSettingsProps {
  initialUser: ProfileUser | null;
}

export function ProfileSettings({ initialUser }: ProfileSettingsProps) {
  const { toast } = useToast();
  const [savedUser, setSavedUser] = useState<ProfileUser | null>(initialUser);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [profileValues, setProfileValues] = useState({
    username: initialUser?.username ?? "",
    email: initialUser?.email ?? "",
  });
  const [passwordValues, setPasswordValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const isProfileDirty = useMemo(() => {
    return (
      profileValues.username !== (savedUser?.username ?? "") ||
      profileValues.email !== (savedUser?.email ?? "")
    );
  }, [profileValues.email, profileValues.username, savedUser?.email, savedUser?.username]);

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSavingProfile(true);
    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileValues),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Unable to update profile");
      }

      const updatedUser = result?.data ?? result;
      if (updatedUser?.username && updatedUser?.email) {
        setSavedUser(updatedUser);
        setProfileValues({
          username: updatedUser.username,
          email: updatedUser.email,
        });
      }

      toast({
        title: "Profile updated",
        description: "Your account details have been saved.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSavingPassword(true);
    try {
      const response = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordValues),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Unable to update password");
      }

      setPasswordValues({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
    } catch (error) {
      toast({
        title: "Password update failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <main className="min-h-screen bg-muted/40 text-foreground">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-semibold">Profile Settings</h1>
              <p className="text-sm text-muted-foreground">
                Keep your profile information up to date and secure.
              </p>
            </div>
            <Badge variant="secondary" className="text-xs font-semibold uppercase tracking-wide">
              Account
            </Badge>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-5" onSubmit={handleProfileSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={profileValues.username}
                      onChange={(event) =>
                        setProfileValues((prev) => ({ ...prev, username: event.target.value }))
                      }
                      placeholder="Choose a username"
                      autoComplete="username"
                    />
                    <p className="text-xs text-muted-foreground">
                      This is visible to other users and on your activity.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileValues.email}
                      onChange={(event) =>
                        setProfileValues((prev) => ({ ...prev, email: event.target.value }))
                      }
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                    <p className="text-xs text-muted-foreground">
                      We will send receipts and alerts to this email.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button type="submit" disabled={!isProfileDirty || isSavingProfile}>
                      {isSavingProfile ? "Saving..." : "Save changes"}
                    </Button>
                    {!isProfileDirty && (
                      <span className="text-xs text-muted-foreground">
                        No changes to save.
                      </span>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-5" onSubmit={handlePasswordSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordValues.currentPassword}
                      onChange={(event) =>
                        setPasswordValues((prev) => ({
                          ...prev,
                          currentPassword: event.target.value,
                        }))
                      }
                      autoComplete="current-password"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordValues.newPassword}
                        onChange={(event) =>
                          setPasswordValues((prev) => ({
                            ...prev,
                            newPassword: event.target.value,
                          }))
                        }
                        autoComplete="new-password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm new password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordValues.confirmPassword}
                        onChange={(event) =>
                          setPasswordValues((prev) => ({
                            ...prev,
                            confirmPassword: event.target.value,
                          }))
                        }
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button type="submit" disabled={isSavingPassword}>
                      {isSavingPassword ? "Updating..." : "Update password"}
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      Use at least 8 characters with letters and numbers.
                    </span>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Signed in as</p>
                  <p className="font-medium">{savedUser?.username || "Unknown user"}</p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <p className="text-muted-foreground">Contact email</p>
                  <p className="font-medium">{savedUser?.email || "Not available"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Need help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  If you notice unexpected changes or need assistance, reach out to support.
                </p>
                <Button variant="outline" type="button">
                  Contact support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
