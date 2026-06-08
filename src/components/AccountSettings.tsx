import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { authClient } from "@lib/auth-client";

interface AccountUser {
  name?: string | null;
  email?: string | null;
  age?: number | null;
  weight?: number | null;
  height?: number | null;
  image?: string | null;
}

export function AccountSettings({ user, open, onOpenChange }: { user: AccountUser; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [age, setAge] = useState(user?.age || "");
  const [weight, setWeight] = useState(user?.weight || "");
  const [height, setHeight] = useState(user?.height || "");

  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const [profileLoading, setProfileLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [profileMsg, setProfileMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [accountMsg, setAccountMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [deleteMsg, setDeleteMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (user) {
      setAge(user.age || "");
      setWeight(user.weight || "");
      setHeight(user.height || "");
    }
  }, [user]);

  const getCsrfToken = (): string | null =>
    document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? null;

  const handleUpdateProfile = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);
    try {
      const res = await fetch("/api/user/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ age, weight, height, csrf_token: getCsrfToken() }),
      });
      if (res.ok) {
        setProfileMsg({ text: "Profile updated successfully!", type: "success" });
      } else {
        const err = await res.text();
        setProfileMsg({ text: err || "Failed to update profile", type: "error" });
      }
    } catch (err) {
      setProfileMsg({ text: err instanceof Error ? err.message : "Failed to update profile", type: "error" });
    }
    setProfileLoading(false);
  };

  const handleUpdateEmail = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    setEmailLoading(true);
    setAccountMsg(null);
    try {
      const { error } = await authClient.changeEmail({ newEmail });
      if (error) {
        setAccountMsg({ text: error.message || "Failed to update email.", type: "error" });
      } else {
        setAccountMsg({ text: "Email updated successfully. Please verify your new email.", type: "success" });
        setNewEmail("");
      }
    } catch (err) {
      setAccountMsg({ text: err instanceof Error ? err.message : "Failed to update email.", type: "error" });
    }
    setEmailLoading(false);
  };

  const handleUpdatePassword = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    setPasswordLoading(true);
    setPasswordMsg(null);
    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });
      if (error) {
        setPasswordMsg({ text: error.message || "Failed to update password.", type: "error" });
      } else {
        setPasswordMsg({ text: "Password updated successfully.", type: "success" });
        setCurrentPassword("");
        setNewPassword("");
      }
    } catch (err) {
      setPasswordMsg({ text: err instanceof Error ? err.message : "Failed to update password.", type: "error" });
    }
    setPasswordLoading(false);
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setDeleteMsg(null);
    try {
      const res = await fetch("/api/user/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csrf_token: getCsrfToken() }),
      });
      if (res.ok) {
        setDeleteMsg({ text: "Account deleted. Redirecting...", type: "success" });
        setTimeout(() => { window.location.href = "/login"; }, 1500);
      } else {
        const err = await res.text();
        setDeleteMsg({ text: err || "Failed to delete account", type: "error" });
      }
    } catch (err) {
      setDeleteMsg({ text: err instanceof Error ? err.message : "Failed to delete account", type: "error" });
    }
    setDeleteLoading(false);
  };

  const statusClass = (type: "success" | "error") =>
    type === "error"
      ? "bg-destructive/10 text-destructive border-destructive/20"
      : "bg-green-500/10 text-green-600 border-green-500/20";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Account Settings</DialogTitle>
          <DialogDescription>Manage your account credentials and personal physical metrics.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account & Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4 pt-4">
            {profileMsg && (
              <div className={`p-3 rounded-md text-sm font-medium border ${statusClass(profileMsg.type)}`}>{profileMsg.text}</div>
            )}
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" min="10" max="120" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 25" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight</Label>
                  <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 80 (kg/lbs)" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 180 (cm/in)" />
              </div>
              <Button type="submit" className="w-full" disabled={profileLoading}>Save Profile</Button>
            </form>
          </TabsContent>

          <TabsContent value="account" className="space-y-6 pt-4">
            {accountMsg && (
              <div className={`p-3 rounded-md text-sm font-medium border ${statusClass(accountMsg.type)}`}>{accountMsg.text}</div>
            )}

            <form onSubmit={handleUpdateEmail} className="space-y-4 border-b pb-6">
              <div className="space-y-2">
                <Label htmlFor="email">Change Email</Label>
                <Input id="email" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder={user?.email} />
              </div>
              <Button variant="secondary" type="submit" className="w-full" disabled={emailLoading || !newEmail}>Update Email</Button>
            </form>

            {passwordMsg && (
              <div className={`p-3 rounded-md text-sm font-medium border ${statusClass(passwordMsg.type)}`}>{passwordMsg.text}</div>
            )}
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current_password">Current Password</Label>
                <Input id="current_password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_password">New Password</Label>
                <Input id="new_password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <Button variant="secondary" type="submit" className="w-full" disabled={passwordLoading || !currentPassword || !newPassword}>Update Password</Button>
            </form>

            <div className="border-t pt-6 space-y-4">
              {deleteMsg && (
                <div className={`p-3 rounded-md text-sm font-medium border ${statusClass(deleteMsg.type)}`}>{deleteMsg.text}</div>
              )}
              {!deleteConfirm ? (
                <div className="space-y-2">
                  <Label className="text-destructive font-semibold">Danger Zone</Label>
                  <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data. This action cannot be undone.</p>
                  <Button variant="destructive" className="w-full" onClick={() => setDeleteConfirm(true)}>Delete Account</Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label className="text-destructive font-semibold">Are you sure?</Label>
                  <p className="text-sm text-muted-foreground">This will permanently delete your account, workout plans, and all data. This cannot be undone.</p>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => { setDeleteConfirm(false); setDeleteMsg(null); }} disabled={deleteLoading}>Cancel</Button>
                    <Button variant="destructive" className="flex-1" onClick={handleDeleteAccount} disabled={deleteLoading}>
                      {deleteLoading ? "Deleting..." : "Yes, Delete My Account"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
