'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '../store/userStore';
import { isFullyOnboarded, getResumeStep } from '../lib/onboardingState';

// ── DEV BYPASS ─────────────────────────────────────────────────────────────
// Login is disabled. The page auto-connects with a mock session and forwards
// the user to the next step in the onboarding / dashboard flow.
// To re-enable real login, restore the original login/page.tsx from git.
// ───────────────────────────────────────────────────────────────────────────

const MOCK_TOKEN = 'dev-bypass-token';

const MOCK_USER = {
  id: 1,
  username: 'dev_user',
  email: 'dev@ojas.local',
  name: 'Dev User',
  gender: 'female' as const,
  doshaComposition: { vata: 0, pitta: 0, kapha: 0 },
  dominantDosha: '',
};

export default function LoginPage() {
  const router = useRouter();
  const { setToken, setCurrentStep } = useUserStore();

  useEffect(() => {
    // Inject mock session directly into the store, bypassing the API
    useUserStore.setState({
      token: MOCK_TOKEN,
      isAuthenticated: true,
      user: MOCK_USER,
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem('token', MOCK_TOKEN);
    }

    const currentUser = useUserStore.getState().user;

    if (isFullyOnboarded(currentUser)) {
      router.replace('/dashboard');
    } else {
      const nextStep = getResumeStep(currentUser);
      setCurrentStep(nextStep);
      router.replace(`/?step=${nextStep}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render a minimal loading state while redirecting
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-surface-cream/60 font-mono text-xs uppercase tracking-widest animate-pulse">
        Auto-connecting…
      </p>
    </div>
  );
}
