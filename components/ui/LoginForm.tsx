import { useState } from 'react'
import { X } from 'lucide-react'
import { useAuth } from '../ModalProvider';

interface LoginFormProps {
    onClose: () => void;
}

export default function LoginForm({ onClose }: LoginFormProps) {

    const [password, setPassword] = useState("");

    const { login } = useAuth();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const status = await login(password);
        if (status) {
            onClose();
        } else {
            setPassword("")
            alert("Login failed, please try again");
        }
    }

    return (
        <>
            {/* Backdrop - click to close */}
            <div
                className='fixed inset-0 bg-black/50 z-60'
                onClick={onClose}
            />

            {/* Modal */}
            <div className='fixed w-[calc(100%-2rem)] max-w-[400px] border border-border rounded-lg bg-card z-60 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-xl'>
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
                    <form className="space-y-2" onSubmit={handleSubmit}>
                        <input
                            type="password"
                            placeholder="passcode here..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='p-2 w-full border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring'
                        />
                    </form>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className='px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-accent cursor-pointer'
                    >
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className='px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 cursor-pointer'>
                        Submit
                    </button>
                </div>
            </div>
        </>
    )
}
