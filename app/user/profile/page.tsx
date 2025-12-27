import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-2xl p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="mb-8 text-muted-foreground">Update your account information</p>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="flex flex-col gap-4 p-6">
            <CardHeader>
              <CardTitle>Email Address</CardTitle>
            </CardHeader>
            <CardContent>
              <Input value="banel29009@gamintor.com" readOnly />
              <Badge variant="secondary" className="mt-3 text-xs font-medium">Need to update your email? Please contact support for email address changes.</Badge>
            </CardContent>
          </Card>
          <Card className="flex flex-col gap-4 p-6">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Input placeholder="Current Password" type="password" />
              <Input placeholder="New Password" type="password" />
              <Input placeholder="Confirm New Password" type="password" />
              <Button className="mt-2">Update Password</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
