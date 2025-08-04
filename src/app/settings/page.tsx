"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { MapPin, Zap, Settings, Wifi, WifiOff } from "lucide-react"

interface SolarPanelSettings {
  area: string
  efficiency: string
  orientation: string
  tilt: string
  locationOverride: string
  city: string
  country: string
}

interface IoTSensorSettings {
  enabled: boolean
  deviceId: string
  connectionInterval: string
  dataTransmissionRate: string
  batteryThreshold: string
}

export default function SettingsPage() {
  const [solarSettings, setSolarSettings] = useState<SolarPanelSettings>({
    area: "",
    efficiency: "",
    orientation: "south",
    tilt: "30",
    locationOverride: "",
    city: "",
    country: ""
  })

  const [iotSettings, setIoTSettings] = useState<IoTSensorSettings>({
    enabled: true,
    deviceId: "",
    connectionInterval: "5",
    dataTransmissionRate: "1",
    batteryThreshold: "20"
  })

  const [isLocationOverrideEnabled, setIsLocationOverrideEnabled] = useState(false)

  const handleSolarSettingsChange = (field: keyof SolarPanelSettings, value: string) => {
    setSolarSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleIoTSettingsChange = (field: keyof IoTSensorSettings, value: string | boolean) => {
    setIoTSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveSolarSettings = () => {
    console.log("Saving solar panel settings:", solarSettings)
    // TODO: Implement API call to save settings
  }

  const handleSaveIoTSettings = () => {
    console.log("Saving IoT sensor settings:", iotSettings)
    // TODO: Implement API call to save settings
  }

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          handleSolarSettingsChange("locationOverride", `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
          setIsLocationOverrideEnabled(true)
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsLocationOverrideEnabled(true)
        }
      )
    } else {
      console.error("Geolocation is not supported by this browser")
      setIsLocationOverrideEnabled(true)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your solar panel specifications and IoT sensor settings.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {/* Solar Panel Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Solar Panel Specifications
            </CardTitle>
            <CardDescription>
              Configure your solar panel parameters for accurate power calculations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="area">Area (m²)</Label>
                <Input
                  id="area"
                  type="number"
                  placeholder="e.g., 20.5"
                  value={solarSettings.area}
                  onChange={(e) => handleSolarSettingsChange("area", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="efficiency">Efficiency (%)</Label>
                <Input
                  id="efficiency"
                  type="number"
                  placeholder="e.g., 22"
                  min="0"
                  max="100"
                  value={solarSettings.efficiency}
                  onChange={(e) => handleSolarSettingsChange("efficiency", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="orientation">Orientation</Label>
                <Select
                  value={solarSettings.orientation}
                  onValueChange={(value) => handleSolarSettingsChange("orientation", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select orientation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="north">North</SelectItem>
                    <SelectItem value="northeast">Northeast</SelectItem>
                    <SelectItem value="east">East</SelectItem>
                    <SelectItem value="southeast">Southeast</SelectItem>
                    <SelectItem value="south">South</SelectItem>
                    <SelectItem value="southwest">Southwest</SelectItem>
                    <SelectItem value="west">West</SelectItem>
                    <SelectItem value="northwest">Northwest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tilt">Tilt Angle (°)</Label>
                <Select
                  value={solarSettings.tilt}
                  onValueChange={(value) => handleSolarSettingsChange("tilt", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tilt angle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0° (Flat)</SelectItem>
                    <SelectItem value="15">15°</SelectItem>
                    <SelectItem value="30">30°</SelectItem>
                    <SelectItem value="45">45°</SelectItem>
                    <SelectItem value="60">60°</SelectItem>
                    <SelectItem value="90">90° (Vertical)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Location Override</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={getCurrentLocation}
                  className="flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  Use Current Location
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Override GPS location if automatic detection fails or for custom calculations.
              </p>
              
              {isLocationOverrideEnabled && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Coordinates (Lat, Lng)</Label>
                    <Input
                      id="location"
                      placeholder="e.g., 40.7128, -74.0060"
                      value={solarSettings.locationOverride}
                      onChange={(e) => handleSolarSettingsChange("locationOverride", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="e.g., New York"
                        value={solarSettings.city}
                        onChange={(e) => handleSolarSettingsChange("city", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        placeholder="e.g., United States"
                        value={solarSettings.country}
                        onChange={(e) => handleSolarSettingsChange("country", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button onClick={handleSaveSolarSettings} className="w-full">
              Save Solar Panel Settings
            </Button>
          </CardContent>
        </Card>

        {/* IoT Sensor Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              IoT Sensor Settings
            </CardTitle>
            <CardDescription>
              Configure your IoT sensors and data transmission parameters.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Sensor Status</Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable IoT sensor data collection
                </p>
              </div>
              <Button
                variant={iotSettings.enabled ? "default" : "outline"}
                size="sm"
                onClick={() => handleIoTSettingsChange("enabled", !iotSettings.enabled)}
                className="flex items-center gap-2"
              >
                {iotSettings.enabled ? (
                  <>
                    <Wifi className="h-4 w-4" />
                    Enabled
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4" />
                    Disabled
                  </>
                )}
              </Button>
            </div>

            {iotSettings.enabled && (
              <>
                <Separator />
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="deviceId">Device ID</Label>
                    <Input
                      id="deviceId"
                      placeholder="e.g., SOLAR_001_ABC123"
                      value={iotSettings.deviceId}
                      onChange={(e) => handleIoTSettingsChange("deviceId", e.target.value)}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="connectionInterval">Connection Interval (min)</Label>
                      <Select
                        value={iotSettings.connectionInterval}
                        onValueChange={(value) => handleIoTSettingsChange("connectionInterval", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select interval" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 minute</SelectItem>
                          <SelectItem value="5">5 minutes</SelectItem>
                          <SelectItem value="10">10 minutes</SelectItem>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dataRate">Data Transmission Rate (min)</Label>
                      <Select
                        value={iotSettings.dataTransmissionRate}
                        onValueChange={(value) => handleIoTSettingsChange("dataTransmissionRate", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select rate" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Every minute</SelectItem>
                          <SelectItem value="5">Every 5 minutes</SelectItem>
                          <SelectItem value="15">Every 15 minutes</SelectItem>
                          <SelectItem value="30">Every 30 minutes</SelectItem>
                          <SelectItem value="60">Every hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="batteryThreshold">Low Battery Threshold (%)</Label>
                    <Select
                      value={iotSettings.batteryThreshold}
                      onValueChange={(value) => handleIoTSettingsChange("batteryThreshold", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select threshold" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10%</SelectItem>
                        <SelectItem value="15">15%</SelectItem>
                        <SelectItem value="20">20%</SelectItem>
                        <SelectItem value="25">25%</SelectItem>
                        <SelectItem value="30">30%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            <Button 
              onClick={handleSaveIoTSettings} 
              className="w-full"
              disabled={!iotSettings.enabled}
            >
              Save IoT Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Additional Settings Cards */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {/* System Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>System Notifications</CardTitle>
            <CardDescription>
              Configure alerts and notification preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Email Alerts</Label>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            <div className="flex items-center justify-between">
              <Label>Performance Warnings</Label>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            <div className="flex items-center justify-between">
              <Label>Maintenance Reminders</Label>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Export */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
              Export and manage your solar power data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Export Historical Data</Label>
              <Button variant="outline" size="sm">Export CSV</Button>
            </div>
            <div className="flex items-center justify-between">
              <Label>Backup Settings</Label>
              <Button variant="outline" size="sm">Download</Button>
            </div>
            <div className="flex items-center justify-between">
              <Label>Reset All Settings</Label>
              <Button variant="destructive" size="sm">Reset</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
