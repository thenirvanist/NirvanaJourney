import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export default function ConfirmNewsletter() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmSubscription = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Invalid confirmation link. Please try subscribing again.');
        return;
      }

      if (!supabase) {
        setStatus('error');
        setMessage('Service unavailable. Please try again later.');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('newsletter_subscriber')
          .update({ status: 'active', confirmed_at: new Date().toISOString() })
          .eq('confirmation_token', token)
          .select()
          .single();

        if (error || !data) {
          setStatus('error');
          setMessage('This confirmation link is invalid or has already been used.');
        } else {
          setStatus('success');
          setMessage('Your subscription has been confirmed! Welcome to The Nirvanist community.');
        }
      } catch (err) {
        console.error('Confirmation error:', err);
        setStatus('error');
        setMessage('Something went wrong. Please try again or contact support.');
      }
    };

    confirmSubscription();
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F2E8] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-[#70c92e] mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Confirming your subscription...</h1>
            <p className="text-gray-600">Please wait a moment.</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-[#70c92e] mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Subscription Confirmed!</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <a 
              href="/"
              className="inline-block bg-[#70c92e] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5fb024] transition-colors"
              data-testid="link-return-home"
            >
              Return to Homepage
            </a>
          </>
        )}
        
        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Confirmation Failed</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <a 
              href="/"
              className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              data-testid="link-return-home-error"
            >
              Return to Homepage
            </a>
          </>
        )}
      </div>
    </div>
  );
}
