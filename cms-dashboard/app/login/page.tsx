"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Shield, AlertCircle } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { apiPost } from "@/lib/api"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  })
  const [showMFA, setShowMFA] = useState(false)
  const [mfaCode, setMfaCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState("en")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const resp = await apiPost<{ username: string; role: string; name: string; authenticated: boolean; token: string }>(
        "/auth/login",
        { username: loginData.username, password: loginData.password },
      )
      if (resp.username === "admin") {
        setShowMFA(true)
      } else {
        localStorage.setItem("cms_user", JSON.stringify(resp))
        router.push("/")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleMFAVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (mfaCode === "123456") {
        // finalize admin session
        localStorage.setItem(
          "cms_user",
          JSON.stringify({ username: loginData.username, role: "Admin", name: "Administrator", authenticated: true }),
        )
        router.push("/")
      } else {
        setError("Invalid MFA code. Please try again.")
      }
    } catch (err) {
      setError("MFA verification failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header with Logos */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <Image
              src="/images/federal-police-logo.png"
              alt="Ethiopian Federal Police"
              width={60}
              height={60}
              className="rounded-full"
            />
            <Image
              src="/images/customs-logo.png"
              alt="Ethiopian Customs Commission"
              width={60}
              height={60}
              className="rounded-full"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">CMS Login</h1>
            <p className="text-muted-foreground">Contraband Management System</p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex justify-center">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="am">አማርኛ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>{showMFA ? "Multi-Factor Authentication" : "Sign In"}</span>
            </CardTitle>
            <CardDescription>
              {showMFA
                ? "Enter the 6-digit code from your authenticator app"
                : "Enter your credentials to access the system"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!showMFA ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username / Email</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={loginData.username}
                    onChange={(e) => setLoginData((prev) => ({ ...prev, username: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={loginData.rememberMe}
                    onCheckedChange={(checked) => setLoginData((prev) => ({ ...prev, rememberMe: checked as boolean }))}
                  />
                  <Label htmlFor="remember" className="text-sm">
                    Remember me
                  </Label>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing In..." : "Sign In"}
                </Button>

                <div className="text-center">
                  <Button variant="link" className="text-sm">
                    Forgot Password?
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleMFAVerification} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mfa">6-Digit Code</Label>
                  <Input
                    id="mfa"
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))}
                    className="text-center text-lg tracking-widest"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Verifying..." : "Verify"}
                </Button>

                <div className="text-center">
                  <Button variant="link" className="text-sm">
                    Resend SMS Code
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center mb-2">Demo Credentials:</p>
            <div className="text-xs space-y-1 text-center">
              <p>
                <strong>Regular User:</strong> any username/password
              </p>
              <p>
                <strong>Admin (with MFA):</strong> admin / admin123 → MFA: 123456
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
