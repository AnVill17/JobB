import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, FileText, Briefcase, Shield, Zap, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UserProfile, JobPreferences } from '@/types/job';
import { useToast } from '@/hooks/use-toast';

const Setup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'profile' | 'preferences'>('profile');
  
  const [profile, setProfile] = useState<UserProfile>({
    resumeText: '',
    extraProjects: '',
    achievements: '',
  });

  const [preferences, setPreferences] = useState<JobPreferences>({
    maxApplicationsPerDay: 50,
    minMatchThreshold: 70,
    blockedCompanies: [],
    blockedRoleTypes: [],
    locationPreference: 'any',
    visaSponsorship: false,
    startDatePreference: 'flexible',
  });

  const [newBlockedCompany, setNewBlockedCompany] = useState('');
  const [newBlockedRole, setNewBlockedRole] = useState('');
  const [resumeFileName, setResumeFileName] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFileName(file.name);
      setProfile(prev => ({ ...prev, resumeFile: file }));
      // In a real app, you'd parse the resume here
    }
  };

  const addBlockedCompany = () => {
    if (newBlockedCompany.trim()) {
      setPreferences(prev => ({
        ...prev,
        blockedCompanies: [...prev.blockedCompanies, newBlockedCompany.trim()],
      }));
      setNewBlockedCompany('');
    }
  };

  const addBlockedRole = () => {
    if (newBlockedRole.trim()) {
      setPreferences(prev => ({
        ...prev,
        blockedRoleTypes: [...prev.blockedRoleTypes, newBlockedRole.trim()],
      }));
      setNewBlockedRole('');
    }
  };

  const removeBlockedCompany = (company: string) => {
    setPreferences(prev => ({
      ...prev,
      blockedCompanies: prev.blockedCompanies.filter(c => c !== company),
    }));
  };

  const removeBlockedRole = (role: string) => {
    setPreferences(prev => ({
      ...prev,
      blockedRoleTypes: prev.blockedRoleTypes.filter(r => r !== role),
    }));
  };

  const { toast } = useToast();

  const handleLaunchAgent = async () => {
    // Basic user id (persisted)
    const userId = localStorage.getItem('userId') || `user-${Date.now()}`;
    localStorage.setItem('userId', userId);

    try {
      let resumePath = '';

      // If a file was selected, upload it to the backend first
      if ((profile as any).resumeFile) {
        const form = new FormData();
        form.append('resume', (profile as any).resumeFile);

        const uploadRes = await fetch('http://localhost:6969/api/upload', {
          method: 'POST',
          body: form,
        });

        if (!uploadRes.ok) {
          const err = await uploadRes.json().catch(() => ({ error: 'Upload failed' }));
          toast({ title: 'Upload failed', description: err.error || 'Could not upload resume', variant: 'destructive' });
          return;
        }

        const uploadJson = await uploadRes.json();
        resumePath = uploadJson.filePath;
      }

      // Start mission on backend
      const payload: any = { preferences, userId, resumePath };
      // If user pasted resume text (no file), include it
      if (!resumePath && profile.resumeText) payload.resumeText = profile.resumeText;

      const startRes = await fetch('http://localhost:6969/api/mission/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!startRes.ok) {
        const err = await startRes.json().catch(() => ({ error: 'Failed to start mission' }));
        toast({ title: 'Failed to start mission', description: err.error || 'Please try again', variant: 'destructive' });
        return;
      }

      toast({ title: 'Mission started', description: 'Agent mission is running on the backend', variant: 'default' });

      // Persist preferences/profile for later
      localStorage.setItem('agentPreferences', JSON.stringify(preferences));
      localStorage.setItem('userProfile', JSON.stringify({ ...profile, resumeFile: undefined, resumeFileName }));

      navigate('/dashboard');
    } catch (err: any) {
      console.error('[Setup] launch error', err);
      toast({ title: 'Error', description: err.message || 'Unexpected error', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background Grid */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-processing/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-processing" />
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">Agent Setup</h1>
              <p className="text-xs text-muted-foreground font-mono">configure your autonomous job agent</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={() => setStep('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              step === 'profile' 
                ? 'bg-processing/20 text-processing border border-processing/50' 
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">Profile</span>
          </button>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <button
            onClick={() => setStep('preferences')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              step === 'preferences' 
                ? 'bg-processing/20 text-processing border border-processing/50' 
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span className="text-sm font-medium">Preferences</span>
          </button>
        </div>

        {step === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Resume Upload */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-processing" />
                  Upload Resume
                </CardTitle>
                <CardDescription>
                  Upload your resume so the agent can match your skills to job requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-processing/50 transition-colors">
                  <input
                    type="file"
                    id="resume-upload"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    {resumeFileName ? (
                      <div className="flex items-center justify-center gap-2 text-success">
                        <FileText className="w-8 h-8" />
                        <span className="font-medium">{resumeFileName}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-foreground font-medium mb-1">
                          Drag & drop or click to upload
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Supports PDF, DOC, DOCX, TXT
                        </p>
                      </>
                    )}
                  </label>
                </div>

                <div className="mt-4">
                  <Label htmlFor="resume-text">Or paste your resume content</Label>
                  <Textarea
                    id="resume-text"
                    placeholder="Paste your resume text here..."
                    value={profile.resumeText}
                    onChange={(e) => setProfile(prev => ({ ...prev, resumeText: e.target.value }))}
                    className="mt-2 min-h-[150px] font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Extra Projects */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-processing" />
                  Extra Projects
                </CardTitle>
                <CardDescription>
                  Add projects not on your resume that showcase your skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Describe your side projects, open source contributions, or portfolio pieces..."
                  value={profile.extraProjects}
                  onChange={(e) => setProfile(prev => ({ ...prev, extraProjects: e.target.value }))}
                  className="min-h-[120px]"
                />
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-processing" />
                  Achievements & Certifications
                </CardTitle>
                <CardDescription>
                  Highlight awards, certifications, or notable achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="AWS Certified, Google Cloud Professional, Hackathon winner, etc..."
                  value={profile.achievements}
                  onChange={(e) => setProfile(prev => ({ ...prev, achievements: e.target.value }))}
                  className="min-h-[120px]"
                />
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button 
                onClick={() => setStep('preferences')}
                className="bg-processing hover:bg-processing/90"
              >
                Continue to Preferences
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'preferences' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Application Limits */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Application Limits</CardTitle>
                <CardDescription>
                  Control how aggressively the agent applies to jobs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Maximum Applications per Day</Label>
                    <span className="font-mono text-processing">{preferences.maxApplicationsPerDay}</span>
                  </div>
                  <Slider
                    value={[preferences.maxApplicationsPerDay]}
                    onValueChange={([value]) => setPreferences(prev => ({ ...prev, maxApplicationsPerDay: value }))}
                    max={100}
                    min={1}
                    step={1}
                    className="py-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    Agent will stop after reaching this limit
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Minimum Match Threshold</Label>
                    <span className="font-mono text-processing">{preferences.minMatchThreshold}%</span>
                  </div>
                  <Slider
                    value={[preferences.minMatchThreshold]}
                    onValueChange={([value]) => setPreferences(prev => ({ ...prev, minMatchThreshold: value }))}
                    max={100}
                    min={0}
                    step={5}
                    className="py-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    Only apply to jobs that match at least this percentage of your profile
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Blocked Companies & Roles */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Blocked Companies & Roles</CardTitle>
                <CardDescription>
                  Specify companies or role types you want to exclude
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Blocked Companies</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Company name..."
                      value={newBlockedCompany}
                      onChange={(e) => setNewBlockedCompany(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addBlockedCompany()}
                    />
                    <Button variant="outline" onClick={addBlockedCompany}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {preferences.blockedCompanies.map((company) => (
                      <Badge
                        key={company}
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive/20 hover:text-destructive"
                        onClick={() => removeBlockedCompany(company)}
                      >
                        {company} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Blocked Role Types</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Role type (e.g., 'Sales', 'Manager')..."
                      value={newBlockedRole}
                      onChange={(e) => setNewBlockedRole(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addBlockedRole()}
                    />
                    <Button variant="outline" onClick={addBlockedRole}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {preferences.blockedRoleTypes.map((role) => (
                      <Badge
                        key={role}
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive/20 hover:text-destructive"
                        onClick={() => removeBlockedRole(role)}
                      >
                        {role} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location & Constraints */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Required Constraints</CardTitle>
                <CardDescription>
                  Set your location, visa, and availability requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Location Preference</Label>
                    <Select
                      value={preferences.locationPreference}
                      onValueChange={(value: 'remote' | 'onsite' | 'hybrid' | 'any') => 
                        setPreferences(prev => ({ ...prev, locationPreference: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any (Remote or Onsite)</SelectItem>
                        <SelectItem value="remote">Remote Only</SelectItem>
                        <SelectItem value="onsite">Onsite Only</SelectItem>
                        <SelectItem value="hybrid">Hybrid Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Start Date Preference</Label>
                    <Select
                      value={preferences.startDatePreference}
                      onValueChange={(value: 'immediate' | 'flexible' | 'specific') => 
                        setPreferences(prev => ({ ...prev, startDatePreference: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                        <SelectItem value="specific">Specific Date</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {preferences.startDatePreference === 'specific' && (
                  <div className="space-y-2">
                    <Label>Specific Start Date</Label>
                    <Input
                      type="date"
                      value={preferences.specificStartDate || ''}
                      onChange={(e) => setPreferences(prev => ({ ...prev, specificStartDate: e.target.value }))}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <Label>Visa Sponsorship Required</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Only show jobs that offer visa sponsorship
                    </p>
                  </div>
                  <Switch
                    checked={preferences.visaSponsorship}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, visaSponsorship: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Launch Button */}
            <div className="flex justify-between">
              <Button 
                variant="outline"
                onClick={() => setStep('profile')}
              >
                Back to Profile
              </Button>
              <Button 
                onClick={handleLaunchAgent}
                className="bg-success hover:bg-success/90 text-success-foreground"
                size="lg"
              >
                <Zap className="w-5 h-5 mr-2" />
                Launch Agent
              </Button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Setup;