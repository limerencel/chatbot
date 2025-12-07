import React from 'react'
import { X } from 'lucide-react'

interface LoginFormProps {
    onClose: () => void;
}

export default function LoginForm({ onClose }: LoginFormProps) {
    return (
        <>
            {/* Backdrop - click to close */}
            <div
                className='fixed inset-0 bg-black/50 z-40'
                onClick={onClose}
            />

            {/* Modal */}
            <div className='fixed w-[400px] border border-border rounded-lg bg-card z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-xl'>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <span className='text-lg font-semibold text-foreground'>Enter your Secrets</span>
                    <button
                        onClick={onClose}
                        className='p-1 rounded-md hover:bg-accent text-muted-foreground cursor-pointer'
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">API Key</label>
                        <input
                            type="password"
                            placeholder="sk-..."
                            className='p-2 w-full border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring'
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className='px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-accent cursor-pointer'
                    >
                        Cancel
                    </button>
                    <button className='px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 cursor-pointer'>
                        Submit
                    </button>
                </div>
            </div>
        </>
    )
}
