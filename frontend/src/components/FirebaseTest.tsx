import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { Button } from './ui/button';

export const FirebaseTest: React.FC = () => {
    const [authState, setAuthState] = useState<string>('Checking...');
    const [error, setError] = useState<string | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const [networkTest, setNetworkTest] = useState<string>('Not tested');

    const addLog = (message: string) => {
        console.log(message);
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    useEffect(() => {
        try {
            addLog('🔥 Starting Firebase initialization...');

            // Test if we're in a restricted environment
            addLog(`Environment: ${window.location.hostname}`);
            addLog(`Protocol: ${window.location.protocol}`);
            addLog(`User Agent: ${navigator.userAgent.substring(0, 50)}...`);

            // Log the auth instance
            addLog(`Auth instance available: ${!!auth}`);
            if (auth) {
                addLog(`Auth app name: ${auth.app.name}`);
                addLog(`Auth config loaded: ${!!auth.config}`);
            }

            const unsubscribe = onAuthStateChanged(auth,
                (user) => {
                    addLog(`✅ Auth state changed: ${user ? 'User signed in' : 'No user'}`);
                    if (user) {
                        setAuthState(`Signed in as: ${user.email || 'Anonymous'}`);
                        addLog(`User UID: ${user.uid}`);
                        addLog(`User provider: ${user.providerData.map(p => p.providerId).join(', ') || 'None'}`);
                    } else {
                        setAuthState('Not signed in');
                    }
                    setError(null);
                },
                (error) => {
                    addLog(`❌ Auth state error: ${error.code} - ${error.message}`);
                    setError(`${error.code}: ${error.message}`);
                    setAuthState('Error occurred');
                }
            );

            return () => {
                addLog('🧹 Cleaning up auth listener');
                unsubscribe();
            };
        } catch (err: any) {
            addLog(`💥 Firebase initialization error: ${err.message}`);
            setError(err.message);
            setAuthState('Failed to initialize');
        }
    }, []);

    const testAnonymousSignIn = async () => {
        try {
            addLog('🔐 Testing anonymous sign-in...');
            setError(null);
            const result = await signInAnonymously(auth);
            addLog(`✅ Anonymous sign-in successful: ${result.user.uid}`);
        } catch (err: any) {
            addLog(`❌ Anonymous sign-in failed: ${err.code} - ${err.message}`);
            setError(`${err.code}: ${err.message}`);

            // Common error explanations
            if (err.code === 'auth/operation-not-allowed') {
                addLog('💡 Anonymous auth is disabled in Firebase console');
            } else if (err.code === 'auth/network-request-failed') {
                addLog('💡 Network issue - check internet connectivity');
            }
        }
    };

    const testNetworkConnectivity = async () => {
        try {
            addLog('🌐 Testing network connectivity...');
            setNetworkTest('Testing...');

            // Test Google APIs endpoint
            const response = await fetch('https://www.googleapis.com/identitytoolkit/v3/relyingparty/getProjectConfig?key=' + import.meta.env.VITE_FIREBASE_API_KEY, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });

            addLog(`Firebase API response status: ${response.status}`);

            if (response.status === 400) {
                setNetworkTest('✅ Network OK (400 expected)');
                addLog('✅ Can reach Firebase APIs');
            } else {
                setNetworkTest(`⚠️ Unexpected status: ${response.status}`);
            }
        } catch (err: any) {
            addLog(`❌ Network test failed: ${err.message}`);
            setNetworkTest(`❌ Failed: ${err.message}`);

            if (err.message.includes('NetworkError')) {
                addLog('💡 This confirms the NetworkError issue');
                addLog('💡 Try: 1) Different browser 2) Local development 3) Check firewall/proxy');
            }
        }
    };

    const clearLogs = () => {
        setLogs([]);
        setError(null);
    };

    return (
        <div className="p-4 m-4 border rounded bg-gray-50 max-w-6xl">
            <h3 className="font-bold text-lg mb-4">🔥 Firebase Connection Diagnostics</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Panel */}
                <div className="space-y-4">
                    <div className="p-3 border rounded bg-white">
                        <h4 className="font-semibold mb-2">Current Status</h4>
                        <p className="mb-2">
                            <strong>Auth State:</strong>
                            <span className={`ml-2 px-2 py-1 rounded text-sm ${authState.includes('Error') || authState.includes('Failed')
                                    ? 'bg-red-100 text-red-600'
                                    : authState.includes('Signed in')
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-yellow-100 text-yellow-600'
                                }`}>
                                {authState}
                            </span>
                        </p>

                        <p className="mb-2">
                            <strong>Network Test:</strong>
                            <span className={`ml-2 px-2 py-1 rounded text-sm ${networkTest.includes('✅')
                                    ? 'bg-green-100 text-green-600'
                                    : networkTest.includes('❌')
                                        ? 'bg-red-100 text-red-600'
                                        : 'bg-gray-100 text-gray-600'
                                }`}>
                                {networkTest}
                            </span>
                        </p>

                        {error && (
                            <div className="p-2 bg-red-50 border border-red-200 rounded">
                                <p className="text-red-600 text-sm">
                                    <strong>Error:</strong> {error}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                        <div className="flex gap-2 flex-wrap">
                            <Button onClick={testNetworkConnectivity} size="sm" variant="outline">
                                🌐 Test Network
                            </Button>
                            <Button onClick={testAnonymousSignIn} size="sm" variant="outline">
                                🔐 Test Auth
                            </Button>
                            <Button onClick={clearLogs} size="sm" variant="secondary">
                                🧹 Clear Logs
                            </Button>
                        </div>
                    </div>

                    {/* Environment Info */}
                    <div className="text-xs text-gray-600 p-3 bg-gray-100 rounded">
                        <strong>Environment:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>Hostname: {window.location.hostname}</li>
                            <li>Protocol: {window.location.protocol}</li>
                            <li>Port: {window.location.port}</li>
                            <li>Firebase Project: vguard-d7ca7</li>
                        </ul>
                    </div>
                </div>

                {/* Logs Panel */}
                <div>
                    <h4 className="font-semibold mb-2">Debug Logs:</h4>
                    <div className="bg-black text-green-400 p-3 rounded text-xs font-mono h-80 overflow-y-auto">
                        {logs.length === 0 ? (
                            <div className="text-gray-500">No logs yet...</div>
                        ) : (
                            logs.map((log, index) => (
                                <div key={index} className="mb-1">
                                    {log}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Troubleshooting Tips */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                <h4 className="font-semibold text-blue-800 mb-2">💡 Troubleshooting Tips:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                    <li><strong>If you see "NetworkError":</strong> Try running locally instead of in Codespace</li>
                    <li><strong>Browser Issues:</strong> Try incognito mode or different browser</li>
                    <li><strong>Codespace Environment:</strong> Some browser security features may block Firebase</li>
                    <li><strong>Alternative:</strong> The backend auth API endpoints work independently of browser Firebase</li>
                </ul>
            </div>
        </div>
    );
};
