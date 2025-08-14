import React, { useState } from 'react';
import { AuthDialog } from '../components/AuthDialog';
import { Button } from '../components/ui/button';

export const AuthTest: React.FC = () => {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <div className="p-4 m-4 border rounded bg-blue-50">
            <h3 className="font-bold text-lg mb-4">🔐 Authentication Test</h3>

            <div className="space-y-4">
                <p className="text-sm text-gray-600">
                    Click the button below to test the authentication dialog
                </p>

                <Button onClick={() => setDialogOpen(true)}>
                    Open Auth Dialog
                </Button>

                <AuthDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                />
            </div>
        </div>
    );
};
