import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { authClient } from "../lib/auth-client";

export function AccountSettings({ user, open, onOpenChange }: { user: any, open: boolean, onOpenChange: (open: boolean) => void }) {
  // Profile State
  const [age, setAge] = useState(user?.age || "");
  const [weight, setWeight] = useState(user?.weight || "");
  const [height, setHeight] = useState(user?.height || "");
  
  // Account State
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  // Feedback States
  const [profileMsg, setProfileMsg] = useState<{ text: string, type: "success" | "error" } | null>(null);
  const [accountMsg, setAccountMsg] = useState<{ text: string, type: "success" | "error" } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync state if user prop changes
  useEffect(() => {
    if (user) {
      setAge(user.age || "");
      setWeight(user.weight || "");
      setHeight(user.height || "");
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setProfileMsg(null);
    try {
      const res = await fetch("/api/user/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ age, weight, height })
      });
      if (res.ok) {
        setProfileMsg({ text: "Profile updated successfully!", type: "success" });
      } else {
        const err = await res.text();
        setProfileMsg({ text: err || "Failed to update profile", type: "error" });
      }
    } catch (err: any) {
      setProfileMsg({ text: err.message, type: "error" });
    }
    setIsUpdating(false);
  };

  const handleUpdateEmail = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    setIsUpdating(true);
    setAccountMsg(null);
    try {
      const { data, error } = await authClient.changeEmail({
        newEmail,
      });
      if (error) {
        setAccountMsg({ text: error.message || "Failed to update email.", type: "error" });
      } else {
        setAccountMsg({ text: "Email updated successfully. Please verify your new email.", type: "success" });
        setNewEmail("");
      }
    } catch (err: any) {
      setAccountMsg({ text: err.message, type: "error" });
    }
    setIsUpdating(false);
  };

  const handleUpdatePassword = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    setIsUpdating(true);
    setAccountMsg(null);
    try {
      const { data, error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true
      });
      if (error) {
        setAccountMsg({ text: error.message || "Failed to update password.", type: "error" });
      } else {
        setAccountMsg({ text: "Password updated successfully.", type: "success" });
        setCurrentPassword("");
        setNewPassword("");
      }
    } catch (err: any) {
      setAccountMsg({ text: err.message, type: "error" });
    }
    setIsUpdating(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Account Settings</DialogTitle>
          <DialogDescription>
            Manage your account credentials and personal physical metrics.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="profile" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account & Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4 pt-4">
            {profileMsg && (
              <div className={`p-3 rounded-md text-sm font-medium border ${profileMsg.type === "error" ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-green-500/10 text-green-600 border-green-500/20"}`}>
                {profileMsg.text}
              </div>
            )}
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" min="10" max="120" value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 25" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight</Label>
                  <Input id="weight" type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 80 (kg/lbs)" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input id="height" type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 180 (cm/in)" />
              </div>
              <Button type="submit" className="w-full" disabled={isUpdating}>Save Profile</Button>
            </form>
          </TabsContent>
          
          <TabsContent value="account" className="space-y-6 pt-4">
            {accountMsg && (
              <div className={`p-3 rounded-md text-sm font-medium border ${accountMsg.type === "error" ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-green-500/10 text-green-600 border-green-500/20"}`}>
                {accountMsg.text}
              </div>
            )}
            
            <form onSubmit={handleUpdateEmail} className="space-y-4 border-b pb-6">
              <div className="space-y-2">
                <Label htmlFor="email">Change Email</Label>
                <Input id="email" type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder={user?.email} />
              </div>
              <Button variant="secondary" type="submit" className="w-full" disabled={isUpdating || !newEmail}>Update Email</Button>
            </form>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current_password">Current Password</Label>
                <Input id="current_password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_password">New Password</Label>
                <Input id="new_password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              </div>
              <Button variant="secondary" type="submit" className="w-full" disabled={isUpdating || !currentPassword || !newPassword}>Update Password</Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
