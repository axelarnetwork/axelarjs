import { useEffect, useState } from 'react';
import type {
  EIP1193Provider,
  EIP6963ProviderDetail,
} from './EthereumProviderTypes';

/**
 * React hook: discover the MetaMask provider via EIP-6963 events.
 * Returns the EIP-1193 provider for MetaMask if present, otherwise undefined.
 */
export function useMetaMaskProvider(): EIP1193Provider | undefined {
  const [provider, setProvider] = useState<EIP1193Provider | undefined>(
    undefined
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const discovered: EIP6963ProviderDetail[] = [];

    function onAnnouncement(event: Event) {
      const { info, provider } = (event as CustomEvent<EIP6963ProviderDetail>)
        .detail;

      if (discovered.some(p => p.info.uuid === info.uuid)) return;

      discovered.push({ info, provider });

      if (info.rdns === 'io.metamask' || info.rdns === 'io.metamask.flask') {
        setProvider(provider);
      }
    }

    window.addEventListener(
      'eip6963:announceProvider',
      onAnnouncement as EventListener
    );
    window.dispatchEvent(new Event('eip6963:requestProvider'));

    return () => {
      window.removeEventListener(
        'eip6963:announceProvider',
        onAnnouncement as EventListener
      );
    };
  }, []);

  return provider;
}
