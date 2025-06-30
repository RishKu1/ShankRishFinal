"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Building2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { usePlaidLink } from 'react-plaid-link';
import { useNotifications } from '@/features/notifications/api/use-notifications';

interface BankConnectionProps {
  isConnected: boolean;
  onConnectionChange: (connected: boolean) => void;
}

export const BankConnection = ({ isConnected, onConnectionChange }: BankConnectionProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const { createNotification } = useNotifications();

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      console.log('Success!', public_token, metadata);
      
      try {
        // Exchange public token for access token
        const response = await fetch('/api/plaid/exchange-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ public_token }),
        });

        if (!response.ok) {
          throw new Error('Failed to exchange token');
        }

        const result = await response.json();
        console.log('Token exchange successful:', result);
        
        // Refetch backend connection status
        const statusRes = await fetch('/api/plaid/has-connected-bank');
        const statusData = await statusRes.json();
        onConnectionChange(!!statusData.connected);

        setIsConnecting(false);
        setLinkToken(null); // Clear the token after successful connection
        createNotification.mutate({
          type: 'success',
          title: 'Bank account connected',
          message: 'Your bank account has been connected and transactions will sync automatically.'
        });
      } catch (error) {
        console.error('Error exchanging token:', error);
        setIsConnecting(false);
        setLinkToken(null); // Clear the token on error
        toast.error('Failed to complete bank connection', {
          description: 'Please try again later.',
        });
      }
    },
    onExit: (err, metadata) => {
      console.log('Exit:', err, metadata);
      setIsConnecting(false);
      setLinkToken(null); // Clear the token on exit
      if (err) {
        toast.error('Failed to connect bank account', {
          description: err.error_message || 'Please try again later.',
        });
      }
    },
  });

  // Auto-open Plaid Link when ready and we have a token
  useEffect(() => {
    if (ready && linkToken && isConnecting) {
      open();
    }
  }, [ready, linkToken, isConnecting, open]);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      console.log('Creating link token...');
      // Create link token
      const response = await fetch('/api/plaid/create-link-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to create link token: ${response.status} ${errorText}`);
      }

      const { link_token } = await response.json();
      console.log('Link token created:', link_token);
      setLinkToken(link_token);

    } catch (error) {
      console.error('Error connecting bank:', error);
      setIsConnecting(false);
      toast.error('Failed to connect bank account', {
        description: error instanceof Error ? error.message : 'Please try again later.',
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      const res = await fetch('/api/plaid/disconnect', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        onConnectionChange(false);
        toast.success('Bank account disconnected', {
          description: 'Your bank account has been disconnected.',
        });
      } else {
        toast.error('Failed to disconnect bank account', {
          description: data.error || 'Please try again later.',
        });
      }
    } catch (error) {
      toast.error('Failed to disconnect bank account', {
        description: 'Please try again later.',
      });
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {isConnected ? (
          <CheckCircle className="h-5 w-5 text-green-600" />
        ) : (
          <Building2 className="h-5 w-5 text-muted-foreground" />
        )}
        <div className="space-y-0.5">
          <Label>Bank Connection</Label>
          <p className="text-sm text-muted-foreground">
            {isConnected ? 'Bank account connected' : 'No bank account connected'}
          </p>
        </div>
      </div>
      <Button 
        onClick={isConnected ? handleDisconnect : handleConnect}
        disabled={isConnecting}
        variant={isConnected ? 'outline' : 'default'}
      >
        {isConnecting ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect'}
      </Button>
    </div>
  );
}; 