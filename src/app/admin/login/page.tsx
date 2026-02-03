'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Lock, Mail, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [resetEmail, setResetEmail] = useState('')
  const [resetPassword, setResetPassword] = useState('')
  const [showReset, setShowReset] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginError('')

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setLoginError(data.error || 'Login failed')
        toast.error(data.error || 'Login failed')
        return
      }

      toast.success('Login successful!')

      if (data.requiresPasswordChange) {
        toast.info('Please change your password')
        router.push('/admin/change-password')
      } else {
        router.push('/admin/dashboard')
      }
    } catch (error) {
      console.error('Login error:', error)
      setLoginError('Network error. Please try again.')
      toast.error('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsResetting(true)

    try {
      const response = await fetch('/api/admin/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: resetEmail,
          password: resetPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Reset failed')
      }

      toast.success('Admin account reset successfully!')
      setResetEmail('')
      setResetPassword('')
      setShowReset(false)
      setIsResetting(false)
    } catch (error) {
      console.error('Reset error:', error)
      toast.error(error.message || 'Failed to reset account')
      setIsResetting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-green-900">Admin Login</h1>
          <p className="text-green-600 mt-1">Mayaash Communication</p>
        </div>

        {/* Login Card */}
        <Card className="border-green-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-green-900">Sign In</CardTitle>
            <CardDescription>
              Enter your admin credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-green-900">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  disabled={isLoading}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-green-900">
                  <Lock className="w-4 h-4 inline mr-1" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="•••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  disabled={isLoading}
                />
              </div>

              {/* Error Message */}
              {loginError && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{loginError}</span>
                </div>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Security Info */}
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-800 space-y-1">
                  <p className="font-semibold">Secure Login</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Account locks after 5 failed attempts</li>
                    <li>15-minute lockout period</li>
                    <li>Password must be changed on first login</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Back to Admin */}
            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                onClick={() => router.push('/admin')}
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                ← Back to Admin
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reset Link */}
        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            onClick={() => setShowReset(true)}
            className="text-green-600 hover:text-green-700 hover:bg-green-50 text-sm"
          >
            Reset Admin Account
          </Button>
        </div>

        {/* Reset Form */}
        {showReset && (
          <Card className="border-blue-200 shadow-xl max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-green-900">Reset Admin Account</CardTitle>
              <CardDescription>
                Reset an admin account to its default state
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <Label htmlFor="resetEmail" className="text-green-900">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Admin Email
                  </Label>
                  <Input
                    id="resetEmail"
                    type="email"
                    placeholder="admin@company.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                    disabled={isResetting}
                  />
                </div>

                <div>
                  <Label htmlFor="resetPassword" className="text-green-900">
                    <Lock className="w-4 h-4 inline mr-1" />
                    Current Password
                  </Label>
                  <Input
                    id="resetPassword"
                    type="password"
                    placeholder="Enter current password"
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    required
                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                    disabled={isResetting}
                  />
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
                  <p className="font-semibold">Security Notice</p>
                  <p className="text-sm">
                    Resetting an account will:
                  <span>• Reset failed attempts to 0</span>
                    <span>• Clear the lockout timestamp</span>
                    <span>• Allow immediate login</span>
                    <span>• Keep the same default password</span>
                  </p>
                  <p className="text-xs text-blue-600">
                    Default password: Mayaash@@123
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isResetting || !resetEmail || !resetPassword}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4"
                >
                  {isResetting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2" />
                      Reset Account
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowReset(false)}
                  className="w-full mt-2"
                  disabled={isResetting}
                >
                  Cancel
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Back to Login */}
        {showReset && (
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              onClick={() => setShowReset(false)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              ← Back to Login
            </Button>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-green-700">
          <p>Need support?</p>
          <p className="text-xs mt-1">serabsales@gmail.com | 0747047555</p>
        </div>
      </div>
    </div>
  )
}
